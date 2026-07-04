import { MainLayout } from "@/components/dashboard/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, ArrowRight } from "lucide-react"

const projects = [
  {
    id: 1,
    name: "Fraud Detection System",
    description: "Real-time fraud detection for credit card transactions",
    models: 5,
    datasets: 3,
    status: "Active",
  },
  {
    id: 2,
    name: "Customer Churn Prediction",
    description: "Predict customer churn risk and retention opportunities",
    models: 3,
    datasets: 2,
    status: "Active",
  },
  {
    id: 3,
    name: "Product Recommendation Engine",
    description: "Personalized product recommendations based on user behavior",
    models: 7,
    datasets: 4,
    status: "Active",
  },
  {
    id: 4,
    name: "Price Optimization",
    description: "Dynamic pricing model for e-commerce platform",
    models: 2,
    datasets: 2,
    status: "Planning",
  },
]

export default function ProjectsPage() {
  return (
    <MainLayout>
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">Projects</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">Manage your ML projects and organize your work</p>
          </div>
          <Button className="w-full sm:w-auto bg-gradient-to-r from-primary to-blue-600 hover:from-primary hover:to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all" size="lg">
            <Plus className="mr-2 h-5 w-5" />
            New Project
          </Button>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.id} className="group hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1 overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg sm:text-xl group-hover:text-primary transition-colors truncate">{project.name}</CardTitle>
                    <CardDescription className="text-xs sm:text-sm mt-1 line-clamp-2">{project.description}</CardDescription>
                  </div>
                  <span className={`px-3 py-1 text-xs sm:text-xs font-semibold rounded-full whitespace-nowrap flex-shrink-0 ${
                    project.status === "Active"
                      ? "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-amber-100/80 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  }`}>
                    {project.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 pb-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Models</p>
                    <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">{project.models}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Datasets</p>
                    <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">{project.datasets}</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" size="sm">
                  View Project
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
