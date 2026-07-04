"use client"

import {
  Rows3,
  Columns3,
  CircleAlert,
  CopyCheck,
  MemoryStick,
  HardDrive,
  type LucideIcon,
} from "lucide-react"
import { useDataset } from "@/lib/dataset-context"

function computeStats(dataset: ReturnType<typeof useDataset>["dataset"]) {
  if (!dataset || !dataset.apiSummary) {
    return [
      { title: "Total Rows", value: "12,480", sub: "records", icon: Rows3 },
      { title: "Total Columns", value: "7", sub: "features", icon: Columns3 },
      { title: "Missing Values", value: "486", sub: "3.9% of cells", icon: CircleAlert },
      { title: "Duplicate Rows", value: "34", sub: "0.27% of rows", icon: CopyCheck },
      { title: "Memory Usage", value: "4.2 MB", sub: "in-memory", icon: MemoryStick },
      { title: "Dataset Size", value: "1.8 MB", sub: "on disk", icon: HardDrive },
    ]
  }

  const { apiSummary } = dataset
  
  // Calculate total missing values from API response
  const totalMissing = Object.values(apiSummary.missing_values || {}).reduce((a: number, b: any) => a + b, 0)
  const totalCells = apiSummary.rows * apiSummary.columns
  const missingPct = totalCells > 0 ? ((totalMissing / totalCells) * 100).toFixed(1) : "0"
  
  const dupPct = apiSummary.rows > 0 ? ((apiSummary.duplicate_rows / apiSummary.rows) * 100).toFixed(2) : "0"

  const sizeKB = dataset.fileSize / 1024
  const sizeStr = sizeKB > 1024 ? (sizeKB / 1024).toFixed(1) + " MB" : sizeKB.toFixed(0) + " KB"

  const memMB = apiSummary.memory_usage_MB
  const memStr = memMB > 1 ? memMB.toFixed(1) + " MB" : (memMB * 1024).toFixed(0) + " KB"

  return [
    { title: "Total Rows", value: apiSummary.rows.toLocaleString(), sub: "records", icon: Rows3 },
    { title: "Total Columns", value: String(apiSummary.columns), sub: "features", icon: Columns3 },
    { title: "Missing Values", value: totalMissing.toLocaleString(), sub: `${missingPct}% of cells`, icon: CircleAlert },
    { title: "Duplicate Rows", value: apiSummary.duplicate_rows.toLocaleString(), sub: `${dupPct}% of rows`, icon: CopyCheck },
    { title: "Memory Usage", value: memStr, sub: "in-memory", icon: MemoryStick },
    { title: "Dataset Size", value: sizeStr, sub: "on disk", icon: HardDrive },
  ]
}

export function SummaryCards() {
  const { dataset } = useDataset()
  const cards = computeStats(dataset)

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="group rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              {card.title}
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <card.icon className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 text-2xl font-semibold tracking-tight">
            {card.value}
          </div>
          <div className="mt-0.5 text-xs text-muted-foreground">{card.sub}</div>
        </div>
      ))}
    </div>
  )
}
