"use client"

import { useMemo, useState } from "react"
import { CopyCheck, TriangleAlert, CheckCircle2 } from "lucide-react"
import { useDataset, BACKEND_URL } from "@/lib/dataset-context"
import { useAuth } from "@/lib/auth"

export function DuplicateAnalysis() {
  const { dataset, isUploaded } = useDataset()

  const { dupCount, dupPct } = useMemo(() => {
    if (!isUploaded || !dataset || !dataset.apiSummary) {
      return { dupCount: 34, dupPct: "0.27" }
    }

    const count = dataset.apiSummary.duplicate_rows
    
    return {
      dupCount: count,
      dupPct: dataset.apiSummary.rows > 0 ? ((count / dataset.apiSummary.rows) * 100).toFixed(2) : "0",
    }
  }, [dataset, isUploaded])

  const hasDuplicates = dupCount > 0
  const [isCleaning, setIsCleaning] = useState(false)
  const { token } = useAuth()
  const { fetchSavedDatasets, loadSavedAnalysis } = useDataset()

  const handleRemoveDuplicates = async () => {
    if (!dataset?.id || !token) return
    
    setIsCleaning(true)
    try {
      // 1. Trigger the cleaning endpoint
      const res = await fetch(`${BACKEND_URL}/datasets/${dataset.id}/clean-duplicates`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (!res.ok) {
        let errorMsg = "Failed to clean duplicates"
        try {
          const errData = await res.json()
          if (errData.detail) errorMsg = errData.detail
        } catch (_) {}
        throw new Error(errorMsg)
      }
      
      const data = await res.json()
      const newDatasetId = data.dataset_id
      const taskId = data.task_id
      
      // 2. Poll for the analysis to complete
      if (taskId) {
        while (true) {
          const pollRes = await fetch(`${BACKEND_URL}/tasks/${taskId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
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
      
      // 3. Re-fetch library list to show new dataset
      await fetchSavedDatasets(token)
      
      // 4. Load the newly cleaned dataset into the dashboard seamlessly
      await loadSavedAnalysis(taskId, newDatasetId, token)
      
    } catch (err) {
      console.error("Error removing duplicates:", err)
      alert(err instanceof Error ? err.message : "Error removing duplicates")
    } finally {
      setIsCleaning(false)
    }
  }

  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-primary">
            <CopyCheck className="h-4 w-4" />
          </span>
          <h2 className="text-sm font-semibold">Duplicate Analysis</h2>
        </div>
        {hasDuplicates ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-chart-4/30 bg-chart-4/15 px-2 py-0.5 text-xs font-medium text-chart-4">
            <TriangleAlert className="h-3 w-3" />
            Attention
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full border border-chart-3/30 bg-chart-3/15 px-2 py-0.5 text-xs font-medium text-chart-3">
            <CheckCircle2 className="h-3 w-3" />
            Clean
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border bg-secondary/40 p-3">
          <div className="text-2xl font-semibold tracking-tight">{dupCount.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">Duplicate rows</div>
        </div>
        <div className="rounded-lg border border-border bg-secondary/40 p-3">
          <div className="text-2xl font-semibold tracking-tight">{dupPct}%</div>
          <div className="text-xs text-muted-foreground">Of total rows</div>
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        {hasDuplicates
          ? `${dupCount} duplicate rows detected. Consider removing them before training to avoid overfitting and biased evaluation metrics.`
          : "No duplicate rows found. Your dataset is clean."}
      </p>

      {hasDuplicates && (
        <button 
          onClick={handleRemoveDuplicates}
          disabled={isCleaning}
          className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-lg border border-border text-sm font-medium transition-colors hover:bg-accent disabled:opacity-50"
        >
          {isCleaning ? "Cleaning..." : "Remove Duplicates"}
        </button>
      )}
    </section>
  )
}
