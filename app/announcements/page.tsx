import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getAnnouncements } from '@/lib/actions/problems'
import { Bell, AlertCircle, Calendar, ShieldCheck } from 'lucide-react'
import { formatDate, formatRelativeTime, cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements(50)

  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-1 bg-slate-50/70 pt-[68px]">
        <div className="container-main py-12 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a237e] text-amber-400 text-xs font-black uppercase tracking-wider">
              <Bell className="w-3.5 h-3.5" /> Official Updates
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Announcements & Notices
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Stay updated with official timelines, instructions, and news regarding DSMNRU Internal SIH 2026.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {announcements.length > 0 ? (
              announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className={cn(
                    'bg-white rounded-3xl border p-6 sm:p-8 space-y-4 shadow-sm transition-all hover:shadow-md',
                    announcement.is_important ? 'border-amber-300 ring-2 ring-amber-400/20' : 'border-slate-200'
                  )}
                >
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      {announcement.is_important && (
                        <span className="text-xs font-black uppercase px-2.5 py-1 rounded-full bg-red-100 text-red-700 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Important Notice
                        </span>
                      )}
                      <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(announcement.created_at)} ({formatRelativeTime(announcement.created_at)})
                      </span>
                    </div>

                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> DSMNRU Organizers
                    </span>
                  </div>

                  <h2 className="text-lg font-black text-slate-900 leading-snug">
                    {announcement.title}
                  </h2>

                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {announcement.content}
                  </p>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
                <Bell className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-black text-slate-700">No Announcements Yet</h3>
                <p className="text-xs text-slate-400">Check back later for updates regarding SIH 2026 selection.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
