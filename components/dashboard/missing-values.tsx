"use client"

import { useMemo } from "react"
import { CircleAlert } from "lucide-react"
import { missingValueBars as demoBars } from "@/lib/dataset-data"
import { useDataset } from "@/lib/dataset-context"
import { cn } from "@/lib/utils"

export function MissingValues() {
  const { dataset, isUploaded } = useDataset()

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

    for (const [col, missing] of Object.entries(apiSummary.missing_values || {})) {
      total += (missing as number)
      if (missing > 0) {
        perColumn.push({
          column: col,
          pct: +(apiSummary.missing_percentage[col]).toFixed(1),
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

  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-primary">
          <CircleAlert className="h-4 w-4" />
        </span>
        <h2 className="text-sm font-semibold">Missing Values</h2>
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
    </section>
  )
}
