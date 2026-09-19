'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import RoleGuard from '@/components/auth/RoleGuard';
import { useAuth } from '@/lib/useAuth';
import { 
  Shield, CheckCircle2, AlertTriangle, Search, 
  Sparkles, Bell
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
        msg: 'This license number was not found in official BIS records. This product might be using a fake ISI mark.'
      });
    }
  };

  return (
    <RoleGuard allowedRoles={['consumer', 'admin']}>
      <div className="max-w-7xl mx-auto space-y-7">
        
        {/* Unified Executive Header */}
        <div className="bg-slate-900 rounded-3xl p-7 text-white shadow-sm border border-slate-800 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-bold mb-2.5">
                <Shield className="w-3.5 h-3.5" />
                <span>Consumer Quality & Safety Center</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                Check Product Quality & Report Fakes
              </h1>
              <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Check if an ISI mark on a product is genuine, and easily report fake or unsafe products to the BIS quality team.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/chat"
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>Consumer Rights Q&A</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 1. INSTANT MARK VERIFIER */}
        <div className="p-7 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Check Any Product's ISI Mark
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Enter the license number (CM/L) printed under the ISI mark on the product box.
              </p>
            </div>
            <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
              Official Database
            </span>
          </div>

          <div className="flex gap-3 max-w-xl">
            <input
              type="text"
              value={cmlSearch}
              onChange={(e) => setCmlSearch(e.target.value)}
              placeholder="e.g. 8400174109"
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              onClick={handleVerify}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-2xl shadow-sm transition cursor-pointer"
            >
              Verify Now
            </button>
          </div>

          {/* Result Card */}
          {searchResult && (
            <div className={`p-5 rounded-2xl border ${
              searchResult.invalid 
                ? 'bg-red-50 border-red-200 text-red-900' 
                : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
            }`}>
              {searchResult.invalid ? (
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-black text-red-900">WARNING: NOT A VALID BIS LICENSE</div>
                    <p className="text-xs text-red-700 mt-1">{searchResult.msg}</p>
                    <button
                      onClick={() => {
                        setIssueType('fake-isi');
                        alert('You can now report this product using the form below.');
                      }}
                      className="mt-3 px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                    >
                      Report This Fake Product
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm font-black text-emerald-900">GENUINE BIS CERTIFIED PRODUCT</span>
                    </div>
                    <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-md">
                      {searchResult.cmlNumber}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white p-4 rounded-xl border border-emerald-200">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Manufacturer</span>
                      <p className="font-bold text-slate-800">{searchResult.licenseeName}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Brand Name</span>
                      <p className="font-bold text-slate-800">{searchResult.brandName}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Standard</span>
                      <p className="font-bold text-slate-800">{searchResult.isCode}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Valid Until</span>
                      <p className="font-bold text-emerald-700">{searchResult.validUpto}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Factory Location</span>
                      <p className="font-bold text-slate-800 truncate">{searchResult.factoryAddress}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 2. REPORT FAKES & MANDATORY GOODS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* File a Report */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-black text-base">
              <AlertTriangle className="w-5 h-5 text-teal-600" />
              <span>Report a Fake ISI Mark or Substandard Product</span>
            </div>
            <p className="text-xs text-slate-500">
              If a shop is selling products with a fake ISI mark or dangerous quality, report it here:
            </p>

            {complaintSubmitted ? (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="text-xs font-bold text-emerald-900">
                  Report Received! Reference: #GRV-2026-9481
                </div>
                <p className="text-[11px] text-emerald-700">
                  Assigned to the local BIS quality inspection team. Thank you for protecting fellow consumers!
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
                  <label className="block font-bold text-slate-700 mb-1">What is the problem?</label>
                  <select 
                    value={issueType} 
                    onChange={(e) => setIssueType(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                  >
                    <option value="fake-isi">Fake ISI Mark on the product</option>
                    <option value="substandard">Poor or dangerous quality</option>
                    <option value="hallmark">Fake Gold Hallmark</option>
                    <option value="expiry">Selling expired or cancelled license stock</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Brand Name & Product</label>
                  <input
                    type="text"
                    value={brandInput}
                    onChange={(e) => setBrandInput(e.target.value)}
                    placeholder="e.g. Royal Star Pressure Cooker 5L"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Shop Name & City</label>
                  <input
                    type="text"
                    placeholder="e.g. Modern Home Store, Laxmi Nagar, Delhi"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                  />
                </div>

                <button
                  onClick={() => {
                    if (!brandInput) {
                      alert('Please enter the product or brand name.');
                      return;
                    }
                    setComplaintSubmitted(true);
                  }}
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
                >
                  Submit Report to Quality Team
                </button>
              </div>
            )}
          </div>

          {/* Products that Must Have ISI Mark */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-black text-base">
                <Bell className="w-5 h-5 text-teal-600" />
                <span>Products That Must Have an ISI Mark by Law</span>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Never buy these safety-critical items without checking for a genuine ISI mark:
            </p>

            <div className="space-y-2 text-xs">
              {[
                { name: 'Packaged Drinking Water & Mineral Water', note: 'Safe and clean for drinking' },
                { name: 'Kitchen Pressure Cookers', note: 'Burst-proof safety valves' },
                { name: 'Two-Wheeler Helmets (Bikes & Scooters)', note: 'Life-saving crash impact protection' },
                { name: 'Children Toys & Games', note: 'Safe materials and non-toxic paints' },
                { name: 'LPG Gas Stoves & Gas Cylinders', note: 'Flame safety and high gas pressure checks' },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800">{item.name}</div>
                    <div className="text-[11px] text-slate-500">{item.note}</div>
                  </div>
                  <span className="text-[10px] font-bold bg-white text-teal-700 px-2.5 py-1 rounded border border-slate-200">
                    Compulsory
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
