'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { User, Settings as SettingsIcon, Shield, Bell, Check, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function SettingsPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [organization, setOrganization] = useState('Consumer Affairs / Quality Dept.')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setEmail(user.email || '')
        setFullName(user.user_metadata?.full_name || user.email?.split('@')[0] || '')
      } else {
        setEmail('demo.officer@netra.app')
        setFullName('Legal Metrology Inspector')
      }
    }
    loadUser()
  }, [supabase])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.auth.updateUser({
          data: { full_name: fullName },
        })
      }
      setSaved(true)
      toast.success('Profile settings updated successfully!')
      setTimeout(() => setSaved(false), 3000)
    } catch {
      toast.error('Failed to update profile.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-16 bg-slate-50/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Page Header */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <SettingsIcon className="w-5 h-5 text-blue-600" />
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Settings &amp; Account
              </h1>
            </div>
            <p className="text-slate-500 text-sm">
              Manage your compliance inspector profile, notification preferences, and account credentials.
            </p>
          </div>

          {/* Profile Card */}
          <Card className="border-slate-200/80 shadow-2xs">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <CardTitle className="text-base font-bold text-slate-900">
                  Profile Information
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-slate-500">
                Update your contact information and display name on generated audit reports.
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSaveProfile}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName" className="text-xs">Full Name / Officer Name</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rajesh Kumar"
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="organization" className="text-xs">Department / Organization</Label>
                  <Input
                    id="organization"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. Legal Metrology Wing / Packaging Audit Team"
                    className="text-sm"
                  />
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-3">
                <p className="text-xs text-slate-400">Changes will reflect on future export reports.</p>
                <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs font-semibold" disabled={loading}>
                  {loading ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> Saving...</>
                  ) : saved ? (
                    <><Check className="w-3.5 h-3.5 mr-1 text-emerald-300" /> Saved</>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Preferences Card */}
          <Card className="border-slate-200/80 shadow-2xs">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-600" />
                <CardTitle className="text-base font-bold text-slate-900">
                  Compliance Rule Engine Preferences
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-slate-500">
                Configure verification thresholds and rule sets applied during label inspection.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800">Legal Metrology (PC) Rules, 2011</p>
                  <p className="text-xs text-slate-500">Active rule set covering 10 mandatory declarations</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Active
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800">High Strictness Mode for MRP &amp; Date</p>
                  <p className="text-xs text-slate-500">Flag missing `(Incl. all taxes)` suffix as high severity</p>
                </div>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                  Enabled
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}
