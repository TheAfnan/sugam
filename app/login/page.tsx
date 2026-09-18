'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Building2, Rocket, Shield, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';
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
      className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100 space-y-5"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <div className="w-14 h-14 bg-gradient-to-br from-teal-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md shadow-teal-700/20">
          <span className="text-white font-black text-xl">SU</span>
        </div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Sign In to SUGAM</h1>
        <p className="text-xs text-gray-500 mt-1">
          Role-protected portals for MSMEs, Applicants, Consumers & Officers
        </p>
      </div>

      {/* 1-Click SIH Persona Quick Logins */}
      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
            SIH Evaluation: 1-Click Login
          </span>
          <span className="text-[10px] font-bold text-teal-700 bg-teal-100/60 px-1.5 py-0.5 rounded">
            Instant Test
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => handleQuickLogin('msme')}
            className="p-2 text-left bg-white hover:bg-amber-50/80 border border-slate-200 hover:border-amber-300 rounded-xl transition flex items-center gap-2 group cursor-pointer shadow-2xs"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold">
              <Building2 className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-slate-800 group-hover:text-amber-900 truncate">
                MSME Mfr
              </div>
              <div className="text-[9px] text-slate-400 truncate">License & Subsidy</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('applicant')}
            className="p-2 text-left bg-white hover:bg-blue-50/80 border border-slate-200 hover:border-blue-300 rounded-xl transition flex items-center gap-2 group cursor-pointer shadow-2xs"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 font-bold">
              <Rocket className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-slate-800 group-hover:text-blue-900 truncate">
                Applicant
              </div>
              <div className="text-[9px] text-slate-400 truncate">0-to-1 Wizard</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('consumer')}
            className="p-2 text-left bg-white hover:bg-emerald-50/80 border border-slate-200 hover:border-emerald-300 rounded-xl transition flex items-center gap-2 group cursor-pointer shadow-2xs"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-slate-800 group-hover:text-emerald-900 truncate">
                Consumer
              </div>
              <div className="text-[9px] text-slate-400 truncate">Mark Verify & Care</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('officer')}
            className="p-2 text-left bg-white hover:bg-purple-50/80 border border-slate-200 hover:border-purple-300 rounded-xl transition flex items-center gap-2 group cursor-pointer shadow-2xs"
          >
            <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center shrink-0 font-bold">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-slate-800 group-hover:text-purple-900 truncate">
                BIS Officer
              </div>
              <div className="text-[9px] text-slate-400 truncate">Scrutiny & Raids</div>
            </div>
          </button>
        </div>
      </div>

      <div className="relative flex items-center justify-center">
        <div className="border-t border-gray-200 w-full"></div>
        <span className="bg-white px-2 text-[10px] uppercase font-bold text-gray-400 absolute">
          Or Enter Credentials
        </span>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
          <input
            name="email"
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            placeholder="msme@sugam.ai"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
          <input
            name="password"
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            placeholder="••••••••"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold py-2.5 px-4 rounded-xl hover:from-teal-700 hover:to-emerald-700 transition-all text-xs shadow-md disabled:opacity-50 mt-1 cursor-pointer"
        >
          {isLoading ? 'Authenticating...' : 'Sign In with Credentials'}
        </motion.button>
      </form>

      <p className="text-center text-xs text-gray-600">
        Don't have an account?{' '}
        <Link
          href={searchParams.get('next') ? `/signup?next=${encodeURIComponent(searchParams.get('next')!)}` : '/signup'}
          className="font-bold text-teal-600 hover:underline"
        >
          Create an account
        </Link>
      </p>

      <div className="text-center">
        <Link href="/" className="text-gray-400 hover:text-gray-600 text-xs font-medium">
          ← Back to homepage
        </Link>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-teal-50 to-emerald-50 p-6 md:p-10">
        <Suspense fallback={<div className="text-sm text-gray-500">Loading sign in...</div>}>
          <LoginForm />
        </Suspense>
      </div>

      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-teal-700 to-emerald-900 text-white p-12">
        <div className="max-w-lg text-left space-y-6">
          <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-teal-200 text-xs font-semibold backdrop-blur-md">
            National Standards AI Assistant
          </div>
          <h2 className="text-4xl font-extrabold leading-tight">
            Role-Based Access for India's Quality Ecosystem
          </h2>
          <p className="text-base text-teal-100/90 leading-relaxed">
            Strict separation between regulated MSMEs, First-Time Startups, Citizens, and BIS Technical Officers.
          </p>
          <div className="space-y-3 text-xs text-teal-100 pt-4">
            <p className="flex items-center gap-2">✓ <strong>MSME Workspace</strong>: CM/L license tracking & subsidy calculator</p>
            <p className="flex items-center gap-2">✓ <strong>Applicant Launchpad</strong>: 0-to-1 Step-by-step readiness score</p>
            <p className="flex items-center gap-2">✓ <strong>Consumer Safety</strong>: BIS Care citizen reporting & mark verifier</p>
            <p className="flex items-center gap-2">✓ <strong>BIS Officer Scrutiny</strong>: Dossier approval queue & raid logs</p>
          </div>
        </div>
      </div>
    </div>
  );
}
