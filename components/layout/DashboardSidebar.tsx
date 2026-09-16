'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Users, BookOpen, Bell, Settings, LogOut, GraduationCap, X, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import type { Profile } from '@/types'

interface Props {
  user: Profile
}

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/team', label: 'My Team', icon: Users },
  { href: '/dashboard/problem', label: 'Selected Problem', icon: BookOpen },
  { href: '/announcements', label: 'Announcements', icon: Bell },
]

export default function DashboardSidebar({ user }: Props) {
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
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <div className="w-9 h-9 rounded-xl bg-[#1a237e] flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">DSMNRU</p>
            <p className="text-sm font-black text-slate-900">SIH 2026</p>
          </div>
        </Link>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-slate-100">
        <div className="bg-gradient-to-br from-[#1a237e] to-[#283593] rounded-2xl p-4 text-white space-y-2">
          <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-slate-900 text-sm font-black">
            {user.full_name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-black text-sm truncate">{user.full_name}</p>
            <p className="text-white/60 text-xs truncate">{user.enrollment_number}</p>
            <p className="text-white/60 text-xs truncate">{user.department}</p>
          </div>
          <span className="inline-block bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
            {user.role}
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all no-underline',
              isActive(href, exact)
                ? 'bg-[#1a237e] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="p-4 space-y-1 border-t border-slate-100">
        <Link
          href="/problems"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-all no-underline"
        >
          <BookOpen className="w-4 h-4" />
          Browse Problems
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all w-full text-left"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-6 left-6 z-50 w-12 h-12 bg-[#1a237e] rounded-2xl flex items-center justify-center text-white shadow-xl"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <>
          <div className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setMobileOpen(false)} />
          <aside className="lg:hidden fixed left-0 top-0 h-full w-72 bg-white border-r border-slate-200 z-50 shadow-2xl">
            <div className="absolute top-4 right-4">
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  )
}
