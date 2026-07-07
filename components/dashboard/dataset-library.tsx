"use client"

import { useState, useMemo, useEffect } from "react"
import {
  Database,
  Search,
  ArrowUpDown,
  FileSpreadsheet,
  Table2,
  Trash2,
  ExternalLink,
  Clock,
  Rows3,
  Columns3,
  Plus,
  FolderOpen,
  SortAsc,
  SortDesc,
  Loader2,
} from "lucide-react"
import { useDataset, type SavedDataset } from "@/lib/dataset-context"
import { useAuth } from "@/lib/auth"
import { cn } from "@/lib/utils"
import { DeleteDatasetModal } from "./delete-dataset-modal"

type SortOption = "newest" | "oldest" | "name-asc" | "name-desc" | "size"

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  } catch {
    return "Unknown"
  }
}

function formatRelativeTime(dateStr: string) {
  try {
    const d = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return formatDate(dateStr)
  } catch {
    return "Unknown"
  }
}

// ── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-muted" />
          <div className="space-y-2">
            <div className="h-4 w-32 rounded bg-muted" />
            <div className="h-3 w-20 rounded bg-muted" />
          </div>
        </div>
        <div className="h-6 w-12 rounded-full bg-muted" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="h-14 rounded-lg bg-muted" />
        <div className="h-14 rounded-lg bg-muted" />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="h-3 w-24 rounded bg-muted" />
        <div className="flex gap-2">
          <div className="h-8 w-8 rounded-lg bg-muted" />
          <div className="h-8 w-20 rounded-lg bg-muted" />
        </div>
      </div>
    </div>
  )
}

// ── Empty State ────────────────────────────────────────────────────────────────
function EmptyState({ onUpload }: { onUpload: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="relative mb-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 shadow-lg">
          <Database className="h-9 w-9 text-primary/60" />
        </div>
        <div className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-primary border border-primary/25">
          <Plus className="h-4 w-4" />
        </div>
      </div>
      <h3 className="text-lg font-semibold tracking-tight">No datasets yet</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground leading-relaxed">
        Upload your first CSV or Excel file to get started with automated analysis, visualizations, and AI-powered insights.
      </p>
      <button
        onClick={onUpload}
        className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md active:scale-[0.98]"
      >
        <Plus className="h-4 w-4" />
        Upload Your First Dataset
      </button>
    </div>
  )
}

