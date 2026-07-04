import { MainLayout } from "@/components/dashboard/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Lock, Users, Palette, Database as DatabaseIcon, Shield } from "lucide-react"

export default function SettingsPage() {
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
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  placeholder="Your full name"
                  className="mt-2 w-full px-4 py-2 rounded-lg border border-input bg-background text-sm"
                  defaultValue="John Doe"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="mt-2 w-full px-4 py-2 rounded-lg border border-input bg-background text-sm"
                  defaultValue="john@example.com"
                />
              </div>
              <Button>Save Changes</Button>
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
              <div>
                <label className="text-sm font-medium">Current Password</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  className="mt-2 w-full px-4 py-2 rounded-lg border border-input bg-background text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="mt-2 w-full px-4 py-2 rounded-lg border border-input bg-background text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="mt-2 w-full px-4 py-2 rounded-lg border border-input bg-background text-sm"
                />
              </div>
              <Button>Update Password</Button>
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
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Email Notifications</p>
                  <p className="text-xs text-muted-foreground">Get notified about experiments and model updates</p>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-input"
                  defaultChecked
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Experiment Alerts</p>
                  <p className="text-xs text-muted-foreground">Alert me when experiments complete</p>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-input"
                  defaultChecked
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Weekly Summary</p>
                  <p className="text-xs text-muted-foreground">Receive weekly platform summary</p>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-input"
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
                <label className="text-sm font-medium mb-3 block">Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  <button className="p-3 border-2 border-primary rounded-lg bg-primary/10">
                    <p className="text-sm font-semibold">Dark</p>
                  </button>
                  <button className="p-3 border-2 border-border rounded-lg">
                    <p className="text-sm font-semibold">Light</p>
                  </button>
                  <button className="p-3 border-2 border-border rounded-lg">
                    <p className="text-sm font-semibold">System</p>
                  </button>
                </div>
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
                <div className="w-full bg-border rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "45%" }} />
                </div>
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
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Analytics</p>
                  <p className="text-xs text-muted-foreground">Allow usage analytics for improvements</p>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-input"
                  defaultChecked
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Data Export</p>
                  <p className="text-xs text-muted-foreground">Export your data in standard format</p>
                </div>
                <Button variant="outline" size="sm">Export</Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="destructive" className="w-full">Delete Account</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
