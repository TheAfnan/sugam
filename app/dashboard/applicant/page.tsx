'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import RoleGuard from '@/components/auth/RoleGuard';
import { useAuth } from '@/lib/useAuth';
import { 
  Rocket, CheckCircle2, FileCheck, HelpCircle, 
  Sparkles, Download
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
      <div className="max-w-7xl mx-auto space-y-7">
        
        {/* Unified Executive Header */}
        <div className="bg-slate-900 rounded-3xl p-7 text-white shadow-sm border border-slate-800 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-bold mb-2.5">
                <Rocket className="w-3.5 h-3.5" />
                <span>New Business & Startup Guide</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                Welcome, {user?.name || 'Aanya Verma'}!
              </h1>
              <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Step-by-step guidance for <span className="font-bold text-white">{user?.companyName || 'NexGen Innovations'}</span> to get your first official BIS ISI Mark without needing costly consultants.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/chat"
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-extrabold rounded-xl text-xs shadow-md transition flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ask AI Guide</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Readiness Meter & 5-Step Roadmap */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Readiness Meter */}
          <div className="lg:col-span-1 p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-5">
            <div>
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Are You Ready to Apply?
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-black text-teal-700">{scorePercent}%</span>
                <span className="text-xs font-bold text-slate-500">
                  ({completedChecks} of {totalChecks} items ready)
                </span>
              </div>
            </div>

            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-teal-600 transition-all duration-500"
                style={{ width: `${scorePercent}%` }}
              ></div>
            </div>

            <div className="space-y-2 pt-1">
              <div className="text-xs font-bold text-slate-800 mb-1">Simple Checklist:</div>
              {[
                { id: 'check-1', label: 'Company PAN and GST Certificate' },
                { id: 'check-2', label: 'Udyam Certificate (for 80% fee discount)' },
                { id: 'check-3', label: 'Factory address & machinery in place' },
                { id: 'check-4', label: 'In-house testing equipment ready' },
                { id: 'check-5', label: 'Testing machine calibration certificate' },
                { id: 'check-6', label: 'Qualified quality person on staff' },
              ].map((c) => (
                <div 
                  key={c.id}
                  onClick={() => toggleCheck(c.id)}
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition text-xs select-none"
                >
                  <input 
                    type="checkbox"
                    checked={readinessChecks[c.id]}
                    onChange={() => {}}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
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
                Simple 5 Steps to Get Your ISI Mark
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Follow these clear steps to successfully receive your license.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { stage: '1', title: 'Find Your Product Standard (IS Code)', desc: 'Check which standard applies to your product and whether it is mandatory by government law.', time: '1–2 Days', status: 'Done', color: 'bg-teal-600 text-white' },
                { stage: '2', title: 'Set Up Basic Testing Tools in Factory', desc: 'Arrange the basic testing tools needed to test product quality inside your factory.', time: '15–20 Days', status: 'In Progress', color: 'bg-teal-600 text-white' },
                { stage: '3', title: 'Submit Online Form on Manakonline', desc: 'Fill the online application on manakonline.in and claim your 80% MSME fee discount.', time: '2–3 Days', status: 'Next', color: 'bg-slate-200 text-slate-700' },
                { stage: '4', title: 'BIS Officer Factory Visit', desc: 'A BIS officer will visit your factory, see your machines, and take sealed product samples for testing.', time: '1 Day', status: 'Next', color: 'bg-slate-200 text-slate-700' },
                { stage: '5', title: 'Receive Your Official License & ISI Mark', desc: 'Once the sample passes testing, you will get your official license number to print on your product packaging.', time: 'Final Step', status: 'Goal', color: 'bg-slate-200 text-slate-700' },
              ].map((s, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${s.color}`}>
                      {s.stage}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <span>{s.title}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({s.time})</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md shrink-0 ${
                    s.status === 'Done' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                    s.status === 'In Progress' ? 'bg-teal-50 text-teal-800 border border-teal-200' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Ready-to-Use Templates & Easy Meanings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Templates */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-black text-base">
              <FileCheck className="w-5 h-5 text-teal-600" />
              <span>Ready-to-Use Document Formats</span>
            </div>
            <p className="text-xs text-slate-500">
              Download standard formats accepted by BIS offices so you don't have to write them from scratch:
            </p>

            <div className="space-y-2.5">
              {[
                { name: 'Factory Layout Map (Sample Template)', size: 'PDF Template' },
                { name: 'Machinery & Equipment List Format', size: 'Excel Format' },
                { name: 'Quality Person Appointment Letter (Format IV)', size: 'Word Document' },
                { name: 'Brand Name Authorization Letter', size: 'Sample Format' },
              ].map((doc, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div className="font-semibold text-slate-700 truncate pr-2">{doc.name}</div>
                  <button 
                    onClick={() => alert(`Downloading template: ${doc.name}`)}
                    className="p-1.5 text-teal-700 hover:text-teal-900 font-bold shrink-0 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Easy Terms */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-black text-base">
              <HelpCircle className="w-5 h-5 text-teal-600" />
              <span>Easy Guide: Common Words Explained Simply</span>
            </div>
            <p className="text-xs text-slate-500">
              Meanings of common terms you will see in BIS papers:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900">QCO (Quality Order):</span>
                <p className="text-slate-600 mt-0.5 text-[11px]">A government order that makes it compulsory to have an ISI mark before selling that product in India.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900">CM/L (License Number):</span>
                <p className="text-slate-600 mt-0.5 text-[11px]">The 7-to-10 digit unique registration number printed under the ISI mark on your product.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900">SIT (Testing Plan):</span>
                <p className="text-slate-600 mt-0.5 text-[11px]">The official list of daily quality tests you must run in your factory.</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </RoleGuard>
  );
}
