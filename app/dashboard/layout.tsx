'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  Calculator,
  Scale,
  FileText,
  MapPin,
  HelpCircle,
  LogOut,
  User as UserIcon,
  ShieldAlert,
  Building2,
  Rocket,
  Shield,
  RefreshCw,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useAuth, UserRole, DEMO_PERSONAS } from '@/lib/useAuth';
import { useLanguageStore, LANGUAGES } from '@/lib/store';

const COMMON_NAV = [
  { label: 'AI Assistant', icon: MessageSquare, href: '/chat' },
  { label: 'Timeline Calculator', icon: Calculator, href: '/timeline' },
  { label: 'Compare Standards', icon: Scale, href: '/compare' },
  { label: 'Industry Guides', icon: FileText, href: '/guides' },
  { label: 'BIS Office Locator', icon: MapPin, href: '/offices' },
  { label: 'FAQ', icon: HelpCircle, href: '/faq' },
];

const ROLE_NAV: Record<UserRole, { label: string; icon: any; href: string; color: string; badge: string }> = {
  msme: {
    label: 'MSME Workspace',
    icon: Building2,
    href: '/dashboard/msme',
    color: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
    badge: 'MSME Manufacturer'
  },
  applicant: {
    label: 'Applicant Launchpad',
    icon: Rocket,
    href: '/dashboard/applicant',
    color: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
    badge: 'First-Time Applicant'
  },
  consumer: {
    label: 'Consumer Center',
    icon: Shield,
    href: '/dashboard/consumer',
    color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
    badge: 'Consumer / Citizen'
  },
  officer: {
    label: 'Officer Scrutiny',
    icon: ShieldAlert,
    href: '/dashboard/officer',
    color: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
    badge: 'BIS Officer'
  },
  admin: {
    label: 'Admin Control',
    icon: LayoutDashboard,
    href: '/dashboard/msme',
    color: 'text-red-400 bg-red-400/10 border-red-400/30',
    badge: 'Administrator'
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, switchRole } = useAuth();
  const { activeLanguage, setLanguage } = useLanguageStore();
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const currentRole: UserRole = user?.role || 'msme';
  const roleConfig = ROLE_NAV[currentRole] || ROLE_NAV.msme;
  const RoleIcon = roleConfig.icon;

  return (
    <div className="h-screen flex bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 flex flex-col border-r border-slate-800/80 shrink-0 select-none z-20">
        
        {/* Brand */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-900/50">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-teal-600 group-hover:bg-teal-500 rounded-xl flex items-center justify-center shadow-md shadow-teal-900/40 transition-colors">
              <span className="text-white font-black text-xs tracking-wider">SU</span>
            </div>
            <div>
              <h1 className="font-extrabold text-base text-white tracking-tight leading-tight">SUGAM-AI</h1>
              <p className="text-[10px] text-teal-400 font-semibold">BIS Compliance Portal</p>
            </div>
          </Link>
        </div>

        {/* Active Role Card & 1-Click Switcher */}
        <div className="p-3 border-b border-slate-800/80 bg-slate-900/30">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Active Persona
            </span>
            <button
              onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
              className="text-[10px] font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1 cursor-pointer"
              title="Switch demo role"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Switch</span>
            </button>
          </div>

          <div 
            onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
            className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${roleConfig.color}`}
          >
            <RoleIcon className="w-4 h-4 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-black truncate">{roleConfig.badge}</div>
              <div className="text-[10px] opacity-80 truncate">{user?.name || 'Demo User'}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 shrink-0 opacity-70" />
          </div>

          {/* Dropdown Role Selector */}
          {showRoleSwitcher && (
            <div className="mt-2 p-2 bg-slate-900 rounded-xl border border-slate-700 shadow-xl space-y-1">
              <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                Select Persona (SIH Demo):
              </div>
              {[
                { role: 'msme', label: 'MSME Manufacturer', icon: Building2 },
                { role: 'applicant', label: 'First-Time Applicant', icon: Rocket },
                { role: 'consumer', label: 'Consumer / Citizen', icon: Shield },
                { role: 'officer', label: 'BIS Technical Officer', icon: ShieldAlert },
              ].map((item) => (
                <button
                  key={item.role}
                  onClick={() => {
                    switchRole(item.role as UserRole);
                    setShowRoleSwitcher(false);
                  }}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-left transition cursor-pointer ${
                    currentRole === item.role
                      ? 'bg-teal-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation List */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {/* Primary Role Portal Button */}
          <div className="mb-2">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 px-3 mb-1">
              My Designated Portal
            </div>
            <Link
              href={roleConfig.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                pathname === roleConfig.href
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                  : 'text-slate-200 bg-slate-900/60 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <RoleIcon size={16} className={pathname === roleConfig.href ? 'text-white' : 'text-teal-400'} />
              <span>{roleConfig.label}</span>
            </Link>
          </div>

          <div className="pt-2">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 px-3 mb-1">
              Standard Compliance Tools
            </div>
            {COMMON_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-800 text-white font-bold'
                      : 'text-slate-400 hover:bg-slate-900/60 hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center justify-between p-2 bg-slate-900 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                {(user?.name || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Demo User'}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email || 'user@sugam.ai'}</p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200/80 px-6 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-500">Bhashini Language:</span>
            <select
              value={activeLanguage}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold text-gray-700 cursor-pointer"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.nativeName} ({l.name})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>BIS Digital Gateway Live</span>
            </div>

            <Link
              href="/chat"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Sparkles size={14} />
              <span>Ask AI Copilot</span>
            </Link>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/70">{children}</main>
      </div>
    </div>
  );
}
