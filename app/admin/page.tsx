import { getStats, getAllProblems } from '@/lib/actions/problems'
import { getAdminTeams } from '@/lib/actions/admin'
import Link from 'next/link'
import {
  BookOpen, Cpu, Zap, Users, CheckCircle2, AlertCircle,
  FileSpreadsheet, ArrowRight, ShieldCheck, Plus, Sparkles
} from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardOverview() {
  const [stats, problems, teams] = await Promise.all([
    getStats(),
    getAllProblems(),
    getAdminTeams(),
  ])

  const recentTeams = teams.slice(0, 5)

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time SIH 2026 portal statistics, problem allocations, and team registrations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/problems?import=true"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 no-underline shadow-sm transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Import CSV
          </Link>
          <Link
            href="/admin/problems?action=add"
            className="px-4 py-2.5 bg-[#1a237e] hover:bg-[#283593] text-white font-bold text-xs rounded-xl flex items-center gap-2 no-underline shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Problem
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Problems', value: stats.total_problems, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
          { label: 'Software / Hardware', value: `${stats.software_problems} / ${stats.hardware_problems}`, icon: Cpu, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
          { label: 'Total Registered Teams', value: stats.total_teams, icon: Users, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
          { label: 'Selected Allocations', value: stats.teams_with_selection, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={cn('rounded-3xl border p-5 space-y-3 shadow-xs bg-white')}>
            <div className="flex items-center justify-between">
              <div className={cn('w-10 h-10 rounded-2xl flex items-center justify-center border', bg)}>
                <Icon className={cn('w-5 h-5', color)} />
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quota & Availability overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <h2 className="font-black text-slate-900 text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#1a237e]" />
            Problem Statement Allocation Status
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
              <p className="text-xs font-bold text-emerald-700 uppercase">Available Problems</p>
              <p className="text-3xl font-black text-emerald-900 mt-1">{stats.available_problems}</p>
              <p className="text-xs text-emerald-600 mt-1">Accepting more teams</p>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
              <p className="text-xs font-bold text-red-700 uppercase">Full Capacity Problems</p>
              <p className="text-3xl font-black text-red-900 mt-1">{stats.full_problems}</p>
              <p className="text-xs text-red-600 mt-1">Quota reached</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <h2 className="font-black text-slate-900 text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-[#1a237e]" />
            Student & Team Activity
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <p className="text-xs font-bold text-blue-700 uppercase">Registered Students</p>
              <p className="text-3xl font-black text-blue-900 mt-1">{stats.total_students}</p>
              <p className="text-xs text-blue-600 mt-1">Student accounts</p>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
              <p className="text-xs font-bold text-amber-700 uppercase">Selection Rate</p>
              <p className="text-3xl font-black text-amber-900 mt-1">
                {stats.total_teams > 0
                  ? `${Math.round((stats.teams_with_selection / stats.total_teams) * 100)}%`
                  : '0%'}
              </p>
              <p className="text-xs text-amber-600 mt-1">Teams with selected PS</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Registered Teams */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-black text-slate-900 text-lg">Recently Registered Teams</h2>
            <p className="text-xs text-slate-500">Latest team registrations and selections</p>
          </div>
          <Link href="/admin/teams" className="text-xs font-bold text-[#1a237e] hover:underline no-underline">
            View All Teams →
          </Link>
        </div>

        {recentTeams.length > 0 ? (
          <div className="space-y-3">
            {recentTeams.map((team: any) => (
              <div key={team.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 flex-wrap gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-[#1a237e] bg-blue-100 px-2.5 py-0.5 rounded-md">
                      {team.team_id}
                    </span>
                    <span className="font-black text-slate-900 text-sm">{team.name}</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Leader: {team.leader?.full_name} ({team.leader?.email}) · {team.members?.length || 0} members
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {team.selection?.problem ? (
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-slate-700 bg-white px-2 py-1 rounded-md border border-slate-200">
                        {team.selection.problem.ps_id}
                      </span>
                      <p className="text-[10px] text-slate-500 truncate max-w-[160px]">
                        {team.selection.problem.title}
                      </p>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 font-bold bg-slate-200/60 px-2.5 py-1 rounded-full">
                      No Selection
                    </span>
                  )}
                  <span className={cn(
                    'text-[10px] font-black uppercase px-2.5 py-1 rounded-full',
                    team.status === 'forming' ? 'bg-amber-100 text-amber-800' :
                    team.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                    'bg-emerald-100 text-emerald-800'
                  )}>
                    {team.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400 text-center py-6">No teams registered yet.</p>
        )}
      </div>
    </div>
  )
}
