"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowRight, CheckCircle2, Sparkles, Zap, BarChart3, Brain } from "lucide-react"

export default function LandingPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const authToken = localStorage.getItem("authToken")
    if (authToken) {
      setIsAuthenticated(true)
      router.push("/dashboard")
    } else {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading || isAuthenticated) {
    return null
  }

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Leverage advanced machine learning to extract meaningful insights from your datasets automatically.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Process millions of records in seconds with our optimized algorithms and cloud infrastructure.",
    },
    {
      icon: BarChart3,
      title: "Rich Visualizations",
      description: "Transform complex data into beautiful, interactive charts and dashboards for better decision-making.",
    },
    {
      icon: Sparkles,
      title: "Automated ML",
      description: "AutoML capabilities that find the best models for your data without manual tuning required.",
    },
  ]

  const stats = [
    { number: "10M+", label: "Records Processed" },
    { number: "500+", label: "Happy Teams" },
    { number: "99.9%", label: "Uptime SLA" },
    { number: "24/7", label: "Support" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-8 right-10 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-cyan-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Navigation Header */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-md bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
              ◆
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Nebula
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-slate-300 hover:text-white transition">
              Features
            </a>
            <a href="#stats" className="text-sm text-slate-300 hover:text-white transition">
              About
            </a>
            <a href="#" className="text-sm text-slate-300 hover:text-white transition">
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="px-6 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-300">Introducing Nebula: AI AutoML Platform</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                Transform Your Data
              </span>
              <br />
              <span className="text-white">Into Intelligent Insights</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Harness the power of artificial intelligence and automated machine learning to unlock hidden patterns in your data. Make smarter decisions faster with Nebula's advanced analytics platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/auth/signup"
                className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition shadow-lg shadow-blue-500/50 flex items-center justify-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/auth/login"
                className="px-8 py-4 border border-white/20 rounded-lg font-semibold hover:bg-white/10 transition"
              >
                Sign In
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6 justify-center text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>Enterprise support</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Card */}
          <div className="mt-20 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-blue-500/20 via-slate-800 to-cyan-500/20 rounded-lg flex items-center justify-center border border-white/10">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <BarChart3 className="w-10 h-10 text-white" />
                </div>
                <p className="text-slate-300">Dashboard Preview</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powerful Features for Modern Teams
            </h2>
            <p className="text-lg text-slate-400">
              Everything you need to build, deploy, and scale machine learning models
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div
                  key={idx}
                  className="group p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all hover:border-blue-500/50"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Stats Section */}
        <section id="stats" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <p className="text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="rounded-2xl border border-white/20 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm p-12 text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Data?
            </h3>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Join hundreds of teams already using Nebula to unlock insights and make data-driven decisions faster than ever before.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition shadow-lg shadow-blue-500/50 flex items-center justify-center gap-2"
              >
                Start Free Today
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#"
                className="px-8 py-4 border border-white/30 rounded-lg font-semibold hover:bg-white/10 transition"
              >
                Schedule Demo
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                    ◆
                  </div>
                  <span className="font-bold">Nebula</span>
                </div>
                <p className="text-sm text-slate-400">AI AutoML Platform for modern teams</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><a href="#" className="hover:text-white transition">Features</a></li>
                  <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                  <li><a href="#" className="hover:text-white transition">Security</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><a href="#" className="hover:text-white transition">About</a></li>
                  <li><a href="#" className="hover:text-white transition">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                  <li><a href="#" className="hover:text-white transition">Terms</a></li>
                  <li><a href="#" className="hover:text-white transition">Contact</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/10 pt-8 text-center text-sm text-slate-500">
              <p>&copy; 2024 Nebula. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
