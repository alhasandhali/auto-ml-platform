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
}

export interface DatasetInfo {
  fileName: string
  fileSize: number
  uploadedAt: Date
  columns: string[]
  rows: ParsedRow[]
  totalRows: number
  totalColumns: number
  apiSummary?: ApiSummary
}

interface DatasetContextValue {
  dataset: DatasetInfo | null
  setDataset: (info: DatasetInfo) => void
  clearDataset: () => void
  isUploaded: boolean
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

// ── Provider ───────────────────────────────────────────────────────────────────
export function DatasetProvider({ children }: { children: ReactNode }) {
  const [dataset, setDatasetState] = useState<DatasetInfo | null>(null)

  const setDataset = useCallback((info: DatasetInfo) => {
    setDatasetState(info)
  }, [])

  const clearDataset = useCallback(() => {
    setDatasetState(null)
  }, [])

  return (
    <DatasetContext.Provider
      value={{
        dataset,
        setDataset,
        clearDataset,
        isUploaded: dataset !== null,
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
