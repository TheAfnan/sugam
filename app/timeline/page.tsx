'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calculator, Clock, DollarSign, CheckCircle2, Shield, AlertCircle, Building2, FlaskConical, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORIES = [
  'Electronics',
  'Food',
  'Textiles',
  'Steel',
  'Construction',
  'Automotive',
  'Medical',
  'Furniture',
  'Chemical',
  'Agriculture',
];

export default function TimelinePage() {
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [config, setConfig] = useState({
    category: 'Electronics',
    complexity: 'medium',
    urgency: 'normal',
    companyType: 'msme',
    location: 'metro',
    preparedness: 'partially-prepared',
  });

  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const calculate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (res.ok && data.results) {
        setResults(data.results);
      }
    } catch (e) {
      console.error('Timeline calculation failed:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    calculate();
  }, [config]);

  const updateField = (field: string, val: any) => {
    setConfig((prev) => ({ ...prev, [field]: val }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-16">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-200 rounded-full text-teal-800 text-xs font-semibold mb-3">
            <Calculator size={13} />
            <span>AI-Driven Estimation Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
            {lang === 'en' ? 'BIS Certification Timeline & Cost Calculator' : 'बीआईएस प्रमाणन समयसीमा एवं लागत कैलकुलेटर'}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            {lang === 'en'
              ? 'Get accurate timeline and cost estimates for your BIS certification process based on your specific requirements.'
              : 'अपनी विशिष्ट आवश्यकताओं के आधार पर अपनी बीआईएस प्रमाणन प्रक्रिया के लिए सटीक समयसीमा और लागत अनुमान प्राप्त करें।'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-900">
                  {lang === 'en' ? 'Configuration' : 'कॉन्फ़िगरेशन'}
                </h2>
                <div className="flex gap-1 bg-gray-100 p-0.5 rounded-lg text-xs font-semibold">
                  <button
                    onClick={() => setLang('en')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      lang === 'en' ? 'bg-white text-teal-700 shadow-xs' : 'text-gray-600'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLang('hi')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      lang === 'hi' ? 'bg-white text-teal-700 shadow-xs' : 'text-gray-600'
                    }`}
                  >
                    हिन्दी
                  </button>
                </div>
              </div>

              <div className="space-y-5 text-sm">
                {/* Product Category */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    {lang === 'en' ? 'Product Category' : 'उत्पाद श्रेणी'}
                  </label>
                  <select
                    value={config.category}
                    onChange={(e) => updateField('category', e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Complexity */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    {lang === 'en' ? 'Product Complexity' : 'उत्पाद जटिलता'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['simple', 'medium', 'complex'].map((cmp) => (
                      <button
                        key={cmp}
                        type="button"
                        onClick={() => updateField('complexity', cmp)}
                        className={`py-2 text-xs font-medium rounded-xl border transition-all ${
                          config.complexity === cmp
                            ? 'border-teal-600 bg-teal-50 text-teal-700 font-bold'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {cmp.charAt(0).toUpperCase() + cmp.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Processing Urgency */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    {lang === 'en' ? 'Processing Urgency' : 'प्रसंस्करण प्राथमिकता'}
                  </label>
                  <div className="space-y-2">
                    {[
                      { val: 'normal', label: lang === 'en' ? 'Normal (Standard)' : 'सामान्य' },
                      { val: 'priority', label: lang === 'en' ? 'Priority (25% Faster)' : 'प्राथमिकता (25% तेज़)' },
                      { val: 'fast-track', label: lang === 'en' ? 'Fast-Track (Express)' : 'फास्ट-ट्रैक (एक्सप्रेस)' },
                    ].map((urg) => (
                      <label key={urg.val} className="flex items-center gap-2 cursor-pointer text-xs">
                        <input
                          type="radio"
                          name="urgency"
                          value={urg.val}
                          checked={config.urgency === urg.val}
                          onChange={(e) => updateField('urgency', e.target.value)}
                          className="text-teal-600 focus:ring-teal-500"
                        />
                        <span className={config.urgency === urg.val ? 'font-semibold text-teal-900' : 'text-gray-600'}>
                          {urg.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Company Type */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    {lang === 'en' ? 'Enterprise Sizing' : 'उद्यम का प्रकार'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { val: 'msme', label: 'MSME / Startup (20% Off)' },
                      { val: 'large', label: 'Large Enterprise' },
                    ].map((comp) => (
                      <button
                        key={comp.val}
                        type="button"
                        onClick={() => updateField('companyType', comp.val)}
                        className={`py-2 px-2 text-xs font-medium rounded-xl border text-center transition-all ${
                          config.companyType === comp.val
                            ? 'border-teal-600 bg-teal-50 text-teal-700 font-bold'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {comp.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {results ? (
              <>
                {/* Summary Banner */}
                <div className="bg-gradient-to-br from-teal-700 to-emerald-900 rounded-2xl p-6 text-white shadow-md">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <span className="px-2.5 py-0.5 bg-teal-600/60 rounded-full text-xs font-semibold text-teal-100">
                        Applicable Standard
                      </span>
                      <h3 className="text-xl font-black mt-1">{results.standard.number}</h3>
                      <p className="text-xs text-teal-200 mt-0.5">{results.standard.title}</p>
                    </div>

                    <div className="flex items-center gap-6 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15">
                      <div>
                        <p className="text-[11px] text-teal-200 uppercase font-semibold">Timeline</p>
                        <p className="text-xl font-extrabold text-white">~{results.totalDays} Days</p>
                      </div>
                      <div className="h-8 w-px bg-white/20" />
                      <div>
                        <p className="text-[11px] text-teal-200 uppercase font-semibold">Total Cost</p>
                        <p className="text-xl font-extrabold text-white">₹{results.totalCost.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline Phases */}
                <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-6">
                  <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock size={17} className="text-teal-600" />
                    <span>Certification Phases & Duration</span>
                  </h3>

                  <div className="space-y-4">
                    {results.timeline.map((ph: any) => (
                      <div
                        key={ph.phase}
                        className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/70 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center">
                            {ph.phase}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-xs sm:text-sm">
                              {ph.name[lang] || ph.name.en}
                            </h4>
                            <p className="text-[11px] text-gray-500">
                              Estimated span: {ph.description[lang] || ph.description.en}
                            </p>
                          </div>
                        </div>
                        <span className="font-extrabold text-sm text-teal-800 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-2xs">
                          {ph.days} days
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fee & Cost Schedule */}
                <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-6">
                  <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <DollarSign size={17} className="text-teal-600" />
                    <span>Official Fee Breakdown & Testing Charges</span>
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
                          <th className="pb-3">Fee Component</th>
                          <th className="pb-3 text-right">Estimated Amount</th>
                          <th className="pb-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {results.costBreakdown.map((item: any, iIdx: number) => (
                          <tr key={iIdx} className="hover:bg-gray-50/50">
                            <td className="py-3 font-medium text-gray-800">
                              {item.item[lang] || item.item.en}
                            </td>
                            <td className="py-3 text-right font-bold text-gray-900">
                              ₹{item.amount.toLocaleString('en-IN')}
                            </td>
                            <td className="py-3 text-center">
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-semibold">
                                Mandatory
                              </span>
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-teal-50/60 font-bold text-teal-950">
                          <td className="py-3.5 px-2">Total Estimated Investment</td>
                          <td className="py-3.5 text-right px-2 text-sm font-black text-teal-800">
                            ₹{results.totalCost.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3.5 text-center px-2">
                            {config.companyType === 'msme' ? (
                              <span className="text-[10px] text-teal-700 bg-teal-100/70 px-2 py-0.5 rounded">
                                MSME Rate
                              </span>
                            ) : (
                              'Standard Rate'
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 text-gray-400">
                Calculating regulatory schedule...
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
