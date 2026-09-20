'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, FileText, Users, ArrowRight, ChevronDown,
  MessageSquare, X, CheckCircle2
} from 'lucide-react';
import HeroFeatures from './HeroFeatures';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

interface AuthLayoutProps {
  initialTab?: 'login' | 'signup';
}

export default function AuthLayout({ initialTab = 'login' }: AuthLayoutProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialTab);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isLangOpen, setIsLangOpen] = useState(false);

  // WhatsApp Simulated Notification
  const [showWhatsAppToast, setShowWhatsAppToast] = useState(false);
  const [activeSimulatedOtp, setActiveSimulatedOtp] = useState('');

  // Forgot Password Modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState<{ message?: string; isError?: boolean } | null>(null);
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setIsForgotLoading(true);
    setForgotStatus(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setForgotStatus({
          message: data.message || `Password reset instructions have been dispatched to ${forgotEmail}.`,
        });
        setTimeout(() => {
          setShowForgotModal(false);
          setForgotStatus(null);
        }, 3000);
      } else {
        setForgotStatus({ message: data.error || 'Failed to dispatch reset email.', isError: true });
      }
    } catch {
      setForgotStatus({ message: 'Network connection error.', isError: true });
    } finally {
      setIsForgotLoading(false);
    }
  };

  const triggerWhatsAppToast = (code: string) => {
    setActiveSimulatedOtp(code);
    setShowWhatsAppToast(true);
  };

  return (
    <div className="min-h-screen bg-[#f3f5f8] text-slate-800 flex flex-col justify-between font-sans antialiased selection:bg-blue-600 selection:text-white relative">
      
      {/* WhatsApp Simulated Toast Notification (Top Center) */}
      <AnimatePresence>
        {showWhatsAppToast && activeSimulatedOtp && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-white text-slate-800 rounded-2xl shadow-2xl p-4 border border-emerald-300 max-w-sm w-[92%] flex items-start gap-3.5"
            role="status"
            aria-live="polite"
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
                  onClick={() => setShowWhatsAppToast(false)}
                  className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 underline cursor-pointer"
                >
                  Dismiss ✕
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Forgot Password Accessible Dialog Modal */}
      {showForgotModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="forgot-title"
        >
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 id="forgot-title" className="text-lg font-bold text-slate-900 mb-1">
              Reset Password
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter your registered email address to receive password reset instructions.
            </p>

            {forgotStatus ? (
              <div
                className={`p-3 rounded-xl border text-xs font-medium ${
                  forgotStatus.isError
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}
                role="alert"
              >
                {forgotStatus.message}
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
                  aria-label="Email address for password reset"
                />
                <button
                  type="submit"
                  disabled={isForgotLoading}
                  className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-blue-700 transition cursor-pointer disabled:opacity-50"
                >
                  {isForgotLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* TOP HEADER: BIS Logo, "Built on BIS", and Language Dropdown */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 flex items-center justify-between">
        {/* Left: BIS Official Logo & Bilingual Branding */}
        <Link href="/" className="flex items-center gap-3 group" aria-label="SUGAM-AI Home">
          <div className="w-11 h-11 relative shrink-0">
            <Image
              src="/images/bis_logo.png"
              alt="Bureau of Indian Standards"
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

        {/* Center: "Built on BIS. Not Replacing BIS." with Indian Tricolor Accent Line */}
        <div className="hidden md:flex flex-col items-center justify-center text-center">
          <span className="text-xs font-semibold text-slate-700">
            Built on BIS. Not Replacing BIS.
          </span>
          <div className="flex items-center gap-1 mt-1" aria-hidden="true">
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
            aria-haspopup="listbox"
            aria-expanded={isLangOpen}
          >
            <span aria-hidden="true">🌐</span>
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
                  className="w-full text-left px-3 py-1.5 hover:bg-blue-50 hover:text-blue-600 font-medium transition cursor-pointer"
                >
                  {lang}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* ======================================================== */}
      {/* MAIN CONTENT: SPLIT-SCREEN DESKTOP & MOBILE WRAPPER       */}
      {/* ======================================================== */}
      <main className="flex-1 flex flex-col justify-center items-center px-3 sm:px-6 py-4 md:py-6">
        
        {/* Main 2-Column Responsive Card Container */}
        <div className="w-full max-w-[1140px] bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          
          {/* ======================================================== */}
          {/* LEFT SIDE: HERO FEATURES (Exact Visual Reproduction)      */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 bg-[#edf2f7] relative flex flex-col justify-between overflow-hidden min-h-[420px] lg:min-h-full">
            <HeroFeatures />
          </div>

          {/* ======================================================== */}
          {/* RIGHT SIDE: AUTHENTICATION CARD                          */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 bg-white relative flex flex-col justify-between p-6 sm:p-8 lg:p-10 border-t lg:border-t-0 lg:border-l border-slate-100">
            
            {/* Top Info Tag on Card */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden sm:inline">
                BIS Quality Portal
              </span>
            </div>

            {/* Centered Form Area */}
            <div className="w-full max-w-sm mx-auto my-auto">
              
              {/* Tab Switcher: Login | Sign Up */}
              <div className="flex items-center border-b border-slate-200 pb-3 mb-6" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'login'}
                  onClick={() => setActiveTab('login')}
                  className={`flex-1 text-center text-sm font-bold pb-2 transition cursor-pointer relative ${
                    activeTab === 'login'
                      ? 'text-blue-600'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Login
                  {activeTab === 'login' && (
                    <motion.div
                      layoutId="authActiveTabUnderline"
                      className="absolute -bottom-3.5 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                    />
                  )}
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'signup'}
                  onClick={() => setActiveTab('signup')}
                  className={`flex-1 text-center text-sm font-bold pb-2 transition cursor-pointer relative ${
                    activeTab === 'signup'
                      ? 'text-blue-600'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Sign Up
                  {activeTab === 'signup' && (
                    <motion.div
                      layoutId="authActiveTabUnderline"
                      className="absolute -bottom-3.5 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                    />
                  )}
                </button>
              </div>

              {/* Active Form */}
              {activeTab === 'login' ? (
                <LoginForm
                  onSwitchToSignup={() => setActiveTab('signup')}
                  onForgotPassword={() => setShowForgotModal(true)}
                />
              ) : (
                <SignupForm
                  onSwitchToLogin={() => setActiveTab('login')}
                  onShowWhatsAppToast={triggerWhatsAppToast}
                />
              )}

            </div>

            {/* Trust Badges & Aatmanirbhar Bharat Footer Below Card */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              {/* 3 Trust Badges */}
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-blue-600" /> Secure & Private
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3 text-emerald-600" /> Trusted BIS Information
                </span>
                <span className="flex items-center gap-1 hidden sm:flex">
                  <Users className="w-3 h-3 text-indigo-600" /> For Citizens, MSMEs & All
                </span>
              </div>

              {/* Aatmanirbhar Bharat / Quality Standards Banner */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-slate-100/80">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 relative shrink-0">
                    <Image
                      src="/images/emblem.png"
                      alt="Government of India Emblem"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                  <div className="leading-tight text-left">
                    <div className="text-[9px] text-slate-400">Under the vision of</div>
                    <div className="text-[11px] font-bold text-slate-800">Aatmanirbhar Bharat</div>
                  </div>
                </div>

                <Link
                  href="/standards"
                  className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-full text-[10px] font-semibold text-slate-700 hover:text-blue-600 transition"
                >
                  <span>Quality Standards for a Developed India</span>
                  <ArrowRight className="w-3 h-3 text-blue-600" />
                </Link>
              </div>
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}
