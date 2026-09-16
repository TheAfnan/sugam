'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          companyName: formData.company,
          companyType: 'individual',
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Unable to create account');
        return;
      }

      localStorage.setItem('bis-demo-user', JSON.stringify(data.user));
      const next = searchParams.get('next') || '/dashboard';
      router.push(next);
    } catch (err) {
      setErrorMsg('Unable to create your account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-gradient-to-br from-teal-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-teal-700/20">
          <span className="text-white font-black text-xl">SU</span>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Create Account</h1>
        <p className="text-xs text-gray-500">Start your journey with SUGAM</p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-3 rounded-xl border border-red-200 bg-red-50 text-xs font-medium text-red-700">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Company (Optional)</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            placeholder="Your company or enterprise"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            placeholder="name@company.com"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
          <input
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            placeholder="Minimum 6 characters"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Confirm Password</label>
          <input
            type="password"
            required
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            placeholder="Re-enter password"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-teal-700 hover:to-emerald-700 transition-all text-sm shadow-md disabled:opacity-50 mt-2"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </motion.button>
      </form>

      <p className="text-center text-xs text-gray-600 mt-6">
        Already have an account?{' '}
        <Link href="/login" className="font-bold text-teal-600 hover:underline">
          Sign In
        </Link>
      </p>
    </motion.div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center px-6 py-12">
      <Suspense fallback={<div className="text-sm text-gray-500">Loading sign up...</div>}>
        <SignupForm />
      </Suspense>
    </div>
  );
}
