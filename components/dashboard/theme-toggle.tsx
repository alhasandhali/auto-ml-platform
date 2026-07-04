"use client"

import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Get initial theme from localStorage or system preference
    const saved = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const dark = saved === "dark" || (saved === null && prefersDark)
    
    setIsDark(dark)
    setMounted(true)
    
    // Ensure DOM reflects the theme
    if (dark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const toggle = () => {
    if (!mounted) return

    const newIsDark = !isDark
    setIsDark(newIsDark)

    // Update DOM
    if (newIsDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    // Persist to localStorage
    localStorage.setItem("theme", newIsDark ? "dark" : "light")

    // Dispatch custom event for other components to listen
    window.dispatchEvent(
      new CustomEvent("themechange", { detail: { isDark: newIsDark } })
    )
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <button
        disabled
        aria-label="Toggle theme"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <Sun className="h-[18px] w-[18px]" />
      </button>
    )
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:scale-95"
    >
      {isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
    </button>
  )
}
