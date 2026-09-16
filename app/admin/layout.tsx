import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/actions/auth'
import AdminSidebar from '@/components/layout/AdminSidebar'
import { Shield } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')

  if (user.role !== 'admin' && user.role !== 'faculty') {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar user={user} />
      <div className="flex-1 lg:ml-64">
        {/* Admin topbar */}
        <div className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center text-slate-950">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">DSMNRU SIH 2026</p>
              <p className="text-sm font-black text-slate-900">Admin Control Panel</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-amber-100 text-amber-800">
              Role: {user.role}
            </span>
            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold text-slate-900">{user.full_name}</p>
              <p className="text-xs text-slate-400">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">{children}</div>
      </div>
    </div>
  )
}
