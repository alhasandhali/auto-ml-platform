"use client"

import { useState, useCallback } from "react"
import { DatasetProvider, useDataset, BACKEND_URL, type SavedDataset } from "@/lib/dataset-context"
import { useAuth } from "@/lib/auth"
import { MainLayout } from "@/components/dashboard/main-layout"
import { DatasetLibrary } from "@/components/dashboard/dataset-library"
import { DatasetHeader } from "@/components/dashboard/dataset-header"
import { SummaryCards } from "@/components/dashboard/summary-cards"
import { DatasetPreview } from "@/components/dashboard/dataset-preview"
import { ColumnAnalysis } from "@/components/dashboard/column-analysis"
import { MissingValues } from "@/components/dashboard/missing-values"
import { DuplicateAnalysis } from "@/components/dashboard/duplicate-analysis"
import { DatasetStatistics } from "@/components/dashboard/dataset-statistics"
import { ChartsSection } from "@/components/dashboard/charts-section"
import { AiInsights } from "@/components/dashboard/ai-insights"
import { UploadDatasetModal } from "@/components/dashboard/upload-dataset-modal"

function DatasetsContent() {
  const { dataset, isUploaded, clearDataset, loadSavedAnalysis, fetchSavedDatasets } = useDataset()
  const { token } = useAuth()

  const [view, setView] = useState<"library" | "analysis">(
    isUploaded ? "analysis" : "library"
  )
  const [showUpload, setShowUpload] = useState(false)
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false)

  // When a dataset is opened from the library
  const handleOpenDataset = useCallback(async (ds: SavedDataset) => {
    // We don't have a direct way to re-open a dataset's analysis from the datasets collection.
    // Instead, we search for matching analyses. For now, we display the dataset metadata.
    // The user can upload again if they want full analysis.
    // Let's show the analysis view with whatever data we have.
    
    // Try to find matching analysis
    if (token) {
      setIsLoadingAnalysis(true)
      try {
        // If dataset has an associated analysis_id, use it directly
        if (ds.analysis_id) {
          const success = await loadSavedAnalysis(ds.analysis_id, ds._id)
          if (success) {
            setView("analysis")
            setIsLoadingAnalysis(false)
            return
          }
        }

        // Fallback: Fetch analyses to find one matching this dataset's filename
        const res = await fetch(`${BACKEND_URL}/analyses?limit=100`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          const match = data.analyses?.find(
            (a: any) => a.filename === ds.metadata.name || a.filename === ds.metadata.name + "." + ds.metadata.file_type
          )
          if (match && match.status === "completed") {
            const success = await loadSavedAnalysis(match._id, ds._id)
            if (success) {
              setView("analysis")
              setIsLoadingAnalysis(false)
              return
            }
          }
        }
      } catch (err) {
        console.error("Error finding analysis:", err)
      }
      setIsLoadingAnalysis(false)
    }

    // Fallback: set basic dataset info from metadata (no full analysis)
    // This will show the analysis view with column info but no charts
    setView("analysis")
  }, [token, loadSavedAnalysis])

  // Navigate back to library
  const handleBackToLibrary = useCallback(() => {
    clearDataset()
    setView("library")
  }, [clearDataset])

  // When upload modal closes, switch to analysis if a dataset was uploaded
  const handleUploadClose = useCallback(() => {
    setShowUpload(false)
    if (isUploaded) {
      setView("analysis")
    }
  }, [isUploaded])

  // Switch to analysis view if a dataset gets uploaded while on library view
  // (this happens after the modal sets the dataset in context)
  if (view === "library" && isUploaded && !showUpload) {
    setView("analysis")
  }

  return (
    <MainLayout>
      {view === "library" ? (
        <>
          <DatasetLibrary
            onUpload={() => setShowUpload(true)}
            onOpenDataset={handleOpenDataset}
          />
          <UploadDatasetModal
            open={showUpload}
            onClose={handleUploadClose}
          />

          {/* Loading overlay for analysis fetch */}
          {isLoadingAnalysis && (
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/60 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-sm font-medium text-muted-foreground">Loading analysis...</p>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-6">
          <DatasetHeader onBackToLibrary={handleBackToLibrary} />
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
      )}
    </MainLayout>
  )
}

export default function DatasetsPage() {
  return (
    <DatasetProvider>
      <DatasetsContent />
    </DatasetProvider>
  )
}