// ── Dataset Card ───────────────────────────────────────────────────────────────
function DatasetCard({
  dataset,
  onOpen,
  onDelete,
}: {
  dataset: SavedDataset
  onOpen: (ds: SavedDataset) => void
  onDelete: (ds: SavedDataset) => void
}) {
  const { metadata } = dataset
  const isCSV = metadata.file_type === "csv"

  return (
    <div className="group relative rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg">
      {/* Subtle gradient overlay on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      {/* Header */}
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors",
              isCSV
                ? "bg-chart-3/15 text-chart-3 group-hover:bg-chart-3/25"
                : "bg-chart-2/15 text-chart-2 group-hover:bg-chart-2/25"
            )}
          >
            {isCSV ? (
              <Table2 className="h-5 w-5" />
            ) : (
              <FileSpreadsheet className="h-5 w-5" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold group-hover:text-primary transition-colors" title={metadata.name}>
              {metadata.name}
            </h3>
            <span
              className={cn(
                "inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider mt-0.5",
                isCSV
                  ? "bg-chart-3/15 text-chart-3"
                  : "bg-chart-2/15 text-chart-2"
              )}
            >
              {metadata.file_type}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      {metadata.description && (
        <p className="relative mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {metadata.description}
        </p>
      )}

      {/* Stats */}
      <div className="relative mt-4 grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-secondary/30 px-3 py-2 transition-colors group-hover:border-border">
          <Rows3 className="h-3.5 w-3.5 text-muted-foreground" />
          <div>
            <div className="text-sm font-semibold tabular-nums">{metadata.row_count.toLocaleString()}</div>
            <div className="text-[10px] text-muted-foreground">rows</div>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-secondary/30 px-3 py-2 transition-colors group-hover:border-border">
          <Columns3 className="h-3.5 w-3.5 text-muted-foreground" />
          <div>
            <div className="text-sm font-semibold tabular-nums">{metadata.column_count}</div>
            <div className="text-[10px] text-muted-foreground">columns</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative mt-4 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Clock className="h-3 w-3" />
          {formatRelativeTime(metadata.uploaded_at)}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(dataset)
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
            title="Delete dataset"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onOpen(dataset)}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary/10 px-3 text-xs font-medium text-primary transition-all hover:bg-primary hover:text-primary-foreground active:scale-95"
          >
            <FolderOpen className="h-3.5 w-3.5" />
            Open
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Library Component ─────────────────────────────────────────────────────
export function DatasetLibrary({
  onUpload,
  onOpenDataset,
}: {
  onUpload: () => void
  onOpenDataset: (dataset: SavedDataset) => void
}) {
  const { savedDatasets, isLoadingList, fetchSavedDatasets, deleteSavedDataset } = useDataset()
  const { token } = useAuth()

  const [query, setQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [deleteTarget, setDeleteTarget] = useState<SavedDataset | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch datasets on mount
  useEffect(() => {
    if (token) {
      fetchSavedDatasets(token)
    }
  }, [token, fetchSavedDatasets])

  // Filter & sort
  const filtered = useMemo(() => {
    let items = savedDatasets

    // Search filter
    if (query.trim()) {
      const q = query.toLowerCase()
      items = items.filter(
        (d) =>
          d.metadata.name.toLowerCase().includes(q) ||
          (d.metadata.description || "").toLowerCase().includes(q) ||
          d.metadata.file_type.toLowerCase().includes(q)
      )
    }

    // Sort
    const sorted = [...items]
    switch (sortBy) {
      case "newest":
        sorted.sort(
          (a, b) =>
            new Date(b.metadata.uploaded_at).getTime() -
            new Date(a.metadata.uploaded_at).getTime()
        )
        break
      case "oldest":
        sorted.sort(
          (a, b) =>
            new Date(a.metadata.uploaded_at).getTime() -
            new Date(b.metadata.uploaded_at).getTime()
        )
        break
      case "name-asc":
        sorted.sort((a, b) => a.metadata.name.localeCompare(b.metadata.name))
        break
      case "name-desc":
        sorted.sort((a, b) => b.metadata.name.localeCompare(a.metadata.name))
        break
      case "size":
        sorted.sort((a, b) => b.metadata.row_count - a.metadata.row_count)
        break
    }

    return sorted
  }, [savedDatasets, query, sortBy])

  const handleDelete = async () => {
    if (!deleteTarget || !token) return
    setIsDeleting(true)
    const success = await deleteSavedDataset(deleteTarget._id, token)
    setIsDeleting(false)
    if (success) {
      setDeleteTarget(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Datasets</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isLoadingList
              ? "Loading your datasets..."
              : `${savedDatasets.length} dataset${savedDatasets.length !== 1 ? "s" : ""} in your library`}
          </p>
        </div>

        <button
          onClick={onUpload}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Upload Dataset
        </button>
      </div>

      {/* Toolbar */}
      {(savedDatasets.length > 0 || query) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search datasets..."
              className="h-9 w-full rounded-lg border border-border bg-secondary/50 pl-9 pr-3 text-sm outline-none transition-colors focus:border-ring focus:bg-secondary"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="h-9 appearance-none rounded-lg border border-border bg-secondary/50 px-3 pr-8 text-sm font-medium outline-none transition-colors focus:border-ring"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="size">Largest First</option>
            </select>
          </div>
        </div>
      )}

      {/* Content */}
      {isLoadingList ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : savedDatasets.length === 0 && !query ? (
        <EmptyState onUpload={onUpload} />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <h3 className="text-sm font-medium">No datasets match your search</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Try a different search term or clear the filter.
          </p>
          <button
            onClick={() => setQuery("")}
            className="mt-3 text-xs font-medium text-primary hover:underline"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((ds) => (
            <DatasetCard
              key={ds._id}
              dataset={ds}
              onOpen={onOpenDataset}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* Delete Modal */}
      <DeleteDatasetModal
        open={deleteTarget !== null}
        datasetName={deleteTarget?.metadata.name || ""}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}
