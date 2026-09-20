'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, FileText, Compass, Users, Shield, Lock, Mail,
  Eye, EyeOff, ArrowRight, CheckCircle2, ChevronDown,
  Sparkles, Leaf, BarChart3, Settings, ShieldCheck, RefreshCw,
  Building2, Rocket, ShieldAlert, KeyRound, MessageSquare, X
} from 'lucide-react';
import { DEMO_PERSONAS, UserRole } from '@/lib/useAuth';

interface ExactBisLoginPageProps {
  initialTab?: 'login' | 'signup';
}

export default function ExactBisLoginPage({ initialTab = 'login' }: ExactBisLoginPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Active Tab: 'login' | 'signup'
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialTab);
  
  // Language Dropdown
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isLangOpen, setIsLangOpen] = useState(false);

  // Login Form States
  const [loginIdentifier, setLoginIdentifier] = useState('msme@sugam.ai');
  const [loginPassword, setLoginPassword] = useState('demo123');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up Form States
  const [signupName, setSignupName] = useState('');
  const [signupIdentifier, setSignupIdentifier] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [signupRole, setSignupRole] = useState<UserRole>('msme');
  const [signupCompany, setSignupCompany] = useState('');
  const [signupMethod, setSignupMethod] = useState<'email' | 'whatsapp'>('whatsapp');

  // Verification (OTP / Email) States
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [activeSimulatedOtp, setActiveSimulatedOtp] = useState('');
  const [showWhatsAppToast, setShowWhatsAppToast] = useState(false);

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  // Quick Evaluator Drawer State
  const [showEvaluatorDrawer, setShowEvaluatorDrawer] = useState(false);

  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      setSuccessMsg('Email verified successfully! Please sign in.');
    }
  }, [searchParams]);

  // 1-Click Judge Persona Login
  const handleQuickPersona = (role: UserRole) => {
    const persona = DEMO_PERSONAS[role];
    localStorage.setItem('bis-demo-user', JSON.stringify(persona));
    window.dispatchEvent(new Event('bis-auth-change'));
    router.push(`/dashboard/${role}`);
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginIdentifier,
          password: loginPassword,
          rememberMe,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Invalid credentials. Please check your details.');
        return;
      }

      localStorage.setItem('bis-demo-user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('bis-auth-change'));

      const role = data.user?.role || 'msme';
      const next = searchParams.get('next') || `/dashboard/${role}`;
      router.push(next);
    } catch (err) {
      setErrorMsg('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Sign Up Submit
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    // If WhatsApp method
    if (signupMethod === 'whatsapp') {
      const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setActiveSimulatedOtp(mockOtp);
      setIsVerifying(true);
      setShowWhatsAppToast(true);
      setIsLoading(false);
      return;
    }

    // Official Email verification (Resend)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupName,
          email: signupIdentifier,
          password: signupPassword,
          companyName: signupCompany,
          role: signupRole,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Registration failed. Please check details.');
        return;
      }

      if (data.requiresEmailConfirmation) {
        setIsVerifying(true);
        if (data.simulatedOtp) {
          setActiveSimulatedOtp(data.simulatedOtp);
          setShowWhatsAppToast(true);
        }
        return;
      }

      if (data.user) {
        localStorage.setItem('bis-demo-user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('bis-auth-change'));
        router.push(`/dashboard/${data.user.role || 'msme'}`);
      }
    } catch (err) {
      setErrorMsg('Unable to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP Verification
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim().length < 6) {
      setErrorMsg('Please enter a valid 6-digit code.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const targetEmail = signupIdentifier.includes('@')
        ? signupIdentifier
        : `${signupIdentifier || 'user'}@sugam.ai`;

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
        router.push(`/dashboard/${signupRole}`);
      }
    } catch {
      setErrorMsg('Verification failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password mock
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSuccess(`Password reset link sent to ${forgotEmail}. Please check your inbox.`);
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSuccess('');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800 flex flex-col justify-between font-sans antialiased selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      
      {/* WhatsApp Simulated Toast Notification (Top Center) */}
      <AnimatePresence>
        {showWhatsAppToast && activeSimulatedOtp && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-white text-slate-800 rounded-2xl shadow-2xl p-4 border border-emerald-300 max-w-sm w-[92%] flex items-start gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="flex-1 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  WhatsApp • SUGAM Portal
                </span>
                <span className="text-[10px] text-slate-400">just now</span>
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
                    setShowWhatsAppToast(false);
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

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Reset Password</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter your registered email address to receive password reset instructions.
            </p>
            {forgotSuccess ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 font-medium">
                {forgotSuccess}
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-blue-700 transition"
                >
                  Send Reset Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* TOP BAR / HEADER */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 flex items-center justify-between">
        {/* Left: BIS Official Logo & Text */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 relative shrink-0">
            <Image
              src="/images/bis_logo.png"
              alt="Bureau of Indian Standards Logo"
              width={50}
              height={50}
              className="object-contain w-full h-full"
              priority
            />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-extrabold text-slate-900 tracking-tight">
              भारतीय मानक ब्यूरो
            </div>
            <div className="text-xs font-bold text-slate-800">
              Bureau of Indian Standards
            </div>
            <div className="text-[10px] text-slate-500 font-medium">
              The National Standards Body of India
            </div>
          </div>
        </Link>

        {/* Center: "Built on BIS. Not Replacing BIS." + Tricolor Line (Hidden on small mobile) */}
        <div className="hidden md:flex flex-col items-center justify-center text-center">
          <span className="text-xs font-semibold text-slate-700">
            Built on BIS. Not Replacing BIS.
          </span>
          <div className="flex items-center gap-1 mt-1">
            <span className="w-7 h-1 bg-[#ff9933] rounded-full"></span>
            <span className="w-7 h-1 bg-slate-200 rounded-full"></span>
            <span className="w-7 h-1 bg-[#138808] rounded-full"></span>
          </div>
        </div>

        {/* Right: Language Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs transition cursor-pointer"
          >
            <span>🌐</span>
            <span>{selectedLanguage}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isLangOpen && (
            <div className="absolute right-0 mt-1.5 w-36 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-30 text-xs">
              {['English', 'हिन्दी (Hindi)', 'தமிழ் (Tamil)', 'বাংলা (Bengali)', 'मराठी (Marathi)'].map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => {
                    setSelectedLanguage(lang);
                    setIsLangOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-blue-50 hover:text-blue-600 font-medium transition"
                >
                  {lang}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* MAIN HERO & AUTH SECTION */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex-1 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* ======================================================== */}
          {/* LEFT COLUMN: HERO CONTENT & VALUE PROPOSITION (7 cols)   */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-5 relative">
            
            {/* Top Pill: SUGAM-AI AN INTELLIGENT LAYER */}
            <div className="inline-flex items-center gap-2 p-1 pr-3 bg-white/90 border border-blue-100 rounded-full shadow-2xs max-w-fit">
              <span className="bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                SUGAM-AI
              </span>
              <span className="text-[11px] font-medium text-slate-700 flex items-center gap-1">
                AN INTELLIGENT LAYER FOR SIMPLER BIS COMPLIANCE
                <ArrowRight className="w-3 h-3 text-blue-600" />
              </span>
            </div>

            {/* Main Title & Sparkle */}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                  SUGAM-AI
                </h1>
                <Sparkles className="w-7 h-7 text-blue-600 fill-blue-600 shrink-0" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 mt-1">
                Simpler Standards. Stronger Bharat.
              </h2>
              <p className="text-sm text-slate-600 mt-2 max-w-xl leading-relaxed">
                Your AI-powered guide to Indian Standards, certification, testing, schemes and more.
              </p>
            </div>

            {/* Feature Points & Illustration Container */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative">
              
              {/* Feature Points (Left Sub-column) */}
              <div className="md:col-span-6 space-y-3.5 z-10">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Search className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Find</div>
                    <div className="text-[11px] text-slate-500">the right BIS standards</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Understand</div>
                    <div className="text-[11px] text-slate-500">requirements in simple language</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Get guidance</div>
                    <div className="text-[11px] text-slate-500">on tests, documents and next steps</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">For everyone</div>
                    <div className="text-[11px] text-slate-500">MSMEs, businesses, consumers and more</div>
                  </div>
                </div>

                {/* Quote Block */}
                <div className="pt-2 border-l-2 border-blue-500 pl-3 mt-2">
                  <p className="text-xs italic font-medium text-slate-700">
                    &ldquo;Standards for a Safer, Stronger, Self-Reliant India&rdquo;
                  </p>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                    — Bureau of Indian Standards
                  </p>
                </div>
              </div>

              {/* People & Skyline Hero Montage (Right Sub-column) */}
              <div className="md:col-span-6 relative flex items-center justify-center">
                <div className="relative w-full max-w-[320px] aspect-[4/5] rounded-2xl overflow-hidden shadow-lg border border-white">
                  <Image
                    src="/images/bis_people_hero.png"
                    alt="Indian Engineers, Professionals and Citizens with Vande Bharat and Manak Se Vikas"
                    fill
                    className="object-cover object-top"
                    priority
                  />
                  {/* Subtle Tricolor Glow on Bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent"></div>
                  
                  {/* Cursive Quality & Safety Motto */}
                  <div className="absolute top-3 right-3 text-right text-blue-900/90 font-serif italic text-xs leading-tight drop-shadow-xs select-none">
                    Quality<br />
                    Safety<br />
                    Trust<br />
                    <span className="text-[10px] text-blue-600">For a Better Tomorrow</span>
                  </div>

                  {/* Tricolor Slogan Tag */}
                  <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">
                      MANAK SE VIKAS
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom 4 Feature Icons Strip */}
            <div className="pt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-slate-600 font-medium border-t border-slate-200/80">
              <span className="flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" /> Safer Products
              </span>
              <span className="flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-blue-600" /> Stronger Industries
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-600" /> Empowered Citizens
              </span>
              <span className="flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5 text-amber-600" /> A Better Tomorrow
              </span>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: THE CLEAN AUTH CARD (5 cols)               */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            {/* White Floating Card */}
            <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 relative">
              
              {/* Tab Header: Login | Sign Up */}
              <div className="flex items-center border-b border-slate-200 pb-3 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setIsVerifying(false);
                    setErrorMsg('');
                  }}
                  className={`flex-1 text-center text-sm font-bold pb-2 transition cursor-pointer relative ${
                    activeTab === 'login'
                      ? 'text-blue-600'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Login
                  {activeTab === 'login' && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute -bottom-3.5 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                    />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('signup');
                    setIsVerifying(false);
                    setErrorMsg('');
                  }}
                  className={`flex-1 text-center text-sm font-bold pb-2 transition cursor-pointer relative ${
                    activeTab === 'signup'
                      ? 'text-blue-600'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Sign Up
                  {activeTab === 'signup' && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute -bottom-3.5 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                    />
                  )}
                </button>
              </div>

              {/* Success / Notification Banner */}
              {successMsg && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Error Banner */}
              {errorMsg && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              {/* =================================================== */}
              {/* TAB 1: LOGIN                                        */}
              {/* =================================================== */}
              {activeTab === 'login' && (
                <div>
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                      Welcome Back
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Login to continue with SUGAM-AI
                    </p>
                  </div>

                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    {/* Input 1: Email / Mobile */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="Email address / Mobile number"
                        className="w-full pl-10 pr-3.5 py-3 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none placeholder-slate-400 bg-white"
                      />
                    </div>

                    {/* Input 2: Password */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none placeholder-slate-400 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Forgot password */}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setShowForgotModal(true)}
                        className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>

                    {/* Login Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#1e40af] hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? 'Logging in...' : 'Login →'}
                    </button>
                  </form>

                  {/* OR Divider */}
                  <div className="relative flex items-center justify-center my-5">
                    <div className="border-t border-slate-200 w-full"></div>
                    <span className="bg-white px-3 text-[10px] uppercase font-bold text-slate-400 absolute">
                      OR
                    </span>
                  </div>

                  {/* Social / 1-Click Buttons (DigiLocker Removed as requested) */}
                  <div className="space-y-2">
                    {/* Google Button */}
                    <button
                      type="button"
                      onClick={() => handleQuickPersona('msme')}
                      className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center gap-2.5 transition shadow-2xs cursor-pointer"
                    >
                      <Image
                        src="/images/google_icon.png"
                        alt="Google"
                        width={18}
                        height={18}
                        className="object-contain"
                      />
                      <span>Continue with Google</span>
                    </button>

                    {/* Evaluator Quick Role Selector Button */}
                    <button
                      type="button"
                      onClick={() => setShowEvaluatorDrawer(!showEvaluatorDrawer)}
                      className="w-full py-2 px-3 bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200 rounded-xl text-[11px] font-bold text-blue-700 flex items-center justify-between transition cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Evaluator 1-Click Demo Portals
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showEvaluatorDrawer ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Collapsible 1-Click Persona Cards */}
                    {showEvaluatorDrawer && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="grid grid-cols-2 gap-1.5 pt-1"
                      >
                        <button
                          type="button"
                          onClick={() => handleQuickPersona('msme')}
                          className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 text-left transition flex items-center gap-2 cursor-pointer"
                        >
                          <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <div className="min-w-0">
                            <div className="text-[11px] font-bold text-slate-900 truncate">Factory Owner</div>
                            <div className="text-[9px] text-slate-500 truncate">MSME 80% Off</div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleQuickPersona('applicant')}
                          className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 text-left transition flex items-center gap-2 cursor-pointer"
                        >
                          <Rocket className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <div className="min-w-0">
                            <div className="text-[11px] font-bold text-slate-900 truncate">New Business</div>
                            <div className="text-[9px] text-slate-500 truncate">First-Time ISI</div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleQuickPersona('consumer')}
                          className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 text-left transition flex items-center gap-2 cursor-pointer"
                        >
                          <Shield className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                          <div className="min-w-0">
                            <div className="text-[11px] font-bold text-slate-900 truncate">Consumer</div>
                            <div className="text-[9px] text-slate-500 truncate">Verify ISI Mark</div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleQuickPersona('officer')}
                          className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 text-left transition flex items-center gap-2 cursor-pointer"
                        >
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <div className="min-w-0">
                            <div className="text-[11px] font-bold text-slate-900 truncate">BIS Officer</div>
                            <div className="text-[9px] text-slate-500 truncate">Audit & Review</div>
                          </div>
                        </button>
                      </motion.div>
                    )}
                  </div>

                  {/* Switch to Sign Up */}
                  <div className="text-center mt-5 text-xs text-slate-600">
                    New to SUGAM-AI?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('signup')}
                      className="font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      Create an account
                    </button>
                  </div>
                </div>
              )}

              {/* =================================================== */}
              {/* TAB 2: SIGN UP                                      */}
              {/* =================================================== */}
              {activeTab === 'signup' && (
                <div>
                  <div className="text-center mb-5">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                      Create an Account
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Join SUGAM-AI for simplified BIS compliance
                    </p>
                  </div>

                  {/* If Verifying OTP Step */}
                  {isVerifying ? (
                    <div className="space-y-4">
                      <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl text-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block mb-1">
                          Security Verification
                        </span>
                        <div className="text-xs text-slate-700 font-medium">
                          Enter 6-digit code sent to:
                        </div>
                        <div className="text-xs font-bold text-slate-900 mt-0.5">
                          {signupIdentifier}
                        </div>
                      </div>

                      <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between text-xs text-slate-600 mb-1 font-medium">
                            <span>Enter 6-digit Code:</span>
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
                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-center text-2xl font-bold tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            autoFocus
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full bg-[#1e40af] hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs cursor-pointer disabled:opacity-50"
                        >
                          {isLoading ? 'Verifying...' : 'Verify & Enter Dashboard →'}
                        </button>
                      </form>

                      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
                            setActiveSimulatedOtp(newOtp);
                            setShowWhatsAppToast(true);
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
                          Back to Form
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Normal Sign Up Form */
                    <form onSubmit={handleSignUpSubmit} className="space-y-3">
                      
                      {/* Fast Method Switcher */}
                      <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl text-xs font-bold mb-1">
                        <button
                          type="button"
                          onClick={() => setSignupMethod('whatsapp')}
                          className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition ${
                            signupMethod === 'whatsapp'
                              ? 'bg-emerald-600 text-white shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> WhatsApp OTP
                        </button>
                        <button
                          type="button"
                          onClick={() => setSignupMethod('email')}
                          className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition ${
                            signupMethod === 'email'
                              ? 'bg-blue-600 text-white shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <Mail className="w-3.5 h-3.5" /> Email Link / OTP
                        </button>
                      </div>

                      {/* Full Name */}
                      <input
                        type="text"
                        required
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        placeholder="Full Name"
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />

                      {/* Role Selector */}
                      <select
                        value={signupRole}
                        onChange={(e) => setSignupRole(e.target.value as UserRole)}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                      >
                        <option value="msme">Factory Owner (MSME 80% Fee Discount)</option>
                        <option value="applicant">New Business / Startup (First-Time License)</option>
                        <option value="consumer">Citizen / Consumer (Verify ISI Mark)</option>
                        <option value="officer">BIS Quality Officer (Surveillance & Reviews)</option>
                      </select>

                      {/* Email or WhatsApp Mobile */}
                      {signupMethod === 'whatsapp' ? (
                        <div className="flex gap-1.5">
                          <span className="px-3 py-2 bg-slate-100 border border-slate-300 text-slate-600 font-bold text-xs rounded-xl flex items-center">
                            +91
                          </span>
                          <input
                            type="tel"
                            required
                            maxLength={10}
                            value={signupIdentifier}
                            onChange={(e) => setSignupIdentifier(e.target.value.replace(/\D/g, ''))}
                            placeholder="WhatsApp Mobile Number"
                            className="flex-1 px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                          />
                        </div>
                      ) : (
                        <input
                          type="email"
                          required
                          value={signupIdentifier}
                          onChange={(e) => setSignupIdentifier(e.target.value)}
                          placeholder="Email Address"
                          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        />
                      )}

                      {/* Password */}
                      <div className="relative">
                        <input
                          type={showSignupPassword ? 'text' : 'password'}
                          required
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          placeholder="Create Password (min 6 characters)"
                          className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 px-4 ${
                          signupMethod === 'whatsapp'
                            ? 'bg-emerald-600 hover:bg-emerald-700'
                            : 'bg-[#1e40af] hover:bg-blue-700'
                        } text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs cursor-pointer disabled:opacity-50 mt-1`}
                      >
                        {isLoading ? 'Processing...' : signupMethod === 'whatsapp' ? 'Send WhatsApp OTP →' : 'Create Account →'}
                      </button>

                      {/* Switch to Login */}
                      <div className="text-center mt-3 text-xs text-slate-600">
                        Already have an account?{' '}
                        <button
                          type="button"
                          onClick={() => setActiveTab('login')}
                          className="font-bold text-blue-600 hover:underline cursor-pointer"
                        >
                          Login
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Trust Badges Below Card */}
              <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-blue-600" /> Secure & Private
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3 text-emerald-600" /> Trusted BIS Information
                </span>
                <span className="flex items-center gap-1 hidden sm:flex">
                  <Users className="w-3 h-3 text-indigo-600" /> For All Citizens
                </span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* BOTTOM FOOTER BAR */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 border-t border-slate-200/80">
        
        {/* Left: Lion Capital / Aatmanirbhar Bharat */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 relative shrink-0">
            <Image
              src="/images/emblem.png"
              alt="Government of India Emblem"
              width={28}
              height={28}
              className="object-contain"
            />
          </div>
          <div className="leading-tight">
            <div className="text-[10px] text-slate-500">Under the vision of</div>
            <div className="text-xs font-bold text-slate-800">Aatmanirbhar Bharat</div>
          </div>
        </div>

        {/* Right: Quality Standards Pill */}
        <Link
          href="/standards"
          className="flex items-center gap-2 px-4 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-full text-xs font-semibold text-slate-800 shadow-2xs transition"
        >
          <span>Quality Standards for a Developed India</span>
          <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
        </Link>
      </footer>

    </div>
  );
}
