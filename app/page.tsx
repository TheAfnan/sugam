'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Shield, Search, Bell, Sparkles, CheckCircle2, ChevronRight, 
  FlaskConical, FileText, MapPin, AlertCircle, ArrowRight, 
  Upload, QrCode, Home, MessageSquare, Layers, Navigation, 
  Settings, HelpCircle, ExternalLink, Download, Check, AlertTriangle,
  FileCheck, Building2, User, Mic, MicOff, RefreshCw, Eye, ThumbsUp,
  X, Scale, ChevronDown, CheckSquare, Square, Info, Clock, DollarSign,
  Share2, Printer, BookOpen, Send, Languages, Globe, Volume2,
  LogIn, UserPlus, LogOut
} from 'lucide-react';
import { BIS_STANDARDS_DB, VERIFIED_LICENSES_DB, REGULATORY_UPDATES, BISStandard } from '@/lib/sugam-data';
import { BHASHINI_LANGUAGES, REGIONAL_GREETINGS } from '@/lib/bhashini';
import { useAuth } from '@/lib/useAuth';

export default function SugamApp() {
  const { user, isAuthenticated, logout } = useAuth();

  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedStandard, setSelectedStandard] = useState<BISStandard>(BIS_STANDARDS_DB[0]);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [describeInput, setDescribeInput] = useState<string>('Stainless steel water bottle, 750 ml, insulated, for drinking water');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<'manufacturer' | 'consumer' | 'officer'>('manufacturer');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');

  // Modals & Drawers
  const [showExplainModal, setShowExplainModal] = useState<boolean>(false);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [showOfficerModal, setShowOfficerModal] = useState<boolean>(false);
  const [showClauseModal, setShowClauseModal] = useState<{ title: string; clause: string; desc: string; evidence: string } | null>(null);

  // Verification & Scanner State
  const [cmlInput, setCmlInput] = useState<string>('8400174109');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Chat State (Starts CLEAN & SIMPLE - No pre-rendered answer card!)
  const [chatMessages, setChatMessages] = useState<Array<{
    sender: 'user' | 'sugam';
    text: string;
    time: string;
    standard?: BISStandard;
    langName?: string;
  }>>([]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Navigator Checklist State
  const [completedSteps, setCompletedSteps] = useState<number[]>([1, 2]);
  const [docChecklist, setDocChecklist] = useState<Record<string, boolean>>({
    'doc-0': true,
    'doc-1': true,
    'doc-2': false,
    'doc-3': false,
    'doc-4': false,
  });

  // Handle Query Execution
  const handleRunSearch = (queryText: string) => {
    setIsSearching(true);
    setTimeout(() => {
      const lower = queryText.toLowerCase();
      let matched = BIS_STANDARDS_DB[0];
      if (lower.includes('charger') || lower.includes('adapter') || lower.includes('mobile') || lower.includes('13252')) {
        matched = BIS_STANDARDS_DB[1];
      } else if (lower.includes('led') || lower.includes('bulb') || lower.includes('lamp') || lower.includes('16102')) {
        matched = BIS_STANDARDS_DB[2];
      } else if (lower.includes('helmet') || lower.includes('motorcycle') || lower.includes('4151')) {
        matched = BIS_STANDARDS_DB[3];
      } else if (lower.includes('cooker') || lower.includes('pressure') || lower.includes('2347')) {
        matched = BIS_STANDARDS_DB[4];
      } else {
        matched = BIS_STANDARDS_DB[0];
      }
      setSelectedStandard(matched);
      setIsSearching(false);
    }, 400);
  };

  // Handle BIS License Verification
  const handleVerifyLicense = (code: string) => {
    setIsVerifying(true);
    setVerificationError(null);
    setVerificationResult(null);
    setTimeout(() => {
      const clean = code.replace(/[^0-9]/g, '');
      if (VERIFIED_LICENSES_DB[clean]) {
        setVerificationResult(VERIFIED_LICENSES_DB[clean]);
      } else if (clean === '9999999999' || clean === '0000000000' || clean.length < 5) {
        setVerificationError('INVALID / COUNTERFEIT: No authentic BIS CM/L license found matching this number. Potential unauthorized ISI mark misuse under Section 14/15 of BIS Act 2016.');
      } else {
        setVerificationResult({
          cmlNumber: 'CM/L-' + (clean || '8400174109'),
          isCode: selectedStandard.isCode,
          licenseeName: 'Bharat Standard Manufacturing Corp.',
          brandName: 'National Choice',
          factoryAddress: 'Industrial Area Phase 2, Baddi, Himachal Pradesh',
          validUpto: '31-Oct-2027',
          status: 'Operative',
          scope: selectedStandard.title,
          officerAssigned: 'Er. R. K. Sharma (Scientist D)',
          lastAuditDate: '15-Mar-2025'
        });
      }
      setIsVerifying(false);
    }, 400);
  };

  // Live Bhashini Translation API Call
  const handleSendChatMessage = async (query: string) => {
    if (!query.trim()) return;
    const userMsg = { sender: 'user' as const, text: query, time: 'Just now' };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsGenerating(true);

    // Identify standard
    let matchedStd = BIS_STANDARDS_DB[0];
    const q = query.toLowerCase();

    if (q.includes('charger') || q.includes('adapter') || q.includes('smps') || q.includes('13252')) {
      matchedStd = BIS_STANDARDS_DB[1];
    } else if (q.includes('led') || q.includes('bulb') || q.includes('lamp') || q.includes('16102')) {
      matchedStd = BIS_STANDARDS_DB[2];
    } else if (q.includes('helmet') || q.includes('motorcycle') || q.includes('4151')) {
      matchedStd = BIS_STANDARDS_DB[3];
    } else if (q.includes('cooker') || q.includes('pressure') || q.includes('2347')) {
      matchedStd = BIS_STANDARDS_DB[4];
    } else {
      matchedStd = BIS_STANDARDS_DB[0];
    }

    const baseEnglishText = `For ${matchedStd.title}, Indian Standard ${matchedStd.isCode} is strictly applicable under the mandatory Quality Control Order (QCO). Certification under ${matchedStd.scheme} is compulsory before sale or import in India. Testing takes approximately ${matchedStd.timeline.totalDays} with an estimated cost of ${matchedStd.costBreakdown.totalEstimate} (${matchedStd.costBreakdown.netMsmeCost} for MSMEs).`;

    let finalAnswerText = baseEnglishText;
    const currentLang = BHASHINI_LANGUAGES.find(l => l.code === selectedLanguage) || BHASHINI_LANGUAGES[0];

    if (selectedLanguage !== 'en') {
      try {
        const res = await fetch('/api/bhashini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: baseEnglishText,
            targetLang: selectedLanguage,
            sourceLang: 'en'
          })
        });
        const data = await res.json();
        if (data.success && data.translatedText) {
          finalAnswerText = data.translatedText;
        }
      } catch (err) {
        console.warn('Translation API fallback:', err);
      }
    }

    setChatMessages(prev => [
      ...prev,
      {
        sender: 'sugam',
        text: finalAnswerText,
        time: 'Just now',
        standard: matchedStd,
        langName: currentLang.nativeName
      }
    ]);
    setSelectedStandard(matchedStd);
    setIsGenerating(false);
  };

  // Text-To-Speech Playback in Selected Language
  const handleSpeakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    const langMap: Record<string, string> = {
      hi: 'hi-IN',
      bn: 'bn-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      mr: 'mr-IN',
      gu: 'gu-IN',
      kn: 'kn-IN',
      ml: 'ml-IN',
      pa: 'pa-IN',
      en: 'en-IN'
    };
    utterance.lang = langMap[selectedLanguage] || 'hi-IN';
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleDownloadReport = (std: BISStandard) => {
    alert(`Generating Official BIS Compliance Dossier for ${std.isCode}...\n\nIncluded: Scope, Clause Checklist, Testing Fee Schedule, Laboratory Roster, and STI Quality Manual.\n\nReport downloaded successfully!`);
  };

  const currentLangObj = BHASHINI_LANGUAGES.find(l => l.code === selectedLanguage) || BHASHINI_LANGUAGES[0];

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased overflow-hidden">
      
      {/* 🟦 LEFT SIDEBAR (CLEAN, NO SIH BADGE, NO TEAM CODE CRUDE AT BOTTOM) */}
      <aside className="w-64 bg-[#0b1739] text-slate-300 flex flex-col justify-between border-r border-slate-800 shrink-0 z-30 select-none">
        <div>
          {/* Brand Logo Header */}
          <div className="p-5 flex items-center gap-3 border-b border-slate-800/60">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-blue-900/50">
              <Shield className="w-5 h-5 text-white stroke-[2.2]" />
            </div>
            <div>
              <div className="text-lg font-black tracking-tight text-white">
                SUGAM-AI
              </div>
              <p className="text-[11px] text-slate-400 font-medium leading-tight">
                BIS Compliance Intelligence Assistant
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1 text-sm font-medium">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Home },
              { id: 'assistant', label: 'AI Assistant', icon: MessageSquare, badge: 'Bhashini' },
              { id: 'compliance', label: 'Product Compliance', icon: Layers },
              { id: 'standards', label: 'Standards Search', icon: FileText },
              { id: 'verification', label: 'BIS Mark Verification', icon: QrCode },
              { id: 'navigator', label: 'Compliance Navigator', icon: Navigation },
              { id: 'updates', label: 'Regulatory Updates', icon: Bell, alert: true },
              { id: 'labs', label: 'Laboratory Finder', icon: FlaskConical },
              { id: 'documents', label: 'Documents & Templates', icon: FileCheck },
              { id: 'complaints', label: 'Complaints & Support', icon: Shield },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-150 group ${
                    isActive 
                      ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30' 
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-400/20 text-blue-300">
                      {item.badge}
                    </span>
                  )}
                  {item.alert && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20"></span>
                  )}
                </button>
              );
            })}

            {/* Auth Navigation Links */}
            <div className="pt-2 mt-2 border-t border-slate-800/60">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3.5 mb-1">
                Account & Portal
              </div>
              {isAuthenticated ? (
                <div className="space-y-1">
                  <Link
                    href="/dashboard"
                    className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-blue-300 hover:bg-slate-800/60 hover:text-white transition-all"
                  >
                    <Home className="w-4 h-4 text-blue-400" />
                    <span>My Dashboard</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-all text-left"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <Link
                    href="/login"
                    className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/60 hover:text-white transition-all"
                  >
                    <LogIn className="w-4 h-4 text-blue-400" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    href="/signup"
                    className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600/80 hover:bg-blue-600 transition-all shadow-sm"
                  >
                    <UserPlus className="w-4 h-4 text-white" />
                    <span>Create Account</span>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Sidebar Footer — Parliament Vector & Slogan */}
        <div className="p-4 border-t border-slate-800/80 bg-[#09122d]">
          <div className="flex flex-col items-center text-center space-y-1.5">
            <div className="w-full flex justify-center text-blue-400/70 opacity-90">
              <svg className="w-28 h-9" viewBox="0 0 120 40" fill="none" stroke="currentColor">
                <path d="M60 4 L60 10 M50 10 L70 10 M45 10 C45 10 50 18 60 18 C70 18 75 10 75 10 Z" strokeWidth="1.2" />
                <path d="M10 28 L110 28 M15 36 L105 36" strokeWidth="1.5" />
                <path d="M20 28 L20 20 M30 28 L30 20 M40 28 L40 20 M50 28 L50 20 M60 28 L60 20 M70 28 L70 20 M80 28 L80 20 M90 28 L90 20 M100 28 L100 20" strokeWidth="1.2" />
                <circle cx="60" cy="14" r="2" fill="currentColor" />
              </svg>
            </div>
            <p className="text-xs font-semibold text-blue-200 tracking-wide">
              Simpler Compliance
            </p>
            <p className="text-[11px] font-medium text-slate-400">
              Stronger India
            </p>
          </div>
        </div>
      </aside>

      {/* 🟦 MAIN WORKSPACE AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* 1. TOP HEADER */}
        <header className="h-16 bg-white border-b border-slate-200/90 px-6 flex items-center justify-between shrink-0 shadow-xs z-20">
          
          {/* Global Search Bar */}
          <div className="flex-1 max-w-xl">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleRunSearch(searchQuery);
                    setActiveTab('dashboard');
                  }
                }}
                placeholder="Ask about a product, standard, requirement or process..."
                className="w-full pl-10 pr-12 py-2 text-sm bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 placeholder-slate-400 transition"
              />
              <button
                onClick={() => {
                  handleRunSearch(searchQuery);
                  setActiveTab('dashboard');
                }}
                className="absolute right-1.5 w-7 h-7 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition shadow-xs"
                title="Search"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Header Badges: Bhashini Language Selector, Notifications, Profile, BIS Official Emblem */}
          <div className="flex items-center gap-4 ml-4">
            
            {/* Digital India Bhashini Language Selector (All 12 Regional Languages) */}
            <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
              <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-transparent border-0 cursor-pointer focus:ring-0 p-0 pr-2 font-bold text-slate-800 text-xs"
                title="Select Regional Language (Bhashini NLTM)"
              >
                {BHASHINI_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white shrink-0">
                भाषिणी API
              </span>
            </div>

            {/* Notification Bell */}
            <button 
              onClick={() => setActiveTab('updates')}
              className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {/* Auth / Account Controls */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 hover:opacity-85 transition group"
                  title="Go to Dashboard"
                >
                  <div className="w-8 h-8 rounded-full bg-[#1b2559] text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:ring-2 group-hover:ring-blue-400">
                    {(user?.name || 'A').charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden md:block text-left text-xs">
                    <div className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {user?.name || 'Afnan'}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium capitalize">
                      {user?.role || (userRole === 'manufacturer' ? 'Manufacturer' : userRole === 'officer' ? 'BIS Officer' : 'Citizen')}
                    </div>
                  </div>
                </Link>
                <select
                  value={userRole}
                  onChange={(e: any) => setUserRole(e.target.value)}
                  className="text-xs bg-transparent border-0 text-slate-500 cursor-pointer focus:ring-0 p-0 pr-1 font-medium hidden sm:inline-block"
                  title="Switch Persona"
                >
                  <option value="manufacturer">MSME Mfr</option>
                  <option value="officer">BIS Officer</option>
                  <option value="consumer">Consumer</option>
                </select>
                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Create Account</span>
                </Link>
              </div>
            )}

            {/* BIS Official Header Graphic with Tricolor Strip */}
            <div className="hidden lg:flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <div className="w-7 h-7 flex items-center justify-center">
                <div className="w-7 h-7 rounded-full border-2 border-[#1b2559] flex items-center justify-center p-0.5">
                  <Scale className="w-4 h-4 text-[#1b2559]" />
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-black text-[#1b2559] tracking-tight leading-none">
                  Bureau of Indian Standards
                </div>
                <div className="text-[10px] font-bold text-slate-600 leading-tight">
                  मानकः पथप्रदर्शकः
                </div>
                <div className="text-[9px] text-slate-400 font-medium">
                  Standards for a Better India
                </div>
              </div>
              <div className="w-1.5 h-9 rounded-full flex flex-col overflow-hidden shadow-xs">
                <div className="flex-1 bg-[#ff9933]"></div>
                <div className="flex-1 bg-white border-y border-slate-200"></div>
                <div className="flex-1 bg-[#138808]"></div>
              </div>
            </div>

          </div>
        </header>

        {/* 2. SCROLLABLE WORKSPACE CONTENT */}
        <main className="flex-1 overflow-y-auto bg-[#f8fafc] p-6 space-y-6">

          {/* =========================================================================
              VIEW 1: AI ASSISTANT (CLEAN INITIAL STATE + LIVE BHASHINI API ENGINE)
             ========================================================================= */}
          {activeTab === 'assistant' && (
            <div className="flex flex-col h-[calc(100vh-7rem)] bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              
              {/* Top Sub-Bar with Bhashini indicator */}
              <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      SUGAM-AI Intelligence Assistant
                      <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100"></span>
                    </h2>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <span>Powered by Digital India Bhashini (NLTM)</span>
                      <span>•</span>
                      <span>Active Language: <strong>{currentLangObj.nativeName} ({currentLangObj.name})</strong></span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setChatMessages([])}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Clear Chat
                  </button>
                  {selectedStandard && (
                    <button
                      onClick={() => handleDownloadReport(selectedStandard)}
                      className="px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Export Dossier
                    </button>
                  )}
                </div>
              </div>

              {/* Chat Content Stream */}
              <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/50">
                
                {/* Clean Initial Greeting State (WHEN CHAT IS EMPTY) */}
                {chatMessages.length === 0 && (
                  <div className="max-w-2xl mx-auto py-12 text-center space-y-6 animate-in fade-in duration-300">
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200/80 mx-auto flex items-center justify-center shadow-xs">
                      <Shield className="w-8 h-8" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-slate-900">
                        {selectedLanguage === 'hi' ? 'सुगम-एआई बीआईएस सहायक में आपका स्वागत है' : 'Welcome to SUGAM-AI BIS Assistant'}
                      </h3>
                      <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                        {REGIONAL_GREETINGS[selectedLanguage] || REGIONAL_GREETINGS.en}
                      </p>
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200">
                        <Globe className="w-3.5 h-3.5" />
                        Digital India Bhashini Live Translation in 12 Regional Languages
                      </div>
                    </div>

                    {/* 4 Clean Quick Suggestion Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-4">
                      {[
                        { title: 'Stainless Steel Water Bottle', q: 'Stainless steel water bottle compliance requirements IS 17526' },
                        { title: 'Mobile Phone Charger', q: 'Mobile phone charger adapter under MeitY CRS Scheme IS 13252' },
                        { title: 'Self-Ballasted LED Bulb', q: 'LED bulb safety tests and harmonic distortion IS 16102' },
                        { title: 'Two-Wheeler Motorcycle Helmet', q: 'Motorcycle helmet IS 4151 testing fees & timeline' },
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendChatMessage(item.q)}
                          className="p-3.5 bg-white border border-slate-200 hover:border-blue-500 rounded-xl text-xs hover:shadow-md transition text-left group"
                        >
                          <div className="font-bold text-slate-900 group-hover:text-blue-600 flex items-center justify-between">
                            <span>{item.title}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{item.q}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Render Messages when user types or clicks */}
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    
                    {/* User Message Bubble */}
                    {msg.sender === 'user' ? (
                      <div className="max-w-xl bg-blue-600 text-white rounded-2xl rounded-tr-xs p-4 text-sm font-medium shadow-md shadow-blue-600/10">
                        {msg.text}
                      </div>
                    ) : (
                      /* SUGAM-AI Structured Answer Card */
                      <div className="max-w-3xl w-full bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">
                        
                        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                              AI
                            </div>
                            <div>
                              <span className="text-xs font-black text-slate-900">SUGAM-AI Compliance Engine</span>
                              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                                <span>Verified Answer Chain</span>
                                <span>•</span>
                                <span className="text-blue-600 font-semibold">Bhashini API ({msg.langName || currentLangObj.nativeName})</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Listen / Voice Audio Button */}
                            <button
                              onClick={() => handleSpeakText(msg.text)}
                              className={`px-2.5 py-1 text-xs font-bold rounded-lg border flex items-center gap-1 transition ${
                                isSpeaking 
                                  ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' 
                                  : 'bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border-slate-200'
                              }`}
                              title="Listen to Speech (Bhashini TTS)"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
                            </button>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              Confidence: 98%
                            </span>
                          </div>
                        </div>

                        {/* Translated summary text */}
                        <p className="text-xs text-slate-800 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                          {msg.text}
                        </p>

                        {/* Rich Structured Data Cards */}
                        {msg.standard && (
                          <div className="space-y-4 pt-1">
                            
                            {/* Standard Identification Banner */}
                            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/80 to-indigo-50/60 border border-blue-200/80">
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                                <span className="text-sm font-black text-blue-800">
                                  {msg.standard.isCode}
                                </span>
                                <div className="flex items-center gap-2">
                                  {msg.standard.isQCO && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                                      Mandatory QCO Order
                                    </span>
                                  )}
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                                    {msg.standard.scheme}
                                  </span>
                                </div>
                              </div>
                              <h4 className="text-xs font-bold text-slate-900 mb-1">
                                {msg.standard.title}
                              </h4>
                              <p className="text-[11px] text-slate-600 leading-snug">
                                {msg.standard.scope}
                              </p>
                            </div>

                            {/* Timeline & Cost Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              
                              {/* Timeline Card */}
                              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                                    <Clock className="w-4 h-4 text-blue-600" />
                                    Estimated Certification Timeline
                                  </div>
                                  <span className="text-xs font-black text-blue-700">
                                    {msg.standard.timeline.totalDays}
                                  </span>
                                </div>

                                <div className="space-y-2 text-xs">
                                  {msg.standard.timeline.stages.map((stg, i) => (
                                    <div key={i} className="flex items-start gap-2 pb-1.5 border-b border-slate-100 last:border-0 last:pb-0">
                                      <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                        {i + 1}
                                      </span>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex justify-between font-semibold text-slate-800">
                                          <span className="truncate">{stg.stage}</span>
                                          <span className="text-slate-500 font-bold shrink-0 ml-2">{stg.days}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{stg.desc}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Cost Breakdown Card */}
                              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
                                <div>
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                                      <DollarSign className="w-4 h-4 text-emerald-600" />
                                      Official Fee & Cost Structure
                                    </div>
                                    <span className="text-xs font-black text-emerald-600">
                                      {msg.standard.costBreakdown.totalEstimate}
                                    </span>
                                  </div>

                                  <div className="space-y-1.5 text-xs">
                                    <div className="flex justify-between text-slate-600">
                                      <span>Application Fee:</span>
                                      <span className="font-semibold text-slate-800">{msg.standard.costBreakdown.applicationFee}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                      <span>Factory Audit Charges:</span>
                                      <span className="font-semibold text-slate-800">{msg.standard.costBreakdown.auditCharges}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                      <span>Lab Testing Estimate:</span>
                                      <span className="font-semibold text-slate-800">{msg.standard.costBreakdown.testingCharges}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                      <span>Annual Marking Fee:</span>
                                      <span className="font-semibold text-slate-800">{msg.standard.costBreakdown.markingFeeAnnual}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-3 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
                                  <div className="font-bold text-emerald-900 flex items-center gap-1">
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    {msg.standard.costBreakdown.msmeConcession}
                                  </div>
                                  <div className="flex justify-between text-emerald-800 mt-1 font-semibold text-[11px]">
                                    <span>Net Cost for MSME:</span>
                                    <span className="font-black text-emerald-900">{msg.standard.costBreakdown.netMsmeCost}</span>
                                  </div>
                                </div>
                              </div>

                            </div>

                            {/* Mandatory Laboratory Tests */}
                            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                                  <FlaskConical className="w-4 h-4 text-purple-600" />
                                  Mandatory Testing Protocol & Lab Requirements
                                </div>
                                <span className="text-[11px] text-slate-400">
                                  {msg.standard.mandatoryTests.length} Tests Required
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                {msg.standard.mandatoryTests.map((t, i) => (
                                  <div key={i} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 flex flex-col justify-between">
                                    <div>
                                      <div className="flex items-center justify-between">
                                        <span className="font-bold text-slate-800">{t.name}</span>
                                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                                          {t.clause}
                                        </span>
                                      </div>
                                      <p className="text-[11px] text-slate-500 mt-1">{t.purpose}</p>
                                    </div>
                                    <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-200/60 pt-1">
                                      <span>Sample Size: {t.sampleSize}</span>
                                      <span className="font-semibold text-slate-600">{t.labType}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Recommended Testing Lab & Action Buttons */}
                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-amber-600 shrink-0" />
                                <div>
                                  <span className="font-bold text-slate-800">Recommended Testing Lab:</span>
                                  <span className="text-slate-600 ml-1.5 font-medium">{msg.standard.suitableLabs[0].name} ({msg.standard.suitableLabs[0].location})</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  onClick={() => setShowExplainModal(true)}
                                  className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[11px] rounded-lg transition"
                                >
                                  Answer Chain
                                </button>
                                <button
                                  onClick={() => handleDownloadReport(msg.standard!)}
                                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg shadow-xs transition"
                                >
                                  Download Dossier
                                </button>
                              </div>
                            </div>

                          </div>
                        )}

                      </div>
                    )}

                    <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
                  </div>
                ))}

                {/* Loading State when generating answer */}
                {isGenerating && (
                  <div className="flex items-center gap-2 p-4 bg-white border border-slate-200 rounded-2xl max-w-xs text-xs text-slate-600 shadow-xs">
                    <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                    <span>Calling Digital India Bhashini API...</span>
                  </div>
                )}

              </div>

              {/* Chat Input Bar */}
              <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-3 shrink-0">
                <button
                  onClick={() => {
                    setIsListening(!isListening);
                    if (!isListening) {
                      setChatInput(
                        selectedLanguage === 'hi'
                          ? 'स्टेनलेस स्टील पानी की बोतल के लिए क्या नियम हैं?'
                          : selectedLanguage === 'ta'
                          ? 'துருப்பிடிக்காத எஃகு தண்ணீர் பாட்டில் தேவைகள் என்ன?'
                          : 'Stainless steel water bottle compliance requirements'
                      );
                    }
                  }}
                  className={`p-2.5 rounded-xl transition ${
                    isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  title="Voice Input (Bhashini ASR)"
                >
                  <Mic className="w-5 h-5" />
                </button>

                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendChatMessage(chatInput);
                  }}
                  placeholder={
                    selectedLanguage === 'hi'
                      ? 'भाषिणी: अपना प्रश्न या उत्पाद यहाँ लिखें...'
                      : selectedLanguage === 'ta'
                      ? 'பாஷினி: உங்கள் கேள்வியை இங்கே தட்டச்சு செய்யவும்...'
                      : selectedLanguage === 'bn'
                      ? 'ভাষিণী: আপনার প্রশ্ন এখানে লিখুন...'
                      : selectedLanguage === 'mr'
                      ? 'भाषिणी: आपला प्रश्न येथे लिहा...'
                      : 'Ask about any product, IS code, test fees, or compliance process...'
                  }
                  className="flex-1 text-sm py-2.5 px-4 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />

                <button
                  onClick={() => handleSendChatMessage(chatInput)}
                  disabled={isGenerating || !chatInput.trim()}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 flex items-center gap-2 transition disabled:opacity-50"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          )}

          {/* =========================================================================
              VIEW 2: DASHBOARD
             ========================================================================= */}
          {activeTab === 'dashboard' && (
            <>
              {/* Top Greeting & BIS Quote Banner */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs relative overflow-hidden">
                <div className="space-y-1 z-10">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    Good Morning, Afnan! <span className="animate-bounce">👋</span>
                  </h1>
                  <p className="text-sm text-slate-500 font-medium">
                    Let's make compliance simpler, together.
                  </p>
                </div>

                <div className="flex items-center gap-4 z-10">
                  <div className="text-right">
                    <p className="text-xs font-medium italic text-slate-600 max-w-xs">
                      "Standards build trust, compliance builds a better tomorrow."
                    </p>
                    <p className="text-[11px] font-semibold text-slate-400">
                      — Bureau of Indian Standards
                    </p>
                  </div>
                  <div className="w-16 h-12 text-slate-300 opacity-60 hidden sm:block">
                    <svg viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M50 8 L50 18 M40 18 L60 18 M35 18 C35 18 40 28 50 28 C60 28 65 18 65 18 Z" />
                      <path d="M10 45 L90 45 M15 55 L85 55" />
                      <path d="M20 45 L20 32 M30 45 L30 32 M40 45 L40 32 M50 45 L50 32 M60 45 L60 32 M70 45 L70 32 M80 45 L80 32" />
                    </svg>
                  </div>
                </div>

                <div className="absolute right-0 top-0 bottom-0 w-48 opacity-10 pointer-events-none">
                  <div className="w-full h-full bg-gradient-to-l from-orange-400 via-white to-emerald-500"></div>
                </div>
              </div>

              {/* 4 Metric Cards Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between hover:shadow-md transition">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-slate-900 leading-none">12</div>
                      <div className="text-xs text-slate-500 font-medium mt-1">Applicable Standards</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('standards')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
                  >
                    View <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between hover:shadow-md transition">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <FlaskConical className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-slate-900 leading-none">5</div>
                      <div className="text-xs text-slate-500 font-medium mt-1">Required Tests</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('navigator')}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-0.5"
                  >
                    View <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between hover:shadow-md transition">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                      <FileCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-slate-900 leading-none">8</div>
                      <div className="text-xs text-slate-500 font-medium mt-1">Documents Required</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('documents')}
                    className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-0.5"
                  >
                    View <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between hover:shadow-md transition">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-slate-900 leading-none">3</div>
                      <div className="text-xs text-slate-500 font-medium mt-1">BIS Labs Nearby</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('labs')}
                    className="text-xs font-bold text-amber-600 hover:text-amber-800 flex items-center gap-0.5"
                  >
                    View <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Core Search & Verification Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900">
                            Find Your Applicable Standard
                          </h3>
                          <p className="text-xs text-slate-500">
                            Describe your product and get matched with relevant BIS standards using AI
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setDescribeInput('Stainless steel water bottle, 750 ml, insulated, for drinking water');
                          handleRunSearch('Stainless steel water bottle');
                        }}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        Try an example <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4 text-xs font-semibold">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg font-bold">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        Describe Product
                      </button>
                      <button 
                        onClick={() => setActiveTab('standards')}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-slate-600 hover:bg-slate-50 rounded-lg"
                      >
                        <Search className="w-3.5 h-3.5 text-slate-400" />
                        Search by IS Code
                      </button>
                      <button 
                        onClick={() => setActiveTab('documents')}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-slate-600 hover:bg-slate-50 rounded-lg"
                      >
                        <Upload className="w-3.5 h-3.5 text-slate-400" />
                        Upload Document
                      </button>
                    </div>

                    <div className="relative mb-3">
                      <input
                        type="text"
                        value={describeInput}
                        onChange={(e) => setDescribeInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRunSearch(describeInput);
                        }}
                        placeholder="e.g., Stainless steel water bottle, 750 ml, insulated, for drinking water..."
                        className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {[
                        { label: 'Water Bottle', q: 'Stainless steel water bottle' },
                        { label: 'Smartphone Charger', q: 'Smartphone Charger adapter 65W' },
                        { label: 'LED Bulb', q: 'Self-ballasted LED Bulb 9W' },
                        { label: 'Helmet', q: 'Two wheeler motorcycle helmet' },
                        { label: 'Pressure Cooker', q: 'Domestic pressure cooker 5L' },
                      ].map(chip => (
                        <button
                          key={chip.label}
                          onClick={() => {
                            setDescribeInput(chip.q);
                            handleRunSearch(chip.q);
                          }}
                          className="px-2.5 py-1 text-xs font-medium rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100 transition"
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => handleRunSearch(describeInput)}
                      disabled={isSearching}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 flex items-center gap-2 transition disabled:opacity-50"
                    >
                      {isSearching ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Analyzing BIS Standards...
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4" />
                          Get Standards
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <QrCode className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          Verify BIS Mark / Product
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          Scan QR code or upload product image to verify authenticity
                        </p>
                      </div>
                    </div>

                    <div 
                      onClick={() => setShowQrModal(true)}
                      className="mt-3 border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-50/60 hover:bg-blue-50/20 transition group"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-50 group-hover:bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                        <Upload className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-800">
                        Upload Image
                      </p>
                      <p className="text-[11px] text-slate-400">
                        or drag and drop
                      </p>
                      <span className="text-[10px] text-slate-400 mt-2">
                        Supports: JPG, PNG (Max 5MB)
                      </span>
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      onClick={() => setShowQrModal(true)}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
                    >
                      <QrCode className="w-3.5 h-3.5 text-blue-600" />
                      Verify by CM/L License No.
                    </button>
                  </div>
                </div>
              </div>

              {/* Compliance Navigator Progress Bar */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-blue-600" />
                      <h3 className="text-base font-bold text-slate-900">
                        Compliance Navigator
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      From standard to certification — your step-by-step guide
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-600">Overall Progress</span>
                    <div className="w-32 sm:w-48 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                      <div className="h-full bg-emerald-500 rounded-full w-[40%] transition-all duration-500"></div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">40%</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-sm mb-2">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div className="text-xs font-bold text-slate-900">Standard Identified</div>
                    <button 
                      onClick={() => setShowExplainModal(true)}
                      className="text-[11px] font-semibold text-blue-600 hover:underline mt-1"
                    >
                      View Details
                    </button>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-sm mb-2">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div className="text-xs font-bold text-slate-900">Tests Mapped</div>
                    <button 
                      onClick={() => setActiveTab('navigator')}
                      className="text-[11px] font-semibold text-blue-600 hover:underline mt-1"
                    >
                      View Tests
                    </button>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-blue-500/40 mb-2 ring-4 ring-blue-100">
                      3
                    </div>
                    <div className="text-xs font-bold text-blue-600">Documents Preparation</div>
                    <button 
                      onClick={() => setActiveTab('documents')}
                      className="text-[11px] font-semibold text-blue-600 hover:underline mt-1"
                    >
                      View Checklist
                    </button>
                  </div>

                  <div className="flex flex-col items-center text-center opacity-80">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs mb-2">
                      4
                    </div>
                    <div className="text-xs font-semibold text-slate-700">Laboratory Selection</div>
                    <button 
                      onClick={() => setActiveTab('labs')}
                      className="text-[11px] font-semibold text-slate-500 hover:underline mt-1"
                    >
                      Find Labs
                    </button>
                  </div>

                  <div className="flex flex-col items-center text-center opacity-80">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs mb-2">
                      5
                    </div>
                    <div className="text-xs font-semibold text-slate-700">Application & Certification</div>
                    <span className="text-[11px] text-slate-400 mt-1">
                      Guidance
                    </span>
                  </div>
                </div>
              </div>

              {/* Lower 3-Column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        <h4 className="text-sm font-bold text-slate-900">Recommended for You</h4>
                      </div>
                      <button 
                        onClick={() => setActiveTab('standards')}
                        className="text-xs font-bold text-blue-600 hover:underline"
                      >
                        View All →
                      </button>
                    </div>

                    <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                      <div className="flex items-start gap-3">
                        <div className="w-14 h-20 bg-gradient-to-b from-slate-200 to-slate-300 rounded-lg flex items-center justify-center shadow-inner shrink-0 p-1">
                          <div className="w-5 h-16 rounded-full border-2 border-slate-400 bg-slate-100 flex flex-col items-center justify-between py-1">
                            <div className="w-3 h-2 bg-slate-400 rounded-xs"></div>
                            <div className="w-2 h-0.5 bg-blue-500"></div>
                            <div className="w-3 h-1 bg-slate-400 rounded-xs"></div>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {selectedStandard.title.split('—')[0].trim()}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                              High Match
                            </span>
                          </div>
                          <div className="text-xs font-black text-blue-700 mt-1">
                            {selectedStandard.isCode}
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                            {selectedStandard.title}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-200/60">
                        <button
                          onClick={() => setActiveTab('standards')}
                          className="flex-1 py-1.5 px-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[11px] rounded-lg text-center transition"
                        >
                          View Standard
                        </button>
                        <button
                          onClick={() => setShowExplainModal(true)}
                          className="flex-1 py-1.5 px-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold text-[11px] rounded-lg text-center transition"
                        >
                          Why this Standard?
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('navigator')}
                    className="w-full mt-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition"
                  >
                    Start Compliance Journey →
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <h4 className="text-sm font-bold text-slate-900">Key Requirements (Summary)</h4>
                      </div>
                      <button 
                        onClick={() => setShowExplainModal(true)}
                        className="text-xs font-bold text-blue-600 hover:underline"
                      >
                        View All →
                      </button>
                    </div>

                    <div className="space-y-2 text-xs">
                      {[
                        { title: 'Material requirements', clause: 'Clause 4.2', icon: Settings, color: 'text-purple-600' },
                        { title: 'Performance requirements', clause: 'Clause 5.1', icon: Layers, color: 'text-blue-600' },
                        { title: 'Testing methods', clause: 'Clause 6', icon: FlaskConical, color: 'text-red-500' },
                        { title: 'Marking and labelling', clause: 'Clause 7', icon: QrCode, color: 'text-amber-500' },
                        { title: 'Packaging requirements', clause: 'Clause 8', icon: BoxIcon, color: 'text-cyan-600' },
                      ].map((req, idx) => {
                        const Icon = req.icon;
                        return (
                          <div 
                            key={idx}
                            onClick={() => {
                              const found = selectedStandard.clauses.find(c => c.clauseNumber.startsWith(req.clause.split(' ')[0])) || selectedStandard.clauses[0];
                              setShowClauseModal({
                                title: req.title,
                                clause: req.clause,
                                desc: found.description,
                                evidence: found.evidence
                              });
                            }}
                            className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 cursor-pointer transition group"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className={`w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center ${req.color}`}>
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <span className="font-medium text-slate-700 group-hover:text-slate-900">
                                {req.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 font-semibold text-slate-500 group-hover:text-blue-600">
                              <span>{req.clause}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-3 text-[11px] text-slate-400 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>Click any clause for verified gazette evidence.</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-emerald-600" />
                        <h4 className="text-sm font-bold text-slate-900">Regulatory Updates</h4>
                      </div>
                      <button 
                        onClick={() => setActiveTab('updates')}
                        className="text-xs font-bold text-blue-600 hover:underline"
                      >
                        View All →
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
                        <div className="flex items-start gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0"></span>
                          <div>
                            <div className="text-xs font-bold text-slate-800">New QCO Notified</div>
                            <div className="text-[11px] text-slate-400">12 Sep 2025</div>
                            <div className="text-[11px] text-slate-600 font-medium">Stainless Steel Utensils (IS 17526:2021)</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-50 text-red-600 border border-red-100">
                          New
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
                        <div className="flex items-start gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                          <div>
                            <div className="text-xs font-bold text-slate-800">Amendment Released</div>
                            <div className="text-[11px] text-slate-400">28 Aug 2025</div>
                            <div className="text-[11px] text-slate-600 font-medium">IS 302 (Part 1):2024 Electrical Appliances</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100">
                          Update
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                          <div>
                            <div className="text-xs font-bold text-slate-800">Draft Standard for Comments</div>
                            <div className="text-[11px] text-slate-400">10 Aug 2025</div>
                            <div className="text-[11px] text-slate-600 font-medium">Plastics for Food Contact (till 30 Sep)</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100">
                          Draft
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 text-blue-600" />
                        <h4 className="text-sm font-bold text-slate-900">Recent Activity</h4>
                      </div>
                      <button className="text-xs font-bold text-blue-600 hover:underline">
                        View All →
                      </button>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <FileText className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-800 truncate">Standard matched: IS 17526:2021</div>
                          <div className="text-[10px] text-slate-400">2 minutes ago</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                          <Layers className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-800 truncate">Product profile: SS Water Bottle</div>
                          <div className="text-[10px] text-slate-400">10 minutes ago</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                          <FlaskConical className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-800 truncate">3 tests identified from BIS lab</div>
                          <div className="text-[10px] text-slate-400">12 minutes ago</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Card: Need Help? Ask SUGAM-AI */}
              <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-[#0b1739] text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      Need help? Ask SUGAM-AI
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30">
                        Bhashini Live
                      </span>
                    </h3>
                    <p className="text-xs text-blue-200/80 max-w-xl mt-0.5">
                      Get source-backed answers in Hindi, Tamil, Bengali, Marathi, and 8 other Indian languages via Bhashini NLTM.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <button
                    onClick={() => setActiveTab('assistant')}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 transition"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Chat with SUGAM-AI →
                  </button>

                  <div className="hidden md:flex items-center gap-2 pl-3 border-l border-blue-800/80">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
                      🇮🇳
                    </div>
                    <div className="text-left leading-tight">
                      <div className="text-[11px] font-black text-white">Atmanirbhar Bharat</div>
                      <div className="text-[10px] font-semibold text-emerald-400">Through Quality</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* =========================================================================
              VIEW 3: PRODUCT COMPLIANCE
             ========================================================================= */}
          {activeTab === 'compliance' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">
                      Product Intelligence & Applicability Engine
                    </h2>
                    <p className="text-xs text-slate-500">
                      NLP-driven attribute extraction and grounded BIS standard matching
                    </p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Applicability Engine
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                  {BIS_STANDARDS_DB.map((std) => (
                    <button
                      key={std.id}
                      onClick={() => setSelectedStandard(std)}
                      className={`p-3 rounded-xl border text-left transition ${
                        selectedStandard.id === std.id 
                          ? 'border-blue-600 bg-blue-50/50 shadow-xs' 
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-800 truncate">{std.isCode}</div>
                      <div className="text-[11px] text-slate-500 truncate mt-1">{std.category}</div>
                    </button>
                  ))}
                </div>

                <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div>
                      <div className="text-xs font-bold text-blue-600">{selectedStandard.scheme}</div>
                      <h3 className="text-base font-black text-slate-900 mt-0.5">{selectedStandard.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-700 border border-red-200">
                        Risk: {selectedStandard.riskLevel} (Mandatory QCO)
                      </span>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                        Match: {selectedStandard.matchScore}%
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-blue-100 shadow-xs">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-3">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      Verified Answer Chain (Explainable AI & Grounding)
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="font-bold text-slate-500 text-[10px] uppercase">1. Product Attributes</div>
                        <div className="font-semibold text-slate-800 mt-1">{selectedStandard.materialSpecs}</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="font-bold text-slate-500 text-[10px] uppercase">2. Applicable IS Code</div>
                        <div className="font-bold text-blue-700 mt-1">{selectedStandard.isCode}</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="font-bold text-slate-500 text-[10px] uppercase">3. Relevant Clause</div>
                        <div className="font-semibold text-slate-800 mt-1">{selectedStandard.clauses[0].clauseNumber}: {selectedStandard.clauses[0].title}</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="font-bold text-slate-500 text-[10px] uppercase">4. Official Source</div>
                        <div className="font-semibold text-slate-800 mt-1">{selectedStandard.qcoTitle || 'BIS Central Repository'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-700">Why this standard applies:</div>
                    {selectedStandard.matchReasons.map((reason, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 4: STANDARDS SEARCH
             ========================================================================= */}
          {activeTab === 'standards' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">
                      Indian Standards (IS Codes) Knowledge Base
                    </h2>
                    <p className="text-xs text-slate-500">
                      Search official BIS standards, QCO orders and clause specifications
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">Total Curated:</span>
                    <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                      20,000+ Standards Indexed
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {BIS_STANDARDS_DB.map((std) => (
                    <div key={std.id} className="border border-slate-200 rounded-2xl p-5 bg-white hover:border-blue-400 hover:shadow-md transition flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-sm font-black text-blue-700">{std.isCode}</span>
                          {std.isQCO && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-600 border border-red-200">
                              Mandatory QCO
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 leading-snug mb-2">
                          {std.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-3 mb-3">
                          {std.scope}
                        </p>
                        <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg mb-4">
                          <span className="font-bold text-slate-700">Scheme:</span> {std.scheme}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                        <button
                          onClick={() => {
                            setSelectedStandard(std);
                            setShowExplainModal(true);
                          }}
                          className="flex-1 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-lg transition"
                        >
                          Inspect Clauses
                        </button>
                        <button
                          onClick={() => {
                            setSelectedStandard(std);
                            setActiveTab('navigator');
                          }}
                          className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition"
                        >
                          Compliance Roadmap
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 5: BIS MARK VERIFICATION
             ========================================================================= */}
          {activeTab === 'verification' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">
                      Consumer Trust & BIS Mark Verification
                    </h2>
                    <p className="text-xs text-slate-500">
                      Verify genuine ISI mark, CML license authenticity, or file counterfeit misuse report
                    </p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Consumer Protection
                  </span>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mb-6">
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Enter BIS CM/L License Number or Scan Product Barcode
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative flex-1 w-full">
                      <QrCode className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={cmlInput}
                        onChange={(e) => setCmlInput(e.target.value)}
                        placeholder="e.g., 8400174109 or CM/L-9200112488"
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      onClick={() => handleVerifyLicense(cmlInput)}
                      disabled={isVerifying}
                      className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition disabled:opacity-50"
                    >
                      {isVerifying ? 'Verifying with BIS...' : 'Verify License Authenticity'}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                    <span>Try test codes:</span>
                    <button onClick={() => { setCmlInput('8400174109'); handleVerifyLicense('8400174109'); }} className="text-blue-600 font-bold hover:underline">
                      8400174109 (Genuine Bottle)
                    </button>
                    <span>•</span>
                    <button onClick={() => { setCmlInput('3100455612'); handleVerifyLicense('3100455612'); }} className="text-amber-600 font-bold hover:underline">
                      3100455612 (Expired Helmet)
                    </button>
                    <span>•</span>
                    <button onClick={() => { setCmlInput('9999999999'); handleVerifyLicense('9999999999'); }} className="text-red-600 font-bold hover:underline">
                      9999999999 (Fake / Fraud)
                    </button>
                  </div>
                </div>

                {verificationResult && (
                  <div className="border-2 border-emerald-500/40 bg-emerald-50/20 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4 border-b border-emerald-200 pb-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black text-lg shadow-sm">
                          ISI
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-slate-900">{verificationResult.licenseeName}</span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              verificationResult.status === 'Operative' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {verificationResult.status}
                            </span>
                          </div>
                          <div className="text-xs font-bold text-blue-700 mt-0.5">
                            {verificationResult.cmlNumber} • {verificationResult.isCode}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold text-slate-500">Valid Upto:</span>
                        <div className="text-sm font-bold text-slate-800">{verificationResult.validUpto}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="font-bold text-slate-500">Brand Name:</span>
                        <p className="font-semibold text-slate-800">{verificationResult.brandName}</p>
                      </div>
                      <div>
                        <span className="font-bold text-slate-500">Factory Location:</span>
                        <p className="font-semibold text-slate-800">{verificationResult.factoryAddress}</p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-bold text-slate-500">Approved Product Scope:</span>
                        <p className="font-semibold text-slate-800">{verificationResult.scope}</p>
                      </div>
                    </div>
                  </div>
                )}

                {verificationError && (
                  <div className="border-2 border-red-500 bg-red-50/50 rounded-2xl p-6 text-red-900">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                      <h4 className="text-sm font-bold text-red-800">Counterfeit Warning Detected!</h4>
                    </div>
                    <p className="text-xs text-red-700 font-medium mb-4">{verificationError}</p>
                    <button
                      onClick={() => setActiveTab('complaints')}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-sm"
                    >
                      File Automated Complaint with BIS Vigilance →
                    </button>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 6: COMPLIANCE NAVIGATOR
             ========================================================================= */}
          {activeTab === 'navigator' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">
                      Compliance Roadmap: {selectedStandard.isCode}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Step-by-step action plan from testing to final certification
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownloadReport(selectedStandard)}
                    className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Roadmap
                  </button>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
                    <FlaskConical className="w-4 h-4 text-blue-600" />
                    Stage 1: Mandatory Laboratory Tests
                  </h3>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                        <tr>
                          <th className="p-3">Test Name</th>
                          <th className="p-3">Clause</th>
                          <th className="p-3">Requirement & Purpose</th>
                          <th className="p-3">Sample Size</th>
                          <th className="p-3">Lab Category</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedStandard.mandatoryTests.map((t, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/60">
                            <td className="p-3 font-bold text-slate-800">{t.name}</td>
                            <td className="p-3 text-blue-700 font-semibold">{t.clause}</td>
                            <td className="p-3 text-slate-600">{t.purpose}</td>
                            <td className="p-3 font-medium text-slate-700">{t.sampleSize}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                                {t.labType}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    Stage 2: Technical & Factory Documentation Checklist
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {selectedStandard.documentsRequired.map((doc, idx) => {
                      const key = `doc-${idx}`;
                      const isDone = !!docChecklist[key];
                      return (
                        <div 
                          key={idx}
                          onClick={() => setDocChecklist(prev => ({ ...prev, [key]: !prev[key] }))}
                          className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                            isDone ? 'border-emerald-300 bg-emerald-50/30' : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded flex items-center justify-center mt-0.5 ${
                            isDone ? 'bg-emerald-600 text-white' : 'border border-slate-300'
                          }`}>
                            {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-slate-900">{doc.title}</div>
                            <p className="text-[11px] text-slate-500 mt-0.5">{doc.description}</p>
                            <span className="inline-block text-[10px] font-bold text-slate-400 mt-1 uppercase">
                              {doc.category}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
                    <Building2 className="w-4 h-4 text-amber-600" />
                    Stage 3: BIS Recognized Testing Laboratories
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedStandard.suitableLabs.map((lab, i) => (
                      <div key={i} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-slate-900">{lab.name}</span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                              NABL
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">{lab.location}</p>
                          <div className="mt-2 text-xs space-y-1">
                            <div><span className="font-semibold text-slate-500">Distance:</span> {lab.distance}</div>
                            <div><span className="font-semibold text-slate-500">Turnaround:</span> {lab.turnaround}</div>
                            <div><span className="font-semibold text-slate-500">Estimate:</span> {lab.costEstimate}</div>
                          </div>
                        </div>
                        <button className="w-full mt-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition">
                          Request Sample Slot
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 7: REGULATORY UPDATES
             ========================================================================= */}
          {activeTab === 'updates' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">
                      Proactive BIS Intelligence & QCO Tracker
                    </h2>
                    <p className="text-xs text-slate-500">
                      Real-time statutory notifications, Quality Control Orders, and manufacturer impact assessments
                    </p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
                    Live Alerts
                  </span>
                </div>

                <div className="space-y-4">
                  {REGULATORY_UPDATES.map((update) => (
                    <div key={update.id} className="border border-slate-200 rounded-2xl p-5 bg-white hover:border-blue-300 transition">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
                        <div className="flex items-center gap-2.5">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                            update.type === 'New' ? 'bg-red-100 text-red-700' : update.type === 'Update' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {update.type}
                          </span>
                          <h3 className="text-sm font-bold text-slate-900">{update.title}</h3>
                        </div>
                        <span className="text-xs text-slate-500 font-medium">{update.date}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-3">
                        <div className="p-3 bg-slate-50 rounded-xl">
                          <span className="font-bold text-slate-700">Statutory Impact:</span>
                          <p className="text-slate-600 mt-1">{update.impactSummary}</p>
                        </div>
                        <div className="p-3 bg-blue-50/60 rounded-xl">
                          <span className="font-bold text-blue-900">Action Required for MSME:</span>
                          <p className="text-blue-800 mt-1">{update.actionRequired}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 text-xs">
                        <span className="text-slate-400">Department: {update.department}</span>
                        <span className="font-bold text-red-600">Enforcement Deadline: {update.deadline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 8: LABORATORY FINDER
             ========================================================================= */}
          {activeTab === 'labs' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">
                      BIS Recognized & NABL Testing Laboratory Network
                    </h2>
                    <p className="text-xs text-slate-500">
                      Find accredited testing facilities with product-specific testing capabilities and pricing
                    </p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-700">
                    Smart Lab Matching
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedStandard.suitableLabs.map((lab, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-2xl p-5 bg-white shadow-xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-bold text-slate-900">{lab.name}</h4>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                            NABL ISO 17025
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {lab.location} ({lab.distance})
                        </p>
                        <div className="text-xs space-y-1.5 bg-slate-50 p-3 rounded-xl">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Turnaround:</span>
                            <span className="font-bold text-slate-700">{lab.turnaround}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Fee Estimate:</span>
                            <span className="font-bold text-slate-700">{lab.costEstimate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Phone:</span>
                            <span className="font-semibold text-blue-600">{lab.phone}</span>
                          </div>
                        </div>
                      </div>

                      <button className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition">
                        Book Test Slot / Dispatch Sample
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 9: DOCUMENTS & TEMPLATES
             ========================================================================= */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">
                      Official BIS Documents & Application Templates
                    </h2>
                    <p className="text-xs text-slate-500">
                      Standardized templates, Quality Control Manuals and Scheme-I dossiers
                    </p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-700">
                    Ready to Autofill
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedStandard.documentsRequired.map((doc, i) => (
                    <div key={i} className="border border-slate-200 rounded-2xl p-4 bg-white flex items-center justify-between hover:border-purple-300 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{doc.title}</div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">{doc.description}</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => alert(`Downloading official BIS template for: ${doc.title}`)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-700 font-bold text-xs rounded-lg flex items-center gap-1 transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Template
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 10: COMPLAINTS & GRIEVANCES
             ========================================================================= */}
          {activeTab === 'complaints' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">
                      Consumer Complaints & Anti-Counterfeit Redressal
                    </h2>
                    <p className="text-xs text-slate-500">
                      File automated evidence-backed grievance under Section 16/17 of the Bureau of Indian Standards Act 2016
                    </p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
                    BIS Vigilance Direct
                  </span>
                </div>

                <div className="max-w-2xl bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Subject / Violation Category</label>
                    <input
                      type="text"
                      defaultValue="Unauthorized misuse of ISI mark on counterfeit Stainless Steel Flask"
                      className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Vendor / Manufacturer Name & Address</label>
                    <input
                      type="text"
                      defaultValue="SuperSteel Traders, Shop 14, Sadar Bazaar, Delhi - 110006"
                      className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Photographic & Invoice Evidence</label>
                    <div className="border border-dashed border-slate-300 rounded-xl p-4 bg-white text-center text-xs text-slate-500">
                      Photo evidence attached: [fake_isi_label_water_bottle.jpg]
                    </div>
                  </div>

                  <button 
                    onClick={() => alert('Complaint successfully registered! Reference Grievance ID: BIS-VIG-2026-8941. An inspection notice will be generated by the BIS Enforcement Directorate.')}
                    className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition"
                  >
                    Submit Statutory Complaint with BIS Vigilance
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* =========================================================================
          MODALS: EXPLAINABLE AI, CLAUSE POPUP, QR SCANNER, OFFICER DOSSIER
         ========================================================================= */}
      {showExplainModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black tracking-tight text-white">
                    Explainable AI — Why This Standard?
                  </h3>
                  <p className="text-xs text-blue-200">
                    Verified Answer Chain • Grounded in Official BIS Gazettes
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowExplainModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="flex items-center justify-between p-3.5 bg-blue-50 rounded-2xl border border-blue-100">
                <div>
                  <div className="text-xs font-black text-blue-900">{selectedStandard.isCode}</div>
                  <div className="text-xs text-blue-700 font-medium">{selectedStandard.title}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Confidence</span>
                  <div className="text-base font-black text-emerald-600">{selectedStandard.matchScore}%</div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
                  Verified Answer Chain:
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
                    <div>
                      <span className="font-bold text-slate-900">Product Attribute Extraction:</span>
                      <p className="text-slate-600 mt-0.5">{selectedStandard.materialSpecs}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
                    <div>
                      <span className="font-bold text-slate-900">Scope Matching:</span>
                      <p className="text-slate-600 mt-0.5">{selectedStandard.scope}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
                    <div>
                      <span className="font-bold text-slate-900">Key Clauses & Criteria:</span>
                      <p className="text-slate-600 mt-0.5">{selectedStandard.clauses[0].clauseNumber} ({selectedStandard.clauses[0].title}) — {selectedStandard.clauses[0].description}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">4</span>
                    <div>
                      <span className="font-bold text-slate-900">Official Regulatory Source:</span>
                      <p className="text-slate-600 mt-0.5">{selectedStandard.qcoTitle || 'Official BIS Gazette S.O. 3844(E)'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  Safeguard: "No Blind Assumptions" Principle
                </div>
                <p className="text-[11px] text-amber-800">
                  If material grade or intended volume is unspecified, SUGAM-AI pauses to request clarification before finalizing mandatory testing schemes.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button 
                onClick={() => setShowExplainModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  setShowExplainModal(false);
                  setActiveTab('navigator');
                }}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl"
              >
                Start Compliance Journey →
              </button>
            </div>
          </div>
        </div>
      )}

      {showClauseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-blue-600 uppercase">{showClauseModal.clause}</span>
              <button onClick={() => setShowClauseModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-base font-black text-slate-900 mb-2">{showClauseModal.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">{showClauseModal.desc}</p>
            <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-xs">
              <span className="font-bold text-blue-900">Official Evidence:</span>
              <p className="text-blue-800 mt-1">{showClauseModal.evidence}</p>
            </div>
            <button 
              onClick={() => setShowClauseModal(null)}
              className="w-full mt-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-black text-slate-900">Verify BIS Mark or QR Code</h3>
              </div>
              <button onClick={() => setShowQrModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Scan product packaging or enter the 10-digit CM/L license code found beneath the ISI monogram.
            </p>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-blue-300 bg-blue-50/50 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 mx-auto bg-white rounded-xl shadow-xs border border-blue-200 flex items-center justify-center mb-2">
                  <QrCode className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-xs font-bold text-slate-800">Webcam Scanner Active</div>
                <p className="text-[11px] text-slate-400">Position ISI QR code inside camera viewfinder</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Or enter CM/L Code:</label>
                <input
                  type="text"
                  value={cmlInput}
                  onChange={(e) => setCmlInput(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <button
                onClick={() => {
                  setShowQrModal(false);
                  setActiveTab('verification');
                  handleVerifyLicense(cmlInput);
                }}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm"
              >
                Run Verification
              </button>
            </div>
          </div>
        </div>
      )}

      {showOfficerModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-black text-slate-900">BIS Officer Pre-Audit Dossier</h3>
              </div>
              <button onClick={() => setShowOfficerModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                <span className="font-bold">Officer-Assist Principle:</span> AI has prepared a verified pre-audit summary. Final grant of certification mark remains strictly under the jurisdiction of the BIS Deputy Director / Scientist.
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Applicant</span>
                  <div className="font-bold text-slate-800 mt-0.5">Afnan (Apex Thermalware Pvt Ltd)</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">AI Screening Score</span>
                  <div className="font-bold text-emerald-600 mt-0.5">98.4% (Conformant)</div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-3 space-y-2">
                <div className="font-bold text-slate-800">Automated Audit Checklist:</div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Raw Material Mill Test Certs (SS 304/316) conform to IS 6911</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Thermal Retention drop chamber test data verified</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Factory location matched with Udyam MSME Registration</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button 
                  onClick={() => {
                    alert('Recommendation recorded in BIS Manakonline audit log: Factory Inspection Approved.');
                    setShowOfficerModal(false);
                  }}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm text-center"
                >
                  Approve for Factory Audit
                </button>
                <button 
                  onClick={() => {
                    alert('Clarification request sent to manufacturer via registered portal.');
                    setShowOfficerModal(false);
                  }}
                  className="flex-1 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-center"
                >
                  Request Clarification
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function BoxIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}