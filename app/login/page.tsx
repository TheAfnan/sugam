'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe: true }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Invalid email or password. Please try again.');
        return;
      }

      localStorage.setItem(
        'bis-demo-user',
        JSON.stringify({
          id: data.user?.id,
          email: data.user?.email,
          name: data.user?.name,
          role: data.user?.role,
        })
      );

      const next = searchParams.get('next') || '/dashboard';
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
      className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-gradient-to-br from-teal-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-teal-700/20">
          <span className="text-white font-black text-xl">SU</span>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1.5">Welcome to SUGAM</h1>
        <p className="text-xs text-gray-500">
          Sign in to access your personalized certification portal
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
          <input
            name="email"
            type="email"
            defaultValue="demo@bis-assistant.com"
            required
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            placeholder="name@company.com"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password</label>
          <input
            name="password"
            type="password"
            defaultValue="demo123"
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
          className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-teal-700 hover:to-emerald-700 transition-all text-sm shadow-md disabled:opacity-50 mt-2"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </motion.button>
      </form>

      <div className="text-center text-xs text-gray-400 mt-5 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
        <p>Demo credentials: <strong className="text-gray-700">demo@bis-assistant.com</strong> / <strong className="text-gray-700">demo123</strong></p>
      </div>

      <p className="text-center text-xs text-gray-600 mt-6">
        Don't have an account?{' '}
        <Link
          href={searchParams.get('next') ? `/signup?next=${encodeURIComponent(searchParams.get('next')!)}` : '/signup'}
          className="font-bold text-teal-600 hover:underline"
        >
          Create an account
        </Link>
      </p>

      <div className="mt-6 text-center">
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
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-teal-50 to-emerald-50 p-8">
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
            Your BIS Certification Journey Starts Here
          </h2>
          <p className="text-base text-teal-100/90 leading-relaxed">
            Get instant access to Indian Standards, certification roadmap, laboratory contacts, timelines, and costs — all in one platform.
          </p>
          <div className="space-y-3 text-xs text-teal-100 pt-4">
            <p className="flex items-center gap-2">✓ Verified IS standards database</p>
            <p className="flex items-center gap-2">✓ Intelligent multi-lingual chat in 11 Indian languages</p>
            <p className="flex items-center gap-2">✓ Cost & Timeline estimation engines</p>
          </div>
        </div>
      </div>
    </div>
  );
}
