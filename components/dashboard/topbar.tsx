"use client"

import { Bell, Search, Menu, LogOut } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const router = useRouter()
  const [userName, setUserName] = useState("User")
  const [userInitials, setUserInitials] = useState("U")
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    // Get user name from localStorage
    const name = localStorage.getItem("userName") || "User"
    setUserName(name)
    
    // Get initials (first letter of each word)
    const initials = name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    setUserInitials(initials)
  }, [])

  const handleLogout = () => {
    // Clear auth from localStorage
    localStorage.removeItem("authToken")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userName")
    
    // Redirect to landing page
    router.push("/")
  }

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
          onClick={handleLogout}
          aria-label="Logout"
          className="hidden sm:flex h-10 px-3 items-center justify-center rounded-lg text-red-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-500 active:scale-95 gap-2 font-medium"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm">Logout</span>
        </button>

        {/* Desktop User Menu */}
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="hidden md:flex items-center gap-2 rounded-lg p-1 px-3 transition-all duration-200 hover:bg-primary/10 active:scale-95"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-xs font-semibold text-white shadow-sm">
              {userInitials}
            </span>
            <span className="text-sm font-medium">{userName}</span>
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 top-12 mt-2 w-48 rounded-lg border border-border/50 bg-background shadow-lg overflow-hidden z-50">
              <div className="p-3 border-b border-border/50">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground">{localStorage.getItem("userEmail")}</p>
              </div>
              <div className="py-2">
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-secondary/50 transition flex items-center gap-2">
                  <span>Account Settings</span>
                </button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-secondary/50 transition flex items-center gap-2">
                  <span>Preferences</span>
                </button>
              </div>
              <div className="border-t border-border/50 py-2">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 transition flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Mobile User Menu Button */}
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            aria-label="User profile"
            className="flex md:hidden h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-all duration-200 hover:bg-primary/10 hover:text-foreground active:scale-95"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-xs font-semibold text-white shadow-sm">
              {userInitials}
            </span>
          </button>

          {/* Mobile Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 top-12 mt-2 w-48 rounded-lg border border-border/50 bg-background shadow-lg overflow-hidden z-50">
              <div className="p-3 border-b border-border/50">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground">{localStorage.getItem("userEmail")}</p>
              </div>
              <div className="py-2">
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-secondary/50 transition">
                  Account Settings
                </button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-secondary/50 transition">
                  Preferences
                </button>
              </div>
              <div className="border-t border-border/50 py-2">
                <button
                  onClick={handleLogout}
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
