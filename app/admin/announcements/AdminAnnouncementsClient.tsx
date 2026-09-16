'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createAnnouncement, deleteAnnouncement } from '@/lib/actions/admin'
import { Bell, Plus, Trash2, AlertCircle, Calendar, Loader2, X } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Props {
  announcements: any[]
}

export default function AdminAnnouncementsClient({ announcements }: Props) {
  const router = useRouter()
  const [showAdd, setShowAdd] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const fd = new FormData(e.currentTarget)
      const res = await createAnnouncement(fd)
      if (res.error) toast.error(res.error)
      else {
        toast.success('Announcement published!')
        setShowAdd(false)
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this announcement?')) return
    setLoading(true)
    try {
      const res = await deleteAnnouncement(id)
      if (res.error) toast.error(res.error)
      else {
        toast.success('Announcement deleted')
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Announcement System</h1>
          <p className="text-slate-500 text-sm mt-1">
            Publish official announcements and notices visible on the landing page and student dashboard.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2.5 bg-[#1a237e] hover:bg-[#283593] text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Announcement
        </button>
      </div>

      {/* Add Modal / Form */}
      {showAdd && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm scroll-reveal">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-slate-900">New Announcement</h2>
            <button onClick={() => setShowAdd(false)} className="p-1 rounded-lg hover:bg-slate-100">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="text-xs font-black uppercase text-slate-500">Title *</label>
              <input type="text" name="title" required placeholder="Announcement headline..." className="w-full p-3 text-xs font-bold bg-slate-50 border rounded-2xl" />
            </div>

            <div>
              <label className="text-xs font-black uppercase text-slate-500">Content *</label>
              <textarea name="content" required rows={4} placeholder="Full announcement text..." className="w-full p-3 text-xs bg-slate-50 border rounded-2xl resize-none" />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" name="is_important" value="true" id="importantCheck" className="w-4 h-4 rounded text-[#1a237e]" />
              <label htmlFor="importantCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
                Mark as Important Notice (High priority badge)
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-3 text-xs font-bold text-slate-600 bg-slate-100 rounded-2xl">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="flex-1 py-3 text-xs font-black text-white bg-[#1a237e] rounded-2xl">
                {loading ? 'Publishing...' : 'Publish Announcement'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="space-y-4">
        {announcements.length > 0 ? (
          announcements.map((a) => (
            <div key={a.id} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-xs">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {a.is_important && (
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Important
                    </span>
                  )}
                  <span className="text-xs font-bold text-slate-400">
                    {formatDate(a.created_at)}
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(a.id)}
                  className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h2 className="font-black text-slate-900">{a.title}</h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{a.content}</p>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400">
            No announcements created yet.
          </div>
        )}
      </div>
    </div>
  )
}
