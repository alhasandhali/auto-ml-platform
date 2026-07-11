"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { apiFetch } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Wand2, Loader2 } from "lucide-react"

interface AutoMLPrepModalProps {
  datasetId: string
  datasetName?: string
  onSuccess?: () => void
}

export function AutoMLPrepModal({ datasetId, datasetName = "this dataset", onSuccess }: AutoMLPrepModalProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Configuration state (default all true)
  const [config, setConfig] = useState({
    encode_categorical: true,
    scale_features: true,
    parse_dates: true,
    drop_irrelevant: true,
  })

  const handleToggle = (key: keyof typeof config) => {
    setConfig((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    const toastId = toast.loading("Running Automated ML Prep pipeline...")

    try {
      const res = await apiFetch(`/api/datasets/${datasetId}/automated-ml-prep`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      })

      if (!res.ok) {
        throw new Error(await res.text() || "Failed to process dataset")
      }

      toast.success("ML Prep Pipeline initiated successfully!", { id: toastId })
      setOpen(false)
      
      // Optionally refresh the current route or trigger a callback
      if (onSuccess) {
        onSuccess()
      } else {
        router.refresh()
      }
    } catch (error: any) {
      console.error("Auto ML Prep Error:", error)
      toast.error(error.message || "An unexpected error occurred", { id: toastId })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={<Button variant="default" className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white" />}
      >
        <Wand2 className="h-4 w-4" />
        Auto ML Prep
      </AlertDialogTrigger>
      
      <AlertDialogContent className="sm:max-w-[450px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Automated ML Preparation</AlertDialogTitle>
          <AlertDialogDescription>
            Configure the automated data cleaning and transformation pipeline for {datasetName}. 
            This will create a new dataset appended with <code className="bg-muted px-1 rounded">_ml_ready</code>.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between space-x-2 border p-3 rounded-md">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="drop_irrelevant" className="font-medium">Drop Irrelevant Columns</Label>
              <span className="text-xs text-muted-foreground">Removes unique IDs and constant values.</span>
            </div>
            <Switch 
              id="drop_irrelevant" 
              checked={config.drop_irrelevant} 
              onCheckedChange={() => handleToggle("drop_irrelevant")} 
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between space-x-2 border p-3 rounded-md">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="parse_dates" className="font-medium">Parse Date/Time Features</Label>
              <span className="text-xs text-muted-foreground">Extracts Year, Month, and Day columns.</span>
            </div>
            <Switch 
              id="parse_dates" 
              checked={config.parse_dates} 
              onCheckedChange={() => handleToggle("parse_dates")} 
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between space-x-2 border p-3 rounded-md">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="encode_categorical" className="font-medium">Encode Categorical Data</Label>
              <span className="text-xs text-muted-foreground">Applies One-Hot & Label Encoding.</span>
            </div>
            <Switch 
              id="encode_categorical" 
              checked={config.encode_categorical} 
              onCheckedChange={() => handleToggle("encode_categorical")} 
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between space-x-2 border p-3 rounded-md">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="scale_features" className="font-medium">Scale Numerical Features</Label>
              <span className="text-xs text-muted-foreground">Normalizes numeric values between 0 and 1.</span>
            </div>
            <Switch 
              id="scale_features" 
              checked={config.scale_features} 
              onCheckedChange={() => handleToggle("scale_features")} 
              disabled={isLoading}
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <Button onClick={handleSubmit} disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Run ML Pipeline"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
