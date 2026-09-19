'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Building2, Rocket, Shield, ShieldAlert } from 'lucide-react';
import { DEMO_PERSONAS, UserRole } from '@/lib/useAuth';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [emailInput, setEmailInput] = useState('msme@sugam.ai');
  const [passwordInput, setPasswordInput] = useState('demo123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleQuickLogin = (role: UserRole) => {
    const persona = DEMO_PERSONAS[role];
    localStorage.setItem('bis-demo-user', JSON.stringify(persona));
    window.dispatchEvent(new Event('bis-auth-change'));
    router.push(`/dashboard/${role}`);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, password: passwordInput, rememberMe: true }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Invalid email or password. Please try again.');
        return;
      }

      localStorage.setItem('bis-demo-user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('bis-auth-change'));

      const role = data.user?.role || 'msme';
      const next = searchParams.get('next') || `/dashboard/${role}`;
      router.push(next);
    } catch (err) {
      setErrorMsg('An unexpected error occurred. Please try again.');
      console.error('Sign-in error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-md w-full bg-white rounded-3xl shadow-sm p-8 border border-slate-200 space-y-5"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <div className="w-13 h-13 bg-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md shadow-teal-700/20">
          <span className="text-white font-black text-xl">SU</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sign In to SUGAM</h1>
        <p className="text-xs text-slate-500 mt-1">
          Simple and secure access to your certification portal
        </p>
      </div>

      {/* 1-Click Persona Quick Logins */}
      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
            Select Your Role to Try Instantly:
          </span>
          <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
            1-Click Demo
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => handleQuickLogin('msme')}
            className="p-2.5 text-left bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition flex items-center gap-2 group cursor-pointer shadow-2xs"
          >
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 font-bold">
              <Building2 className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-slate-900 truncate">
                Factory Owner
              </div>
              <div className="text-[9px] text-slate-400 truncate">MSME Discounts</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('applicant')}
            className="p-2.5 text-left bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition flex items-center gap-2 group cursor-pointer shadow-2xs"
          >
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 font-bold">
              <Rocket className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-slate-900 truncate">
                New Business
              </div>
              <div className="text-[9px] text-slate-400 truncate">First-Time Guide</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('consumer')}
            className="p-2.5 text-left bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition flex items-center gap-2 group cursor-pointer shadow-2xs"
          >
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 font-bold">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-slate-900 truncate">
                Consumer
              </div>
              <div className="text-[9px] text-slate-400 truncate">Check ISI & Fakes</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('officer')}
            className="p-2.5 text-left bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition flex items-center gap-2 group cursor-pointer shadow-2xs"
          >
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 font-bold">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-slate-900 truncate">
                BIS Officer
              </div>
              <div className="text-[9px] text-slate-400 truncate">Review & Approve</div>
            </div>
          </button>
        </div>
      </div>

      <div className="relative flex items-center justify-center">
        <div className="border-t border-slate-200 w-full"></div>
        <span className="bg-white px-2 text-[10px] uppercase font-bold text-slate-400 absolute">
          Or Enter Details
        </span>
      </div>

      {searchParams.get('verified') === 'true' && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold">
          ✓ Email verified successfully! You can now sign in with your email and password.
        </div>
      )}

      {searchParams.get('error') && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
          {searchParams.get('error')}
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
          <input
            name="email"
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            placeholder="msme@sugam.ai"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
          <input
            name="password"
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-teal-600 text-white font-bold py-2.5 px-4 rounded-xl hover:bg-teal-700 transition-all text-xs shadow-xs disabled:opacity-50 mt-1 cursor-pointer"
        >
          {isLoading ? 'Checking...' : 'Sign In with Email'}
        </button>
      </form>

      <p className="text-center text-xs text-slate-600">
        Don't have an account?{' '}
        <Link
          href={searchParams.get('next') ? `/signup?next=${encodeURIComponent(searchParams.get('next')!)}` : '/signup'}
          className="font-bold text-teal-600 hover:underline"
        >
          Create an account
        </Link>
      </p>

      <div className="text-center">
        <Link href="/" className="text-slate-400 hover:text-slate-600 text-xs font-medium">
          ← Back to homepage
        </Link>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-slate-50">
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <Suspense fallback={<div className="text-sm text-slate-500">Loading sign in...</div>}>
          <LoginForm />
        </Suspense>
      </div>

      <div className="hidden lg:flex flex-1 items-center justify-center bg-slate-900 text-white p-12">
        <div className="max-w-lg text-left space-y-6">
          <div className="inline-block px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold">
            SUGAM Portal Access
          </div>
          <h2 className="text-4xl font-extrabold leading-tight">
            Clear, Simple Guidance for Indian Quality Standards
          </h2>
          <p className="text-base text-slate-300 leading-relaxed">
            Personalized tools built specifically for factory owners, new startups, citizens, and quality officers.
          </p>
          <div className="space-y-3 text-xs text-slate-300 pt-2">
            <p className="flex items-center gap-2">✓ <strong>Factory Owners</strong>: License tracking & 80% fee discount</p>
            <p className="flex items-center gap-2">✓ <strong>New Businesses</strong>: 5 easy steps to get your first ISI mark</p>
            <p className="flex items-center gap-2">✓ <strong>Consumers</strong>: Check genuine ISI marks & report fake goods</p>
            <p className="flex items-center gap-2">✓ <strong>Quality Officers</strong>: Application review & factory visit calendar</p>
          </div>
        </div>
      </div>
    </div>
  );
}
