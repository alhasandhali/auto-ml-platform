"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { apiFetch, setGlobalAccessToken, getGlobalAccessToken } from "./api"

export interface User {
  username: string
  role: string
  email?: string
  full_name?: string
}

type AuthContextType = {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Initialize session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Trigger a profile fetch to hydrate the user state.
        // apiFetch will seamlessly attempt to refresh the token if we have a valid HttpOnly cookie.
        const response = await apiFetch("/api/auth/profile")
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
          setToken(getGlobalAccessToken())
        } else {
          setToken(null)
          setUser(null)
        }
      } catch (err) {
        setToken(null)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    initializeAuth()

    // Listen for forced logouts from apiFetch interceptor
    const handleLogoutEvent = () => {
      setToken(null)
      setUser(null)
      router.push("/auth/login")
    }
    window.addEventListener("auth:logout", handleLogoutEvent)
    return () => window.removeEventListener("auth:logout", handleLogoutEvent)
  }, [router])

  const login = (newToken: string, newUser: User) => {
    setGlobalAccessToken(newToken)
    setToken(newToken)
    setUser(newUser)
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await apiFetch("/api/auth/logout", { method: "POST" })
    } catch (e) {}
    setGlobalAccessToken(null)
    setToken(null)
    setUser(null)
    setIsLoading(false)
    router.push("/auth/login")
  }

  // Redirect logic
  useEffect(() => {
    if (!isLoading) {
      const isAuthPage = pathname.startsWith("/auth/")
      if (!token && !isAuthPage && pathname !== "/") {
        router.push("/auth/login")
      } else if (token && isAuthPage) {
        router.push("/dashboard")
      }
    }
  }, [token, isLoading, pathname, router])

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
