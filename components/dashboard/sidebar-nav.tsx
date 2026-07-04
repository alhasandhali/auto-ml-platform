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
  PanelLeftClose,
  PanelLeft,
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

export function SidebarNav({
  collapsed,
  onToggle,
}: {
  collapsed: boolean
  onToggle: () => void
}) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col shrink-0 border-r border-border/50 bg-gradient-to-b from-background via-background to-secondary/10 transition-all duration-300 ease-out shadow-xl overflow-hidden",
        collapsed ? "w-[80px]" : "w-[260px]",
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-4 border-b border-border/50 flex-shrink-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 group">
          <Hexagon className="h-5 w-5" fill="currentColor" />
        </div>
        {!collapsed && (
          <div className="flex flex-col leading-tight min-w-0 overflow-hidden">
            <span className="text-sm font-bold tracking-tight text-foreground">Nebula</span>
            <span className="text-xs text-muted-foreground">AutoML Platform</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-3 py-4 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            title={collapsed ? item.label : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 relative group overflow-hidden",
              isActive(item.href)
                ? "bg-gradient-to-r from-primary/20 to-primary/5 text-primary shadow-md before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-primary before:to-primary/50"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground hover:shadow-sm active:scale-95",
              collapsed && "justify-center px-0 before:hidden",
            )}
          >
            <item.icon className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110 group-active:scale-95" />
            {!collapsed && <span className="truncate flex-1">{item.label}</span>}
            {collapsed && item.label === "Dashboard" && (
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-primary/10 to-transparent transition-opacity" />
            )}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border/50 p-3 flex-shrink-0">
        <button
          onClick={onToggle}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-secondary/50 hover:text-foreground hover:shadow-sm active:scale-95",
            collapsed && "justify-center px-0",
          )}
        >
          {collapsed ? (
            <PanelLeft className="h-5 w-5" />
          ) : (
            <>
              <PanelLeftClose className="h-5 w-5" />
              <span className="truncate">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
