'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  Search,
  Calculator,
  Scale,
  FileText,
  Bookmark,
  MapPin,
  HelpCircle,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '@/lib/useAuth';
import { useLanguageStore, LANGUAGES } from '@/lib/store';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'AI Assistant', icon: MessageSquare, href: '/chat' },
  { label: 'Timeline Calculator', icon: Calculator, href: '/timeline' },
  { label: 'Compare Standards', icon: Scale, href: '/compare' },
  { label: 'Industry Guides', icon: FileText, href: '/guides' },
  { label: 'BIS Office Locator', icon: MapPin, href: '/offices' },
  { label: 'FAQ', icon: HelpCircle, href: '/faq' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { activeLanguage, setLanguage } = useLanguageStore();

  return (
    <div className="h-screen flex bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-emerald-950 flex flex-col border-r border-emerald-900/60 shrink-0">
        {/* Brand */}
        <div className="p-5 border-b border-emerald-900/60">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-teal-600 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-black text-xs tracking-wider">SU</span>
            </div>
            <div>
              <h1 className="font-extrabold text-base text-white tracking-tight">SUGAM</h1>
              <p className="text-[11px] text-teal-300/80 font-medium">Standards Portal</p>
            </div>
          </Link>
        </div>

        {/* Nav list */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-emerald-100/70 hover:bg-emerald-900/50 hover:text-white'
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-emerald-900/60 bg-emerald-950/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-teal-700/80 text-white flex items-center justify-center font-bold text-xs">
                <UserIcon size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Demo User'}</p>
                <p className="text-[10px] text-teal-300/70 truncate">{user?.email || 'demo@sugam.ai'}</p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-emerald-300/60 hover:text-white rounded-lg hover:bg-emerald-900 transition-colors"
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
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500">Language:</span>
            <select
              value={activeLanguage}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-2.5 py-1 text-xs border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-gray-700 cursor-pointer"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.nativeName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/chat"
              className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              Start Chat
            </Link>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
