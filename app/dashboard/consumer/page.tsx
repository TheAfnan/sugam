'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import RoleGuard from '@/components/auth/RoleGuard';
import { useAuth } from '@/lib/useAuth';
import { 
  Shield, CheckCircle2, AlertTriangle, QrCode, Search, 
  MapPin, Camera, Sparkles, ExternalLink, ArrowRight, Bell
} from 'lucide-react';
import { VERIFIED_LICENSES_DB } from '@/lib/sugam-data';

export default function ConsumerDashboardPage() {
  const { user } = useAuth();
  const [cmlSearch, setCmlSearch] = useState('8400174109');
  const [searchResult, setSearchResult] = useState<any>(VERIFIED_LICENSES_DB['8400174109']);
  const [complaintSubmitted, setComplaintSubmitted] = useState(false);
  const [brandInput, setBrandInput] = useState('');
  const [issueType, setIssueType] = useState('fake-isi');

  const handleVerify = () => {
    const clean = cmlSearch.replace(/[^0-9]/g, '');
    if (VERIFIED_LICENSES_DB[clean]) {
      setSearchResult(VERIFIED_LICENSES_DB[clean]);
    } else {
      setSearchResult({
        invalid: true,
        cmlNumber: cmlSearch,
        msg: 'No authentic BIS License found matching this CM/L number. Beware of counterfeit ISI mark misuse under Section 14/15 of BIS Act 2016.'
      });
    }
  };

  return (
    <RoleGuard allowedRoles={['consumer', 'admin']}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-800 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold mb-3">
                <Shield className="w-3.5 h-3.5 text-emerald-300" />
                <span>BIS Care Citizen Quality & Safety Portal</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                Consumer Safety Center
              </h1>
              <p className="text-xs md:text-sm text-emerald-100/80 mt-1 max-w-2xl leading-relaxed">
                Empowering Indian citizens to verify authentic ISI marks, check Gold Hallmarking (HUID), and report counterfeit or substandard products directly to enforcement officers.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/chat"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold backdrop-blur-md transition flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>Consumer Rights Q&A</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 1. INSTANT BIS MARK VERIFIER */}
        <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Instant BIS Mark & License Verifier
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter the CM/L number printed under the ISI mark to check licensee legitimacy.
              </p>
            </div>
            <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
              Live BIS Registry Query
            </span>
          </div>

          <div className="flex gap-3 max-w-xl">
            <div className="relative flex-1">
              <input
                type="text"
                value={cmlSearch}
                onChange={(e) => setCmlSearch(e.target.value)}
                placeholder="Enter 7–10 digit CM/L number (e.g. 8400174109)"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <button
              onClick={handleVerify}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-2xl shadow-sm transition cursor-pointer"
            >
              Verify License
            </button>
          </div>

          {/* Result Card */}
          {searchResult && (
            <div className={`p-6 rounded-2xl border ${
              searchResult.invalid 
                ? 'bg-red-50 border-red-200 text-red-900' 
                : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
            }`}>
              {searchResult.invalid ? (
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-black text-red-900">SUSPICIOUS / INVALID BIS MARK DETECTED</div>
                    <p className="text-xs text-red-700 mt-1">{searchResult.msg}</p>
                    <button
                      onClick={() => {
                        setIssueType('fake-isi');
                        alert('Grievance ticket created. Please fill out details below to report this product.');
                      }}
                      className="mt-3 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                    >
                      Report This Counterfeit Product to Enforcement Cell
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm font-black text-emerald-900">AUTHENTIC & OPERATIVE BIS LICENCE</span>
                    </div>
                    <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-md">
                      {searchResult.cmlNumber}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white/80 p-4 rounded-xl border border-emerald-200/60">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Manufacturer</span>
                      <p className="font-bold text-slate-800">{searchResult.licenseeName}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Brand Name</span>
                      <p className="font-bold text-slate-800">{searchResult.brandName}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Applicable Standard</span>
                      <p className="font-bold text-slate-800">{searchResult.isCode}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Valid Upto</span>
                      <p className="font-bold text-emerald-700">{searchResult.validUpto}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Factory Address</span>
                      <p className="font-bold text-slate-800 truncate">{searchResult.factoryAddress}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 2. CITIZEN GRIEVANCE FILING & QCO PRODUCTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* File a Grievance */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-black text-base">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>Report Substandard Goods or Fake ISI Marks</span>
            </div>
            <p className="text-xs text-slate-500">
              Your confidential complaint triggers official BIS surveillance inspections under Section 29 of the BIS Act 2016.
            </p>

            {complaintSubmitted ? (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="text-xs font-bold text-emerald-900">
                  Complaint Filed: Ticket #BIS-GRV-2026-9481
                </div>
                <p className="text-[11px] text-emerald-700">
                  Assigned to Northern Regional Office enforcement squad. You will receive SMS alerts as raid updates occur.
                </p>
                <button
                  onClick={() => setComplaintSubmitted(false)}
                  className="mt-2 text-xs font-bold text-emerald-800 underline cursor-pointer"
                >
                  File another report
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Issue Category</label>
                  <select 
                    value={issueType} 
                    onChange={(e) => setIssueType(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                  >
                    <option value="fake-isi">Counterfeit ISI Mark (No genuine CM/L number)</option>
                    <option value="substandard">Substandard / Dangerous Quality Product</option>
                    <option value="hallmark">Fake Gold Hallmarking (Hallmark HUID mismatch)</option>
                    <option value="expiry">Expired License Product Sold in Market</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Brand Name & Product Details</label>
                  <input
                    type="text"
                    value={brandInput}
                    onChange={(e) => setBrandInput(e.target.value)}
                    placeholder="e.g. Royal Star Pressure Cooker (5 Litres)"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Purchase Location / Store Address</label>
                  <input
                    type="text"
                    placeholder="Shop #4, Main Market, Laxmi Nagar, Delhi - 110092"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                  />
                </div>

                <button
                  onClick={() => {
                    if (!brandInput) {
                      alert('Please provide brand name or product details.');
                      return;
                    }
                    setComplaintSubmitted(true);
                  }}
                  className="w-full py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer"
                >
                  Submit Official Complaint to BIS
                </button>
              </div>
            )}
          </div>

          {/* Mandatory QCO Consumer Directory */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-black text-base">
                <Bell className="w-5 h-5 text-red-600" />
                <span>Must-Have ISI Mark Checklist</span>
              </div>
              <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                Compulsory by Law
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Never purchase these safety-critical products without verifying an authentic ISI mark:
            </p>

            <div className="space-y-2.5 text-xs">
              {[
                { name: 'Packaged Drinking Water & Mineral Water', standard: 'IS 14543 / IS 13428', note: 'Strict microbial safety standards' },
                { name: 'Domestic Pressure Cookers', standard: 'IS 2347', note: 'Safety valve burst pressure compliance' },
                { name: 'Two-Wheeler Helmets (Motorcycle)', standard: 'IS 4151', note: 'Mandatory impact absorption testing' },
                { name: 'Children Toys & Electric Play Items', standard: 'IS 9873 / IS 15644', note: 'Zero toxic phthalates & lead-free paints' },
                { name: 'Domestic Gas Cylinders & LPG Stoves', standard: 'IS 3196 / IS 4246', note: 'High pressure resistance and flame stability' },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800">{item.name}</div>
                    <div className="text-[11px] text-slate-500">{item.note}</div>
                  </div>
                  <span className="font-mono text-[10px] font-bold bg-white text-slate-700 px-2 py-1 rounded border border-slate-200">
                    {item.standard}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </RoleGuard>
  );
}
