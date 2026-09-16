'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, BookOpen, Users, UserCheck, Bell, Settings,
  GraduationCap, LogOut, Shield, FileSpreadsheet, Menu, X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import type { Profile } from '@/types'

interface Props {
  user: Profile
}

const adminNavItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/problems', label: 'Problem Statements', icon: BookOpen },
  { href: '/admin/teams', label: 'Teams & Selections', icon: Users },
  { href: '/admin/users', label: 'Users & Roles', icon: UserCheck },
  { href: '/admin/announcements', label: 'Announcements', icon: Bell },
  { href: '/admin/settings', label: 'Event Settings', icon: Settings },
]

export default function AdminSidebar({ user }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0d1240] text-white">
      {/* Brand */}
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center text-slate-900">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider block">Faculty / Admin</span>
            <span className="text-sm font-black text-white">DSMNRU SIH 2026</span>
          </div>
        </Link>
      </div>

      {/* Admin Info */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="bg-white/10 rounded-2xl p-3.5 space-y-1">
          <p className="font-black text-sm text-white truncate">{user.full_name}</p>
          <p className="text-xs text-white/60 truncate">{user.email}</p>
          <span className="inline-block bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase mt-1">
            {user.role}
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {adminNavItems.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all no-underline',
              isActive(href, exact)
                ? 'bg-amber-400 text-slate-950 shadow-lg'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-white/10 space-y-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-white/70 hover:bg-white/10 hover:text-white transition-all no-underline"
        >
          <GraduationCap className="w-4 h-4" />
          Student View
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/20 transition-all w-full text-left"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 border-r border-slate-800 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-6 left-6 z-50 w-12 h-12 bg-amber-400 rounded-2xl flex items-center justify-center text-slate-950 shadow-xl font-bold"
      >
        <Menu className="w-5 h-5" />
      </button>

      {mobileOpen && (
        <>
          <div className="lg:hidden fixed inset-0 bg-black/60 z-50" onClick={() => setMobileOpen(false)} />
          <aside className="lg:hidden fixed left-0 top-0 h-full w-72 z-50 shadow-2xl">
            <div className="absolute top-4 right-4 z-10">
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-xl text-white/70 hover:bg-white/10">
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  )
}
