import { SignupForm } from '@/components/auth/signup-form'
import { Navbar } from '@/components/layout/navbar'
import { ScanLine } from 'lucide-react'
import Link from 'next/link'

export const metadata = { title: 'Create Account' }

export default function SignupPage() {
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
            <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
            <p className="text-slate-500 mt-1 text-sm">Start verifying product compliance for free</p>
          </div>
          <SignupForm />
          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </>
  )
}
