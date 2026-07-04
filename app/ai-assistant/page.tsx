import { MainLayout } from "@/components/dashboard/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Send, Zap, BarChart3, Database, Brain } from "lucide-react"

export default function AiAssistantPage() {
  return (
    <MainLayout>
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">AI Assistant</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">Get AI-powered insights and recommendations for your ML workflows</p>
          </div>
        </div>

        <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2 group-hover:text-primary transition-colors">
                <Zap className="h-5 w-5 flex-shrink-0" />
                Quick Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">
                Analyze datasets and get instant recommendations
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2 group-hover:text-primary transition-colors">
                <BarChart3 className="h-5 w-5 flex-shrink-0" />
                Model Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">
                Get recommended algorithms for your data
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2 group-hover:text-primary transition-colors">
                <Database className="h-5 w-5 flex-shrink-0" />
                Data Exploration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">
                Explore patterns and correlations
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2 group-hover:text-primary transition-colors">
                <Brain className="h-5 w-5 flex-shrink-0" />
                Code Generation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">
                Generate training and preprocessing code
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="hover:shadow-2xl transition-shadow duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl">Chat with AI Assistant</CardTitle>
            <CardDescription>Ask questions about your data, models, and best practices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <div className="space-y-3">
                  <div className="flex justify-start">
                    <div className="bg-background p-3 rounded-lg max-w-md">
                      <p className="text-sm">Hi! I'm your AI Assistant. I can help you with:</p>
                      <ul className="text-sm list-disc list-inside mt-2 space-y-1">
                        <li>Dataset analysis and profiling</li>
                        <li>Model selection and optimization</li>
                        <li>Feature engineering recommendations</li>
                        <li>Code generation and debugging</li>
                        <li>Best practices and ML tips</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask me anything about your ML workflow..."
                  className="flex-1 px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Common Questions</CardTitle>
            <CardDescription>Get quick answers to frequently asked questions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {[
                "How do I handle missing values in my dataset?",
                "What's the best model for my dataset?",
                "How can I improve my model accuracy?",
                "What features should I engineer?",
              ].map((question, i) => (
                <Button key={i} variant="outline" className="justify-start text-left h-auto p-3">
                  <span className="text-sm">{question}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
