'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import RoleGuard from '@/components/auth/RoleGuard';
import { useAuth } from '@/lib/useAuth';
import { 
  ShieldAlert, CheckCircle2, XCircle, FileText, Calendar, 
  MapPin, Eye, AlertCircle, ArrowUpRight, Search, Download
} from 'lucide-react';

export default function OfficerDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'queue' | 'inspections' | 'raids'>('queue');
  const [dossiers, setDossiers] = useState([
    { id: 'APP-2026-9041', company: 'Bharat Standard Mfg Corp', isCode: 'IS 17526:2021', product: 'Stainless Steel Water Bottles', labReport: 'NABL Certified (PASS)', status: 'Pending Scrutiny', date: '16-Sep-2026' },
    { id: 'APP-2026-8812', company: 'LumiTech Electronics Pvt Ltd', isCode: 'IS 16102:2012', product: 'Self-Ballasted LED Lamps', labReport: 'Testing Complete (PASS)', status: 'Approved for GoL', date: '14-Sep-2026' },
    { id: 'APP-2026-7734', company: 'RiderSafe Protective Gear', isCode: 'IS 4151:2015', product: 'Protective Helmets for Two-Wheelers', labReport: 'Clause 5.2 Failure', status: 'Discrepancy Raised', date: '12-Sep-2026' },
  ]);

  const approveDossier = (id: string) => {
    setDossiers(prev => prev.map(d => d.id === id ? { ...d, status: 'Approved for GoL' } : d));
    alert(`Dossier ${id} approved for Grant of License (GoL). An endorsement order has been generated.`);
  };

  const rejectDossier = (id: string) => {
    setDossiers(prev => prev.map(d => d.id === id ? { ...d, status: 'Discrepancy Raised' } : d));
    alert(`Discrepancy letter dispatched to applicant for dossier ${id}.`);
  };

  return (
    <RoleGuard allowedRoles={['officer', 'admin']}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-950 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-400/20 border border-purple-400/30 text-purple-200 text-xs font-bold mb-3">
                <ShieldAlert className="w-3.5 h-3.5 text-purple-300" />
                <span>BIS Technical Officer Scrutiny & Regulatory Clearance</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                {user?.name || 'Dr. Vikram Malhotra'}
              </h1>
              <p className="text-xs md:text-sm text-purple-100/80 mt-1 max-w-2xl leading-relaxed">
                Designation: <span className="font-bold text-white">{user?.designation || 'Scientist-E & Joint Director'}</span> • Northern Regional Headquarters (New Delhi)
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1.5 bg-purple-500/20 text-purple-200 rounded-xl text-xs font-mono font-bold border border-purple-400/30">
                CLEARANCE LEVEL: T-5 OFFICER
              </span>
            </div>
          </div>
        </div>

        {/* 4 Inspection Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Dossiers</span>
            <div className="text-2xl font-black text-slate-900 mt-2">14 Applications</div>
            <div className="text-xs font-semibold text-amber-600 mt-1">3 Urgent QCO Deadlines</div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Factory Audits</span>
            <div className="text-2xl font-black text-slate-900 mt-2">4 Scheduled</div>
            <div className="text-xs font-semibold text-blue-600 mt-1">NCR Industrial Belts</div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Citizen Complaints</span>
            <div className="text-2xl font-black text-slate-900 mt-2">6 Active</div>
            <div className="text-xs font-semibold text-red-600 mt-1">Fake ISI Mark Reports</div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Seizure Notices</span>
            <div className="text-2xl font-black text-slate-900 mt-2">2 Enforced</div>
            <div className="text-xs font-semibold text-emerald-600 mt-1">Section 15 BIS Act 2016</div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-slate-200">
          {[
            { id: 'queue', label: 'Dossier Scrutiny Queue' },
            { id: 'inspections', label: 'Factory Inspection Calendar' },
            { id: 'raids', label: 'Counterfeit Seizure Tracker' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'border-purple-600 text-purple-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: DOSSIER QUEUE */}
        {activeTab === 'queue' && (
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Manufacturer Application Scrutiny Queue
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Review factory test reports, SIT compliance manuals, and approve Grant of License (GoL).
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3 px-3">App ID</th>
                    <th className="pb-3 px-3">Manufacturer</th>
                    <th className="pb-3 px-3">Standard / Product</th>
                    <th className="pb-3 px-3">Lab Report</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Officer Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {dossiers.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-4 px-3 font-mono font-bold text-slate-900">{d.id}</td>
                      <td className="py-4 px-3">
                        <div className="font-bold text-slate-800">{d.company}</div>
                        <div className="text-[10px] text-slate-400">Filed: {d.date}</div>
                      </td>
                      <td className="py-4 px-3">
                        <div className="font-bold text-slate-700">{d.isCode}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">{d.product}</div>
                      </td>
                      <td className="py-4 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          d.labReport.includes('PASS') ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {d.labReport}
                        </span>
                      </td>
                      <td className="py-4 px-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          d.status === 'Approved for GoL' ? 'bg-emerald-100 text-emerald-800' :
                          d.status === 'Pending Scrutiny' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {d.status}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-right space-x-2">
                        <button
                          onClick={() => approveDossier(d.id)}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold transition shadow-2xs cursor-pointer"
                        >
                          Approve GoL
                        </button>
                        <button
                          onClick={() => rejectDossier(d.id)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 rounded-lg text-[10px] font-bold transition border border-slate-200 cursor-pointer"
                        >
                          Raise NC
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
                Factory Audit & Geotagged Surveillance Roster
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Upcoming on-site plant verification visits scheduled in accordance with annual surveillance quota.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { company: 'National Choice Containers', loc: 'Baddi Industrial Area, HP', date: '22-Sep-2026', officer: 'Dr. Vikram Malhotra', scope: 'Complete line audit & Sample Drawing for IS 17526' },
                { company: 'Prime Wire Industries', loc: 'Bahadurgarh, Haryana', date: '25-Sep-2026', officer: 'Dr. Vikram Malhotra', scope: 'Electrical safety testing witness for IS 694' },
              ].map((visit, idx) => (
                <div key={idx} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-black text-slate-900 text-sm">{visit.company}</div>
                      <div className="text-slate-500 mt-0.5">{visit.loc}</div>
                    </div>
                    <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-lg font-bold">
                      {visit.date}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] bg-white p-3 rounded-xl border border-slate-200">
                    Audit Directive: {visit.scope}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: RAIDS & SEIZURES */}
        {activeTab === 'raids' && (
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Market Surveillance & Counterfeit Seizure Orders
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Enforcement actions triggered under Section 14, 15 & 29 of the Bureau of Indian Standards Act 2016.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-red-50/70 border border-red-200 rounded-2xl flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-black text-red-950 text-sm">
                    Search & Seizure Order #BIS-SZ-2026-042
                  </div>
                  <p className="text-red-800 text-[11px]">
                    Target: M/s SafeRider Spurious Helmets Godown, Mayapuri Industrial Area Phase 1. 850 units seized bearing fake ISI mark without valid CM/L.
                  </p>
                  <div className="text-[10px] text-slate-500 font-semibold mt-1">
                    Enforcement Officer: Sh. D. K. Gautam (Scientist C) • Case Forwarded to Metropolitan Magistrate
                  </div>
                </div>
                <span className="px-3 py-1 bg-red-600 text-white font-bold rounded-lg text-[10px] shrink-0">
                  SEIZED
                </span>
              </div>
            </div>
          </div>
        )}

      </div>
    </RoleGuard>
  );
}
