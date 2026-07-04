"use client"

import { useState, useMemo, useEffect } from "react"
import { BarChart3, Grid3x3, PieChart, Activity, ChevronDown } from "lucide-react"
import { useDataset } from "@/lib/dataset-context"
import { cn } from "@/lib/utils"
import { computeCorrelationMatrix, computeHistogram, computeFrequencies } from "@/lib/math-utils"
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

function ChartCard({
  title,
  subtitle,
  icon: Icon,
  children,
  action,
}: {
  title: string
  subtitle: string
  icon: typeof BarChart3
  children: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/30 flex flex-col h-[320px]">
      <div className="mb-4 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-primary shrink-0">
            <Icon className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold truncate">{title}</h3>
            <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
          </div>
        </div>
        {action}
      </div>
      <div className="flex-1 min-h-0 relative">
        {children}
      </div>
    </div>
  )
}

const missingBarsDemo = [
  { label: "Income", v: 24 },
  { label: "Salary", v: 12 },
  { label: "Age", v: 2 },
  { label: "Date", v: 2 },
  { label: "Dept", v: 0.5 },
]

// Using explicit hex colors because CSS variables in SVG fills can sometimes fail in Recharts
const PIE_COLORS = [
  "#3b82f6", // blue-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#ec4899", // pink-500
  "#8b5cf6", // violet-500
  "#ef4444", // red-500
  "#14b8a6", // teal-500
]

