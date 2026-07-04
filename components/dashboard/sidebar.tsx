"use client"

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
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Projects", icon: FolderKanban },
  { label: "Datasets", icon: Database, active: true },
  { label: "Models", icon: Boxes },
  { label: "Experiments", icon: FlaskConical },
  { label: "AI Assistant", icon: Sparkles },
  { label: "Reports", icon: FileBarChart },
  { label: "Settings", icon: Settings },
]

export function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean
  onToggle: () => void
}) {
  return (
    <aside
      className={cn(
        "hidden md:flex flex-col shrink-0 border-r border-sidebar-border bg-sidebar transition-all duration-300",
        collapsed ? "w-[72px]" : "w-64",
      )}
    >
      <div className="flex h-16 items-center gap-2 px-4 border-b border-sidebar-border">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Hexagon className="h-5 w-5" fill="currentColor" />
        </div>
        {!collapsed && (
          <div className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-tight">Nebula</span>
            <span className="text-xs text-muted-foreground">AutoML Platform</span>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => (
          <a
            key={item.label}
            href="#"
            title={collapsed ? item.label : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              item.active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              collapsed && "justify-center px-0",
            )}
          >
            <item.icon className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </a>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={onToggle}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
            collapsed && "justify-center px-0",
          )}
        >
          {collapsed ? (
            <PanelLeft className="h-[18px] w-[18px]" />
          ) : (
            <>
              <PanelLeftClose className="h-[18px] w-[18px]" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
