import { LoginForm } from '@/components/auth/login-form'
import { Navbar } from '@/components/layout/navbar'
import { ScanLine } from 'lucide-react'
import Link from 'next/link'

export const metadata = { title: 'Login' }

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                <ScanLine className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-slate-900 text-xl">नेत्र</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
            <p className="text-slate-500 mt-1 text-sm">Sign in to your account to continue</p>
          </div>
          <LoginForm />
          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-blue-600 font-medium hover:underline">
              Create one for free
            </Link>
          </p>
        </div>
      </main>
    </>
  )
}
