"use client"

import { useMemo, useState } from "react"
import {
  Sparkles,
  CircleAlert,
  Scale,
  Wand2,
  Trees,
  Layers,
  ArrowRight,
  X,
  Loader2,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useDataset } from "@/lib/dataset-context"
import ReactMarkdown from "react-markdown"

type Insight = {
  icon: LucideIcon
  title: string
  desc: string
  tone: "warn" | "good" | "info"
}

const demoInsights: Insight[] = [
  {
    icon: CircleAlert,
    title: "Missing values detected",
    desc: "Income (24%) and Salary (12%) need imputation before training.",
    tone: "warn",
  },
  {
    icon: Scale,
    title: "Dataset is balanced",
    desc: "Target class 'Purchased' has a healthy 54/46 split.",
    tone: "good",
  },
  {
    icon: Wand2,
    title: "Scaling recommended",
    desc: "Numeric ranges vary widely — apply StandardScaler.",
    tone: "info",
  },
  {
    icon: Trees,
    title: "Random Forest recommended",
    desc: "Mixed feature types suit tree-based ensembles well.",
    tone: "info",
  },
  {
    icon: Layers,
    title: "Feature engineering suggested",
    desc: "Bucket 'Age' and encode 'Department' for a lift in accuracy.",
    tone: "good",
  },
]

const toneStyles: Record<Insight["tone"], string> = {
  warn: "bg-chart-4/15 text-chart-4 border-chart-4/30",
  good: "bg-chart-3/15 text-chart-3 border-chart-3/30",
  info: "bg-primary/15 text-primary border-primary/30",
}

