"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { Topbar } from "./topbar"
import { DatasetHeader } from "./dataset-header"
import { SummaryCards } from "./summary-cards"
import { DatasetPreview } from "./dataset-preview"
import { ColumnAnalysis } from "./column-analysis"
import { MissingValues } from "./missing-values"
import { DuplicateAnalysis } from "./duplicate-analysis"
import { DatasetStatistics } from "./dataset-statistics"
import { ChartsSection } from "./charts-section"
import { AiInsights } from "./ai-insights"

export function DashboardShell() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setCollapsed((c) => !c)} />

        <main className="flex-1 p-4 md:p-6">
          <div className="mx-auto max-w-[1600px] space-y-6">
            <DatasetHeader />
            <SummaryCards />

            <div className="flex flex-col gap-6 xl:flex-row">
              <div className="min-w-0 flex-1 space-y-6">
                <DatasetPreview />
                <ColumnAnalysis />
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <MissingValues />
                  <DuplicateAnalysis />
                </div>
                <DatasetStatistics />
                <ChartsSection />
              </div>

              <AiInsights />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
