"use client"

import { useMemo, useState } from "react"
import { CircleAlert, CheckCircle2 } from "lucide-react"
import { missingValueBars as demoBars } from "@/lib/dataset-data"
import { useDataset, BACKEND_URL } from "@/lib/dataset-context"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth"
import { toast } from "sonner"
import { apiFetch } from "@/lib/api"

export function MissingValues() {
  const { dataset, isUploaded, fetchSavedDatasets, loadSavedAnalysis } = useDataset()
  const [isCleaning, setIsCleaning] = useState(false)
  const { token } = useAuth()

  const { bars, totalMissing, totalPct } = useMemo(() => {
    if (!isUploaded || !dataset || !dataset.apiSummary) {
      return {
        bars: demoBars,
        totalMissing: 486,
        totalPct: "3.9",
      }
    }

    const { apiSummary } = dataset
    const totalCells = apiSummary.rows * apiSummary.columns
    let total = 0
    const perColumn: { column: string; pct: number }[] = []

    for (const colInfo of (apiSummary.column_info || [])) {
      total += (colInfo.missing_values || 0)
      if (colInfo.missing_values > 0) {
        perColumn.push({
          column: colInfo.column_name,
          pct: colInfo.missing_percentage || 0,
        })
      }
    }

    perColumn.sort((a, b) => b.pct - a.pct)

    return {
      bars: perColumn,
      totalMissing: total,
      totalPct: totalCells > 0 ? ((total / totalCells) * 100).toFixed(1) : "0",
    }
  }, [dataset, isUploaded])

  const hasMissing = totalMissing > 0;

  const handleSolveMissingValues = async () => {
    if (!dataset?.id || !token) return
    
    setIsCleaning(true)
    try {
      const res = await apiFetch(`${BACKEND_URL}/datasets/${dataset.id}/solve-missing-values`, {
        method: "POST"
      })
      
      if (!res.ok) {
        let errorMsg = "Failed to solve missing values"
        try {
          const errData = await res.json()
          if (errData.detail) errorMsg = errData.detail
        } catch (_) {}
        throw new Error(errorMsg)
      }
      
      const data = await res.json()
      const newDatasetId = data.dataset_id
      const taskId = data.task_id
      
      if (taskId) {
        while (true) {
          const pollRes = await apiFetch(`${BACKEND_URL}/tasks/${taskId}`);
          if (!pollRes.ok) throw new Error("Failed to fetch task status.");
          const pollData = await pollRes.json();
          if (pollData.status === "completed") {
            break;
          } else if (pollData.status === "failed") {
            throw new Error(pollData.error || "Analysis failed.");
          }
          await new Promise((r) => setTimeout(r, 2000));
        }
      }
      
      await fetchSavedDatasets()
      await loadSavedAnalysis(taskId, newDatasetId)
      toast.success("Missing values solved successfully")
      
    } catch (err) {
      console.error("Error solving missing values:", err)
      toast.error(err instanceof Error ? err.message : "Error solving missing values")
    } finally {
      setIsCleaning(false)
    }
  }

  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-primary">
            <CircleAlert className="h-4 w-4" />
          </span>
          <h2 className="text-sm font-semibold">Missing Values</h2>
        </div>
        {hasMissing ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-chart-4/30 bg-chart-4/15 px-2 py-0.5 text-xs font-medium text-chart-4">
            <CircleAlert className="h-3 w-3" />
            Attention
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full border border-chart-3/30 bg-chart-3/15 px-2 py-0.5 text-xs font-medium text-chart-3">
            <CheckCircle2 className="h-3 w-3" />
            Clean
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-6">
        <div>
          <div className="text-2xl font-semibold tracking-tight">
            {totalMissing.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">Total missing</div>
        </div>
        <div className="h-9 w-px bg-border" />
        <div>
          <div className="text-2xl font-semibold tracking-tight text-chart-4">
            {totalPct}%
          </div>
          <div className="text-xs text-muted-foreground">Of all cells</div>
        </div>
      </div>

      <div className="mt-5 space-y-3.5">
        {bars.length === 0 && (
          <p className="text-sm text-muted-foreground">No missing values found.</p>
        )}
        {bars.map((bar) => (
          <div key={bar.column}>
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="font-medium">{bar.column}</span>
              <span className="tabular-nums text-muted-foreground">
                {bar.pct}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  bar.pct >= 20
                    ? "bg-destructive"
                    : bar.pct >= 10
                      ? "bg-chart-4"
                      : "bg-primary",
                )}
                style={{ width: `${Math.min(100, bar.pct * 3)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {hasMissing && (
        <button 
          onClick={handleSolveMissingValues}
          disabled={isCleaning}
          className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-lg border border-border text-sm font-medium transition-colors hover:bg-accent disabled:opacity-50"
        >
          {isCleaning ? "Solving..." : "Solve Missing Values"}
        </button>
      )}
    </section>
  )
}
