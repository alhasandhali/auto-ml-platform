"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  FolderKanban,
  Database,
  Boxes,
  FlaskConical,
  Sparkles,
  FileBarChart,
  Settings,
  X,
  Hexagon,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Projects", icon: FolderKanban, href: "/projects" },
  { label: "Datasets", icon: Database, href: "/datasets" },
  { label: "Models", icon: Boxes, href: "/models" },
  { label: "Experiments", icon: FlaskConical, href: "/experiments" },
  { label: "AI Assistant", icon: Sparkles, href: "/ai-assistant" },
  { label: "Reports", icon: FileBarChart, href: "/reports" },
  { label: "Settings", icon: Settings, href: "/settings" },
]

export function MobileSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden transition-opacity duration-200"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Overlay */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-[260px] flex flex-col border-r border-border/50 bg-gradient-to-b from-background via-background to-secondary/10 shadow-2xl transition-transform duration-300 ease-out md:hidden overflow-hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header with Close Button */}
        <div className="flex h-16 items-center justify-between gap-3 px-4 border-b border-border/50 flex-shrink-0">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg">
              <Hexagon className="h-5 w-5" fill="currentColor" />
            </div>
            <div className="flex flex-col leading-tight min-w-0 overflow-hidden">
              <span className="text-sm font-bold tracking-tight text-foreground">Nebula</span>
              <span className="text-xs text-muted-foreground">AutoML</span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-secondary/50 hover:text-foreground active:scale-95"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 px-3 py-4 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 relative group overflow-hidden",
                isActive(item.href)
                  ? "bg-gradient-to-r from-primary/20 to-primary/5 text-primary shadow-md before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-primary before:to-primary/50"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground hover:shadow-sm active:scale-95",
              )}
            >
              <item.icon className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110 group-active:scale-95" />
              <span className="truncate flex-1">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-border/50 px-3 py-4 text-xs text-muted-foreground text-center">
          <p>Nebula AutoML Platform</p>
        </div>
      </aside>
    </>
  )
}
