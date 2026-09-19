'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, ArrowRight, RefreshCw, KeyRound } from 'lucide-react';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    role: 'msme',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Email verification state
  const [requiresVerification, setRequiresVerification] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpSuccessMsg, setOtpSuccessMsg] = useState('');
  const [resendStatus, setResendStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
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
          role: formData.role,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Unable to create account. Please try again.');
        return;
      }

      // Check if Supabase email confirmation is required
      if (data.requiresEmailConfirmation) {
        setRequiresVerification(true);
        setRegisteredEmail(formData.email);
        return;
      }

      // Direct login if email confirmation was off
      if (data.user) {
        localStorage.setItem('bis-demo-user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('bis-auth-change'));
        const next = searchParams.get('next') || `/dashboard/${data.user.role || 'msme'}`;
        router.push(next);
      }
    } catch (err) {
      setErrorMsg('Unable to create your account. Please check network and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length < 6) {
      setErrorMsg('Please enter the valid 6-digit code sent to your email');
      return;
    }

    setIsVerifyingOtp(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registeredEmail,
          token: otpCode.trim(),
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Invalid OTP code. Please check your email or click the link in your email.');
        return;
      }

      setOtpSuccessMsg('Email verified successfully! Redirecting to your dashboard...');
      if (data.user) {
        localStorage.setItem('bis-demo-user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('bis-auth-change'));
        setTimeout(() => {
          router.push(`/dashboard/${data.user.role || 'msme'}`);
        }, 1200);
      }
    } catch (err) {
      setErrorMsg('Verification failed. Please check the code and try again.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResend = async () => {
    setResendStatus('Sending another verification email...');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: registeredEmail,
          password: formData.password,
          companyName: formData.company,
          role: formData.role,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResendStatus('A new verification email has been sent!');
      } else {
        setResendStatus(data.error || 'Please wait a few minutes before requesting another email.');
      }
    } catch {
      setResendStatus('Could not resend email. Please check your connection.');
    }
  };

  // Screen 2: Verification Screen
  if (requiresVerification) {
    return (
      <motion.div
        className="max-w-md w-full bg-white rounded-3xl shadow-sm p-8 border border-slate-200"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-teal-200">
            <Mail className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Verify Your Email</h2>
          <p className="text-xs text-slate-500 mt-1">
            We sent a verification link & 6-digit code to:
          </p>
          <p className="text-xs font-bold text-slate-800 bg-slate-100 py-1.5 px-3 rounded-lg mt-2 inline-block border border-slate-200">
            {registeredEmail}
          </p>
        </div>

        {otpSuccessMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{otpSuccessMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {/* Enter 6-digit OTP Code */}
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-teal-600" />
              Enter 6-digit Code from Email
            </label>
            <input
              type="text"
              maxLength={8}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="e.g. 123456"
              className="w-full px-3.5 py-3 border border-slate-300 rounded-xl text-center text-lg font-bold tracking-widest text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={isVerifyingOtp}
            className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-teal-700 transition text-xs shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isVerifyingOtp ? 'Verifying Code...' : 'Verify & Continue'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="relative flex items-center justify-center my-5">
          <div className="border-t border-slate-200 w-full"></div>
          <span className="bg-white px-2 text-[10px] uppercase font-bold text-slate-400 absolute">
            Or Click Email Link
          </span>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2">
          <p className="text-[11px] text-slate-600">
            You can also simply click the <strong>Confirm Email</strong> button inside the email we sent you.
          </p>
          <Link
            href="/login?verified=true"
            className="inline-block text-xs font-bold text-teal-700 hover:underline"
          >
            I clicked the email link ➔ Sign In
          </Link>
        </div>

        {resendStatus && (
          <p className="text-[11px] text-center text-teal-700 font-medium mt-3">
            {resendStatus}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-slate-500 pt-4 mt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleResend}
            className="flex items-center gap-1 text-slate-600 hover:text-teal-700 font-medium cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" /> Resend Email
          </button>

          <button
            type="button"
            onClick={() => setRequiresVerification(false)}
            className="text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
          >
            Change Email
          </button>
        </div>
      </motion.div>
    );
  }

  // Screen 1: Registration Form
  return (
    <motion.div
      className="max-w-md w-full bg-white rounded-3xl shadow-sm p-8 border border-slate-200 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-center">
        <div className="w-13 h-13 bg-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md shadow-teal-700/20">
          <span className="text-white font-black text-xl">SU</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create Your Account</h1>
        <p className="text-xs text-slate-500 mt-1">Get certified and compliant with SUGAM</p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl border border-red-200 bg-red-50 text-xs font-medium text-red-700">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Select Your Role</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white text-slate-800"
          >
            <option value="msme">Factory Owner (MSME Certification & 80% Discounts)</option>
            <option value="applicant">New Business / Startup (First-Time License Guide)</option>
            <option value="consumer">Consumer (Check Genuine Marks & Report Fakes)</option>
            <option value="officer">BIS Quality Officer (Surveillance & Reviews)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            placeholder="e.g. Ramesh Kumar"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Company / Organization (Optional)</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            placeholder="e.g. Bharat Enterprise"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            placeholder="name@company.com"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Confirm</label>
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-teal-700 transition-all text-xs shadow-xs disabled:opacity-50 mt-2 cursor-pointer"
        >
          {isLoading ? 'Creating Account & Sending Email...' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-xs text-slate-600 pt-1">
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <Suspense fallback={<div className="text-sm text-slate-500">Loading sign up...</div>}>
        <SignupForm />
      </Suspense>
    </div>
  );
}
