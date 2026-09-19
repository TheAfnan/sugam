'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, CheckCircle2, ArrowRight, RefreshCw, KeyRound,
  MessageSquare, Mail, Building2, Rocket, ShieldAlert,
  Sparkles, Terminal, Lock, UserCheck, X, ChevronRight, Eye, EyeOff
} from 'lucide-react';
import { DEMO_PERSONAS, UserRole } from '@/lib/useAuth';

interface GithubBisAuthProps {
  initialMode?: 'signin' | 'signup';
  isModal?: boolean;
  onClose?: () => void;
}

export default function GithubBisAuth({
  initialMode = 'signin',
  isModal = false,
  onClose,
}: GithubBisAuthProps) {
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

  // 3D Tilt Effect State
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  // WhatsApp Simulated Notification
  const [showWhatsAppNotification, setShowWhatsAppNotification] = useState(false);
  const [activeSimulatedOtp, setActiveSimulatedOtp] = useState('');

  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      setSuccessBanner('✓ Official Email Verified! Sign in with your credentials.');
    }
  }, [searchParams]);

  // Handle 3D card tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotateX(-y * 0.05);
    setRotateY(x * 0.05);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

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
        setErrorMsg(data.error || 'Invalid credentials. Please verify your details.');
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
      setErrorMsg('Enter valid 6-digit code');
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
    <div className={`relative ${isModal ? 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md' : 'w-full min-h-screen flex items-center justify-center p-4 md:p-8 bg-[#0a0d12]'}`}>
      {/* WhatsApp Simulated Top Toast Notification */}
      <AnimatePresence>
        {showWhatsAppNotification && activeSimulatedOtp && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] bg-[#161b22] text-white rounded-2xl shadow-2xl p-4 border border-emerald-500/50 max-w-sm w-[92%] flex items-start gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-bold text-emerald-400">WhatsApp • BIS SUGAM</span>
                <span className="text-[10px] text-slate-400">now</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                Your official 6-digit verification code is:
              </p>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="bg-emerald-950/90 text-emerald-300 font-mono font-black text-sm px-2.5 py-0.5 rounded border border-emerald-500/40 tracking-widest">
                  {activeSimulatedOtp}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setOtpCode(activeSimulatedOtp);
                    setShowWhatsAppNotification(false);
                  }}
                  className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
                >
                  Auto-fill code ➔
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Glassmorphic GitHub-style Container */}
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX, rotateY }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        style={{ perspective: 1000 }}
        className="w-full max-w-4xl bg-[#0d1117] border border-slate-800/80 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative text-slate-200"
      >
        {/* Close Button if opened as Modal */}
        {isModal && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* LEFT COLUMN: 3D Holographic BIS Seal & National Standard Crest (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#161b22] via-[#0d1117] to-[#0b0e14] p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 relative overflow-hidden">
          {/* Ambient Glow Orbs */}
          <div className="absolute -top-16 -left-16 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Top Branding & Terminal Tag */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-[10px] tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded-md flex items-center gap-1.5">
                <Terminal className="w-3 h-3" /> GOVT.OF.INDIA // BIS-SECURE-AUTH
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              SUGAM <span className="text-teal-400 font-normal text-sm font-mono">// सेतु</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              National Bureau of Indian Standards Unified Quality & Certification Access Gateway
            </p>
          </div>

          {/* Center: 3D Interactive BIS Quality Seal */}
          <div className="my-8 flex flex-col items-center justify-center relative group cursor-pointer">
            {/* Rotating Orbit Ring */}
            <div className="w-44 h-44 rounded-full border border-teal-500/20 border-dashed animate-spin-slow absolute inset-0 m-auto pointer-events-none"></div>
            
            {/* 3D Gold / Teal Shield Container */}
            <motion.div
              whileHover={{ scale: 1.05, rotateZ: 2 }}
              className="w-36 h-36 rounded-3xl bg-gradient-to-br from-slate-800 via-teal-950 to-slate-900 border-2 border-teal-500/40 shadow-xl shadow-teal-950/50 flex flex-col items-center justify-center relative p-3 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 flex items-center justify-center shadow-lg shadow-teal-500/30 mb-2 font-black text-xl">
                IS
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-white">
                मानकः पथप्रदर्शकः
              </span>
              <span className="text-[8px] font-mono text-teal-400/90 tracking-tighter mt-0.5">
                STANDARDS GUIDEPOST
              </span>
              <div className="mt-1 flex items-center gap-1 text-[8px] font-mono text-emerald-400">
                <Shield className="w-2.5 h-2.5" /> ISI VERIFIED
              </div>
            </motion.div>
          </div>

          {/* Bottom Hackathon 1-Click Demo Personas */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>EVALUATOR QUICK ACCESS:</span>
              <span className="text-teal-400 font-bold">1-CLICK</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => handlePersonaLogin('msme')}
                className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-teal-500/50 text-left transition flex items-center gap-2 cursor-pointer group"
              >
                <Building2 className="w-3.5 h-3.5 text-teal-400 group-hover:scale-110 transition" />
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-white truncate">Factory Owner</div>
                  <div className="text-[9px] text-slate-400 truncate">MSME 80% Off</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handlePersonaLogin('applicant')}
                className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-teal-500/50 text-left transition flex items-center gap-2 cursor-pointer group"
              >
                <Rocket className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition" />
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-white truncate">New Startup</div>
                  <div className="text-[9px] text-slate-400 truncate">First-Time ISI</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handlePersonaLogin('consumer')}
                className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-teal-500/50 text-left transition flex items-center gap-2 cursor-pointer group"
              >
                <Shield className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition" />
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-white truncate">Citizen</div>
                  <div className="text-[9px] text-slate-400 truncate">Verify ISI Mark</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handlePersonaLogin('officer')}
                className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-teal-500/50 text-left transition flex items-center gap-2 cursor-pointer group"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition" />
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-white truncate">BIS Officer</div>
                  <div className="text-[9px] text-slate-400 truncate">Inspect & Audit</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: GitHub-style Sleek Auth Terminal (7 cols) */}
        <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-center bg-[#0d1117]">
          {/* GitHub Tab Switcher: Sign In vs Create Account */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setIsVerifying(false);
                  setErrorMsg('');
                }}
                className={`text-xs font-mono font-bold pb-2 transition cursor-pointer relative ${
                  mode === 'signin'
                    ? 'text-white border-b-2 border-teal-500 -mb-[13px]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                $ git auth --signin
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setIsVerifying(false);
                  setErrorMsg('');
                }}
                className={`text-xs font-mono font-bold pb-2 transition cursor-pointer relative ml-4 ${
                  mode === 'signup'
                    ? 'text-white border-b-2 border-emerald-500 -mb-[13px]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                $ git auth --create-account
              </button>
            </div>

            <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
              SSH-256 SECURE
            </span>
          </div>

          {/* Success Banner */}
          {successBanner && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successBanner}</span>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-mono">
              [!] {errorMsg}
            </div>
          )}

          {/* VIEW A: VERIFICATION STEP (If OTP / Email sent) */}
          {isVerifying ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="font-mono text-[10px] text-teal-400 uppercase tracking-widest block mb-1">
                  SECURITY HANDSHAKE PENDING
                </span>
                <h3 className="text-base font-bold text-white">Enter 6-Digit Verification Token</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Confirmation code dispatched to: <strong className="text-white">{registeredTarget}</strong>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
                    <span>TOKEN INPUT:</span>
                    {activeSimulatedOtp && (
                      <button
                        type="button"
                        onClick={() => setOtpCode(activeSimulatedOtp)}
                        className="text-emerald-400 font-bold hover:underline cursor-pointer"
                      >
                        Auto-Paste: {activeSimulatedOtp}
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••••"
                    className="w-full px-4 py-3 bg-[#161b22] border border-slate-700 rounded-xl text-center text-2xl font-mono font-bold tracking-widest text-emerald-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingOtp}
                  className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-500 text-white font-mono font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingOtp ? 'VERIFYING TOKEN...' : 'CONFIRM IDENTITY & PROCEED ➔'}
                </button>
              </form>

              <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-3 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => {
                    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
                    setActiveSimulatedOtp(newOtp);
                    setShowWhatsAppNotification(true);
                  }}
                  className="hover:text-teal-400 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" /> Resend Token
                </button>
                <button
                  type="button"
                  onClick={() => setIsVerifying(false)}
                  className="hover:text-slate-300 cursor-pointer"
                >
                  Edit Information
                </button>
              </div>
            </motion.div>
          ) : mode === 'signin' ? (
            /* VIEW B: SIGN IN FORM */
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleSignIn}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  USER_IDENTITY // EMAIL
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="msme@sugam.ai"
                  className="w-full px-3.5 py-2.5 bg-[#161b22] border border-slate-700/80 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 placeholder-slate-600"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
                  <span>SECRET_KEY // PASSWORD</span>
                  <span className="text-[10px] text-slate-500">demo: demo123</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 bg-[#161b22] border border-slate-700/80 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 placeholder-slate-600 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-500 text-white font-mono font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {isLoading ? 'AUTHENTICATING...' : 'AUTHENTICATE USER ➔'}
              </button>

              <div className="text-center pt-2 text-xs text-slate-500 font-mono">
                First time exploring?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-teal-400 hover:underline font-bold cursor-pointer"
                >
                  Create verified profile
                </button>
              </div>
            </motion.form>
          ) : (
            /* VIEW C: CREATE ACCOUNT FORM */
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleSignUp}
              className="space-y-3"
            >
              {/* Verification Channel Selector */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-[#161b22] border border-slate-800 rounded-xl text-xs font-mono font-bold">
                <button
                  type="button"
                  onClick={() => setVerificationChannel('whatsapp')}
                  className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition ${
                    verificationChannel === 'whatsapp'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" /> WhatsApp OTP
                </button>
                <button
                  type="button"
                  onClick={() => setVerificationChannel('email')}
                  className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition ${
                    verificationChannel === 'email'
                      ? 'bg-teal-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" /> Resend Email
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  ROLE // ENTITY TYPE
                </label>
                <select
                  value={signupRole}
                  onChange={(e) => setSignupRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 bg-[#161b22] border border-slate-700/80 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="msme">Factory Owner (MSME 80% Fee Concession)</option>
                  <option value="applicant">New Business / Startup (First-Time License)</option>
                  <option value="consumer">Citizen / Consumer (Verify ISI Mark & Fakes)</option>
                  <option value="officer">BIS Quality Officer (Surveillance & Audits)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    LEGAL NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ramesh Sharma"
                    className="w-full px-3 py-2 bg-[#161b22] border border-slate-700/80 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    ENTERPRISE (OPT)
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Bharat Precision"
                    className="w-full px-3 py-2 bg-[#161b22] border border-slate-700/80 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {verificationChannel === 'whatsapp' ? (
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    WHATSAPP (+91 MOBILE)
                  </label>
                  <div className="flex gap-2">
                    <span className="px-3 py-2 bg-slate-800 text-slate-400 font-mono text-xs rounded-xl flex items-center">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="98765 43210"
                      className="flex-1 px-3 py-2 bg-[#161b22] border border-slate-700/80 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              ) : null}

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  OFFICIAL EMAIL
                </label>
                <input
                  type="email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="contact@enterprise.com"
                  className="w-full px-3 py-2 bg-[#161b22] border border-slate-700/80 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  CREATE PASSWORD (MIN 6 CHARS)
                </label>
                <input
                  type="password"
                  required
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-[#161b22] border border-slate-700/80 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
              >
                {isLoading ? (
                  'INITIALIZING...'
                ) : verificationChannel === 'whatsapp' ? (
                  <>
                    <MessageSquare className="w-3.5 h-3.5" />
                    SEND WHATSAPP OTP & REGISTER ➔
                  </>
                ) : (
                  <>
                    <Mail className="w-3.5 h-3.5" />
                    SEND RESEND VERIFICATION EMAIL ➔
                  </>
                )}
              </button>

              <div className="text-center pt-2 text-xs text-slate-500 font-mono">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-emerald-400 hover:underline font-bold cursor-pointer"
                >
                  Sign in here
                </button>
              </div>
            </motion.form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
