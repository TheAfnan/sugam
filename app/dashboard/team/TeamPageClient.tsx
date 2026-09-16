'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { createTeam, joinTeam, leaveTeam, withdrawProblemSelection, removeMember } from '@/lib/actions/teams'
import { Users, Plus, LogIn, Crown, UserMinus, Copy, Check, Hash, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Profile } from '@/types'

interface TeamMember {
  id: string
  role: string
  profile?: Profile | null
}

interface Team {
  id: string
  team_id: string
  name: string
  leader_id: string
  department?: string
  description?: string
  status: string
  max_size: number
  members: TeamMember[]
  selection?: { problem?: { title: string; ps_id: string } } | null
}

interface Props {
  team: Team | null
  user: Profile
  initialAction?: string
}

export default function TeamPageClient({ team, user, initialAction }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<'create' | 'join'>(
    !team ? (initialAction === 'join' ? 'join' : 'create') : 'create'
  )
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [joinCode, setJoinCode] = useState('')
  const [createForm, setCreateForm] = useState({ name: '', department: user.department || '', description: '' })

  const isLeader = team?.leader_id === user.id

  const copyTeamId = () => {
    if (team?.team_id) {
      navigator.clipboard.writeText(team.team_id)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!createForm.name.trim()) { toast.error('Team name is required'); return }
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('name', createForm.name)
      fd.append('department', createForm.department)
      fd.append('description', createForm.description)
      const result = await createTeam(fd)
      if (result?.error) toast.error(result.error)
      else { toast.success('Team created! Share your team code with members.'); router.refresh() }
    } finally { setLoading(false) }
  }

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!joinCode.trim()) { toast.error('Enter a team code'); return }
    setLoading(true)
    try {
      const result = await joinTeam(joinCode)
      if (result?.error) toast.error(result.error)
      else { toast.success('Joined team successfully!'); router.refresh() }
    } finally { setLoading(false) }
  }

  const handleLeave = async () => {
    if (!confirm('Are you sure you want to leave this team?')) return
    setLoading(true)
    try {
      const result = await leaveTeam()
      if (result?.error) toast.error(result.error)
      else { toast.success('Left team'); router.refresh() }
    } finally { setLoading(false) }
  }

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (!confirm(`Remove ${memberName} from the team?`)) return
    setLoading(true)
    try {
      const result = await removeMember(memberId)
      if (result?.error) toast.error(result.error)
      else { toast.success(`${memberName} removed`); router.refresh() }
    } finally { setLoading(false) }
  }

  if (!team) {
    return (
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">My Team</h1>
          <p className="text-slate-500 text-sm mt-1">Create a new team or join an existing one with a team code.</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-100 rounded-2xl p-1">
          {[
            { key: 'create', label: 'Create Team', icon: Plus },
            { key: 'join', label: 'Join Team', icon: LogIn },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key as 'create' | 'join')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-xl transition-all',
                tab === key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {tab === 'create' ? (
          <form onSubmit={handleCreate} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <h2 className="font-black text-slate-900">Create New Team</h2>
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500">Team Name *</label>
              <input type="text" value={createForm.name} onChange={e => setCreateForm(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Team Phoenix, Code Crusaders..." className="w-full px-4 py-3 text-sm font-medium bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-[#1a237e] transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500">Department</label>
              <input type="text" value={createForm.department} onChange={e => setCreateForm(p => ({ ...p, department: e.target.value }))}
                placeholder="Computer Science & Engineering" className="w-full px-4 py-3 text-sm font-medium bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-[#1a237e] transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500">Description (optional)</label>
              <textarea value={createForm.description} onChange={e => setCreateForm(p => ({ ...p, description: e.target.value }))}
                placeholder="Brief description of your team..." rows={3} className="w-full px-4 py-3 text-sm font-medium bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-[#1a237e] transition-all resize-none" />
            </div>
            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#1a237e] hover:bg-[#283593] text-white font-black text-sm rounded-2xl transition-all disabled:opacity-60">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : <><Plus className="w-4 h-4" /> Create Team</>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleJoin} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <h2 className="font-black text-slate-900">Join Existing Team</h2>
            <p className="text-sm text-slate-500">Get the team code (e.g. DSMNRU-1234) from your team leader.</p>
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500">Team Code *</label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="DSMNRU-1234" className="w-full pl-11 pr-4 py-3 text-sm font-mono font-bold bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-[#1a237e] transition-all uppercase" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#1a237e] hover:bg-[#283593] text-white font-black text-sm rounded-2xl transition-all disabled:opacity-60">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Joining...</> : <><LogIn className="w-4 h-4" /> Join Team</>}
            </button>
          </form>
        )}
      </div>
    )
  }

  // Has team — show management UI
  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">My Team</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your team members and settings.</p>
        </div>
        <span className={cn(
          'text-xs font-black px-3 py-1.5 rounded-full uppercase',
          team.status === 'forming' ? 'bg-amber-100 text-amber-700' :
          team.status === 'submitted' ? 'bg-blue-100 text-blue-700' :
          'bg-emerald-100 text-emerald-700'
        )}>
          {team.status}
        </span>
      </div>

      {/* Team Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900">{team.name}</h2>
            {team.department && <p className="text-sm text-slate-500">{team.department}</p>}
            {team.description && <p className="text-sm text-slate-600 mt-1">{team.description}</p>}
          </div>
          <button onClick={copyTeamId} className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-600 transition-all">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="font-mono">{team.team_id}</span>
          </button>
        </div>

        {/* Members */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider">
              Members ({team.members.length}/{team.max_size})
            </h3>
          </div>
          <div className="space-y-2">
            {team.members.map((member) => (
              <div key={member.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                <div className="w-9 h-9 rounded-full bg-[#1a237e] flex items-center justify-center text-white text-sm font-black shrink-0">
                  {member.profile?.full_name?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-slate-900 truncate">{member.profile?.full_name}</p>
                  <p className="text-xs text-slate-500 truncate">{member.profile?.enrollment_number}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'text-[10px] font-black px-2 py-0.5 rounded-full uppercase',
                    member.role === 'leader' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-600'
                  )}>
                    {member.role === 'leader' ? '👑 Leader' : 'Member'}
                  </span>
                  {isLeader && member.role !== 'leader' && (
                    <button onClick={() => handleRemoveMember(member.id, member.profile?.full_name || '')}
                      disabled={loading}
                      className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors disabled:opacity-50">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Share code */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <p className="text-xs font-black text-blue-700 uppercase tracking-wider mb-1">Share Team Code</p>
          <p className="text-sm text-blue-600 font-medium">
            Share code <strong className="font-mono font-black">{team.team_id}</strong> with your teammates so they can join.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2 border-t border-slate-100">
          {!isLeader && (
            <button onClick={handleLeave} disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all disabled:opacity-50">
              <UserMinus className="w-4 h-4" />
              Leave Team
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
