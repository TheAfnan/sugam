'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { GraduationCap, Mail, Lock, Eye, EyeOff, User, Phone, BookOpen, Loader2, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Biomedical Engineering',
  'Rehabilitation Sciences',
  'Special Education',
  'Physiotherapy',
  'Occupational Therapy',
  'Speech & Language Pathology',
  'Audiology',
  'MBA / Management',
  'Law',
  'Other',
]

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    enrollment_number: '',
    phone: '',
    department: '',
    year_of_study: '',
    password: '',
    confirm_password: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const update = (key: string, value: string) => {
    setFormData(p => ({ ...p, [key]: value }))
    if (errors[key]) setErrors(p => { const n = { ...p }; delete n[key]; return n })
  }

  const validateStep1 = () => {
    const errs: Record<string, string> = {}
    if (!formData.full_name.trim()) errs.full_name = 'Full name is required'
    if (!formData.email) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Enter a valid email'
    if (!formData.enrollment_number.trim()) errs.enrollment_number = 'Enrollment number is required'
    return errs
  }

  const validateStep2 = () => {
    const errs: Record<string, string> = {}
    if (!formData.department) errs.department = 'Department is required'
    if (!formData.year_of_study) errs.year_of_study = 'Year of study is required'
    if (!formData.password) errs.password = 'Password is required'
    else if (formData.password.length < 8) errs.password = 'Password must be at least 8 characters'
    if (formData.password !== formData.confirm_password) errs.confirm_password = 'Passwords do not match'
    return errs
  }

  const handleNext = () => {
    const errs = validateStep1()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validateStep2()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    try {
      const supabase = createClient()

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
            enrollment_number: formData.enrollment_number,
            phone: formData.phone,
            department: formData.department,
            year_of_study: parseInt(formData.year_of_study),
            role: 'student',
          },
        },
      })

      if (error) { toast.error(error.message); return }

      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          email: formData.email,
          full_name: formData.full_name,
          enrollment_number: formData.enrollment_number,
          phone: formData.phone,
          department: formData.department,
          year_of_study: parseInt(formData.year_of_study),
          role: 'student',
        })
      }

      toast.success('Account created successfully! Welcome to SIH 2026 🎉')
      router.push('/dashboard')
      router.refresh()
    } catch {
      toast.error('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-5/12 gradient-hero relative overflow-hidden">
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
              Join the
              <br />
              <span className="text-amber-400">Innovation Journey</span>
            </h2>
            <p className="text-white/65 text-base leading-relaxed max-w-sm">
              Register to explore 200+ government problem statements and represent DSMNRU at Smart India Hackathon 2026.
            </p>
          </div>

          <div className="space-y-3">
            {['Create your account', 'Form a team of 3–6 members', 'Select your problem statement', 'Present at internal hackathon'].map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center text-slate-900 text-xs font-black shrink-0">
                  {i + 1}
                </div>
                <p className="text-sm font-bold text-white/80">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-lg space-y-8 py-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1a237e] flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-amber-400" />
            </div>
            <p className="text-base font-black text-slate-900">DSMNRU · Internal SIH 2026</p>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Create Account</h1>
            <p className="text-slate-500 text-sm">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-[#1a237e] font-bold hover:underline no-underline">Sign in</Link>
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-3">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                  s <= step ? 'bg-[#1a237e] text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  {s}
                </div>
                <span className={`text-xs font-bold ${s === step ? 'text-[#1a237e]' : 'text-slate-400'}`}>
                  {s === 1 ? 'Personal Info' : 'Academic Details'}
                </span>
                {s < 2 && <div className="w-8 h-0.5 bg-slate-200 mx-1" />}
              </div>
            ))}
          </div>

          <form onSubmit={step === 1 ? (e) => { e.preventDefault(); handleNext() } : handleSubmit} className="space-y-5">
            {step === 1 ? (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" value={formData.full_name} onChange={e => update('full_name', e.target.value)}
                      placeholder="Ravi Kumar Sharma" className="w-full pl-11 pr-4 py-3.5 text-sm font-medium bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-[#1a237e] focus:bg-white transition-all" />
                  </div>
                  {errors.full_name && <p className="text-xs text-red-500 font-medium">{errors.full_name}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="email" value={formData.email} onChange={e => update('email', e.target.value)}
                      placeholder="you@dsmnru.ac.in" className="w-full pl-11 pr-4 py-3.5 text-sm font-medium bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-[#1a237e] focus:bg-white transition-all" />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-500">Enrollment No. *</label>
                    <input type="text" value={formData.enrollment_number} onChange={e => update('enrollment_number', e.target.value)}
                      placeholder="DSMNRU2024001" className="w-full px-4 py-3.5 text-sm font-medium bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-[#1a237e] focus:bg-white transition-all" />
                    {errors.enrollment_number && <p className="text-xs text-red-500 font-medium">{errors.enrollment_number}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-500">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="tel" value={formData.phone} onChange={e => update('phone', e.target.value)}
                        placeholder="+91 9876543210" className="w-full pl-11 pr-4 py-3.5 text-sm font-medium bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-[#1a237e] focus:bg-white transition-all" />
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full flex items-center justify-center gap-2 py-4 bg-[#1a237e] hover:bg-[#283593] text-white font-black text-sm rounded-2xl transition-all shadow-lg">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">Department *</label>
                  <div className="relative">
                    <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select value={formData.department} onChange={e => update('department', e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 text-sm font-medium bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-[#1a237e] focus:bg-white transition-all appearance-none cursor-pointer">
                      <option value="">Select your department</option>
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  {errors.department && <p className="text-xs text-red-500 font-medium">{errors.department}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">Year of Study *</label>
                  <select value={formData.year_of_study} onChange={e => update('year_of_study', e.target.value)}
                    className="w-full px-4 py-3.5 text-sm font-medium bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-[#1a237e] focus:bg-white transition-all appearance-none cursor-pointer">
                    <option value="">Select year</option>
                    {[1, 2, 3, 4, 5, 6].map(y => <option key={y} value={y}>Year {y}</option>)}
                  </select>
                  {errors.year_of_study && <p className="text-xs text-red-500 font-medium">{errors.year_of_study}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type={showPassword ? 'text' : 'password'} value={formData.password}
                      onChange={e => update('password', e.target.value)} placeholder="Min. 8 characters"
                      className="w-full pl-11 pr-12 py-3.5 text-sm font-medium bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-[#1a237e] focus:bg-white transition-all" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">Confirm Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type={showPassword ? 'text' : 'password'} value={formData.confirm_password}
                      onChange={e => update('confirm_password', e.target.value)} placeholder="Re-enter password"
                      className="w-full pl-11 pr-4 py-3.5 text-sm font-medium bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-[#1a237e] focus:bg-white transition-all" />
                  </div>
                  {errors.confirm_password && <p className="text-xs text-red-500 font-medium">{errors.confirm_password}</p>}
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)}
                    className="flex-1 py-4 text-[#1a237e] font-bold text-sm border-2 border-[#1a237e]/30 rounded-2xl hover:bg-[#1a237e]/5 transition-all">
                    ← Back
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex-2 flex-1 flex items-center justify-center gap-2 py-4 bg-[#1a237e] hover:bg-[#283593] text-white font-black text-sm rounded-2xl transition-all shadow-lg disabled:opacity-60">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
