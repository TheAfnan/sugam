import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/actions/auth'
import { getMyTeam, withdrawProblemSelection } from '@/lib/actions/teams'
import { getAvailabilityStatus, cn, formatDate } from '@/lib/utils'
import {
  BookOpen, Building2, Tag, Cpu, Zap, CheckCircle, ArrowRight,
  AlertCircle, ExternalLink, ArrowLeftRight
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function SelectedProblemPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')

  const team = await getMyTeam()
  const selection = team?.selection
  const problem = selection?.problem

  if (!team) {
    return (
      <div className="max-w-xl space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Selected Problem Statement</h1>
          <p className="text-slate-500 text-sm mt-1">View and track your team's problem statement selection.</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
          <div>
            <h2 className="text-lg font-black text-slate-900">No Team Found</h2>
            <p className="text-sm text-slate-600 max-w-sm mx-auto mt-1">
              You must create or join a team before your team can select a problem statement.
            </p>
          </div>
          <Link
            href="/dashboard/team"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a237e] text-white font-black text-sm rounded-xl no-underline"
          >
            Create or Join Team <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  if (!problem) {
    return (
      <div className="max-w-xl space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Selected Problem Statement</h1>
          <p className="text-slate-500 text-sm mt-1">Your team has not selected a problem statement yet.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-4">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <div>
            <h2 className="text-lg font-black text-slate-900">No Problem Selected</h2>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
              Browse the official problem bank and select a problem statement for team <strong>{team.name}</strong>.
            </p>
          </div>
          <Link
            href="/problems"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a237e] text-white font-black text-sm rounded-2xl shadow-lg no-underline hover:bg-[#283593] transition-all"
          >
            Browse Problem Statements <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  const availability = getAvailabilityStatus(problem)

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Selected Problem Statement</h1>
          <p className="text-slate-500 text-sm mt-1">Tracking problem selection for Team {team.name}</p>
        </div>
        <span className="text-xs font-black px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 uppercase">
          {selection?.status || 'PENDING'}
        </span>
      </div>

      {/* Selected Problem Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-mono font-black text-white bg-[#1a237e] px-3 py-1 rounded-xl">
              {problem.ps_id}
            </span>
            <span className={cn(
              'text-xs font-black px-2.5 py-1 rounded-xl border',
              problem.category === 'Software' ? 'badge-software' : 'badge-hardware'
            )}>
              {problem.category === 'Software' ? <Cpu className="w-3.5 h-3.5 inline mr-1" /> : <Zap className="w-3.5 h-3.5 inline mr-1" />}
              {problem.category}
            </span>
          </div>

          <Link
            href={`/problems/${problem.id}`}
            className="text-xs font-black text-[#1a237e] hover:underline flex items-center gap-1 no-underline"
          >
            Full Statement Page <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-900">{problem.title}</h2>
          <p className="text-sm text-slate-500 mt-1">{problem.organization}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase">Theme</p>
            <p className="font-bold text-slate-800">{problem.theme}</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase">Selection Date</p>
            <p className="font-bold text-slate-800">{selection ? formatDate(selection.selected_at) : 'N/A'}</p>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Description</h3>
          <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
            {problem.description}
          </p>
        </div>

        {problem.expected_solution && (
          <div className="space-y-2">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Expected Solution</h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {problem.expected_solution}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
