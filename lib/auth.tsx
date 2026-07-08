"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

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

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken")
    const storedUser = localStorage.getItem("authUser")
    if (storedToken && storedUser) {
      setToken(storedToken)
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        // Invalid json
      }
    }
    setIsLoading(false)
  }, [])

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem("authToken", newToken)
    localStorage.setItem("authUser", JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }

  const logout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("authUser")
    setToken(null)
    setUser(null)
    router.push("/auth/login")
  }

  // Redirect logic
  useEffect(() => {
    if (!isLoading) {
      const isAuthPage = pathname.startsWith("/auth/")
      if (!token && !isAuthPage && pathname !== "/") {
        // Redirect to login if accessing protected route without token
        router.push("/auth/login")
      } else if (token && isAuthPage) {
        // Redirect to dashboard if accessing auth pages with token
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
