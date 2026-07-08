"use client"

import { Bell, Search, Menu, LogOut } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useAuth } from "@/lib/auth"
import Link from "next/link"

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [showMenu, setShowMenu] = useState(false)

  const userName = user?.username || "User"
  const userEmail = user?.email || ""
  
  const userInitials = userName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-border/50 bg-background/95 px-3 backdrop-blur-md shadow-sm md:px-6 md:justify-start">
      <button
        onClick={onMenuClick}
        aria-label="Toggle sidebar menu"
        className="flex md:hidden h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-all duration-200 hover:bg-primary/10 hover:text-foreground active:scale-95 active:bg-primary/20"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative flex-1 w-full max-w-sm md:max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search..."
          className="h-10 w-full rounded-lg border border-border/50 bg-secondary/50 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all duration-200 focus:border-primary/50 focus:bg-secondary focus:ring-2 focus:ring-primary/20 hover:border-border/80"
        />
      </div>

      <div className="ml-auto flex items-center gap-1 md:gap-2">
        <button
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-all duration-200 hover:bg-primary/10 hover:text-foreground active:scale-95"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
        </button>

        <ThemeToggle />

        {/* Logout Button */}
        <button
          onClick={logout}
          aria-label="Logout"
          className="hidden sm:flex h-10 px-3 items-center justify-center rounded-lg text-red-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-500 active:scale-95 gap-2 font-medium"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm">Logout</span>
        </button>

        {/* User Menu */}
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            aria-label="User profile"
            className="flex items-center gap-2 rounded-lg p-1 px-1 md:px-3 transition-all duration-200 hover:bg-primary/10 active:scale-95"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-xs font-semibold text-white shadow-sm">
              {userInitials}
            </span>
            <span className="hidden md:block text-sm font-medium">{userName}</span>
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 top-12 mt-2 w-48 rounded-lg border border-border/50 bg-background shadow-lg overflow-hidden z-50">
              <div className="p-3 border-b border-border/50">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground">{userEmail}</p>
              </div>
              <div className="py-2">
                <Link 
                  href="/settings"
                  className="w-full px-4 py-2 text-left text-sm hover:bg-secondary/50 transition flex items-center gap-2"
                >
                  <span>Account Settings</span>
                </Link>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-secondary/50 transition flex items-center gap-2">
                  <span>Preferences</span>
                </button>
              </div>
              <div className="border-t border-border/50 py-2">
                <button
                  onClick={logout}
                  className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 transition flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
