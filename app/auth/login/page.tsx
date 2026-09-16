'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { GraduationCap, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!formData.email) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Enter a valid email'
    if (!formData.password) errs.password = 'Password is required'
    return errs
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    try {
      const supabase = createClient()
      const { error, data } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        toast.error(error.message)
        return
      }

      const role = data.user?.user_metadata?.role || 'student'
      toast.success('Welcome back!')

      if (role === 'admin' || role === 'faculty') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
      router.refresh()
    } catch {
      toast.error('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 30% 50%, white 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
        <div className="relative z-10 flex flex-col justify-center p-16 space-y-8">
          <Link href="/" className="flex items-center gap-3 no-underline">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-slate-900" />
            </div>
            <div>
              <p className="text-white/70 text-xs font-bold uppercase tracking-widest">DSMNRU</p>
              <p className="text-white text-lg font-black">Internal SIH 2026</p>
            </div>
          </Link>

          <div className="space-y-4">
            <h2 className="text-4xl font-black text-white leading-tight">
              Welcome back to
              <br />
              <span className="text-amber-400">SIH 2026 Portal</span>
            </h2>
            <p className="text-white/65 text-base leading-relaxed max-w-sm">
              Sign in to access your team dashboard, problem statements, and selection status.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { value: '200+', label: 'Problems' },
              { value: '3–6', label: 'Team Size' },
              { value: '∞', label: 'Innovation' },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white/10 rounded-2xl p-4 text-center border border-white/15">
                <p className="text-2xl font-black text-amber-400">{value}</p>
                <p className="text-xs font-bold text-white/60 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1a237e] flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">DSMNRU</p>
              <p className="text-base font-black text-slate-900">Internal SIH 2026</p>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Sign In</h1>
            <p className="text-slate-500 text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/auth/register" className="text-[#1a237e] font-bold hover:underline no-underline">
                Register your team
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                  placeholder="you@dsmnru.ac.in"
                  className="w-full pl-11 pr-4 py-3.5 text-sm font-medium bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-[#1a237e] focus:bg-white transition-all"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={e => setFormData(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3.5 text-sm font-medium bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-[#1a237e] focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-[#1a237e] hover:bg-[#283593] text-white font-black text-sm rounded-2xl transition-all shadow-lg disabled:opacity-60"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Signing In...</>
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
            <p className="text-xs font-black text-amber-800 uppercase tracking-wider">Demo Credentials</p>
            <div className="space-y-1">
              <p className="text-xs font-medium text-amber-700">Admin: admin@dsmnru.ac.in / Admin@123</p>
              <p className="text-xs font-medium text-amber-700">Student: student@dsmnru.ac.in / Student@123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
