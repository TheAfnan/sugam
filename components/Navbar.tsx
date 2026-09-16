'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguageStore, LANGUAGES } from '@/lib/store';
import { useAuth } from '@/lib/useAuth';

export default function Navbar() {
  const pathname = usePathname();
  const { activeLanguage, setLanguage } = useLanguageStore();
  const { user, isAuthenticated } = useAuth();

  const navLinks = [
    { href: '/chat', label: 'Chat' },
    { href: '/compare', label: 'Compare' },
    { href: '/guides', label: 'Guides' },
    { href: '/offices', label: 'Offices' },
    { href: '/timeline', label: 'Timeline' },
    { href: '/faq', label: 'FAQ' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 px-6 py-3.5 flex items-center justify-between transition-all">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-teal-600 group-hover:bg-teal-700 rounded-lg flex items-center justify-center transition-colors shadow-sm">
            <span className="text-white font-black text-xs tracking-wider">SU</span>
          </div>
          <span className="font-bold text-gray-900 text-lg tracking-tight">SUGAM</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-teal-600 ${
                  isActive ? 'text-teal-600 font-semibold' : ''
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Language selector */}
        <select
          value={activeLanguage}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.nativeName}
            </option>
          ))}
        </select>

        {isAuthenticated ? (
          <Link
            href="/dashboard"
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700 shadow-sm"
          >
            Dashboard
          </Link>
        ) : (
          <>
            <Link
              href="/login"
              className="text-teal-600 font-medium text-sm hover:underline px-2 py-1"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700 shadow-sm"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
