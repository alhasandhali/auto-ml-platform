"use client"

import { useMemo } from "react"
import { CopyCheck, TriangleAlert, CheckCircle2 } from "lucide-react"
import { useDataset } from "@/lib/dataset-context"

export function DuplicateAnalysis() {
  const { dataset, isUploaded } = useDataset()

  const { dupCount, dupPct } = useMemo(() => {
    if (!isUploaded || !dataset || !dataset.apiSummary) {
      return { dupCount: 34, dupPct: "0.27" }
    }

    const count = dataset.apiSummary.duplicate_rows
    
    return {
      dupCount: count,
      dupPct: dataset.apiSummary.rows > 0 ? ((count / dataset.apiSummary.rows) * 100).toFixed(2) : "0",
    }
  }, [dataset, isUploaded])

  const hasDuplicates = dupCount > 0

  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-primary">
            <CopyCheck className="h-4 w-4" />
          </span>
          <h2 className="text-sm font-semibold">Duplicate Analysis</h2>
        </div>
        {hasDuplicates ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-chart-4/30 bg-chart-4/15 px-2 py-0.5 text-xs font-medium text-chart-4">
            <TriangleAlert className="h-3 w-3" />
            Attention
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full border border-chart-3/30 bg-chart-3/15 px-2 py-0.5 text-xs font-medium text-chart-3">
            <CheckCircle2 className="h-3 w-3" />
            Clean
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border bg-secondary/40 p-3">
          <div className="text-2xl font-semibold tracking-tight">{dupCount.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">Duplicate rows</div>
        </div>
        <div className="rounded-lg border border-border bg-secondary/40 p-3">
          <div className="text-2xl font-semibold tracking-tight">{dupPct}%</div>
          <div className="text-xs text-muted-foreground">Of total rows</div>
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        {hasDuplicates
          ? `${dupCount} duplicate rows detected. Consider removing them before training to avoid overfitting and biased evaluation metrics.`
          : "No duplicate rows found. Your dataset is clean."}
      </p>

      {hasDuplicates && (
        <button className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-lg border border-border text-sm font-medium transition-colors hover:bg-accent">
          Remove Duplicates
        </button>
      )}
    </section>
  )
}
