import { MainLayout } from "@/components/dashboard/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Play, RotateCcw } from "lucide-react"

const experiments = [
  {
    id: 1,
    name: "Feature Engineering Test",
    project: "Fraud Detection System",
    status: "Completed",
    accuracy: 96.8,
    duration: "2h 34m",
    createdAt: "2 days ago",
  },
  {
    id: 2,
    name: "Hyperparameter Tuning v2",
    project: "Customer Churn Prediction",
    status: "Running",
    accuracy: null,
    duration: "1h 12m",
    createdAt: "2 hours ago",
  },
  {
    id: 3,
    name: "Model Comparison: XGBoost vs LightGBM",
    project: "Price Optimization",
    status: "Completed",
    accuracy: 91.5,
    duration: "3h 45m",
    createdAt: "1 week ago",
  },
  {
    id: 4,
    name: "Data Augmentation Strategy",
    project: "Product Recommendation Engine",
    status: "Failed",
    accuracy: null,
    duration: "45m",
    createdAt: "3 days ago",
  },
  {
    id: 5,
    name: "Cross-validation Analysis",
    project: "Fraud Detection System",
    status: "Completed",
    accuracy: 94.2,
    duration: "1h 20m",
    createdAt: "1 week ago",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800"
    case "Running":
      return "bg-blue-100 text-blue-800"
    case "Failed":
      return "bg-red-100 text-red-800"
    case "Queued":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function ExperimentsPage() {
  return (
    <MainLayout>
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">Experiments</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">Track and manage your ML experiments</p>
          </div>
          <Button className="w-full sm:w-auto bg-gradient-to-r from-primary to-blue-600 hover:from-primary hover:to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all" size="lg">
            <Plus className="mr-2 h-5 w-5" />
            New Experiment
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Experiments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48</div>
              <p className="text-xs text-muted-foreground mt-1">+8 completed this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Running</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground mt-1">~3 hours remaining</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">91.7%</div>
              <p className="text-xs text-muted-foreground mt-1">44 successful / 48 total</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2h 15m</div>
              <p className="text-xs text-muted-foreground mt-1">Per experiment</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Experiments</CardTitle>
            <CardDescription>All your recent model experiments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {experiments.map((exp) => (
                <div key={exp.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="font-semibold">{exp.name}</h3>
                        <p className="text-sm text-muted-foreground">{exp.project}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {exp.accuracy && (
                      <div className="text-right">
                        <p className="text-sm font-semibold">{exp.accuracy}%</p>
                        <p className="text-xs text-muted-foreground">Accuracy</p>
                      </div>
                    )}
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{exp.duration}</p>
                      <p className="text-xs text-muted-foreground">{exp.createdAt}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getStatusColor(exp.status)}`}>
                      {exp.status}
                    </span>
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
