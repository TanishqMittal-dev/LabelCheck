import { LoginForm } from '@/components/auth/login-form'
import { Navbar } from '@/components/layout/navbar'
import { ScanLine } from 'lucide-react'
import Link from 'next/link'

export const metadata = { title: 'Login' }

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2.5 mb-2">
              <div className="w-10 h-10 bg-[#2563EB] rounded-xl flex items-center justify-center shadow-xs">
                <ScanLine className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-[#0F1B35] text-2xl tracking-tight">नेत्र</span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#0F1B35] tracking-tight">Inspector Portal Login</h1>
            <p className="text-[#64748B] text-xs sm:text-sm">Sign in to access your Legal Metrology audit dashboard</p>
          </div>
          <LoginForm />
          <p className="text-center text-xs sm:text-sm text-[#64748B]">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-[#2563EB] font-bold hover:underline">
              Create one for free
            </Link>
          </p>
        </div>
      </main>
    </>
  )
}
