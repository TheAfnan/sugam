'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle, ArrowRight, RefreshCw, KeyRound, MessageSquare, ShieldCheck } from 'lucide-react';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verificationMethod, setVerificationMethod] = useState<'email' | 'whatsapp'>('whatsapp');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    company: '',
    role: 'msme',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Email/WhatsApp verification state
  const [requiresVerification, setRequiresVerification] = useState(false);
  const [registeredIdentifier, setRegisteredIdentifier] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpSuccessMsg, setOtpSuccessMsg] = useState('');
  const [resendStatus, setResendStatus] = useState('');
  
  // WhatsApp / Instant simulated notification
  const [showWhatsAppToast, setShowWhatsAppToast] = useState(false);
  const [simulatedOtpCode, setSimulatedOtpCode] = useState('');

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

    // If WhatsApp method selected
    if (verificationMethod === 'whatsapp') {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setSimulatedOtpCode(generatedOtp);
      setRegisteredIdentifier(formData.phone ? `+91 ${formData.phone}` : formData.email);
      setRequiresVerification(true);
      setShowWhatsAppToast(true);
      setIsLoading(false);
      return;
    }

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

      // Check if Supabase email confirmation or rate-limited OTP is required
      if (data.requiresEmailConfirmation) {
        setRequiresVerification(true);
        setRegisteredIdentifier(formData.email);
        if (data.simulatedOtp) {
          setSimulatedOtpCode(data.simulatedOtp);
          setShowWhatsAppToast(true);
        }
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
    const cleanOtp = otpCode.trim();
    if (!cleanOtp || cleanOtp.length < 6) {
      setErrorMsg('Please enter the valid 6-digit code');
      return;
    }

    setIsVerifyingOtp(true);
    setErrorMsg('');

    try {
      const targetEmail = formData.email || `${formData.phone || 'user'}@sugam.ai`;
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail,
          token: cleanOtp,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Invalid OTP code. Please check the code.');
        return;
      }

      setOtpSuccessMsg('Verified successfully! Redirecting to your dashboard...');
      if (data.user) {
        // Save user and trigger role dashboard
        data.user.role = formData.role || data.user.role || 'msme';
        localStorage.setItem('bis-demo-user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('bis-auth-change'));
        setTimeout(() => {
          router.push(`/dashboard/${formData.role || data.user.role || 'msme'}`);
        }, 1200);
      }
    } catch (err) {
      setErrorMsg('Verification failed. Please check the code and try again.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResend = async () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setSimulatedOtpCode(newOtp);
    setShowWhatsAppToast(true);
    setResendStatus('New 6-digit OTP sent to your WhatsApp/Email!');
  };

  return (
    <>
      {/* Realistic WhatsApp Notification Pop-up Dropdown */}
      <AnimatePresence>
        {showWhatsAppToast && simulatedOtpCode && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white rounded-2xl shadow-2xl p-4 border border-emerald-500/60 max-w-sm w-[92%] flex items-start gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/30">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-emerald-400 flex items-center gap-1">
                  WhatsApp • SUGAM Portal
                </span>
                <span className="text-[10px] text-slate-400">just now</span>
              </div>
              <p className="text-slate-200 text-[11px] leading-relaxed">
                Your 6-digit official verification code is:
              </p>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="bg-emerald-950/80 text-emerald-300 font-mono font-bold text-base px-2.5 py-1 rounded-lg border border-emerald-500/40 tracking-widest">
                  {simulatedOtpCode}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setOtpCode(simulatedOtpCode);
                    setShowWhatsAppToast(false);
                  }}
                  className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
                >
                  Auto-fill code ➔
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen 2: Verification Screen */}
      {requiresVerification ? (
        <motion.div
          className="max-w-md w-full bg-white rounded-3xl shadow-sm p-8 border border-slate-200"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-center mb-6">
            <div className={`w-14 h-14 ${verificationMethod === 'whatsapp' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-teal-50 text-teal-600 border-teal-200'} rounded-2xl flex items-center justify-center mx-auto mb-3 border`}>
              {verificationMethod === 'whatsapp' ? (
                <MessageSquare className="w-7 h-7" />
              ) : (
                <Mail className="w-7 h-7" />
              )}
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {verificationMethod === 'whatsapp' ? 'Verify WhatsApp OTP' : 'Verify Your Email'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Verification code sent to:
            </p>
            <p className="text-xs font-bold text-slate-800 bg-slate-100 py-1.5 px-3 rounded-lg mt-2 inline-block border border-slate-200">
              {registeredIdentifier}
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

          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-teal-600" />
                  Enter 6-Digit OTP Code
                </span>
                {simulatedOtpCode && (
                  <button
                    type="button"
                    onClick={() => setOtpCode(simulatedOtpCode)}
                    className="text-[10px] text-teal-600 font-bold hover:underline cursor-pointer"
                  >
                    Paste {simulatedOtpCode}
                  </button>
                )}
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="••••••"
                className="w-full px-3.5 py-3 border border-slate-300 rounded-xl text-center text-xl font-bold tracking-widest text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={isVerifyingOtp}
              className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-teal-700 transition text-xs shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isVerifyingOtp ? 'Verifying Code...' : 'Verify & Enter Dashboard'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {resendStatus && (
            <p className="text-[11px] text-center text-emerald-700 font-medium mt-3">
              {resendStatus}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-slate-500 pt-4 mt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleResend}
              className="flex items-center gap-1 text-slate-600 hover:text-teal-700 font-medium cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Resend OTP
            </button>

            <button
              type="button"
              onClick={() => {
                setRequiresVerification(false);
                setShowWhatsAppToast(false);
              }}
              className="text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
            >
              Change Details
            </button>
          </div>
        </motion.div>
      ) : (
        /* Screen 1: Registration Form with WhatsApp & Email options */
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

          {/* Verification Channel Selector */}
          <div className="p-1 bg-slate-100 rounded-xl grid grid-cols-2 gap-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setVerificationMethod('whatsapp')}
              className={`py-2 px-3 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                verificationMethod === 'whatsapp'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              WhatsApp OTP (Fast)
            </button>
            <button
              type="button"
              onClick={() => setVerificationMethod('email')}
              className={`py-2 px-3 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                verificationMethod === 'email'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              Email Link / OTP
            </button>
          </div>

          {verificationMethod === 'whatsapp' && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Instant 6-digit OTP will be sent directly via <strong>WhatsApp</strong>.</span>
            </div>
          )}

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

            {verificationMethod === 'whatsapp' ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Mobile Number</label>
                <div className="flex gap-2">
                  <span className="inline-flex items-center px-3 rounded-xl border border-slate-300 bg-slate-100 text-slate-600 text-xs font-bold">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                    className="flex-1 px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="98765 43210"
                  />
                </div>
              </div>
            ) : null}

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
              className={`w-full ${
                verificationMethod === 'whatsapp'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-teal-600 hover:bg-teal-700'
              } text-white font-bold py-3 px-4 rounded-xl transition-all text-xs shadow-xs disabled:opacity-50 mt-2 cursor-pointer flex items-center justify-center gap-2`}
            >
              {isLoading ? (
                'Processing...'
              ) : verificationMethod === 'whatsapp' ? (
                <>
                  <MessageSquare className="w-4 h-4" />
                  Send WhatsApp OTP & Register
                </>
              ) : (
                'Send Verification Email'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-600 pt-1">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-teal-600 hover:underline">
              Sign In
            </Link>
          </p>
        </motion.div>
      )}
    </>
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
