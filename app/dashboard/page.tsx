import { MainLayout } from "@/components/dashboard/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const dashboardStats = [
  { title: "Total Datasets", value: "24", change: "+2 this week", icon: "📊" },
  { title: "Active Models", value: "12", change: "+1 training", icon: "🤖" },
  { title: "Experiments", value: "48", change: "+8 completed", icon: "🧪" },
  { title: "Accuracy Rate", value: "94.2%", change: "+2.1% from last month", icon: "✅" },
]

const chartData = [
  { name: "Mon", accuracy: 85, precision: 88, recall: 82 },
  { name: "Tue", accuracy: 87, precision: 89, recall: 85 },
  { name: "Wed", accuracy: 89, precision: 90, recall: 87 },
  { name: "Thu", accuracy: 88, precision: 91, recall: 86 },
  { name: "Fri", accuracy: 91, precision: 92, recall: 89 },
  { name: "Sat", accuracy: 93, precision: 94, recall: 91 },
  { name: "Sun", accuracy: 94, precision: 95, recall: 92 },
]

const pieData = [
  { name: "Completed", value: 45, fill: "#3b82f6" },
  { name: "In Progress", value: 20, fill: "#10b981" },
  { name: "Pending", value: 15, fill: "#f59e0b" },
  { name: "Failed", value: 5, fill: "#ef4444" },
]

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-1 sm:gap-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            Welcome back! Here's your ML platform overview and recent activity.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {dashboardStats.map((stat) => (
            <Card key={stat.title} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-default">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    {stat.title}
                  </CardTitle>
                  <span className="text-xl sm:text-2xl opacity-20 group-hover:opacity-40 transition-opacity">{stat.icon}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent group-hover:from-primary group-hover:to-purple-600 transition-all">
                    {stat.value}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2 group-hover:text-foreground/80 transition-colors">
                    {stat.change}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
          <Card className="lg:col-span-2 hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">Model Performance Metrics</CardTitle>
              <CardDescription>Weekly accuracy, precision, and recall trends</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {chartData.map((day) => (
                <div key={day.name} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">{day.name}</span>
                    <span className="text-sm font-bold text-primary">{day.accuracy}%</span>
                  </div>
                  <div className="flex gap-1.5 h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50"
                      style={{ width: `${day.accuracy}%` }}
                    />
                    <div className="flex-1 bg-border/50 rounded-full" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">Experiment Status</CardTitle>
              <CardDescription>Distribution of states</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className="w-3 h-3 rounded-full shadow-md group-hover:scale-125 transition-transform"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors truncate">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-foreground ml-2 whitespace-nowrap">{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="hover:shadow-2xl transition-shadow duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl">Recent Activity</CardTitle>
            <CardDescription>Your latest model training and data updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {[
                { activity: "Model 'Fraud Detection v3' completed training", time: "2 hours ago", icon: "✓" },
                { activity: "Dataset 'Customer Data Q4' uploaded successfully", time: "5 hours ago", icon: "📁" },
                { activity: "Experiment 'Feature Engineering Test' started", time: "1 day ago", icon: "⚙️" },
                { activity: "Model 'Price Prediction v2' accuracy improved to 96.5%", time: "1 day ago", icon: "📈" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-border/30 last:border-0 last:pb-0 group hover:bg-secondary/20 -mx-2 -my-1 sm:-mx-4 sm:-my-2 px-2 sm:px-4 py-1 sm:py-2 rounded-lg transition-colors"
                >
                  <span className="text-lg flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-medium text-foreground group-hover:text-primary transition-colors">{item.activity}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">{item.time}</p>
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
