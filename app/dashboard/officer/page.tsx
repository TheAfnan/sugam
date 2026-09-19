'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import RoleGuard from '@/components/auth/RoleGuard';
import { useAuth } from '@/lib/useAuth';
import { 
  ShieldAlert, CheckCircle2, FileText, Calendar, 
  MapPin, Eye, AlertCircle
} from 'lucide-react';

export default function OfficerDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'queue' | 'inspections' | 'raids'>('queue');
  const [dossiers, setDossiers] = useState([
    { id: 'APP-2026-9041', company: 'Bharat Standard Mfg Corp', isCode: 'IS 17526:2021', product: 'Stainless Steel Bottles', labReport: 'Passed Lab Tests', status: 'Waiting for Review', date: '16-Sep-2026' },
    { id: 'APP-2026-8812', company: 'LumiTech Electronics Pvt Ltd', isCode: 'IS 16102:2012', product: 'LED Bulbs & Lamps', labReport: 'Passed Lab Tests', status: 'Ready for License', date: '14-Sep-2026' },
    { id: 'APP-2026-7734', company: 'RiderSafe Protective Gear', isCode: 'IS 4151:2015', product: 'Motorcycle Helmets', labReport: 'Impact Test Issue', status: 'Clarification Sent', date: '12-Sep-2026' },
  ]);

  const approveDossier = (id: string) => {
    setDossiers(prev => prev.map(d => d.id === id ? { ...d, status: 'License Approved' } : d));
    alert(`Application ${id} approved! The manufacturer will be issued their official license number.`);
  };

  const rejectDossier = (id: string) => {
    setDossiers(prev => prev.map(d => d.id === id ? { ...d, status: 'Clarification Sent' } : d));
    alert(`Clarification letter sent to applicant for ${id}.`);
  };

  return (
    <RoleGuard allowedRoles={['officer', 'admin']}>
      <div className="max-w-7xl mx-auto space-y-7">
        
        {/* Unified Executive Header */}
        <div className="bg-slate-900 rounded-3xl p-7 text-white shadow-sm border border-slate-800 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-bold mb-2.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>BIS Quality Officer Portal</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                {user?.name || 'Dr. Vikram Malhotra'}
              </h1>
              <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Role: <span className="font-bold text-white">{user?.designation || 'Quality Director'}</span> • Northern Region Branch Office (New Delhi)
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-teal-500/20 text-teal-300 rounded-xl text-xs font-bold border border-teal-400/30">
                Official Officer Clearance
              </span>
            </div>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Reviews</span>
            <div className="text-2xl font-black text-slate-900 mt-2">14 Applications</div>
            <div className="text-xs font-semibold text-slate-500 mt-1">3 with deadlines this week</div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Factory Visits</span>
            <div className="text-2xl font-black text-slate-900 mt-2">4 Scheduled</div>
            <div className="text-xs font-semibold text-slate-500 mt-1">Delhi NCR Industrial belt</div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Citizen Complaints</span>
            <div className="text-2xl font-black text-slate-900 mt-2">6 Active</div>
            <div className="text-xs font-semibold text-slate-500 mt-1">Reports of fake ISI marks</div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Actions Taken</span>
            <div className="text-2xl font-black text-slate-900 mt-2">2 Completed</div>
            <div className="text-xs font-semibold text-emerald-600 mt-1">Fake products removed</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200">
          {[
            { id: 'queue', label: 'Applications to Approve' },
            { id: 'inspections', label: 'Factory Visit Calendar' },
            { id: 'raids', label: 'Complaints & Enforcement' },
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

        {/* TAB 1: QUEUE */}
        {activeTab === 'queue' && (
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Incoming Company Applications
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Review factory papers and test results to approve the official ISI mark license.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3 px-3">Application #</th>
                    <th className="pb-3 px-3">Company</th>
                    <th className="pb-3 px-3">Product</th>
                    <th className="pb-3 px-3">Lab Test</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {dossiers.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50 transition">
                      <td className="py-4 px-3 font-mono font-bold text-slate-900">{d.id}</td>
                      <td className="py-4 px-3">
                        <div className="font-bold text-slate-800">{d.company}</div>
                        <div className="text-[10px] text-slate-400">Date: {d.date}</div>
                      </td>
                      <td className="py-4 px-3">
                        <div className="font-bold text-slate-700">{d.isCode}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">{d.product}</div>
                      </td>
                      <td className="py-4 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          d.labReport.includes('Passed') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {d.labReport}
                        </span>
                      </td>
                      <td className="py-4 px-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          d.status.includes('Approved') || d.status.includes('Ready') ? 'bg-emerald-50 text-emerald-800' :
                          d.status.includes('Waiting') ? 'bg-blue-50 text-blue-800' : 'bg-amber-50 text-amber-800'
                        }`}>
                          {d.status}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-right space-x-2">
                        <button
                          onClick={() => approveDossier(d.id)}
                          className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-[10px] font-bold transition cursor-pointer"
                        >
                          Approve License
                        </button>
                        <button
                          onClick={() => rejectDossier(d.id)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold transition border border-slate-200 cursor-pointer"
                        >
                          Ask Question
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: INSPECTIONS */}
        {activeTab === 'inspections' && (
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Factory Visit Schedule
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Upcoming on-site factory verification visits to check machines and take test samples.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { company: 'National Choice Containers', loc: 'Baddi Industrial Area, HP', date: '22-Sep-2026', purpose: 'Check bottle testing line & take samples for testing' },
                { company: 'Prime Wire Industries', loc: 'Bahadurgarh, Haryana', date: '25-Sep-2026', purpose: 'Witness electrical wire safety tests' },
              ].map((visit, idx) => (
                <div key={idx} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-black text-slate-900 text-sm">{visit.company}</div>
                      <div className="text-slate-500 mt-0.5">{visit.loc}</div>
                    </div>
                    <span className="px-2.5 py-1 bg-teal-50 text-teal-800 border border-teal-200 rounded-lg font-bold">
                      {visit.date}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] bg-white p-3 rounded-xl border border-slate-200">
                    Visit Purpose: {visit.purpose}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: RAIDS */}
        {activeTab === 'raids' && (
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Actions on Fake ISI Marks
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Actions taken based on consumer reports of counterfeit goods in the market.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-black text-slate-900 text-sm">
                    Inspection & Removal #BIS-SZ-2026-042
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Location: SafeRider Godown, Mayapuri Industrial Area. 850 unapproved motorcycle helmets removed from market for printing fake ISI marks.
                  </p>
                  <div className="text-[10px] text-slate-400 font-semibold mt-1">
                    Inspecting Officer: D. K. Gautam • Case forwarded to local authorities
                  </div>
                </div>
                <span className="px-3 py-1 bg-slate-900 text-white font-bold rounded-lg text-[10px] shrink-0">
                  Closed
                </span>
              </div>
            </div>
          </div>
        )}

      </div>
    </RoleGuard>
  );
}
