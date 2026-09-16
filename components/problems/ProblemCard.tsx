import Link from 'next/link'
import { cn, getAvailabilityStatus, getSlotsRemaining } from '@/lib/utils'
import { Building2, Cpu, Zap, Users, ArrowRight, Tag } from 'lucide-react'
import type { Problem } from '@/types'

interface ProblemCardProps {
  problem: Problem
  className?: string
}

export default function ProblemCard({ problem, className }: ProblemCardProps) {
  const availStatus = getAvailabilityStatus(problem)
  const slotsLeft = getSlotsRemaining(problem)

  return (
    <div
      className={cn(
        'bg-white rounded-3xl border-2 border-slate-200 hover:border-[#1a237e]/40 hover:shadow-xl transition-all duration-200 p-6 flex flex-col justify-between h-full',
        availStatus === 'full' && 'opacity-75 hover:border-slate-300',
        className
      )}
    >
      <div className="space-y-3.5">
        {/* Top Row: PS ID + Category + Availability */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono font-black text-white bg-[#1a237e] px-3 py-1 rounded-lg tracking-wider shadow-sm">
              {problem.ps_id}
            </span>
            <span className={cn(
              'text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border',
              problem.category === 'Software' ? 'badge-software' : 'badge-hardware'
            )}>
              {problem.category === 'Software'
                ? <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> Software</span>
                : <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Hardware</span>
              }
            </span>
          </div>

          {/* Availability Badge */}
          <span className={cn(
            'text-[11px] font-black px-3 py-1 rounded-full border flex items-center gap-1.5',
            availStatus === 'available' ? 'badge-available' :
            availStatus === 'limited' ? 'badge-limited' : 'badge-full'
          )}>
            <span className={cn(
              'w-1.5 h-1.5 rounded-full',
              availStatus === 'available' ? 'bg-emerald-500' :
              availStatus === 'limited' ? 'bg-orange-500' : 'bg-red-500'
            )} />
            {availStatus === 'available' ? `${slotsLeft} Slot${slotsLeft !== 1 ? 's' : ''} Available` :
             availStatus === 'limited' ? `${slotsLeft} Slot${slotsLeft !== 1 ? 's' : ''} Left` :
             'Problem Full'}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-black text-slate-950 leading-snug tracking-tight line-clamp-2">
          {problem.title}
        </h3>

        {/* Organization */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-700 flex items-center gap-2">
          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{problem.organization}</span>
        </div>

        {/* Theme */}
        <div className="text-[11px] font-bold text-blue-900 bg-blue-50/80 border border-blue-100 px-3 py-1 rounded-lg inline-flex items-center gap-1.5">
          <Tag className="w-3 h-3" />
          {problem.theme}
        </div>

        {/* Description preview */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
          {problem.background || problem.description}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
        {/* Team count */}
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
          <Users className="w-4 h-4" />
          <span>
            <span className="text-slate-700">{problem.current_team_count}</span>
            <span className="text-slate-400">/{problem.max_teams} teams</span>
          </span>
          {/* Mini progress bar */}
          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                availStatus === 'available' ? 'bg-emerald-400' :
                availStatus === 'limited' ? 'bg-orange-400' : 'bg-red-400'
              )}
              style={{ width: `${Math.min(100, (problem.current_team_count / problem.max_teams) * 100)}%` }}
            />
          </div>
        </div>

        <Link
          href={`/problems/${problem.id}`}
          className={cn(
            'text-xs font-black px-4 py-1.5 rounded-xl flex items-center gap-1.5 transition-all no-underline shadow-sm',
            availStatus === 'full'
              ? 'text-slate-500 bg-slate-100 cursor-not-allowed'
              : 'text-white bg-[#1a237e] hover:bg-[#283593] active:scale-95'
          )}
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
