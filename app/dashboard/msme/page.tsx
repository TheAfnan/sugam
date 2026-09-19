'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import RoleGuard from '@/components/auth/RoleGuard';
import { useAuth } from '@/lib/useAuth';
import { 
  Building2, ShieldCheck, Clock, DollarSign, 
  FlaskConical, CheckCircle2, FileText, 
  Download, Calendar, Sparkles
} from 'lucide-react';

export default function MsmeDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'licenses' | 'subsidies' | 'sit' | 'samples'>('licenses');
  const [testingCostInput, setTestingCostInput] = useState(50000);

  return (
    <RoleGuard allowedRoles={['msme', 'admin']}>
      <div className="max-w-7xl mx-auto space-y-7">
        
        {/* Unified Executive Header */}
        <div className="bg-slate-900 rounded-3xl p-7 text-white shadow-sm border border-slate-800 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-bold mb-2.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>Factory & License Manager</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                {user?.companyName || 'Bharat Precision Fasteners Pvt Ltd'}
              </h1>
              <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Udyam Registration: <span className="font-mono font-bold text-white">{user?.udyamNumber || 'UDYAM-DL-01-0029481'}</span> • License (CM/L): <span className="font-mono font-bold text-white">{user?.cmNumber || 'CM/L-8400174109'}</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <Link
                href="/timeline"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
              >
                <DollarSign className="w-4 h-4 text-teal-300" />
                <span>Calculate Fee Savings</span>
              </Link>
              <Link
                href="/chat"
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-extrabold rounded-xl text-xs shadow-md transition flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ask AI Assistant</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Clean Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Licenses</span>
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-slate-900">2 Active</div>
              <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Valid & In Good Standing</span>
              </div>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">MSME Fee Savings</span>
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-slate-900">₹68,500 Saved</div>
              <div className="text-xs font-semibold text-slate-500 mt-1">
                80% off on application, 50% off on testing
              </div>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Next Quality Visit</span>
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-slate-900">In 42 Days</div>
              <div className="text-xs font-semibold text-slate-500 mt-1">
                Assigned Officer: Amit Saxena
              </div>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Daily Testing Checks</span>
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <FlaskConical className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-slate-900">95% Complete</div>
              <div className="text-xs font-semibold text-emerald-600 mt-1">
                Ready for quality inspection
              </div>
            </div>
          </div>
        </div>

        {/* Clean Underline Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200">
          {[
            { id: 'licenses', label: 'Your Active Licenses' },
            { id: 'subsidies', label: 'MSME Fee Discount Calculator' },
            { id: 'sit', label: 'Factory Quality Checklist' },
            { id: 'samples', label: 'Lab Test Sample Status' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: LICENSES */}
        {activeTab === 'licenses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Card 1 */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                    Active • ISI Mark
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-1 font-mono">
                    CM/L-8400174109
                  </h3>
                  <p className="text-xs font-bold text-slate-700 mt-0.5">
                    IS 17526:2021 — Stainless Steel Water Bottles
                  </p>
                </div>
                <div className="w-11 h-11 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-800 font-extrabold text-sm border border-slate-200">
                  ISI
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Valid Until</span>
                  <p className="font-bold text-slate-800">31-Oct-2027</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Yearly Fee</span>
                  <p className="font-bold text-slate-800">₹32,000 / year</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Factory Address</span>
                  <p className="font-bold text-slate-800 truncate">Plot 14, Sector 58, Ballabgarh</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">BIS Branch Office</span>
                  <p className="font-bold text-slate-800">Delhi Branch Office-I</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button 
                  onClick={() => alert('Downloading official BIS License Certificate (PDF)...')}
                  className="flex-1 py-2.5 px-3 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download License</span>
                </button>
                <button 
                  onClick={() => alert('Renewal portal: You are eligible for 50% MSME concession on renewal.')}
                  className="py-2.5 px-4 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Renew
                </button>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                    Active • Electrical Safety
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-1 font-mono">
                    CM/L-7200192341
                  </h3>
                  <p className="text-xs font-bold text-slate-700 mt-0.5">
                    IS 302-2-14:2009 — Electric Food Mixers & Grinders
                  </p>
                </div>
                <div className="w-11 h-11 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-800 font-extrabold text-sm border border-slate-200">
                  ISI
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Valid Until</span>
                  <p className="font-bold text-slate-800">15-Jan-2027</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Yearly Fee</span>
                  <p className="font-bold text-slate-800">₹44,000 / year</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Factory Address</span>
                  <p className="font-bold text-slate-800 truncate">Phase-II Industrial Area, Manesar</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">BIS Branch Office</span>
                  <p className="font-bold text-slate-800">Faridabad Branch Office</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button 
                  onClick={() => alert('Downloading official BIS License Certificate (PDF)...')}
                  className="flex-1 py-2.5 px-3 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download License</span>
                </button>
                <button 
                  onClick={() => alert('Renewal opens 90 days before expiration date.')}
                  className="py-2.5 px-4 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Renew
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: SUBSIDY CALCULATOR */}
        {activeTab === 'subsidies' && (
          <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-6">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                MSME Fee Discount Calculator
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                If you have an Udyam Certificate, you get an 80% discount on the application fee and a 50% discount on laboratory testing fees.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 space-y-4 p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Normal Lab Testing Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={testingCostInput}
                    onChange={(e) => setTestingCostInput(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="text-xs text-slate-600 space-y-2 pt-1">
                  <div className="flex justify-between font-semibold">
                    <span>Udyam Status:</span>
                    <span className="font-bold text-emerald-700">Verified MSME</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Regular Application Fee:</span>
                    <span className="line-through text-slate-400">₹5,000</span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-700">
                    <span>Your Application Fee:</span>
                    <span>₹1,000 (80% Off)</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 bg-slate-100 text-slate-800 rounded-2xl border border-slate-200 flex flex-col justify-between">
                  <div>
                    <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                      Normal Total Cost
                    </span>
                    <div className="text-3xl font-black mt-2 font-mono text-slate-900">
                      ₹{(5000 + testingCostInput).toLocaleString('en-IN')}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2">
                      Cost without MSME discount benefits.
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-teal-600 text-white rounded-2xl flex flex-col justify-between shadow-sm">
                  <div>
                    <span className="text-xs uppercase font-bold text-teal-200 tracking-wider">
                      Your Discounted Cost
                    </span>
                    <div className="text-3xl font-black mt-2 font-mono">
                      ₹{(1000 + Math.round(testingCostInput * 0.5)).toLocaleString('en-IN')}
                    </div>
                    <p className="text-[11px] text-teal-100 mt-2 font-medium">
                      You save ₹{(4000 + Math.round(testingCostInput * 0.5)).toLocaleString('en-IN')} with your MSME certificate!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: QUALITY CHECKLIST */}
        {activeTab === 'sit' && (
          <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Daily Quality Checks for Your Factory
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Keep these simple routine tests up to date so your factory inspection goes smoothly.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                { title: 'Temperature Test (Hot & Cold Retention)', freq: '1 in every 500 bottles', status: 'Done', log: 'Today, 09:30 AM' },
                { title: 'Steel Material Food-Grade Quality Check', freq: 'Every incoming steel batch', status: 'Done', log: 'Yesterday' },
                { title: 'Drop & Leak-Proof Test', freq: '5 bottles per production shift', status: 'Done', log: 'Today, 11:15 AM' },
                { title: 'Testing Machine Calibration Check', freq: 'Every 2 months', status: 'Up to Date', log: 'Valid till Nov 2026' },
                { title: 'Sample Storage Room Records', freq: 'Keep samples for 6 months', status: 'Done', log: 'Batch #890 recorded' },
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                      ✓
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">{item.title}</div>
                      <div className="text-[11px] text-slate-500">How often: {item.freq} • Last checked: {item.log}</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-[10px] font-bold">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SAMPLES STATUS */}
        {activeTab === 'samples' && (
          <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Lab Test Sample Status
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Track the progress of test samples sent to approved laboratories.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sample Tracking Number</span>
                  <div className="text-sm font-black font-mono text-slate-900">SMP-DEL-2026-0814</div>
                </div>
                <span className="px-3 py-1 bg-teal-50 text-teal-800 border border-teal-200 rounded-full text-xs font-bold">
                  Testing in Progress (Stage 3 of 4)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Testing Lab</span>
                  <p className="font-bold text-slate-800">Shriram Testing Institute, Delhi</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Results Expected</span>
                  <p className="font-bold text-slate-800">Within 4 working days</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Tests Being Done</span>
                  <p className="font-bold text-slate-800">Rust Resistance & Safe Materials</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </RoleGuard>
  );
}