export function AiInsights() {
  const { dataset, isUploaded } = useDataset()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportText, setReportText] = useState("")
  const [error, setError] = useState("")

  const insights = useMemo(() => {
    if (!isUploaded || !dataset || !dataset.apiSummary) return demoInsights

    const api = dataset.apiSummary
    const generated: Insight[] = []

    // Check missing values
    const missingCols = Object.entries(api.missing_percentage || {})
      .filter(([_, pct]) => (pct as number) > 0)
      .map(([col, pct]) => `${col} (${(pct as number).toFixed(1)}%)`)

    if (missingCols.length > 0) {
      generated.push({
        icon: CircleAlert,
        title: "Missing values detected",
        desc: `${missingCols.slice(0, 3).join(", ")}${missingCols.length > 3 ? "..." : ""} need imputation.`,
        tone: "warn",
      })
    } else {
      generated.push({
        icon: Sparkles,
        title: "Dataset is clean",
        desc: "No missing values found. Ready for feature engineering.",
        tone: "good",
      })
    }

    // Check duplicates
    if (api.duplicate_rows > 0) {
      generated.push({
        icon: CircleAlert,
        title: "Duplicate rows detected",
        desc: `Found ${api.duplicate_rows} duplicate rows. Consider dropping them.`,
        tone: "warn",
      })
    }

    // Data Types summary
    const categorical = api.column_info.filter(c => c.dtype.includes("str") || c.dtype.includes("object")).length
    const numeric = api.column_info.filter(c => c.dtype.includes("int") || c.dtype.includes("float")).length

    if (numeric > 0 && categorical > 0) {
      generated.push({
        icon: Wand2,
        title: "Mixed feature types",
        desc: `Found ${numeric} numeric and ${categorical} categorical features. Requires encoding.`,
        tone: "info",
      })
    } else if (numeric > 0) {
      generated.push({
        icon: Wand2,
        title: "Numeric features",
        desc: `All ${numeric} features are numeric. Consider StandardScaler or MinMax.`,
        tone: "info",
      })
    }

    // Outliers
    const outlierCols = Object.entries(api.outliers || {})
      .filter(([_, count]) => count > 0)
      .map(([col, count]) => `${col} (${count})`)

    if (outlierCols.length > 0) {
      generated.push({
        icon: Scale,
        title: "Outliers detected",
        desc: `Found in: ${outlierCols.slice(0, 3).join(", ")}. Consider robust scaling.`,
        tone: "info",
      })
    }

    // Default model recommendation
    generated.push({
      icon: Trees,
      title: "Model recommendation",
      desc: "Tree-based ensembles (Random Forest, XGBoost) are a solid baseline.",
      tone: "info",
    })

    return generated.slice(0, 5) // Max 5 insights
  }, [dataset, isUploaded])

  const handleGenerateReport = async () => {
    if (!dataset || !dataset.apiSummary) return
    
    setIsModalOpen(true)
    setIsGenerating(true)
    setReportText("")
    setError("")
    
    try {
      const res = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Fallback to llama3.2 since that's what is installed
        body: JSON.stringify({ apiSummary: dataset.apiSummary, model: "llama3.2" }),
      })
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to connect to local Ollama instance.")
      }
      
      const reader = res.body?.getReader()
      if (!reader) throw new Error("Stream not available")
      
      const decoder = new TextDecoder()
      let fullText = ""
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split("\n")
        
        for (const line of lines) {
          if (line.trim() === "") continue
          try {
            const data = JSON.parse(line)
            if (data.response) {
              fullText += data.response
              setReportText(fullText)
            }
          } catch (e) {
            console.error("Error parsing chunk:", line)
          }
        }
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <>
      <aside className="flex w-full flex-col rounded-xl border border-border bg-card shadow-sm xl:w-80 xl:shrink-0 h-[calc(100vh-2rem)] sticky top-4">
        <div className="flex items-center gap-2 border-b border-border p-4 shrink-0">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-sm font-semibold">AI Dataset Insights</h2>
            <p className="text-xs text-muted-foreground">{insights.length} recommendations</p>
          </div>
        </div>

        <div className="flex-1 space-y-3 p-4 overflow-y-auto">
          {insights.map((insight) => (
            <div
              key={insight.title}
              className="group rounded-lg border border-border bg-secondary/30 p-3 transition-colors hover:border-primary/40"
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
                    toneStyles[insight.tone],
                  )}
                >
                  <insight.icon className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-medium leading-tight">
                    {insight.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {insight.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border p-4 shrink-0 bg-card rounded-b-xl">
          <button 
            onClick={handleGenerateReport}
            disabled={!isUploaded || !dataset?.apiSummary}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="h-4 w-4" />
            Generate AI Report
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* AI Report Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 md:p-8 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl h-[90vh] md:h-[85vh] bg-card border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 md:p-5 border-b border-border bg-secondary/20 shrink-0">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <h2 className="text-base font-semibold tracking-tight">AI Data Scientist Report</h2>
                  <p className="text-xs text-muted-foreground">Generated locally via Ollama</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-md hover:bg-secondary text-muted-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 md:p-8 overflow-y-auto flex-1 bg-background relative scroll-smooth">
              {error ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 max-w-md mx-auto">
                  <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                    <CircleAlert className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Connection Error</h3>
                    <p className="text-sm text-muted-foreground mt-2">{error}</p>
                    <div className="mt-6 p-4 bg-secondary/50 rounded-lg text-left border border-border">
                      <p className="text-xs text-foreground font-medium mb-2">Troubleshooting Checklist:</p>
                      <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
                        <li>Is Ollama installed and running on your computer?</li>
                        <li>Have you pulled the model? <code className="bg-background px-1 py-0.5 rounded text-primary">ollama pull llama3</code></li>
                        <li>Is Ollama listening on <code className="bg-background px-1 py-0.5 rounded">http://localhost:11434</code>?</li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : reportText === "" && isGenerating ? (
                <div className="flex flex-col items-center justify-center h-[50vh] space-y-5">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 border-4 border-primary/20 rounded-full w-12 h-12"></div>
                    <div className="border-4 border-primary border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
                    <Sparkles className="h-4 w-4 text-primary absolute animate-pulse" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">Analyzing dataset topology...</p>
                    <p className="text-xs text-muted-foreground mt-1">This may take a few seconds on local hardware.</p>
                  </div>
                </div>
              ) : (
                <div className="max-w-3xl mx-auto pb-8">
                  <ReactMarkdown
                    components={{
                      h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-8 mb-4 tracking-tight text-foreground" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-xl font-semibold mt-8 mb-4 tracking-tight text-foreground border-b border-border pb-2" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-lg font-medium mt-6 mb-3 text-foreground" {...props} />,
                      p: ({node, ...props}) => <p className="mb-4 text-sm text-muted-foreground leading-relaxed" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 text-sm text-muted-foreground space-y-1.5 marker:text-primary" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 text-sm text-muted-foreground space-y-1.5" {...props} />,
                      li: ({node, ...props}) => <li {...props} />,
                      strong: ({node, ...props}) => <strong className="font-semibold text-foreground" {...props} />,
                      code: ({node, className, children, ...props}) => (
                        <code className={cn("px-1.5 py-0.5 rounded-md bg-secondary/50 text-foreground font-mono text-xs border border-border", className)} {...props}>
                          {children}
                        </code>
                      ),
                      pre: ({node, ...props}) => (
                        <pre className="p-4 rounded-lg bg-secondary/30 border border-border overflow-x-auto text-xs my-4" {...props} />
                      ),
                      blockquote: ({node, ...props}) => (
                        <blockquote className="border-l-4 border-primary/50 pl-4 py-1 italic text-muted-foreground my-4 bg-primary/5 rounded-r-lg" {...props} />
                      ),
                    }}
                  >
                    {reportText}
                  </ReactMarkdown>
                  {isGenerating && (
                    <span className="inline-block w-2.5 h-4 ml-1 bg-primary animate-pulse align-middle" />
                  )}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-border bg-secondary/20 shrink-0 flex justify-end gap-2">
               {reportText && !isGenerating && (
                 <button 
                   onClick={() => navigator.clipboard.writeText(reportText)}
                   className="px-4 py-2 rounded-md bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition-colors border border-border"
                 >
                   Copy to Clipboard
                 </button>
               )}
               <button 
                 onClick={() => setIsModalOpen(false)}
                 className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
               >
                 Close Report
               </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