export function ChartsSection() {
  const { dataset, isUploaded } = useDataset()

  const [selectedFeature, setSelectedFeature] = useState<string | null>(null)
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null)

  const numericCols = useMemo(() => {
    if (!isUploaded || !dataset?.apiSummary) return ["Salary", "Age"]
    return Object.keys(dataset.apiSummary.numeric_summary || {})
  }, [dataset, isUploaded])

  const categoricalCols = useMemo(() => {
    if (!isUploaded || !dataset?.apiSummary) return ["Purchased"]
    const api = dataset.apiSummary
    const numSet = new Set(Object.keys(api.numeric_summary || {}))
    return api.column_info?.map(c => c.column_name).filter(c => !numSet.has(c)) || []
  }, [dataset, isUploaded])

  useEffect(() => {
    if (isUploaded && numericCols.length > 0) setSelectedFeature(numericCols[0])
    if (isUploaded && dataset) {
      // Pick a target. Prefer categorical, else last column
      if (categoricalCols.length > 0) setSelectedTarget(categoricalCols[categoricalCols.length - 1])
      else setSelectedTarget(dataset.columns[dataset.columns.length - 1])
    }
  }, [isUploaded, numericCols, categoricalCols, dataset])

  const featureCol = selectedFeature || "Salary"
  const targetCol = selectedTarget || "Purchased"

  // Compute Missing
  const missingBars = useMemo(() => {
    if (!isUploaded || !dataset?.apiSummary) return missingBarsDemo
    const bars: { label: string; v: number }[] = []
    for (const [col, pct] of Object.entries(dataset.apiSummary.missing_percentage || {})) {
      if ((pct as number) > 0) {
        bars.push({ label: col, v: +(pct as number).toFixed(1) })
      }
    }
    bars.sort((a, b) => b.v - a.v)
    return bars.slice(0, 5)
  }, [dataset, isUploaded])

  // Compute Histogram
  const histogram = useMemo(() => {
    if (!isUploaded || !dataset || dataset.rows.length === 0) {
      // Demo
      return [8, 18, 34, 52, 68, 74, 61, 45, 30, 19, 11, 6].map((v, i) => ({
        binStart: i * 10, binEnd: (i+1) * 10, count: v
      }))
    }
    const values = dataset.rows
      .map(r => r[featureCol])
      .filter((v): v is number => typeof v === "number")
    
    return computeHistogram(values, 12)
  }, [dataset, isUploaded, featureCol])
  const maxHist = Math.max(...histogram.map(h => h.count), 1)

  // Compute Correlation Matrix
  const { corrMatrix, corrCols } = useMemo(() => {
    if (!isUploaded || !dataset || dataset.rows.length === 0) {
      return {
        corrMatrix: [
          [1, 0.42, 0.68, 0.31],
          [0.42, 1, 0.87, 0.55],
          [0.68, 0.87, 1, 0.49],
          [0.31, 0.55, 0.49, 1],
        ],
        corrCols: ["Age", "Sal", "Inc", "Prc"]
      }
    }
    
    // Pick up to 5 numeric columns to keep UI clean
    const cols = numericCols.slice(0, 5)
    return {
      corrCols: cols,
      corrMatrix: computeCorrelationMatrix(dataset.rows, cols)
    }
  }, [dataset, isUploaded, numericCols])

  // Compute Class Distribution
  const classFreq = useMemo(() => {
    if (!isUploaded || !dataset || dataset.rows.length === 0) {
      return [
        { name: "Yes", count: 6739, pct: 54 },
        { name: "No", count: 5741, pct: 46 }
      ]
    }
    const values = dataset.rows.map(r => r[targetCol])
    const freqs = computeFrequencies(values).slice(0, 5) // Top 5
    
    // Normalize pct
    const totalCount = freqs.reduce((a, b) => a + b.count, 0)
    return freqs.map(f => ({ ...f, pct: Math.round((f.count / totalCount) * 100) }))
  }, [dataset, isUploaded, targetCol])

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Missing Values */}
      <ChartCard
        title="Missing Values"
        subtitle="Percentage by column (Top 5)"
        icon={BarChart3}
      >
        <div className="flex h-full items-end justify-around gap-3 border-b border-border pb-0 relative">
          {missingBars.length === 0 && (
             <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground pb-6">
               No missing values
             </div>
          )}
          {missingBars.map((b) => (
            <div key={b.label} className="group flex flex-1 flex-col items-center gap-2 h-full justify-end relative cursor-default">
              
              {/* Tooltip */}
              <div className="absolute bottom-[calc(100%-20px)] hidden group-hover:flex flex-col items-center z-10 pointer-events-none w-max">
                <div className="bg-popover text-popover-foreground border border-border shadow-md text-xs px-2 py-1.5 rounded-md font-medium">
                  {b.label}: <span className="text-muted-foreground ml-1">{b.v}%</span>
                </div>
                <div className="w-2 h-2 bg-popover border-b border-r border-border rotate-45 -mt-1.5" />
              </div>

              <span className="text-xs tabular-nums text-muted-foreground group-hover:text-foreground transition-colors">
                {b.v}%
              </span>
              <div className="flex w-full items-end justify-center h-full relative">
                <div
                  className="w-8 rounded-t bg-primary/80 transition-all group-hover:bg-primary"
                  style={{ height: `${Math.max(4, (b.v / 100) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground truncate w-full text-center pb-2 px-1">{b.label}</span>
            </div>
          ))}
        </div>
      </ChartCard>

      {/* Feature Distribution */}
      <ChartCard
        title="Feature Distribution"
        subtitle="Numeric histograms"
        icon={Activity}
        action={
          isUploaded && numericCols.length > 0 && (
            <div className="relative">
              <select
                value={featureCol}
                onChange={(e) => setSelectedFeature(e.target.value)}
                className="h-8 appearance-none rounded-md border border-input bg-background pl-3 pr-8 text-xs font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring w-36"
              >
                {numericCols.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground opacity-50" />
            </div>
          )
        }
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 flex items-end gap-1 border-b border-border">
            {histogram.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-chart-2/80 transition-all hover:bg-chart-2 relative group cursor-default"
                style={{ height: `${Math.max(2, (h.count / maxHist) * 100)}%` }}
              >
                {/* Tooltip */}
                <div className="absolute bottom-full mb-1.5 hidden group-hover:flex flex-col items-center left-1/2 -translate-x-1/2 z-10 pointer-events-none w-max">
                  <div className="bg-popover text-popover-foreground border border-border shadow-md text-[11px] px-2 py-1 rounded-md font-medium text-center">
                    <div>{h.binStart.toLocaleString(undefined, {maximumFractionDigits: 1})} - {h.binEnd.toLocaleString(undefined, {maximumFractionDigits: 1})}</div>
                    <div className="text-muted-foreground">{h.count.toLocaleString()} rows</div>
                  </div>
                  <div className="w-1.5 h-1.5 bg-popover border-b border-r border-border rotate-45 -mt-[4px]" />
                </div>
              </div>
            ))}
          </div>
          {histogram.length > 0 && (
            <div className="mt-2 flex justify-between text-[10px] text-muted-foreground pb-2 px-1">
              <span>{histogram[0].binStart.toLocaleString(undefined, {maximumFractionDigits: 1})}</span>
              <span>{histogram[Math.floor(histogram.length/2)].binStart.toLocaleString(undefined, {maximumFractionDigits: 1})}</span>
              <span>{histogram[histogram.length-1].binEnd.toLocaleString(undefined, {maximumFractionDigits: 1})}</span>
            </div>
          )}
        </div>
      </ChartCard>

      {/* Correlation Heatmap */}
      <ChartCard
        title="Correlation Heatmap"
        subtitle="Pearson matrix (First 5 num cols)"
        icon={Grid3x3}
      >
        <div className="flex flex-col h-full justify-between pb-2">
          {corrMatrix.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Not enough numeric columns
            </div>
          ) : (
            <div className="flex gap-2 h-full">
              <div className="flex flex-col justify-around pr-1 text-[10px] text-muted-foreground pt-0.5">
                {corrCols.map((c) => {
                  const short = c.length > 5 ? c.substring(0, 3) + ".." : c
                  return (
                    <span key={c} className="truncate w-8 text-right cursor-default">{short}</span>
                  )
                })}
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex-1 grid gap-1" style={{ gridTemplateColumns: `repeat(${corrCols.length}, minmax(0, 1fr))` }}>
                  {corrMatrix.flatMap((row, r) =>
                    row.map((val, c) => (
                      <div
                        key={`${r}-${c}`}
                        className={cn(
                          "group relative flex items-center justify-center rounded text-[10px] font-medium tabular-nums cursor-default",
                          Math.abs(val) >= 0.8
                            ? "text-primary-foreground"
                            : Math.abs(val) >= 0.5
                              ? "text-primary-foreground"
                              : "text-foreground/80",
                        )}
                        style={{
                          backgroundColor: `color-mix(in oklch, var(--primary) ${Math.round(
                            Math.abs(val) * 100,
                          )}%, var(--muted))`,
                        }}
                      >
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center z-10 pointer-events-none w-max">
                          <div className="bg-popover text-popover-foreground border border-border shadow-md text-[11px] px-2 py-1 rounded-md font-medium text-center leading-tight">
                            {corrCols[r]} × {corrCols[c]}<br/>
                            <span className="text-muted-foreground">Corr: {val.toFixed(3)}</span>
                          </div>
                          <div className="w-1.5 h-1.5 bg-popover border-b border-r border-border rotate-45 -mt-[4px]" />
                        </div>

                        {val.toFixed(2)}
                      </div>
                    )),
                  )}
                </div>
                <div className="mt-1 grid gap-1 text-center text-[10px] text-muted-foreground" style={{ gridTemplateColumns: `repeat(${corrCols.length}, minmax(0, 1fr))` }}>
                  {corrCols.map((c) => {
                    const short = c.length > 5 ? c.substring(0, 3) + ".." : c
                    return (
                      <span key={c} className="truncate cursor-default">{short}</span>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </ChartCard>

      {/* Class Distribution */}
      <ChartCard
        title="Class Distribution"
        subtitle="Target variable proportions"
        icon={PieChart}
        action={
          isUploaded && dataset && (
            <div className="relative">
              <select
                value={targetCol}
                onChange={(e) => setSelectedTarget(e.target.value)}
                className="h-8 appearance-none rounded-md border border-input bg-background pl-3 pr-8 text-xs font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring w-36"
              >
                {dataset.columns.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground opacity-50" />
            </div>
          )
        }
      >
        <div className="flex items-center gap-2 h-full pb-2">
          <div className="h-full flex-1 min-w-0">
            {classFreq.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={classFreq}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius="50%"
                    outerRadius="80%"
                    stroke="none"
                  >
                    {classFreq.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  {/* Custom Tooltip */}
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-popover text-popover-foreground border border-border shadow-md text-[11px] px-2.5 py-1.5 rounded-md font-medium">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].payload.fill }} />
                              {data.name}
                            </div>
                            <div className="text-muted-foreground mt-1 text-[10px]">
                              {data.count.toLocaleString()} rows ({data.pct}%)
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                    cursor={false}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            ) : (
               <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                 No data available
               </div>
            )}
          </div>
          <div className="flex-1 space-y-2.5 overflow-y-auto pr-1">
            {classFreq.map((item, i) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                <div className="min-w-0">
                  <div className="text-xs font-medium truncate" title={item.name}>{item.name} · {item.pct}%</div>
                  <div className="text-[10px] text-muted-foreground">{item.count.toLocaleString()} rows</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ChartCard>
    </div>
  )
}
