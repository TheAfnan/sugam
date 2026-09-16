'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { selectProblem, withdrawProblemSelection } from '@/lib/actions/teams'
import { LogIn, Users, CheckCircle, Lock, AlertCircle, Loader2, ArrowLeftRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type CTAState = 'select' | 'already_selected' | 'team_has_other' | 'full' | 'login' | 'no_team'

interface Props {
  problemId: string
  ctaState: CTAState
  teamHasOtherProblem: boolean
  otherProblemTitle?: string
}

export default function SelectProblemButton({ problemId, ctaState, teamHasOtherProblem, otherProblemTitle }: Props) {
  const [loading, setLoading] = useState(false)
  const [withdrawing, setWithdrawing] = useState(false)
  const [confirmChange, setConfirmChange] = useState(false)

  const handleSelect = async () => {
    if (teamHasOtherProblem && !confirmChange) {
      setConfirmChange(true)
      return
    }

    setLoading(true)
    try {
      const result = await selectProblem(problemId)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('Problem selected successfully! Good luck! 🎉')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
      setConfirmChange(false)
    }
  }

  const handleWithdraw = async () => {
    setWithdrawing(true)
    try {
      const result = await withdrawProblemSelection()
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('Problem selection withdrawn.')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setWithdrawing(false)
    }
  }

  if (ctaState === 'login') {
    return (
      <Link
        href="/auth/login"
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#1a237e] hover:bg-[#283593] text-white font-black text-sm rounded-2xl transition-all shadow-lg no-underline"
      >
        <LogIn className="w-4 h-4" />
        Login to Select Problem
      </Link>
    )
  }

  if (ctaState === 'no_team') {
    return (
      <Link
        href="/dashboard"
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-sm rounded-2xl transition-all shadow-lg no-underline"
      >
        <Users className="w-4 h-4" />
        Create or Join a Team
      </Link>
    )
  }

  if (ctaState === 'already_selected') {
    return (
      <div className="space-y-3">
        <div className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-100 text-emerald-700 font-black text-sm rounded-2xl border-2 border-emerald-200">
          <CheckCircle className="w-4 h-4" />
          Your Team Selected This Problem
        </div>
        <button
          onClick={handleWithdraw}
          disabled={withdrawing}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl border border-red-200 transition-all disabled:opacity-50"
        >
          {withdrawing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowLeftRight className="w-3.5 h-3.5" />}
          {withdrawing ? 'Withdrawing...' : 'Change Problem Selection'}
        </button>
      </div>
    )
  }

  if (ctaState === 'full') {
    return (
      <div className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-50 text-red-600 font-black text-sm rounded-2xl border-2 border-red-200 cursor-not-allowed">
        <Lock className="w-4 h-4" />
        Problem Full — No Slots Available
      </div>
    )
  }

  if (ctaState === 'team_has_other' && confirmChange) {
    return (
      <div className="space-y-3">
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-xs font-medium text-orange-800">
          <p className="font-black mb-1">⚠️ Confirm Problem Change</p>
          <p>Your team currently has: <strong>{otherProblemTitle?.slice(0, 60)}...</strong></p>
          <p className="mt-1">Selecting this problem will replace your current selection.</p>
        </div>
        <button
          onClick={handleSelect}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-black text-sm rounded-2xl transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
          {loading ? 'Changing...' : 'Confirm Change'}
        </button>
        <button
          onClick={() => setConfirmChange(false)}
          className="w-full py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleSelect}
      disabled={loading}
      className={cn(
        'w-full flex items-center justify-center gap-2 py-3.5 font-black text-sm rounded-2xl transition-all shadow-lg disabled:opacity-60',
        ctaState === 'team_has_other'
          ? 'bg-orange-500 hover:bg-orange-600 text-white'
          : 'bg-[#1a237e] hover:bg-[#283593] text-white'
      )}
    >
      {loading ? (
        <><Loader2 className="w-4 h-4 animate-spin" /> Selecting...</>
      ) : ctaState === 'team_has_other' ? (
        <><ArrowLeftRight className="w-4 h-4" /> Change to This Problem</>
      ) : (
        <><CheckCircle className="w-4 h-4" /> Select This Problem</>
      )}
    </button>
  )
}
