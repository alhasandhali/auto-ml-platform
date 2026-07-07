"use client"

import { useState } from "react"
import { Upload, ChevronRight, Clock, CalendarDays, ArrowLeft } from "lucide-react"
import { useDataset } from "@/lib/dataset-context"
import { UploadDatasetModal } from "./upload-dataset-modal"

interface DatasetHeaderProps {
  onBackToLibrary?: () => void
}

export function DatasetHeader({ onBackToLibrary }: DatasetHeaderProps) {
  const { dataset, isUploaded } = useDataset()
  const [showUpload, setShowUpload] = useState(false)

  const fileName = isUploaded ? dataset!.fileName : "customer_transactions.csv"
  const uploadDate = isUploaded
    ? dataset!.uploadedAt.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Jun 28, 2026"

  const analyzedTime = isUploaded ? "Just now" : "4 minutes ago"

  return (
    <>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
            {onBackToLibrary && (
              <button
                onClick={onBackToLibrary}
                className="flex items-center gap-1 text-primary font-medium hover:underline underline-offset-2 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                My Datasets
              </button>
            )}
            {onBackToLibrary && <ChevronRight className="h-3.5 w-3.5" />}
            {!onBackToLibrary && (
              <>
                <span>{isUploaded ? "Uploaded Dataset" : "Customer Churn"}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </>
            )}
            <span className="font-medium text-foreground">Dataset Analysis</span>
          </nav>
          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            {fileName}
          </h1>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              Uploaded {uploadDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              Last analyzed {analyzedTime}
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowUpload(true)}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          <Upload className="h-4 w-4" />
          Upload New Dataset
        </button>
      </div>

      <UploadDatasetModal
        open={showUpload}
        onClose={() => setShowUpload(false)}
      />
    </>
  )
}
