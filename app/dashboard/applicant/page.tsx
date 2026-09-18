'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import RoleGuard from '@/components/auth/RoleGuard';
import { useAuth } from '@/lib/useAuth';
import { 
  Rocket, CheckCircle2, ArrowRight, FileCheck, HelpCircle, 
  Sparkles, Download, Clock, Shield, AlertCircle
} from 'lucide-react';

export default function ApplicantDashboardPage() {
  const { user } = useAuth();
  const [readinessChecks, setReadinessChecks] = useState<Record<string, boolean>>({
    'check-1': true,
    'check-2': true,
    'check-3': true,
    'check-4': false,
    'check-5': false,
    'check-6': false,
  });

  const totalChecks = Object.keys(readinessChecks).length;
  const completedChecks = Object.values(readinessChecks).filter(Boolean).length;
  const scorePercent = Math.round((completedChecks / totalChecks) * 100);

  const toggleCheck = (id: string) => {
    setReadinessChecks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <RoleGuard allowedRoles={['applicant', 'admin']}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-800 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-400/20 border border-blue-400/30 text-blue-200 text-xs font-bold mb-3">
                <Rocket className="w-3.5 h-3.5 text-blue-300" />
                <span>First-Time BIS Certification Launchpad</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                Welcome, {user?.name || 'Aanya Verma'}!
              </h1>
              <p className="text-xs md:text-sm text-blue-100/80 mt-1 max-w-2xl leading-relaxed">
                Guiding <span className="font-bold text-white">{user?.companyName || 'NexGen AgroTech'}</span> from zero to your very first official BIS License (ISI Mark / CRS) without costly consultants.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/chat"
                className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-extrabold rounded-xl text-xs shadow-md shadow-blue-500/30 transition flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ask SUGAM AI Copilot</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Readiness Meter & 5-Step Roadmap */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Readiness Gauge */}
          <div className="lg:col-span-1 p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-5">
            <div>
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Application Readiness Score
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-black text-blue-900">{scorePercent}%</span>
                <span className="text-xs font-bold text-slate-500">
                  ({completedChecks} of {totalChecks} Prerequisites Met)
                </span>
              </div>
            </div>

            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-teal-500 transition-all duration-500"
                style={{ width: `${scorePercent}%` }}
              ></div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-slate-800 mb-1">Mandatory Prerequisites:</div>
              {[
                { id: 'check-1', label: 'Company PAN & GSTIN Certificate' },
                { id: 'check-2', label: 'Udyam MSME Certificate (For 80% Fee Waiver)' },
                { id: 'check-3', label: 'Factory Layout & Machinery Installation' },
                { id: 'check-4', label: 'In-House Testing Equipment (as per SIT)' },
                { id: 'check-5', label: 'Equipment Calibration from NABL Lab' },
                { id: 'check-6', label: 'Competent QC In-Charge Appointed' },
              ].map((c) => (
                <div 
                  key={c.id}
                  onClick={() => toggleCheck(c.id)}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition text-xs select-none"
                >
                  <input 
                    type="checkbox"
                    checked={readinessChecks[c.id]}
                    onChange={() => {}}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className={readinessChecks[c.id] ? 'line-through text-slate-400' : 'font-semibold text-slate-700'}>
                    {c.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 5-Step Roadmap */}
          <div className="lg:col-span-2 p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-5">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                0-to-1 Step-by-Step Certification Roadmap
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Follow this sequential path to achieve Grant of License (GoL) on your very first submission.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { stage: '1', title: 'Find Applicable Indian Standard (IS)', desc: 'Identify whether your product falls under mandatory Quality Control Order (QCO) or voluntary certification.', time: '1–2 Days', status: 'Completed', color: 'bg-emerald-500 text-white' },
                { stage: '2', title: 'Prepare In-House Quality & Testing Infrastructure', desc: 'Procure minimum required test equipment specified in the Scheme of Inspection and Testing (SIT).', time: '15–30 Days', status: 'In Progress', color: 'bg-blue-600 text-white' },
                { stage: '3', title: 'File Online Application on Manakonline', desc: 'Submit Form-I on manakonline.in with manufacturing process, machinery list, and Udyam concession claim.', time: '3–5 Days', status: 'Upcoming', color: 'bg-slate-200 text-slate-600' },
                { stage: '4', title: 'BIS Officer Factory Audit & Sample Drawing', desc: 'BIS technical officer inspects manufacturing plant, verifies in-house testing, and draws sealed samples for NABL verification.', time: '1 Day Visit', status: 'Upcoming', color: 'bg-slate-200 text-slate-600' },
                { stage: '5', title: 'Grant of License (GoL) & ISI Mark Usage', desc: 'Upon sample passing test parameters, receive official CM/L number and right to print ISI mark on packaging.', time: '7 Days', status: 'Goal', color: 'bg-slate-200 text-slate-600' },
              ].map((s, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${s.color}`}>
                      {s.stage}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <span>{s.title}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">• {s.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                    s.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                    s.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Starter Kit & Jargon Buster */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Starter Kit Templates */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-black text-base">
              <FileCheck className="w-5 h-5 text-teal-600" />
              <span>First-Timer Document Starter Kit</span>
            </div>
            <p className="text-xs text-slate-500">
              Download standard formats and templates accepted by BIS branch offices:
            </p>

            <div className="space-y-2.5">
              {[
                { name: 'Factory Layout Schematic Blueprint (Template)', size: '240 KB PDF' },
                { name: 'Manufacturing Machinery & Calibration Register Format', size: '180 KB XLSX' },
                { name: 'Competent QC In-Charge Undertaking (Format IV)', size: '120 KB DOCX' },
                { name: 'Brand / Trademark Authorization Affidavit', size: '140 KB PDF' },
              ].map((doc, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div className="font-semibold text-slate-700 truncate pr-2">{doc.name}</div>
                  <button 
                    onClick={() => alert(`Downloading template: ${doc.name}`)}
                    className="p-1.5 text-blue-600 hover:text-blue-800 font-bold shrink-0 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Jargon Buster */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-black text-base">
              <HelpCircle className="w-5 h-5 text-indigo-600" />
              <span>BIS Jargon Buster (Demystified)</span>
            </div>
            <p className="text-xs text-slate-500">
              Quick dictionary so you understand government notices and letters:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                <span className="font-bold text-indigo-950">QCO (Quality Control Order):</span>
                <p className="text-slate-600 mt-0.5 text-[11px]">A mandatory order by central ministries making BIS certification compulsory before product sale in India.</p>
              </div>
              <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                <span className="font-bold text-indigo-950">CM/L (Certification Marks Licence Number):</span>
                <p className="text-slate-600 mt-0.5 text-[11px]">The 7-to-10 digit unique registration number printed alongside the ISI mark on your product.</p>
              </div>
              <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                <span className="font-bold text-indigo-950">SIT (Scheme of Inspection & Testing):</span>
                <p className="text-slate-600 mt-0.5 text-[11px]">The official rulebook issued by BIS specifying what factory tests you must conduct on every production batch.</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </RoleGuard>
  );
}
