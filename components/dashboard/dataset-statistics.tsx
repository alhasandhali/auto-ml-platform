"use client"

import { useState, useMemo, useEffect } from "react"
import { Sigma, ChevronDown } from "lucide-react"
import { datasetStats as demoStats } from "@/lib/dataset-data"
import { useDataset } from "@/lib/dataset-context"
import { cn } from "@/lib/utils"

export function DatasetStatistics() {
  const { dataset, isUploaded } = useDataset()
  const [selectedCol, setSelectedCol] = useState<string | null>(null)

  // Reset selected column when dataset changes
  useEffect(() => {
    if (isUploaded && dataset?.apiSummary) {
      const numericCols = Object.keys(dataset.apiSummary.numeric_summary || {})
      if (numericCols.length > 0) {
        setSelectedCol(numericCols[0])
      } else {
        setSelectedCol(null)
      }
    } else {
      setSelectedCol(null)
    }
  }, [dataset, isUploaded])

  const { stats, availableCols, activeCol } = useMemo(() => {
    if (!isUploaded || !dataset || !dataset.apiSummary) {
      return { stats: demoStats, availableCols: [], activeCol: "Salary" }
    }

    const { apiSummary } = dataset
    const numericCols = Object.keys(apiSummary.numeric_summary || {})
    
    if (numericCols.length === 0) {
      return {
        stats: [
          { label: "Info", value: "No numeric columns found" },
        ],
        availableCols: [],
        activeCol: "—",
      }
    }

    const active = selectedCol && numericCols.includes(selectedCol) ? selectedCol : numericCols[0]
    const colStats = apiSummary.numeric_summary[active]

    const fmt = (n: number) =>
      Number.isInteger(n) ? n.toLocaleString() : n.toLocaleString(undefined, { maximumFractionDigits: 2 })

    return {
      stats: [
        { label: "Mean", value: fmt(colStats.mean) },
        { label: "Median", value: fmt(colStats["50%"]) },
        { label: "Min", value: fmt(colStats.min) },
        { label: "Max", value: fmt(colStats.max) },
        { label: "Std Dev", value: fmt(colStats.std) },
      ],
      availableCols: numericCols,
      activeCol: active,
    }
  }, [dataset, isUploaded, selectedCol])

  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-primary">
            <Sigma className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-sm font-semibold">Dataset Statistics</h2>
            <p className="text-xs text-muted-foreground">Numeric feature summary</p>
          </div>
        </div>

        {availableCols.length > 0 && (
          <div className="relative">
            <select
              value={activeCol}
              onChange={(e) => setSelectedCol(e.target.value)}
              className="h-9 w-full appearance-none rounded-md border border-input bg-background px-3 pr-8 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:w-[180px] font-medium"
            >
              {availableCols.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground opacity-50" />
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-border bg-secondary/40 p-3 transition-colors hover:border-primary/40"
          >
            <div className="text-xs font-medium text-muted-foreground">
              {stat.label}
            </div>
            <div className="mt-1 text-lg font-semibold tabular-nums tracking-tight">
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
