"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth"
import { User, Mail, Shield, Save, Loader2, LogOut } from "lucide-react"
import { apiFetch } from "@/lib/api"

export default function ProfilePage() {
  const { user, token, logout, login } = useAuth()
  const [email, setEmail] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  useEffect(() => {
    if (user) {
      setEmail(user.email || "")
    }
  }, [user])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage({ type: "", text: "" })

    try {
      const res = await apiFetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      })

      if (!res.ok) {
        throw new Error("Failed to update profile")
      }
      
      // Update local context
      if (user) {
        login(token as string, { ...user, email })
      }
      
      setMessage({ type: "success", text: "Profile updated successfully!" })
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "An error occurred" })
    } finally {
      setIsSaving(false)
    }
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="border-b border-border p-6">
            <h2 className="text-lg font-semibold">Account Information</h2>
          </div>
          
          <form onSubmit={handleUpdateProfile} className="p-6 space-y-6">
            {message.text && (
              <div className={`p-4 rounded-lg text-sm ${message.type === "success" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-destructive/10 text-destructive border border-destructive/20"}`}>
                {message.text}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={user.username}
                    disabled
                    className="w-full rounded-lg border border-border bg-muted/50 py-2 pl-9 pr-4 text-sm opacity-70 cursor-not-allowed"
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Username cannot be changed.</p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Role</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={user.role}
                    disabled
                    className="w-full rounded-lg border border-border bg-muted/50 py-2 pl-9 pr-4 text-sm opacity-70 cursor-not-allowed capitalize"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={logout}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-destructive bg-transparent px-4 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
              
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
