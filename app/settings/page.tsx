"use client"

import { MainLayout } from "@/components/dashboard/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Lock, Users, Palette, Database as DatabaseIcon, Shield, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function SettingsPage() {
  const { user, token, logout, login } = useAuth()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Wait until mounted to show theme UI to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Form states
  const [profileLoading, setProfileLoading] = useState(false)
  const [fullName, setFullName] = useState(user?.full_name || user?.username || "")
  const [email, setEmail] = useState(user?.email || "")

  const [securityLoading, setSecurityLoading] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Notification states
  const [emailNotif, setEmailNotif] = useState(true)
  const [experimentNotif, setExperimentNotif] = useState(true)
  const [weeklyNotif, setWeeklyNotif] = useState(false)
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true)

  // Derived dummy progress value
  const [progressValue, setProgressValue] = useState(0)
  useEffect(() => {
    // Animate progress bar on load
    const timer = setTimeout(() => setProgressValue(45), 500)
    return () => clearTimeout(timer)
  }, [])

  // Handlers
  const handleProfileUpdate = async () => {
    setProfileLoading(true)
    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ email, full_name: fullName })
      })

      if (!response.ok) throw new Error("Failed to update profile")

      // Update local context
      if (user && token) {
        login(token, { ...user, email, full_name: fullName })
      }
      toast.success("Profile updated successfully")
    } catch (err) {
      toast.error("Failed to update profile. Please try again.")
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match")
      return
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }
    setSecurityLoading(true)
    try {
      const response = await fetch("/api/auth/profile/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || "Failed to update password")
      }

      toast.success("Password updated successfully")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err: any) {
      toast.error(err.message || "An error occurred while updating password")
    } finally {
      setSecurityLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch("/api/auth/profile", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error("Failed to delete account")
      
      toast.success("Account deleted successfully")
      logout() // This redirects to login
    } catch (err) {
      toast.error("An error occurred while deleting your account")
    }
  }

  const handleToggle = (setter: React.Dispatch<React.SetStateAction<boolean>>, value: boolean, label: string) => {
    setter(value)
    toast.success(`${label} preference saved`)
  }

  return (
    <MainLayout>
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">Settings</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">Manage your account, preferences, and platform settings</p>
        </div>

        <div className="space-y-4 sm:space-y-6 max-w-4xl">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Profile Settings
              </CardTitle>
              <CardDescription>Manage your account information and profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button onClick={handleProfileUpdate} disabled={profileLoading}>
                {profileLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Security
              </CardTitle>
              <CardDescription>Manage your password and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <Button onClick={handlePasswordUpdate} disabled={securityLoading}>
                {securityLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Update Password
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>Control how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Email Notifications</p>
                  <p className="text-xs text-muted-foreground">Get notified about experiments and model updates</p>
                </div>
                <Switch 
                  checked={emailNotif} 
                  onCheckedChange={(val) => handleToggle(setEmailNotif, val, "Email Notifications")} 
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Experiment Alerts</p>
                  <p className="text-xs text-muted-foreground">Alert me when experiments complete</p>
                </div>
                <Switch 
                  checked={experimentNotif} 
                  onCheckedChange={(val) => handleToggle(setExperimentNotif, val, "Experiment Alerts")} 
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Weekly Summary</p>
                  <p className="text-xs text-muted-foreground">Receive weekly platform summary</p>
                </div>
                <Switch 
                  checked={weeklyNotif} 
                  onCheckedChange={(val) => handleToggle(setWeeklyNotif, val, "Weekly Summary")} 
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>Customize how the platform looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-3 block">Theme</Label>
                {mounted && (
                  <div className="grid grid-cols-3 gap-3">
                    <button 
                      onClick={() => setTheme('dark')}
                      className={`p-3 border-2 rounded-lg transition-all ${theme === 'dark' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
                    >
                      <p className="text-sm font-semibold">Dark</p>
                    </button>
                    <button 
                      onClick={() => setTheme('light')}
                      className={`p-3 border-2 rounded-lg transition-all ${theme === 'light' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
                    >
                      <p className="text-sm font-semibold">Light</p>
                    </button>
                    <button 
                      onClick={() => setTheme('system')}
                      className={`p-3 border-2 rounded-lg transition-all ${theme === 'system' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
                    >
                      <p className="text-sm font-semibold">System</p>
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Data & Storage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DatabaseIcon className="h-5 w-5" />
                Data & Storage
              </CardTitle>
              <CardDescription>Manage your data storage and retention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <p className="text-sm font-medium">Storage Usage</p>
                  <p className="text-sm font-semibold">450 GB / 1 TB</p>
                </div>
                <Progress value={progressValue} className="h-2 w-full" />
              </div>
              <Button variant="outline" className="w-full">Upgrade Storage</Button>
            </CardContent>
          </Card>

          {/* Privacy & Compliance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Compliance
              </CardTitle>
              <CardDescription>Privacy settings and compliance options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Analytics</p>
                  <p className="text-xs text-muted-foreground">Allow usage analytics for improvements</p>
                </div>
                <Switch 
                  checked={analyticsEnabled} 
                  onCheckedChange={(val) => handleToggle(setAnalyticsEnabled, val, "Analytics")} 
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Data Export</p>
                  <p className="text-xs text-muted-foreground">Export your data in standard format</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => toast.success("Data export started. Check your email soon.")}>Export</Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200 dark:border-red-900/50">
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-500">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AlertDialog>
                <AlertDialogTrigger className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 rounded-md font-medium">
                  Delete Account
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account
                      and remove all of your datasets and models from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                      Delete permanently
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
