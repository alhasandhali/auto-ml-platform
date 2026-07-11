"use client"

import { useState } from "react"
import { Sparkles } from "lucide-react"
import { useDataset, BACKEND_URL } from "@/lib/dataset-context"
import { useAuth } from "@/lib/auth"
import { toast } from "sonner"
import { apiFetch } from "@/lib/api"

export function NoisyData() {
  const { dataset, fetchSavedDatasets, loadSavedAnalysis } = useDataset()
  const [isCleaning, setIsCleaning] = useState(false)
  const { token } = useAuth()

  const handleCleanNoise = async () => {
    if (!dataset?.id || !token) return
    
    setIsCleaning(true)
    try {
      const res = await apiFetch(`${BACKEND_URL}/datasets/${dataset.id}/clean-noise`, {
        method: "POST"
      })
      
      if (!res.ok) {
        let errorMsg = "Failed to clean noisy data"
        try {
          const errData = await res.json()
          if (errData.detail) errorMsg = errData.detail
        } catch (_) {}
        throw new Error(errorMsg)
      }
      
      const data = await res.json()
      const newDatasetId = data.dataset_id
      const taskId = data.task_id
      
      if (taskId) {
        while (true) {
          const pollRes = await apiFetch(`${BACKEND_URL}/tasks/${taskId}`);
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
      
      await fetchSavedDatasets()
      await loadSavedAnalysis(taskId, newDatasetId)
      toast.success("Noisy data cleaned successfully")
      
    } catch (err) {
      console.error("Error cleaning noisy data:", err)
      toast.error(err instanceof Error ? err.message : "Error cleaning noisy data")
    } finally {
      setIsCleaning(false)
    }
  }

  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-primary">
            <Sparkles className="h-4 w-4" />
          </span>
          <h2 className="text-sm font-semibold">Clean Noisy Data</h2>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border bg-secondary/40 p-3">
          <div className="text-sm font-medium tracking-tight">Standardization</div>
          <div className="text-xs text-muted-foreground mt-1">Strips whitespace & converts types</div>
        </div>
        <div className="rounded-lg border border-border bg-secondary/40 p-3">
          <div className="text-sm font-medium tracking-tight">Outliers & Errors</div>
          <div className="text-xs text-muted-foreground mt-1">Caps extremes & fixes logic</div>
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        Use our intelligent heuristic engine to dynamically analyze and clean your dataset. This will automatically format strings, enforce numeric types, cap extreme outliers using IQR, and resolve known logical errors (like negative ages or prices).
      </p>

      <button 
        onClick={handleCleanNoise}
        disabled={isCleaning}
        className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-lg border border-border bg-primary/10 text-primary hover:bg-primary/20 text-sm font-medium transition-colors disabled:opacity-50"
      >
        {isCleaning ? "Cleaning..." : "Clean Noisy Data"}
      </button>
    </section>
  )
}
