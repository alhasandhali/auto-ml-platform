"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import {
  X,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useDataset, parseCSV } from "@/lib/dataset-context"
import * as XLSX from "xlsx"

const ACCEPTED_TYPES = [
  "text/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]
const ACCEPTED_EXTENSIONS = [".csv", ".xls", ".xlsx"]
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB

type UploadState = "idle" | "uploading" | "success" | "error"

interface UploadDatasetModalProps {
  open: boolean
  onClose: () => void
}

export function UploadDatasetModal({ open, onClose }: UploadDatasetModalProps) {
  const { setDataset } = useDataset()
  const [file, setFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [uploadState, setUploadState] = useState<UploadState>("idle")
  const [progress, setProgress] = useState(0)
  const [errorMsg, setErrorMsg] = useState("")
  const [rowCount, setRowCount] = useState(0)
  const [colCount, setColCount] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setFile(null)
      setUploadState("idle")
      setProgress(0)
      setErrorMsg("")
      setRowCount(0)
      setColCount(0)
    }
  }, [open])

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open && uploadState !== "uploading") {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [open, onClose, uploadState])

  const validateFile = useCallback((f: File): string | null => {
    const ext = "." + f.name.split(".").pop()?.toLowerCase()
    if (!ACCEPTED_EXTENSIONS.includes(ext) && !ACCEPTED_TYPES.includes(f.type)) {
      return `Unsupported file type. Please upload a CSV or Excel file.`
    }
    if (f.size > MAX_FILE_SIZE) {
      return `File size exceeds 50 MB limit. Your file is ${(f.size / 1024 / 1024).toFixed(1)} MB.`
    }
    if (f.size === 0) {
      return `File is empty. Please upload a valid dataset.`
    }
    return null
  }, [])

  const handleFileSelect = useCallback(
    (f: File) => {
      const err = validateFile(f)
      if (err) {
        setErrorMsg(err)
        setUploadState("error")
        setFile(null)
        return
      }
      setFile(f)
      setUploadState("idle")
      setErrorMsg("")
    },
    [validateFile],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const dropped = e.dataTransfer.files[0]
      if (dropped) handleFileSelect(dropped)
    },
    [handleFileSelect],
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0]
      if (selected) handleFileSelect(selected)
      e.target.value = ""
    },
    [handleFileSelect],
  )

  const handleUpload = useCallback(async () => {
    if (!file) return
    setUploadState("uploading")
    setProgress(0)
    setErrorMsg("")

    try {
      // Start progress animation
      const progressInterval = setInterval(() => {
        setProgress((p) => {
          const inc = Math.random() * 15 + 5
          return p + inc >= 90 ? 90 : p + inc
        })
      }, 300)

      // Send to FastAPI backend
      const formData = new FormData()
      formData.append("file", file)
      
      // Send to Next.js API proxy to avoid CORS issues
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      })
      
      if (!res.ok) {
        throw new Error("Failed to analyze dataset on the server.")
      }
      
      const initialResponse = await res.json()
      let apiSummary;

      if (initialResponse.task_id) {
        const taskId = initialResponse.task_id;
        while (true) {
          const pollRes = await fetch(`/api/tasks/${taskId}`);
          if (!pollRes.ok) throw new Error("Failed to fetch task status.");
          const pollData = await pollRes.json();
          if (pollData.status === "completed") {
            apiSummary = pollData.result;
            break;
          } else if (pollData.status === "failed") {
            throw new Error(pollData.error || "Analysis failed.");
          }
          await new Promise((r) => setTimeout(r, 2000));
        }
      } else {
        apiSummary = initialResponse;
      }

      // For preview purposes, if it's a CSV we still parse the first few rows locally. 
      // If it's Excel, we just show empty preview for now, but API summary will work!
      let columns: string[] = []
      let previewRows: any[] = []
      
      const ext = "." + file.name.split(".").pop()?.toLowerCase()
      if (ext === ".csv") {
        const text = await file.text()
        const parsed = parseCSV(text)
        columns = parsed.columns
        previewRows = parsed.rows.slice(0, 5000) // Keep up to 5k rows for client-side chart generation
      } else if (ext === ".xlsx" || ext === ".xls") {
        const arrayBuffer = await file.arrayBuffer()
        const workbook = XLSX.read(arrayBuffer, { type: "array" })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const json = XLSX.utils.sheet_to_json(worksheet)
        
        if (json.length > 0) {
          columns = Object.keys(json[0] as object)
          previewRows = json.slice(0, 5000)
        } else {
          columns = apiSummary.column_info.map((c: any) => c.column_name)
        }
      } else {
        // Fallback just in case
        columns = apiSummary.column_info.map((c: any) => c.column_name)
      }
      
      clearInterval(progressInterval)
      setProgress(100)
      
      setRowCount(apiSummary.rows)
      setColCount(apiSummary.columns)

      // Small delay to show 100%
      await new Promise((r) => setTimeout(r, 400))

      // Set dataset in context with API summary
      setDataset({
        fileName: file.name,
        fileSize: file.size,
        uploadedAt: new Date(),
        columns,
        rows: previewRows,
        totalRows: apiSummary.rows,
        totalColumns: apiSummary.columns,
        apiSummary,
      })

      setUploadState("success")
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Failed to parse file. Please try again.",
      )
      setUploadState("error")
    }
  }, [file, setDataset])

  const removeFile = useCallback(() => {
    setFile(null)
    setUploadState("idle")
    setProgress(0)
    setErrorMsg("")
  }, [])

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current && uploadState !== "uploading") {
          onClose()
        }
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl animate-in zoom-in-95 fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 className="text-lg font-semibold">Upload New Dataset</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Upload a CSV or Excel file to analyze
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={uploadState === "uploading"}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Drop zone */}
          {uploadState !== "success" && (
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={cn(
                "relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all duration-200",
                dragOver
                  ? "border-primary bg-primary/5 scale-[1.01]"
                  : "border-border hover:border-primary/40 hover:bg-accent/30",
                uploadState === "uploading" && "pointer-events-none opacity-60",
              )}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".csv,.xls,.xlsx"
                onChange={handleInputChange}
                className="hidden"
              />
              <div
                className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-2xl transition-colors duration-200",
                  dragOver
                    ? "bg-primary/15 text-primary"
                    : "bg-accent text-primary",
                )}
              >
                <Upload className="h-6 w-6" />
              </div>
              <p className="mt-3 text-sm font-medium">
                {dragOver ? "Drop your file here" : "Drag & drop your dataset"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                or{" "}
                <span className="font-medium text-primary underline underline-offset-2">
                  browse files
                </span>
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                Supports CSV and Excel files — up to 50 MB
              </p>
            </div>
          )}

          {/* Selected file */}
          {file && uploadState !== "success" && (
            <div className="rounded-xl border border-border bg-secondary/30 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-chart-3/15 text-chart-3">
                  <FileSpreadsheet className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                {uploadState !== "uploading" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile()
                    }}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Progress bar */}
              {uploadState === "uploading" && (
                <div className="mt-3 space-y-1.5">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-chart-2 transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Parsing dataset...
                    </span>
                    <span>{progress}%</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error message */}
          {uploadState === "error" && errorMsg && (
            <div className="flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/5 p-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              <p className="text-sm text-destructive">{errorMsg}</p>
            </div>
          )}

          {/* Success state */}
          {uploadState === "success" && file && (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-chart-3/15">
                <CheckCircle2 className="h-8 w-8 text-chart-3" />
              </div>
              <h3 className="mt-4 text-base font-semibold">Upload Complete!</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{file.name}</span>{" "}
                has been parsed successfully.
              </p>
              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <span>
                  <span className="font-semibold text-foreground">{rowCount.toLocaleString()}</span> rows
                </span>
                <span className="h-3 w-px bg-border" />
                <span>
                  <span className="font-semibold text-foreground">{colCount}</span> columns
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-border p-5">
          {uploadState === "success" ? (
            <button
              onClick={onClose}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              View Dataset
            </button>
          ) : (
            <>
              <button
                onClick={onClose}
                disabled={uploadState === "uploading"}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!file || uploadState === "uploading"}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-40"
              >
                {uploadState === "uploading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Upload Dataset
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
