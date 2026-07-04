import { MainLayout } from "@/components/dashboard/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Zap, TrendingUp } from "lucide-react"

const models = [
  {
    id: 1,
    name: "Fraud Detection v3",
    project: "Fraud Detection System",
    accuracy: 96.8,
    f1Score: 0.94,
    status: "Deployed",
    lastUpdated: "2 hours ago",
  },
  {
    id: 2,
    name: "Churn Prediction v2",
    project: "Customer Churn Prediction",
    accuracy: 92.3,
    f1Score: 0.89,
    status: "Training",
    lastUpdated: "1 hour ago",
  },
  {
    id: 3,
    name: "Recommendation Engine v4",
    project: "Product Recommendation Engine",
    accuracy: 88.5,
    f1Score: 0.86,
    status: "Deployed",
    lastUpdated: "1 day ago",
  },
  {
    id: 4,
    name: "Price Optimization v1",
    project: "Price Optimization",
    accuracy: 91.2,
    f1Score: 0.87,
    status: "Ready",
    lastUpdated: "3 days ago",
  },
  {
    id: 5,
    name: "Churn Prediction v1",
    project: "Customer Churn Prediction",
    accuracy: 89.1,
    f1Score: 0.82,
    status: "Archived",
    lastUpdated: "1 week ago",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Deployed":
      return "bg-green-100 text-green-800"
    case "Training":
      return "bg-blue-100 text-blue-800"
    case "Ready":
      return "bg-yellow-100 text-yellow-800"
    case "Archived":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function ModelsPage() {
  return (
    <MainLayout>
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">Models</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">Train, evaluate, and deploy your ML models</p>
          </div>
          <Button className="w-full sm:w-auto bg-gradient-to-r from-primary to-blue-600 hover:from-primary hover:to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all" size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Train Model
          </Button>
        </div>

        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
          <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Models</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">12</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 group-hover:text-foreground/80 transition-colors">5 deployed, 2 training</p>
            </CardContent>
          </Card>
          <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider">Avg Accuracy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">92.8%</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 group-hover:text-foreground/80 transition-colors">+1.2% this month</p>
            </CardContent>
          </Card>
          <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider">Active Deployments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">5</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 group-hover:text-foreground/80 transition-colors">99.8% uptime</p>
            </CardContent>
          </Card>
        </div>

        <Card className="hover:shadow-2xl transition-shadow duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl">All Models</CardTitle>
            <CardDescription>Overview of all trained and deployed models</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {models.map((model) => (
                <div key={model.id} className="group hover:bg-secondary/40 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 sm:py-4 rounded-lg transition-colors border border-transparent hover:border-border/50">
                  <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-5 items-center">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm sm:text-base group-hover:text-primary transition-colors truncate">{model.name}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">{model.project}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Accuracy</p>
                      <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">{model.accuracy}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">F1 Score</p>
                      <p className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">{model.f1Score}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Status</p>
                      <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(model.status)}`}>
                        {model.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Updated</p>
                      <p className="text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors">{model.lastUpdated}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
