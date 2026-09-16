'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  Menu, X, GraduationCap, ChevronDown, LogIn, UserPlus,
  LayoutDashboard, Bell, BookOpen, LogOut, Settings, Shield
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/problems', label: 'Problem Statements' },
  { href: '/announcements', label: 'Announcements' },
  { href: '/about', label: 'About SIH 2026' },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<Profile | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(async ({ data: { user: authUser } }) => {
      if (authUser) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single()
        setUser(data)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        setUser(data)
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
    router.refresh()
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const dashboardHref = user?.role === 'admin' || user?.role === 'faculty' ? '/admin' : '/dashboard'

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          'nav-navy border-b border-white/10',
          scrolled ? 'shadow-2xl' : 'shadow-none'
        )}
        style={{ height: '68px' }}
      >
        <div className="container-main h-full flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0 group transition-transform active:scale-95"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
              <GraduationCap className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[10px] font-bold text-white/70 tracking-wider uppercase">
                DSMNRU · Lucknow
              </span>
              <span className="text-[15px] font-black text-amber-400 tracking-tight">
                Internal SIH 2026
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 text-sm rounded-lg font-semibold transition-all no-underline',
                  isActive(link.href)
                    ? 'text-white bg-white/15 shadow-sm'
                    : 'text-white/75 hover:text-white hover:bg-white/10'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white transition-all text-sm font-semibold"
                >
                  <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center text-slate-900 text-xs font-black">
                    {user.full_name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:block max-w-[120px] truncate">
                    {user.full_name?.split(' ')[0]}
                  </span>
                  <ChevronDown className={cn('w-4 h-4 transition-transform', dropdownOpen && 'rotate-180')} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs font-black text-slate-900 truncate">{user.full_name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      <span className={cn(
                        'text-[10px] font-black uppercase px-2 py-0.5 rounded-full mt-1 inline-block',
                        user.role === 'admin' ? 'bg-red-100 text-red-700' :
                        user.role === 'faculty' ? 'bg-purple-100 text-purple-700' :
                        'bg-blue-100 text-blue-700'
                      )}>
                        {user.role}
                      </span>
                    </div>
                    <Link
                      href={dashboardHref}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors no-underline"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    {(user.role === 'admin' || user.role === 'faculty') && (
                      <Link
                        href="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors no-underline"
                      >
                        <Shield className="w-4 h-4" />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => { handleLogout(); setDropdownOpen(false) }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white/85 hover:text-white hover:bg-white/10 rounded-xl transition-all no-underline border border-white/20"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-black text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all no-underline shadow-lg"
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden sm:block">Register Team</span>
                  <span className="sm:hidden">Join</span>
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileOpen && (
          <div className="lg:hidden bg-[#0d1240] border-t border-white/10 px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'block px-4 py-3 text-sm rounded-xl font-semibold transition-all no-underline',
                  isActive(link.href)
                    ? 'text-white bg-white/15'
                    : 'text-white/75 hover:text-white hover:bg-white/10'
                )}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <Link
                href="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm rounded-xl font-semibold text-white/75 hover:text-white hover:bg-white/10 transition-all no-underline"
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* Overlay for dropdown */}
      {dropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setDropdownOpen(false)}
        />
      )}
    </>
  )
}
