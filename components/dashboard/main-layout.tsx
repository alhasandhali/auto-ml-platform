"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SidebarNav } from "./sidebar-nav"
import { MobileSidebar } from "./mobile-sidebar"
import { Topbar } from "./topbar"

export function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const authToken = localStorage.getItem("authToken")
    if (!authToken) {
      // Redirect to landing page if not authenticated
      router.push("/")
    } else {
      setIsAuthenticated(true)
      setIsLoading(false)
    }
  }, [router])

  if (isLoading || !isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-background via-background to-secondary/5">
      {/* Desktop Sidebar */}
      <SidebarNav collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />

      {/* Mobile Sidebar Overlay */}
      <MobileSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setMobileMenuOpen((m) => !m)} />

        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-[1600px] p-3 sm:p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
