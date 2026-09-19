'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, CheckCircle2, ArrowRight, RefreshCw, KeyRound,
  MessageSquare, Mail, Building2, Rocket, ShieldAlert,
  X, Eye, EyeOff, Check
} from 'lucide-react';
import { DEMO_PERSONAS, UserRole } from '@/lib/useAuth';

interface CleanBisAuthProps {
  initialMode?: 'signin' | 'signup';
  isModal?: boolean;
  onClose?: () => void;
}

export default function GithubBisAuth({
  initialMode = 'signin',
  isModal = false,
  onClose,
}: CleanBisAuthProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Mode: 'signin' | 'signup'
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [verificationChannel, setVerificationChannel] = useState<'whatsapp' | 'email'>('whatsapp');
  
  // Sign In inputs
  const [loginEmail, setLoginEmail] = useState('msme@sugam.ai');
  const [loginPassword, setLoginPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);

  // Sign Up inputs
  const [name, setName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState<UserRole>('msme');
  const [company, setCompany] = useState('');

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successBanner, setSuccessBanner] = useState('');

  // Verification step
  const [isVerifying, setIsVerifying] = useState(false);
  const [registeredTarget, setRegisteredTarget] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isSubmittingOtp, setIsSubmittingOtp] = useState(false);

  // WhatsApp Simulated Notification
  const [showWhatsAppNotification, setShowWhatsAppNotification] = useState(false);
  const [activeSimulatedOtp, setActiveSimulatedOtp] = useState('');

  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      setSuccessBanner('Email verified successfully! You can now sign in.');
    }
  }, [searchParams]);

  // Quick 1-Click login for judges
  const handlePersonaLogin = (role: UserRole) => {
    const persona = DEMO_PERSONAS[role];
    localStorage.setItem('bis-demo-user', JSON.stringify(persona));
    window.dispatchEvent(new Event('bis-auth-change'));
    if (onClose) onClose();
    router.push(`/dashboard/${role}`);
  };

  // Sign In submit
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Invalid email or password. Please try again.');
        return;
      }

      localStorage.setItem('bis-demo-user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('bis-auth-change'));
      if (onClose) onClose();
      const nextRole = data.user?.role || 'msme';
      const nextUrl = searchParams.get('next') || `/dashboard/${nextRole}`;
      router.push(nextUrl);
    } catch (err) {
      setErrorMsg('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Sign Up submit
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    // Fast WhatsApp simulation
    if (verificationChannel === 'whatsapp') {
      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      setActiveSimulatedOtp(generatedCode);
      setRegisteredTarget(phone ? `+91 ${phone}` : signupEmail);
      setIsVerifying(true);
      setShowWhatsAppNotification(true);
      setIsLoading(false);
      return;
    }

    // Official Email verification (Resend)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email: signupEmail,
          password: signupPassword,
          companyName: company,
          role: signupRole,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Registration failed. Please check details.');
        return;
      }

      if (data.requiresEmailConfirmation) {
        setRegisteredTarget(signupEmail);
        setIsVerifying(true);
        if (data.simulatedOtp) {
          setActiveSimulatedOtp(data.simulatedOtp);
          setShowWhatsAppNotification(true);
        }
        return;
      }

      if (data.user) {
        localStorage.setItem('bis-demo-user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('bis-auth-change'));
        if (onClose) onClose();
        router.push(`/dashboard/${data.user.role || 'msme'}`);
      }
    } catch (err) {
      setErrorMsg('Unable to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // OTP Verification
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim().length < 6) {
      setErrorMsg('Please enter the 6-digit code');
      return;
    }

    setIsSubmittingOtp(true);
    setErrorMsg('');

    try {
      const targetEmail = signupEmail || `${phone || 'user'}@sugam.ai`;
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail,
          token: otpCode.trim(),
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Invalid OTP code.');
        return;
      }

      if (data.user) {
        data.user.role = signupRole;
        localStorage.setItem('bis-demo-user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('bis-auth-change'));
        if (onClose) onClose();
        router.push(`/dashboard/${signupRole}`);
      }
    } catch (err) {
      setErrorMsg('Verification failed. Try again.');
    } finally {
      setIsSubmittingOtp(false);
    }
  };

  return (
    <div className={`relative ${isModal ? 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm' : 'w-full min-h-screen flex items-center justify-center p-4 md:p-8 bg-slate-100'}`}>
      
      {/* WhatsApp Simulated Top Toast Notification */}
      <AnimatePresence>
        {showWhatsAppNotification && activeSimulatedOtp && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] bg-white text-slate-800 rounded-2xl shadow-xl p-4 border border-emerald-200 max-w-sm w-[92%] flex items-start gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="flex-1 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  WhatsApp • SUGAM Portal
                </span>
                <span className="text-[10px] text-slate-400">Just now</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                Your 6-digit verification code is:
              </p>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="bg-emerald-50 text-emerald-800 font-bold text-base px-2.5 py-0.5 rounded-lg border border-emerald-200 tracking-widest font-mono">
                  {activeSimulatedOtp}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setOtpCode(activeSimulatedOtp);
                    setShowWhatsAppNotification(false);
                  }}
                  className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 underline cursor-pointer"
                >
                  Auto-fill code ➔
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Clean Card */}
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative text-slate-800">
        
        {/* Close Button if Modal */}
        {isModal && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* LEFT PANEL: Clean Navy Official BIS Branding (5 cols) */}
        <div className="lg:col-span-5 bg-[#0b1739] text-white p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 relative">
          <div>
            {/* National Crest / Header */}
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/30">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight text-white">SUGAM</h2>
                <p className="text-[11px] text-blue-200 font-medium">मानक सेतु • BIS Portal</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Official Indian Quality Standards and Certification Gateway by the Bureau of Indian Standards.
            </p>

            {/* Clean 3D BIS Quality Badge */}
            <div className="my-6 p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex flex-col items-center justify-center font-black shadow-lg shadow-amber-500/20 shrink-0">
                <span className="text-xs tracking-tight">ISI</span>
                <span className="text-[8px] font-semibold uppercase">Mark</span>
              </div>
              <div>
                <div className="text-xs font-bold text-white">मानकः पथप्रदर्शकः</div>
                <div className="text-[10px] text-slate-300">Standards Guide the Nation</div>
                <div className="text-[10px] text-emerald-400 font-medium mt-0.5 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Verified Quality Assurance
                </div>
              </div>
            </div>
          </div>

          {/* Quick Role Tester for Judges */}
          <div className="space-y-2 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between text-[11px] text-slate-300 font-bold">
              <span>Try Instant Role Portals:</span>
              <span className="text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded text-[10px]">1-Click Demo</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handlePersonaLogin('msme')}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-left transition flex items-center gap-2 cursor-pointer group"
              >
                <Building2 className="w-4 h-4 text-blue-300 group-hover:scale-105 transition" />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">Factory Owner</div>
                  <div className="text-[10px] text-slate-300 truncate">80% Discount</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handlePersonaLogin('applicant')}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-left transition flex items-center gap-2 cursor-pointer group"
              >
                <Rocket className="w-4 h-4 text-emerald-300 group-hover:scale-105 transition" />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">New Startup</div>
                  <div className="text-[10px] text-slate-300 truncate">First-Time Guide</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handlePersonaLogin('consumer')}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-left transition flex items-center gap-2 cursor-pointer group"
              >
                <Shield className="w-4 h-4 text-cyan-300 group-hover:scale-105 transition" />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">Consumer</div>
                  <div className="text-[10px] text-slate-300 truncate">Check ISI Mark</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handlePersonaLogin('officer')}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-left transition flex items-center gap-2 cursor-pointer group"
              >
                <ShieldAlert className="w-4 h-4 text-amber-300 group-hover:scale-105 transition" />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">BIS Officer</div>
                  <div className="text-[10px] text-slate-300 truncate">Audit & Review</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Clean, Friendly Form (7 cols) */}
        <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-center bg-white">
          
          {/* Clean Tab Switcher: Sign In vs Create Account */}
          <div className="flex items-center gap-6 border-b border-slate-200 pb-3 mb-5">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setIsVerifying(false);
                setErrorMsg('');
              }}
              className={`text-sm font-bold pb-2 transition cursor-pointer relative ${
                mode === 'signin'
                  ? 'text-blue-600 border-b-2 border-blue-600 -mb-[13px]'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setIsVerifying(false);
                setErrorMsg('');
              }}
              className={`text-sm font-bold pb-2 transition cursor-pointer relative ${
                mode === 'signup'
                  ? 'text-blue-600 border-b-2 border-blue-600 -mb-[13px]'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Success Banner */}
          {successBanner && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successBanner}</span>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* VIEW A: VERIFICATION STEP (If OTP / Email sent) */}
          {isVerifying ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block mb-1">
                  Verification Required
                </span>
                <h3 className="text-base font-bold text-slate-900">Enter 6-Digit Code</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Verification code has been sent to: <strong className="text-slate-800">{registeredTarget}</strong>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5 font-medium">
                    <span>6-Digit Code:</span>
                    {activeSimulatedOtp && (
                      <button
                        type="button"
                        onClick={() => setOtpCode(activeSimulatedOtp)}
                        className="text-blue-600 font-bold hover:underline cursor-pointer"
                      >
                        Auto-fill: {activeSimulatedOtp}
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••••"
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-center text-2xl font-bold tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingOtp}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingOtp ? 'Verifying...' : 'Verify & Enter Dashboard ➔'}
                </button>
              </form>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
                    setActiveSimulatedOtp(newOtp);
                    setShowWhatsAppNotification(true);
                  }}
                  className="hover:text-blue-600 flex items-center gap-1 cursor-pointer font-medium"
                >
                  <RefreshCw className="w-3 h-3" /> Resend Code
                </button>
                <button
                  type="button"
                  onClick={() => setIsVerifying(false)}
                  className="hover:text-slate-800 cursor-pointer font-medium"
                >
                  Change Email / Phone
                </button>
              </div>
            </div>
          ) : mode === 'signin' ? (
            /* VIEW B: CLEAN SIGN IN FORM */
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="msme@sugam.ai"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>Password</span>
                  <span className="text-[11px] text-slate-400 font-normal">Demo: demo123</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {isLoading ? 'Signing In...' : 'Sign In to Portal ➔'}
              </button>

              <div className="text-center pt-2 text-xs text-slate-500">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-blue-600 hover:underline font-bold cursor-pointer"
                >
                  Create an account
                </button>
              </div>
            </form>
          ) : (
            /* VIEW C: CLEAN CREATE ACCOUNT FORM */
            <form onSubmit={handleSignUp} className="space-y-3">
              
              {/* Verification Channel Selector */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setVerificationChannel('whatsapp')}
                  className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition ${
                    verificationChannel === 'whatsapp'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" /> WhatsApp OTP
                </button>
                <button
                  type="button"
                  onClick={() => setVerificationChannel('email')}
                  className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition ${
                    verificationChannel === 'email'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" /> Email Link / OTP
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Your Role
                </label>
                <select
                  value={signupRole}
                  onChange={(e) => setSignupRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="msme">Factory Owner (MSME 80% Fee Discount)</option>
                  <option value="applicant">New Business / Startup (First-Time License)</option>
                  <option value="consumer">Consumer (Verify ISI Mark & Report Fakes)</option>
                  <option value="officer">BIS Quality Officer (Surveillance & Reviews)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ramesh Sharma"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Enterprise (Optional)
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Bharat Enterprise"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {verificationChannel === 'whatsapp' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp Mobile Number
                  </label>
                  <div className="flex gap-2">
                    <span className="px-3 py-2 bg-slate-100 border border-slate-300 text-slate-600 font-bold text-xs rounded-xl flex items-center">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="98765 43210"
                      className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              ) : null}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password (Minimum 6 characters)
                </label>
                <input
                  type="password"
                  required
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 ${
                  verificationChannel === 'whatsapp'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1`}
              >
                {isLoading ? (
                  'Processing...'
                ) : verificationChannel === 'whatsapp' ? (
                  <>
                    <MessageSquare className="w-3.5 h-3.5" />
                    Send WhatsApp OTP & Register
                  </>
                ) : (
                  <>
                    <Mail className="w-3.5 h-3.5" />
                    Send Verification Email
                  </>
                )}
              </button>

              <div className="text-center pt-2 text-xs text-slate-500">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-blue-600 hover:underline font-bold cursor-pointer"
                >
                  Sign in here
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
