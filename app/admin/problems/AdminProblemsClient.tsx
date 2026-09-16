'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { createProblem, deleteProblem, updateProblem } from '@/lib/actions/admin'
import CsvImport from '@/components/admin/CsvImport'
import {
  BookOpen, Plus, FileSpreadsheet, Trash2, Edit2, Search,
  Cpu, Zap, CheckCircle, AlertCircle, X, Loader2
} from 'lucide-react'
import { cn, SIH_THEMES } from '@/lib/utils'
import type { Problem, ProblemCategory, ProblemStatus } from '@/types'

interface Props {
  problems: Problem[]
}

export default function AdminProblemsClient({ problems }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showCsvImport, setShowCsvImport] = useState(searchParams.get('import') === 'true')
  const [showAddModal, setShowAddModal] = useState(searchParams.get('action') === 'add')
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [loading, setLoading] = useState(false)

  const filteredProblems = problems.filter(p => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return (
        p.ps_id.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.organization.toLowerCase().includes(q) ||
        p.theme.toLowerCase().includes(q)
      )
    }
    return true
  })

  const handleDelete = async (id: string, psId: string) => {
    if (!confirm(`Are you sure you want to delete problem ${psId}?`)) return
    setLoading(true)
    try {
      const res = await deleteProblem(id)
      if (res.error) toast.error(res.error)
      else {
        toast.success(`Problem ${psId} deleted`)
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const fd = new FormData(e.currentTarget)
      const res = await createProblem(fd)
      if (res.error) toast.error(res.error)
      else {
        toast.success('Problem statement created!')
        setShowAddModal(false)
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingProblem) return
    setLoading(true)
    try {
      const fd = new FormData(e.currentTarget)
      const res = await updateProblem(editingProblem.id, fd)
      if (res.error) toast.error(res.error)
      else {
        toast.success('Problem statement updated!')
        setEditingProblem(null)
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Problem Statement Management</h1>
          <p className="text-slate-500 text-sm mt-1">
            Total {problems.length} problem statements in database. Add, edit, bulk import via CSV, or configure capacity.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCsvImport(!showCsvImport)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4" />
            {showCsvImport ? 'Close CSV Import' : 'Import CSV'}
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-[#1a237e] hover:bg-[#283593] text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Problem
          </button>
        </div>
      </div>

      {/* CSV Import Modal / Container */}
      {showCsvImport && (
        <div className="scroll-reveal">
          <CsvImport onClose={() => setShowCsvImport(false)} />
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by PS ID, Title, Organization..."
            className="w-full pl-10 pr-4 py-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#1a237e]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['all', 'Software', 'Hardware'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={cn(
                'px-3.5 py-2 text-xs font-bold rounded-xl border transition-all',
                categoryFilter === cat
                  ? 'bg-[#1a237e] text-white border-[#1a237e]'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              )}
            >
              {cat === 'all' ? 'All Types' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 font-black text-slate-700 uppercase tracking-wider">
              <tr>
                <th className="p-4">PS ID</th>
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Theme</th>
                <th className="p-4">Organization</th>
                <th className="p-4">Teams Selected</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredProblems.length > 0 ? (
                filteredProblems.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono font-black text-[#1a237e]">{p.ps_id}</td>
                    <td className="p-4 font-bold text-slate-900 max-w-xs">{p.title}</td>
                    <td className="p-4">
                      <span className={cn(
                        'px-2 py-0.5 rounded-md font-bold uppercase text-[10px]',
                        p.category === 'Software' ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-800'
                      )}>
                        {p.category}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 max-w-[140px] truncate">{p.theme}</td>
                    <td className="p-4 text-slate-600 max-w-[140px] truncate">{p.organization}</td>
                    <td className="p-4 font-bold">
                      <span className={p.current_team_count >= p.max_teams ? 'text-red-600 font-black' : 'text-emerald-600'}>
                        {p.current_team_count} / {p.max_teams}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingProblem(p)}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.ps_id)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No problem statements match your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Problem Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 my-8">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-slate-900 text-lg">Add New Problem Statement</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black uppercase text-slate-500">PS ID *</label>
                  <input type="text" name="ps_id" required placeholder="SIH26-1021" className="w-full p-3 text-xs font-mono font-bold bg-slate-50 border rounded-2xl" />
                </div>
                <div>
                  <label className="text-xs font-black uppercase text-slate-500">Category *</label>
                  <select name="category" className="w-full p-3 text-xs font-bold bg-slate-50 border rounded-2xl">
                    <option value="Software">Software</option>
                    <option value="Hardware">Hardware</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-500">Problem Title *</label>
                <input type="text" name="title" required placeholder="Full title of the problem statement" className="w-full p-3 text-xs font-bold bg-slate-50 border rounded-2xl" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black uppercase text-slate-500">Theme / Domain *</label>
                  <select name="theme" className="w-full p-3 text-xs font-bold bg-slate-50 border rounded-2xl">
                    {SIH_THEMES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black uppercase text-slate-500">Organization *</label>
                  <input type="text" name="organization" required placeholder="Ministry or Org Name" className="w-full p-3 text-xs font-bold bg-slate-50 border rounded-2xl" />
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-500">Ministry (optional)</label>
                <input type="text" name="ministry" placeholder="Ministry of Education" className="w-full p-3 text-xs font-bold bg-slate-50 border rounded-2xl" />
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-500">Description *</label>
                <textarea name="description" required rows={3} placeholder="Detailed problem statement text..." className="w-full p-3 text-xs bg-slate-50 border rounded-2xl resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black uppercase text-slate-500">Max Teams Capacity</label>
                  <input type="number" name="max_teams" defaultValue={3} min={1} className="w-full p-3 text-xs font-bold bg-slate-50 border rounded-2xl" />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input type="checkbox" name="is_featured" value="true" className="w-4 h-4 rounded text-[#1a237e]" />
                    Mark as Featured
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 text-xs font-bold text-slate-600 bg-slate-100 rounded-2xl">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="flex-1 py-3 text-xs font-black text-white bg-[#1a237e] rounded-2xl">
                  {loading ? 'Saving...' : 'Create Problem'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingProblem && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 my-8">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-slate-900 text-lg">Edit {editingProblem.ps_id}</h2>
              <button onClick={() => setEditingProblem(null)} className="p-1 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase text-slate-500">Problem Title</label>
                <input type="text" name="title" defaultValue={editingProblem.title} required className="w-full p-3 text-xs font-bold bg-slate-50 border rounded-2xl" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black uppercase text-slate-500">Category</label>
                  <select name="category" defaultValue={editingProblem.category} className="w-full p-3 text-xs font-bold bg-slate-50 border rounded-2xl">
                    <option value="Software">Software</option>
                    <option value="Hardware">Hardware</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black uppercase text-slate-500">Max Teams</label>
                  <input type="number" name="max_teams" defaultValue={editingProblem.max_teams} min={1} className="w-full p-3 text-xs font-bold bg-slate-50 border rounded-2xl" />
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-500">Organization</label>
                <input type="text" name="organization" defaultValue={editingProblem.organization} required className="w-full p-3 text-xs font-bold bg-slate-50 border rounded-2xl" />
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-500">Description</label>
                <textarea name="description" defaultValue={editingProblem.description} required rows={3} className="w-full p-3 text-xs bg-slate-50 border rounded-2xl resize-none" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditingProblem(null)} className="flex-1 py-3 text-xs font-bold text-slate-600 bg-slate-100 rounded-2xl">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="flex-1 py-3 text-xs font-black text-white bg-[#1a237e] rounded-2xl">
                  {loading ? 'Saving...' : 'Update Problem'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
