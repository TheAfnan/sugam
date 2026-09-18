'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import RoleGuard from '@/components/auth/RoleGuard';
import { useAuth } from '@/lib/useAuth';
import { 
  Building2, ShieldCheck, Award, Clock, DollarSign, 
  FlaskConical, CheckCircle2, AlertTriangle, FileText, 
  Download, ArrowUpRight, ChevronRight, Calendar, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function MsmeDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'licenses' | 'subsidies' | 'sit' | 'samples'>('licenses');
  const [subsidyCalculated, setSubsidyCalculated] = useState(false);
  const [testingCostInput, setTestingCostInput] = useState(50000);

  return (
    <RoleGuard allowedRoles={['msme', 'admin']}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-stone-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-200 text-xs font-bold mb-3">
                <Building2 className="w-3.5 h-3.5 text-amber-300" />
                <span>MSME Regulated Manufacturer Workspace</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                {user?.companyName || 'Bharat Precision Fasteners Pvt Ltd'}
              </h1>
              <p className="text-xs md:text-sm text-amber-100/80 mt-1 max-w-2xl leading-relaxed">
                Udyam ID: <span className="font-mono font-bold text-white">{user?.udyamNumber || 'UDYAM-DL-01-0029481'}</span> • Active CM/L: <span className="font-mono font-bold text-white">{user?.cmNumber || 'CM/L-8400174109'}</span> • Small Enterprise Category
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <Link
                href="/timeline"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold backdrop-blur-md transition shadow-xs flex items-center gap-1.5"
              >
                <DollarSign className="w-4 h-4 text-amber-300" />
                <span>Subsidy Calculator</span>
              </Link>
              <Link
                href="/chat"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-amber-950 font-extrabold rounded-xl text-xs shadow-md shadow-amber-500/30 transition flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ask SUGAM AI</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Licenses</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-slate-900">2 CM/L</div>
              <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>100% Operative & Valid</span>
              </div>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">MSME Concessions</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-slate-900">₹68,500</div>
              <div className="text-xs font-semibold text-amber-700 mt-1">
                80% App + 50% Lab Test Rebate
              </div>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Surveillance Audit</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-slate-900">In 42 Days</div>
              <div className="text-xs font-semibold text-blue-600 mt-1">
                Er. Amit Saxena (Scientist D)
              </div>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">SIT Compliance</span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <FlaskConical className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-slate-900">94.8%</div>
              <div className="text-xs font-semibold text-purple-600 mt-1">
                Daily QA Routine Logs Verified
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200">
          {[
            { id: 'licenses', label: 'Operative CM/L Licenses' },
            { id: 'subsidies', label: 'MSME Concession Calculator' },
            { id: 'sit', label: 'Scheme of Inspection & Testing (SIT)' },
            { id: 'samples', label: 'Lab Sample Dispatch Status' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'border-amber-600 text-amber-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OPERATIVE LICENSES */}
        {activeTab === 'licenses' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* License Card 1 */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                      Operative • ISI Mark
                    </span>
                    <h3 className="text-lg font-black text-slate-900 mt-1 font-mono">
                      CM/L-8400174109
                    </h3>
                    <p className="text-xs font-bold text-slate-600 mt-0.5">
                      IS 17526:2021 — Stainless Steel Vacuum Bottles
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-700 font-bold border border-amber-200">
                    ISI
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Valid Upto</span>
                    <p className="font-bold text-slate-800">31-Oct-2027</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Annual Marking Fee</span>
                    <p className="font-bold text-slate-800">₹32,000 / annum</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Factory Unit</span>
                    <p className="font-bold text-slate-800 truncate">Plot 14, Sector 58, Ballabgarh</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Nodal Branch</span>
                    <p className="font-bold text-slate-800">Delhi Branch Office-I</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button 
                    onClick={() => alert('Downloading official BIS CM/L License Endorsement Certificate (PDF)...')}
                    className="flex-1 py-2 px-3 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Endorsement</span>
                  </button>
                  <button 
                    onClick={() => alert('Annual marking fee portal open: You qualify for 50% MSME concession under Notification S.O. 1290(E).')}
                    className="py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    Renew License
                  </button>
                </div>
              </div>

              {/* License Card 2 */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                      Operative • Safety Standard
                    </span>
                    <h3 className="text-lg font-black text-slate-900 mt-1 font-mono">
                      CM/L-7200192341
                    </h3>
                    <p className="text-xs font-bold text-slate-600 mt-0.5">
                      IS 302-2-14:2009 — Electric Food Mixers & Grinders
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-700 font-bold border border-blue-200">
                    ISI
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Valid Upto</span>
                    <p className="font-bold text-slate-800">15-Jan-2027</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Annual Marking Fee</span>
                    <p className="font-bold text-slate-800">₹44,000 / annum</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Factory Unit</span>
                    <p className="font-bold text-slate-800 truncate">Phase-II Industrial Area, Manesar</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Nodal Branch</span>
                    <p className="font-bold text-slate-800">Faridabad Branch Office</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button 
                    onClick={() => alert('Downloading official BIS CM/L License Endorsement Certificate (PDF)...')}
                    className="flex-1 py-2 px-3 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Endorsement</span>
                  </button>
                  <button 
                    onClick={() => alert('Renewal audit window opens 90 days before expiry date.')}
                    className="py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    Audit Calendar
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: MSME SUBSIDY CALCULATOR */}
        {activeTab === 'subsidies' && (
          <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-6">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                BIS Micro & Small Enterprise (MSE) Fee Concession Engine
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                As per Ministry of Consumer Affairs circular, verified Udyam holders receive an 80% waiver on application fees and a 50% concession on testing charges.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 space-y-4 p-5 bg-amber-50/70 border border-amber-200 rounded-2xl">
                <div>
                  <label className="block text-xs font-bold text-amber-950 mb-1">
                    Standard Laboratory Testing Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={testingCostInput}
                    onChange={(e) => setTestingCostInput(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-white border border-amber-300 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="text-xs text-amber-900 space-y-2">
                  <div className="flex justify-between font-semibold">
                    <span>Udyam Category:</span>
                    <span className="font-bold text-amber-950">Small (50% Concession)</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Regular Application:</span>
                    <span className="line-through text-slate-400">₹5,000</span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-700">
                    <span>MSME Application Fee:</span>
                    <span>₹1,000 (80% Off)</span>
                  </div>
                </div>

                <button
                  onClick={() => setSubsidyCalculated(true)}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm transition cursor-pointer"
                >
                  Recalculate Savings
                </button>
              </div>

              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 bg-slate-900 text-white rounded-2xl flex flex-col justify-between">
                  <div>
                    <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                      Total Regular BIS Cost
                    </span>
                    <div className="text-3xl font-black mt-2 font-mono">
                      ₹{(5000 + testingCostInput).toLocaleString('en-IN')}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2">
                      Standard fee schedule without active MSME Udyam credentials.
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl flex flex-col justify-between shadow-md shadow-emerald-700/20">
                  <div>
                    <span className="text-xs uppercase font-bold text-emerald-200 tracking-wider">
                      Your Subsidized MSME Cost
                    </span>
                    <div className="text-3xl font-black mt-2 font-mono">
                      ₹{(1000 + Math.round(testingCostInput * 0.5)).toLocaleString('en-IN')}
                    </div>
                    <p className="text-[11px] text-emerald-100/80 mt-2 font-medium">
                      Net MSME Savings: ₹{(4000 + Math.round(testingCostInput * 0.5)).toLocaleString('en-IN')} per testing cycle!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SIT AUDIT CHECKLIST */}
        {activeTab === 'sit' && (
          <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Scheme of Inspection and Testing (SIT) In-Plant Checklist
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Mandatory routine factory testing requirements for IS 17526:2021 to satisfy surveillance officer audits.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                { title: 'Vacuum Thermal Retention Test (Clause 4.2)', freq: '1 in every 500 units', status: 'Compliant', log: 'Today, 09:30 AM' },
                { title: 'Food Grade Material Toxicity Screening (Clause 5.1)', freq: 'Every raw material steel coil', status: 'Compliant', log: 'Yesterday' },
                { title: 'Drop Impact & Leakage Pressure Test (Clause 6.3)', freq: '5 units per production shift', status: 'Compliant', log: 'Today, 11:15 AM' },
                { title: 'In-House Calibration of Pressure Transducers', freq: 'Bi-monthly by NABL lab', status: 'Valid till 28-Nov', log: 'Calibrated by NABL-042' },
                { title: 'Retained Sample Storage Room Logging', freq: '6 months retention period', status: 'Compliant', log: 'Batch #890 logged' },
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      ✓
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">{item.title}</div>
                      <div className="text-[11px] text-slate-500">Frequency: {item.freq} • Last Log: {item.log}</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-[10px] font-bold">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SAMPLES DISPATCH */}
        {activeTab === 'samples' && (
          <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Surveillance Sample Dispatch & Lab Tracking
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Real-time tracking of sealed factory samples drawn during periodic inspections.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sample Consignment #</span>
                  <div className="text-sm font-black font-mono text-slate-900">SMP-DEL-2026-0814</div>
                </div>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
                  Testing in Progress (Stage 3 of 4)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Designated Lab</span>
                  <p className="font-bold text-slate-800">Shriram Institute for Industrial Research</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Estimated Turnaround</span>
                  <p className="font-bold text-slate-800">4 Working Days Remaining</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Tests Conducted</span>
                  <p className="font-bold text-slate-800">Corrosion Resistance & Leachable Heavy Metals</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </RoleGuard>
  );
}
