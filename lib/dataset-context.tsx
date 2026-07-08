"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

// ── Types ──────────────────────────────────────────────────────────────────────
export type ParsedRow = Record<string, string | number | boolean | null>

export interface ApiSummary {
  rows: number;
  columns: number;
  column_info: {
    column_name: string;
    dtype: string;
    missing_values: number;
    missing_percentage: number;
    unique_values: number;
  }[];
  missing_values: Record<string, number>;
  missing_percentage: Record<string, number>;
  duplicate_rows: number;
  memory_usage_MB: number;
  numeric_summary: Record<string, any>;
  categorical_summary: Record<string, any>;
  outliers: Record<string, number>;
  histograms?: Record<string, { binStart: number; binEnd: number; count: number }[]>;
  correlation?: {
    cols: string[];
    matrix: number[][];
  };
  frequencies?: Record<string, { name: string; count: number; pct: number }[]>;
}

export interface DatasetInfo {
  id?: string
  fileName: string
  fileSize: number
  uploadedAt: Date
  columns: string[]
  rows: ParsedRow[]
  totalRows: number
  totalColumns: number
  apiSummary?: ApiSummary
}

// ── Saved Dataset type (from MongoDB) ──────────────────────────────────────────
export interface SavedDataset {
  _id: string
  user_id: string
  metadata: {
    name: string
    description: string | null
    file_type: string
    row_count: number
    column_count: number
    columns: string[]
    uploaded_at: string
  }
  s3_key: string
  analysis_id?: string
}

interface DatasetContextValue {
  dataset: DatasetInfo | null
  setDataset: (info: DatasetInfo) => void
  clearDataset: () => void
  isUploaded: boolean

  // Saved datasets library
  savedDatasets: SavedDataset[]
  isLoadingList: boolean
  fetchSavedDatasets: (token: string) => Promise<void>
  deleteSavedDataset: (id: string, token: string) => Promise<boolean>
  loadSavedAnalysis: (analysisId: string, datasetId: string, token: string) => Promise<boolean>
}

const DatasetContext = createContext<DatasetContextValue | null>(null)

// ── CSV Parser ─────────────────────────────────────────────────────────────────
function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"'
        i++
      } else if (ch === '"') {
        inQuotes = false
      } else {
        current += ch
      }
    } else {
      if (ch === '"') {
        inQuotes = true
      } else if (ch === ",") {
        result.push(current.trim())
        current = ""
      } else {
        current += ch
      }
    }
  }
  result.push(current.trim())
  return result
}

export function parseCSV(text: string): { columns: string[]; rows: ParsedRow[] } {
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "")
  if (lines.length === 0) return { columns: [], rows: [] }

  const columns = parseCSVLine(lines[0])
  const rows: ParsedRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    const row: ParsedRow = {}
    columns.forEach((col, j) => {
      const raw = values[j] ?? ""
      // Try to auto-detect types
      if (raw === "" || raw.toLowerCase() === "null" || raw.toLowerCase() === "na" || raw.toLowerCase() === "n/a") {
        row[col] = null
      } else if (raw.toLowerCase() === "true") {
        row[col] = true
      } else if (raw.toLowerCase() === "false") {
        row[col] = false
      } else {
        const num = Number(raw)
        row[col] = isNaN(num) ? raw : num
      }
    })
    rows.push(row)
  }

  return { columns, rows }
}

// ── Backend URL ────────────────────────────────────────────────────────────────
export const BACKEND_URL = "https://dataset-api-fastapi.onrender.com"

// ── Provider ───────────────────────────────────────────────────────────────────
export function DatasetProvider({ children }: { children: ReactNode }) {
  const [dataset, setDatasetState] = useState<DatasetInfo | null>(null)

  // Saved datasets library state
  const [savedDatasets, setSavedDatasets] = useState<SavedDataset[]>([])
  const [isLoadingList, setIsLoadingList] = useState(false)

  const setDataset = useCallback((info: DatasetInfo) => {
    setDatasetState(info)
  }, [])

  const clearDataset = useCallback(() => {
    setDatasetState(null)
  }, [])

  // Fetch saved datasets from backend
  const fetchSavedDatasets = useCallback(async (token: string) => {
    setIsLoadingList(true)
    try {
      const res = await fetch(`${BACKEND_URL}/datasets?limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Failed to fetch datasets")
      const data = await res.json()
      setSavedDatasets(data.datasets || [])
    } catch (err) {
      console.error("Error fetching datasets:", err)
    } finally {
      setIsLoadingList(false)
    }
  }, [])

  // Delete a saved dataset
  const deleteSavedDataset = useCallback(async (id: string, token: string): Promise<boolean> => {
    try {
      const res = await fetch(`${BACKEND_URL}/datasets/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Failed to delete dataset")
      // Remove from local state
      setSavedDatasets((prev) => prev.filter((d) => d._id !== id))
      return true
    } catch (err) {
      console.error("Error deleting dataset:", err)
      return false
    }
  }, [])

  // Load a saved analysis into the context
  const loadSavedAnalysis = useCallback(async (analysisId: string, datasetId: string, token: string): Promise<boolean> => {
    try {
      const res = await fetch(`${BACKEND_URL}/analyses/${analysisId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Failed to load analysis")
      const doc = await res.json()
      
      if (!doc.analysis) return false

      const analysis = doc.analysis
      const columns = (analysis.column_info || []).map((c: any) => c.column_name)

      let previewRows = []
      try {
        const previewRes = await fetch(`${BACKEND_URL}/datasets/${datasetId}/preview`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (previewRes.ok) {
          const previewData = await previewRes.json()
          if (previewData.rows) {
            previewRows = previewData.rows
          }
        }
      } catch (err) {
        console.error("Failed to load dataset preview:", err)
      }

      const createdAtStr = doc.created_at || new Date().toISOString();
      const safeCreatedAt = createdAtStr.endsWith('Z') || createdAtStr.includes('+') ? createdAtStr : `${createdAtStr}Z`;

      setDatasetState({
        id: datasetId,
        fileName: doc.filename || "Saved Dataset",
        fileSize: 0,
        uploadedAt: new Date(safeCreatedAt),
        columns,
        rows: previewRows,
        totalRows: analysis.rows || 0,
        totalColumns: analysis.columns || 0,
        apiSummary: analysis,
      })

      return true
    } catch (err) {
      console.error("Error loading analysis:", err)
      return false
    }
  }, [])

  return (
    <DatasetContext.Provider
      value={{
        dataset,
        setDataset,
        clearDataset,
        isUploaded: dataset !== null,

        savedDatasets,
        isLoadingList,
        fetchSavedDatasets,
        deleteSavedDataset,
        loadSavedAnalysis,
      }}
    >
      {children}
    </DatasetContext.Provider>
  )
}

// ── Hook ───────────────────────────────────────────────────────────────────────
export function useDataset() {
  const ctx = useContext(DatasetContext)
  if (!ctx) {
    throw new Error("useDataset must be used within a DatasetProvider")
  }
  return ctx
}
