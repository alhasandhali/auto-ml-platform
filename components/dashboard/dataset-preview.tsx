"use client"

import { useMemo, useState } from "react"
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  ChevronLeft,
  ChevronRight,
  Table2,
} from "lucide-react"
import { datasetRows, type DatasetRow } from "@/lib/dataset-data"
import { useDataset, type ParsedRow } from "@/lib/dataset-context"
import { cn } from "@/lib/utils"

const PAGE_SIZE = 6

// ── Fallback columns for demo data ────────────────────────────────────────────
type SortKey = keyof DatasetRow
const demoColumns: { key: SortKey; label: string }[] = [
  { key: "age", label: "Age" },
  { key: "salary", label: "Salary" },
  { key: "gender", label: "Gender" },
  { key: "department", label: "Department" },
  { key: "purchased", label: "Purchased" },
]

// ── Cell renderer ──────────────────────────────────────────────────────────────
function CellValue({ value }: { value: unknown }) {
  if (value === null || value === undefined) {
    return (
      <span className="rounded bg-destructive/15 px-1.5 py-0.5 text-xs font-medium text-destructive">
        null
      </span>
    )
  }
  if (typeof value === "boolean") {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
          value
            ? "border-chart-3/25 bg-chart-3/15 text-chart-3"
            : "border-border bg-muted text-muted-foreground",
        )}
      >
        {value ? "Yes" : "No"}
      </span>
    )
  }
  if (typeof value === "number") {
    return <span className="tabular-nums">{value.toLocaleString()}</span>
  }
  return <span>{String(value)}</span>
}

// ── Main Component ─────────────────────────────────────────────────────────────
export function DatasetPreview() {
  const { dataset, isUploaded } = useDataset()

  // Determine which data to use
  const columns = isUploaded
    ? dataset!.columns.map((c) => ({ key: c, label: c }))
    : demoColumns.map((c) => ({ key: c.key as string, label: c.label }))

  const sourceRows: ParsedRow[] = isUploaded
    ? dataset!.rows
    : (datasetRows as unknown as ParsedRow[])

  const totalRowCount = isUploaded ? dataset!.totalRows : datasetRows.length

  const [query, setQuery] = useState("")
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [page, setPage] = useState(0)

  // Reset pagination when dataset changes
  const datasetId = isUploaded ? dataset!.fileName : "__demo__"
  const prevDatasetIdRef = useMemo(() => ({ current: datasetId }), [datasetId])
  if (prevDatasetIdRef.current !== datasetId) {
    prevDatasetIdRef.current = datasetId
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let rows = sourceRows.filter((r) => {
      if (q === "") return true
      return Object.values(r)
        .map((v) => (v === null ? "null" : String(v)))
        .join(" ")
        .toLowerCase()
        .includes(q)
    })
    if (sortKey) {
      rows = [...rows].sort((a, b) => {
        const av = a[sortKey]
        const bv = b[sortKey]
        if (av === null) return 1
        if (bv === null) return -1
        if (av < bv) return sortDir === "asc" ? -1 : 1
        if (av > bv) return sortDir === "asc" ? 1 : -1
        return 0
      })
    }
    return rows
  }, [query, sortKey, sortDir, sourceRows])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, totalPages - 1)
  const paged = filtered.slice(
    current * PAGE_SIZE,
    current * PAGE_SIZE + PAGE_SIZE,
  )

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
    setPage(0)
  }

  return (
    <section className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-primary">
            <Table2 className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-sm font-semibold">Dataset Preview</h2>
            <p className="text-xs text-muted-foreground">
              {filtered.length} of {totalRowCount} rows
              {isUploaded && (
                <span className="ml-1.5 text-chart-3">● Live</span>
              )}
            </p>
          </div>
        </div>
        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(0)
            }}
            placeholder="Search rows..."
            className="h-9 w-full rounded-lg border border-border bg-secondary/50 pl-9 pr-3 text-sm outline-none transition-colors focus:border-ring"
          />
        </div>
      </div>

      <div className="max-h-[340px] overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-card">
            <tr className="border-b border-border">
              {columns.map((col) => {
                const active = sortKey === col.key
                return (
                  <th key={col.key} className="px-4 py-3 text-left font-medium">
                    <button
                      onClick={() => toggleSort(col.key)}
                      className={cn(
                        "inline-flex items-center gap-1.5 text-xs uppercase tracking-wide transition-colors hover:text-foreground",
                        active ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {col.label}
                      {active ? (
                        sortDir === "asc" ? (
                          <ArrowUp className="h-3.5 w-3.5" />
                        ) : (
                          <ArrowDown className="h-3.5 w-3.5" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
                      )}
                    </button>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {paged.map((row, i) => (
              <tr
                key={i}
                className="border-b border-border/60 transition-colors last:border-0 hover:bg-accent/40"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-muted-foreground">
                    <CellValue value={row[col.key]} />
                  </td>
                ))}
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-sm text-muted-foreground"
                >
                  No matching rows found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-border p-3">
        <span className="text-xs text-muted-foreground">
          Page {current + 1} of {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={current === 0}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={current >= totalPages - 1}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
