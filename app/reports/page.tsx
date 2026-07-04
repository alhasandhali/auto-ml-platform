import { MainLayout } from "@/components/dashboard/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Download, Eye } from "lucide-react"

const reports = [
  {
    id: 1,
    title: "Model Performance Report - Q4 2024",
    description: "Comprehensive analysis of all deployed models",
    date: "Dec 15, 2024",
    type: "Performance",
    status: "Ready",
  },
  {
    id: 2,
    title: "Data Quality Assessment",
    description: "Dataset health and data integrity report",
    date: "Dec 10, 2024",
    type: "Data Quality",
    status: "Ready",
  },
  {
    id: 3,
    title: "Feature Importance Analysis",
    description: "Top features driving model predictions",
    date: "Dec 8, 2024",
    type: "Analysis",
    status: "Ready",
  },
  {
    id: 4,
    title: "Training Experiment Summary",
    description: "Results from recent model training experiments",
    date: "Dec 5, 2024",
    type: "Experiments",
    status: "Ready",
  },
  {
    id: 5,
    title: "Prediction Accuracy Trends",
    description: "Monthly accuracy trends across all models",
    date: "Dec 1, 2024",
    type: "Performance",
    status: "Archived",
  },
]

export default function ReportsPage() {
  return (
    <MainLayout>
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">Reports</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">Generate and view comprehensive reports about your models and data</p>
          </div>
          <Button className="w-full sm:w-auto bg-gradient-to-r from-primary to-blue-600 hover:from-primary hover:to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all" size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Generate Report
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1">Generated this quarter</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Report Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground mt-1">Performance, Analysis, Quality...</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Latest Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Dec 15</div>
              <p className="text-xs text-muted-foreground mt-1">Performance Report Q4</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Your Reports</h3>
          <div className="grid gap-4">
            {reports.map((report) => (
              <Card key={report.id} className="hover:border-primary transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{report.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-primary/10 text-primary">
                          {report.type}
                        </span>
                        <span className="text-xs text-muted-foreground">{report.date}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Report Templates</CardTitle>
            <CardDescription>Choose from pre-built templates or create custom reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "Model Performance", description: "Accuracy, precision, recall metrics" },
                { name: "Data Quality", description: "Missing values, duplicates, outliers" },
                { name: "Feature Analysis", description: "Feature importance and correlations" },
                { name: "Training Summary", description: "Experiment results and comparisons" },
              ].map((template, i) => (
                <Button key={i} variant="outline" className="h-auto p-4 justify-start flex-col items-start">
                  <span className="font-semibold">{template.name}</span>
                  <span className="text-xs text-muted-foreground">{template.description}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
