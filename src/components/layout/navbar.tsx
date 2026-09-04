'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ScanLine, Menu, X, ChevronRight, LogOut, User, LayoutDashboard, History } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

const NAV_LINKS = [
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/#features', label: 'Features' },
  { href: '/#compliance', label: 'Compliance' },
  { href: '/about', label: 'About' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<{ email?: string; id?: string } | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user ?? null)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [supabase.auth])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    toast.success('Signed out successfully')
    router.push('/')
    router.refresh()
  }

  const isDashboard = pathname.startsWith('/dashboard') || pathname.startsWith('/scan') ||
    pathname.startsWith('/history') || pathname.startsWith('/reports') || pathname.startsWith('/settings')

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-200',
      scrolled || isDashboard
        ? 'bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm'
        : 'bg-transparent'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-blue-700 transition-colors">
              <ScanLine className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">LabelCheck</span>
          </Link>

          {/* Desktop nav */}
          {!isDashboard && (
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Dashboard nav */}
          {isDashboard && (
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/dashboard" className={cn('px-3 py-2 text-sm font-medium rounded-md transition-colors', pathname === '/dashboard' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')}>
                Dashboard
              </Link>
              <Link href="/scan" className={cn('px-3 py-2 text-sm font-medium rounded-md transition-colors', pathname === '/scan' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')}>
                Scan Product
              </Link>
              <Link href="/history" className={cn('px-3 py-2 text-sm font-medium rounded-md transition-colors', pathname === '/history' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')}>
                History
              </Link>
              <Link href="/settings" className={cn('px-3 py-2 text-sm font-medium rounded-md transition-colors', pathname === '/settings' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')}>
                Settings
              </Link>
            </nav>
          )}

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 font-medium">{user.email?.split('@')[0]}</span>
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-slate-600 hover:text-red-600">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/signup">
                    Get Started
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 py-3 space-y-1 shadow-lg">
          {(isDashboard ? [
            { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { href: '/scan', label: 'Scan Product', icon: ScanLine },
            { href: '/history', label: 'History', icon: History },
            { href: '/settings', label: 'Settings', icon: User },
          ] : NAV_LINKS.map(l => ({ ...l, icon: null }))).map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              {link.icon && <link.icon className="w-4 h-4" />}
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <Button variant="outline" size="sm" onClick={handleSignOut} className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50">
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link href="/login" onClick={() => setMobileOpen(false)}>Login</Link>
                </Button>
                <Button size="sm" asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link href="/signup" onClick={() => setMobileOpen(false)}>Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
