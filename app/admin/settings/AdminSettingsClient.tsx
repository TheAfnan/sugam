'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { updateEventSetting } from '@/lib/actions/admin'
import { Settings, Save, Lock, Users, Calendar, ShieldCheck, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  initialSettings: Record<string, any>
}

export default function AdminSettingsClient({ initialSettings }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    max_team_size: initialSettings.max_team_size || 6,
    min_team_size: initialSettings.min_team_size || 3,
    max_teams_per_problem: initialSettings.max_teams_per_problem || 3,
    allow_problem_change: initialSettings.allow_problem_change ?? true,
    require_approval: initialSettings.require_approval ?? false,
    selection_locked: initialSettings.selection_locked ?? false,
    registration_open: initialSettings.registration_open ?? true,
    event_dates: initialSettings.event_dates || {
      registration_end: '2026-09-15',
      problem_selection_end: '2026-09-20',
      internal_event_date: '2026-09-27',
    },
  })

  const handleSave = async (key: string, value: any) => {
    setLoading(true)
    try {
      const res = await updateEventSetting(key, value)
      if (res.error) toast.error(res.error)
      else {
        toast.success(`Setting '${key}' saved!`)
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAll = async () => {
    setLoading(true)
    try {
      for (const [key, value] of Object.entries(settings)) {
        await updateEventSetting(key, value)
      }
      toast.success('All settings saved successfully!')
      router.refresh()
    } catch {
      toast.error('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Event Settings & Controls</h1>
          <p className="text-slate-500 text-sm mt-1">
            Configure system rules, capacity limits, selection locking, and event deadlines.
          </p>
        </div>
        <button
          onClick={handleSaveAll}
          disabled={loading}
          className="px-6 py-3 bg-[#1a237e] hover:bg-[#283593] text-white font-black text-xs rounded-2xl flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save All Settings
        </button>
      </div>

      {/* Rules & Locks */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <h2 className="font-black text-slate-900 text-lg flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#1a237e]" />
          System Toggles & Controls
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-black text-slate-900 text-sm">Lock All Problem Selections</span>
              <input
                type="checkbox"
                checked={settings.selection_locked}
                onChange={e => setSettings(p => ({ ...p, selection_locked: e.target.checked }))}
                className="w-5 h-5 rounded text-[#1a237e] cursor-pointer"
              />
            </div>
            <p className="text-xs text-slate-500">
              When enabled, students cannot select or change problem statements.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-black text-slate-900 text-sm">Allow Problem Changes</span>
              <input
                type="checkbox"
                checked={settings.allow_problem_change}
                onChange={e => setSettings(p => ({ ...p, allow_problem_change: e.target.checked }))}
                className="w-5 h-5 rounded text-[#1a237e] cursor-pointer"
              />
            </div>
            <p className="text-xs text-slate-500">
              Allow teams to switch their selected problem statement before locking.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-black text-slate-900 text-sm">Open Team Registration</span>
              <input
                type="checkbox"
                checked={settings.registration_open}
                onChange={e => setSettings(p => ({ ...p, registration_open: e.target.checked }))}
                className="w-5 h-5 rounded text-[#1a237e] cursor-pointer"
              />
            </div>
            <p className="text-xs text-slate-500">
              Allow new students to register accounts and create teams.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-black text-slate-900 text-sm">Faculty Approval Required</span>
              <input
                type="checkbox"
                checked={settings.require_approval}
                onChange={e => setSettings(p => ({ ...p, require_approval: e.target.checked }))}
                className="w-5 h-5 rounded text-[#1a237e] cursor-pointer"
              />
            </div>
            <p className="text-xs text-slate-500">
              Require faculty approval for problem statement selection.
            </p>
          </div>
        </div>
      </div>

      {/* Capacities */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <h2 className="font-black text-slate-900 text-lg flex items-center gap-2">
          <Users className="w-5 h-5 text-[#1a237e]" />
          Capacity & Team Limits
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-slate-500">Max Teams per Problem</label>
            <input
              type="number"
              min={1}
              value={settings.max_teams_per_problem}
              onChange={e => setSettings(p => ({ ...p, max_teams_per_problem: parseInt(e.target.value) || 3 }))}
              className="w-full p-3 font-bold text-sm bg-slate-50 border border-slate-200 rounded-2xl"
            />
            <p className="text-[11px] text-slate-400">Default quota for new problems</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-slate-500">Min Team Size</label>
            <input
              type="number"
              min={1}
              value={settings.min_team_size}
              onChange={e => setSettings(p => ({ ...p, min_team_size: parseInt(e.target.value) || 3 }))}
              className="w-full p-3 font-bold text-sm bg-slate-50 border border-slate-200 rounded-2xl"
            />
            <p className="text-[11px] text-slate-400">Min members to select problem</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-slate-500">Max Team Size</label>
            <input
              type="number"
              min={1}
              value={settings.max_team_size}
              onChange={e => setSettings(p => ({ ...p, max_team_size: parseInt(e.target.value) || 6 }))}
              className="w-full p-3 font-bold text-sm bg-slate-50 border border-slate-200 rounded-2xl"
            />
            <p className="text-[11px] text-slate-400">Max allowed members</p>
          </div>
        </div>
      </div>

      {/* Deadlines */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <h2 className="font-black text-slate-900 text-lg flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#1a237e]" />
          Event Timeline & Deadlines
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-slate-500">Registration End Date</label>
            <input
              type="date"
              value={settings.event_dates.registration_end || ''}
              onChange={e => setSettings(p => ({
                ...p,
                event_dates: { ...p.event_dates, registration_end: e.target.value }
              }))}
              className="w-full p-3 font-bold text-sm bg-slate-50 border border-slate-200 rounded-2xl"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-slate-500">Selection End Date</label>
            <input
              type="date"
              value={settings.event_dates.problem_selection_end || ''}
              onChange={e => setSettings(p => ({
                ...p,
                event_dates: { ...p.event_dates, problem_selection_end: e.target.value }
              }))}
              className="w-full p-3 font-bold text-sm bg-slate-50 border border-slate-200 rounded-2xl"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-slate-500">Internal Hackathon Date</label>
            <input
              type="date"
              value={settings.event_dates.internal_event_date || ''}
              onChange={e => setSettings(p => ({
                ...p,
                event_dates: { ...p.event_dates, internal_event_date: e.target.value }
              }))}
              className="w-full p-3 font-bold text-sm bg-slate-50 border border-slate-200 rounded-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
