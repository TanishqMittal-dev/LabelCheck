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
    window.location.href = '/'
  }

  const isDashboard = pathname.startsWith('/dashboard') || pathname.startsWith('/scan') ||
    pathname.startsWith('/history') || pathname.startsWith('/reports') || pathname.startsWith('/settings')

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-200',
      scrolled || isDashboard
        ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs'
        : 'bg-white/80 backdrop-blur-md border-b border-slate-200/60'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-xs group-hover:bg-blue-700 transition-colors shrink-0">
              <ScanLine className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-xl tracking-tight font-sans">नेत्र</span>
                <span className="hidden sm:inline-block text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Legal Metrology
                </span>
              </div>
              <span className="text-[10px] font-medium text-slate-500 hidden md:block leading-none -mt-0.5">
                Packaged Commodity Verification
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          {!isDashboard && (
            <nav className="hidden md:flex items-center gap-1.5">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3.5 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100/80 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Dashboard nav */}
          {isDashboard && (
            <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
              <Link href="/dashboard" className={cn('px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all', pathname === '/dashboard' ? 'text-blue-700 bg-white shadow-2xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50')}>
                Dashboard
              </Link>
              <Link href="/scan" className={cn('px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all', pathname === '/scan' ? 'text-blue-700 bg-white shadow-2xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50')}>
                Scan Product
              </Link>
              <Link href="/history" className={cn('px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all', pathname === '/history' ? 'text-blue-700 bg-white shadow-2xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50')}>
                History
              </Link>
              <Link href="/settings" className={cn('px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all', pathname === '/settings' ? 'text-blue-700 bg-white shadow-2xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50')}>
                Settings
              </Link>
            </nav>
          )}

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2.5">
            {user ? (
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5">
                <span className="text-xs text-slate-700 font-semibold">{user.email?.split('@')[0]}</span>
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="h-7 px-2 text-xs text-slate-500 hover:text-red-600 hover:bg-red-50">
                  <LogOut className="w-3.5 h-3.5 mr-1" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="text-slate-600 hover:text-slate-900 font-medium">
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700 shadow-2xs font-semibold">
                  <Link href="/signup">
                    Get Started
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors"
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
