"use client"

import { useMemo } from "react"
import { ListTree } from "lucide-react"
import { columnAnalysis as demoColumns, dataTypeStyles, type DataType } from "@/lib/dataset-data"
import { useDataset } from "@/lib/dataset-context"
import { cn } from "@/lib/utils"

export function ColumnAnalysis() {
  const { dataset, isUploaded } = useDataset()

  const columns = useMemo(() => {
    if (!isUploaded || !dataset || !dataset.apiSummary) return demoColumns

    return dataset.apiSummary.column_info.map((col) => {
      // Map API dtypes to our internal UI types
      let type: DataType = "Categorical"
      if (col.dtype.includes("int")) type = "Integer"
      else if (col.dtype.includes("float")) type = "Float"
      else if (col.dtype.includes("bool")) type = "Boolean"
      else if (col.dtype.includes("datetime")) type = "Datetime"

      return {
        name: col.column_name,
        type,
        missing: col.missing_values,
        missingPct: +(col.missing_percentage).toFixed(1),
        unique: col.unique_values,
      }
    })
  }, [dataset, isUploaded])

  return (
    <section className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-2 border-b border-border p-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-primary">
          <ListTree className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-sm font-semibold">Column Analysis</h2>
          <p className="text-xs text-muted-foreground">
            {columns.length} columns profiled
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {["Column Name", "Data Type", "Missing", "Missing %", "Unique"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {columns.map((col) => (
              <tr
                key={col.name}
                className="border-b border-border/60 transition-colors last:border-0 hover:bg-accent/40"
              >
                <td className="px-4 py-3 font-medium">{col.name}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
                      dataTypeStyles[col.type],
                    )}
                  >
                    {col.type}
                  </span>
                </td>
                <td className="px-4 py-3 tabular-nums text-muted-foreground">
                  {col.missing}
                </td>
                <td className="px-4 py-3 tabular-nums">
                  <span
                    className={cn(
                      col.missingPct >= 10
                        ? "text-destructive"
                        : col.missingPct > 0
                          ? "text-chart-4"
                          : "text-muted-foreground",
                    )}
                  >
                    {col.missingPct}%
                  </span>
                </td>
                <td className="px-4 py-3 tabular-nums text-muted-foreground">
                  {col.unique.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
