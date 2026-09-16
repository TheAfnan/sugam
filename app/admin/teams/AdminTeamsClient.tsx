'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { updateTeamStatus } from '@/lib/actions/admin'
import { Users, Search, CheckCircle, XCircle, Clock, BookOpen, Crown, ChevronDown } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'

interface Props {
  teams: any[]
}

export default function AdminTeamsClient({ teams }: Props) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(false)

  const filteredTeams = teams.filter(t => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return (
        t.team_id.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        (t.leader?.full_name || '').toLowerCase().includes(q) ||
        (t.selection?.problem?.ps_id || '').toLowerCase().includes(q)
      )
    }
    return true
  })

  const handleStatusChange = async (teamId: string, status: string) => {
    setLoading(true)
    try {
      const res = await updateTeamStatus(teamId, status)
      if (res.error) toast.error(res.error)
      else {
        toast.success(`Team status updated to ${status}`)
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Teams & Problem Selections</h1>
        <p className="text-slate-500 text-sm mt-1">
          Monitor all registered teams, members, and selected problem statements. Approve or adjust team status.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Team Code, Team Name, Leader Name, or PS ID..."
            className="w-full pl-10 pr-4 py-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#1a237e]"
          />
        </div>

        <div className="flex items-center gap-2">
          {['all', 'forming', 'submitted', 'approved'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={cn(
                'px-3 py-2 text-xs font-bold rounded-xl border transition-all capitalize',
                statusFilter === st
                  ? 'bg-[#1a237e] text-white border-[#1a237e]'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              )}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Teams Grid */}
      <div className="space-y-4">
        {filteredTeams.length > 0 ? (
          filteredTeams.map((team) => (
            <div key={team.id} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-white bg-[#1a237e] px-2.5 py-1 rounded-lg">
                      {team.team_id}
                    </span>
                    <h2 className="text-lg font-black text-slate-900">{team.name}</h2>
                  </div>
                  <p className="text-xs text-slate-500">
                    Leader: <strong className="text-slate-800">{team.leader?.full_name}</strong> ({team.leader?.email}) · Created {formatDate(team.created_at)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className={cn(
                    'text-xs font-black px-3 py-1 rounded-full uppercase',
                    team.status === 'forming' ? 'bg-amber-100 text-amber-800' :
                    team.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                    team.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-red-100 text-red-800'
                  )}>
                    {team.status}
                  </span>

                  {/* Status Dropdown */}
                  <select
                    value={team.status}
                    onChange={(e) => handleStatusChange(team.id, e.target.value)}
                    disabled={loading}
                    className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none"
                  >
                    <option value="forming">Forming</option>
                    <option value="submitted">Submitted</option>
                    <option value="approved">Approve</option>
                    <option value="rejected">Reject</option>
                  </select>
                </div>
              </div>

              {/* Selection Banner */}
              {team.selection?.problem ? (
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-[#1a237e] shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-white bg-[#1a237e] px-2 py-0.5 rounded">
                          {team.selection.problem.ps_id}
                        </span>
                        <p className="text-xs font-black text-slate-900">{team.selection.problem.title}</p>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {team.selection.problem.organization} · {team.selection.problem.theme}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    Selected {formatDate(team.selection.selected_at)}
                  </span>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3 text-xs text-slate-400 font-bold text-center">
                  No Problem Statement Selected Yet
                </div>
              )}

              {/* Members */}
              <div>
                <p className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2">
                  Team Members ({team.members?.length || 0} / {team.max_size})
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {team.members?.map((m: any) => (
                    <div key={m.id} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                      <div className="truncate">
                        <p className="font-black text-slate-800 truncate">{m.profile?.full_name || 'Member'}</p>
                        <p className="text-[10px] text-slate-400 truncate">{m.profile?.enrollment_number}</p>
                      </div>
                      {m.role === 'leader' && (
                        <span className="text-[9px] font-black bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                          Leader
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400">
            No teams match your search or filter.
          </div>
        )}
      </div>
    </div>
  )
}
