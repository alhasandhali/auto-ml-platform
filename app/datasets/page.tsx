"use client"

import { DatasetProvider } from "@/lib/dataset-context"
import { MainLayout } from "@/components/dashboard/main-layout"
import { DatasetHeader } from "@/components/dashboard/dataset-header"
import { SummaryCards } from "@/components/dashboard/summary-cards"
import { DatasetPreview } from "@/components/dashboard/dataset-preview"
import { ColumnAnalysis } from "@/components/dashboard/column-analysis"
import { MissingValues } from "@/components/dashboard/missing-values"
import { DuplicateAnalysis } from "@/components/dashboard/duplicate-analysis"
import { DatasetStatistics } from "@/components/dashboard/dataset-statistics"
import { ChartsSection } from "@/components/dashboard/charts-section"
import { AiInsights } from "@/components/dashboard/ai-insights"

export default function DatasetsPage() {
  return (
    <DatasetProvider>
      <MainLayout>
        <div className="space-y-6">
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
      </MainLayout>
    </DatasetProvider>
  )
}
