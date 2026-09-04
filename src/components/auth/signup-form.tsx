'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, Mail, Lock, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

const signupSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type SignupFormData = z.infer<typeof signupSchema>

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { full_name: data.fullName },
        },
      })

      if (error) {
        toast.error(error.message || 'Failed to create account.')
        return
      }

      toast.success('Account created! Signing you in...')
      window.location.href = '/dashboard'
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="shadow-md border-[#E2E8F0] rounded-2xl bg-white">
      <CardContent className="p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="fullName" className="text-xs font-bold text-[#0F1B35]">Full Name / Officer Name</Label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="fullName"
                placeholder="e.g. Ramesh Chandra"
                className="pl-10 h-11 text-sm rounded-xl border-[#E2E8F0] focus:border-[#2563EB]"
                {...register('fullName')}
                aria-invalid={!!errors.fullName}
              />
            </div>
            {errors.fullName && <p className="text-xs text-red-600 font-medium">{errors.fullName.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-bold text-[#0F1B35]">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="email"
                type="email"
                placeholder="officer@netra.gov.in"
                className="pl-10 h-11 text-sm rounded-xl border-[#E2E8F0] focus:border-[#2563EB]"
                {...register('email')}
                aria-invalid={!!errors.email}
              />
            </div>
            {errors.email && <p className="text-xs text-red-600 font-medium">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-bold text-[#0F1B35]">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="password"
                type="password"
                placeholder="Min. 8 characters"
                className="pl-10 h-11 text-sm rounded-xl border-[#E2E8F0] focus:border-[#2563EB]"
                {...register('password')}
                aria-invalid={!!errors.password}
              />
            </div>
            {errors.password && <p className="text-xs text-red-600 font-medium">{errors.password.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-xs font-bold text-[#0F1B35]">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repeat password"
                className="pl-10 h-11 text-sm rounded-xl border-[#E2E8F0] focus:border-[#2563EB]"
                {...register('confirmPassword')}
                aria-invalid={!!errors.confirmPassword}
              />
            </div>
            {errors.confirmPassword && <p className="text-xs text-red-600 font-medium">{errors.confirmPassword.message}</p>}
          </div>

          <Button type="submit" className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold h-11 rounded-xl shadow-xs btn-lift mt-2" disabled={isLoading}>
            {isLoading ? (
              <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Creating account...</>
            ) : (
              'Create Account'
            )}
          </Button>

          <p className="text-[11px] text-[#64748B] text-center">
            SIH 2026 National Level Demo Platform &bull; Problem Statement PSC26034
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
