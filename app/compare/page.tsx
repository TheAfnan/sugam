'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguageStore } from '@/lib/store';
import { t, formatCurrency, formatDays } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function ComparePage() {
  const { activeLanguage } = useLanguageStore();
  const [standards, setStandards] = useState<any[]>([]);
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetch('/data/standards.json')
      .then((res) => res.json())
      .then((data) => {
        const stds = (data.standards || []).map((s: any) => ({
          ...s,
          isNumber: s.number || s.id,
          timelineDays: s.certification?.timeline?.total_days || 45,
          totalCost: s.certification?.cost?.total?.min || 25000,
          appFee: s.certification?.cost?.breakdown?.application_fee || 4000,
          testFee: s.certification?.cost?.breakdown?.testing_charges || 15000,
          inspFee: s.certification?.cost?.breakdown?.inspection_charges || 6000,
          phasesCount: s.certification?.timeline?.phases?.length || 4,
          relatedList: (s.related_standards || []).map((r: any) => r.number || r.id || r),
        }));
        setStandards(stds);
        if (stds.length >= 2) {
          setSelectedNumbers([stds[0].isNumber, stds[1].isNumber]);
        }
      })
      .catch((err) => console.error('Failed to load standards:', err));
  }, []);

  const toggleSelect = (isNumber: string) => {
    setErrorMsg('');
    if (selectedNumbers.includes(isNumber)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== isNumber));
    } else {
      if (selectedNumbers.length >= 3) {
        setErrorMsg('Maximum 3 standards can be compared at a time.');
        return;
      }
      setSelectedNumbers([...selectedNumbers, isNumber]);
    }
  };

  const filteredStandards = standards.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    const titleText = t(s.title, activeLanguage).toLowerCase();
    return s.isNumber.toLowerCase().includes(q) || titleText.includes(q) || (s.category || '').toLowerCase().includes(q);
  });

  const comparedStandards = selectedNumbers
    .map((num) => standards.find((s) => s.isNumber === num))
    .filter(Boolean);

  const attributes = [
    {
      label: 'Standard Number',
      render: (s: any) => <span className="font-bold text-teal-700">{s.isNumber}</span>,
    },
    {
      label: 'Title',
      render: (s: any) => <span className="text-sm font-medium">{t(s.title, activeLanguage)}</span>,
    },
    {
      label: 'Category',
      render: (s: any) => <span className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded-md text-gray-700">{s.category}</span>,
    },
    {
      label: 'Certification Type',
      render: (s: any) => (
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
            s.is_mandatory !== false ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
          }`}
        >
          {s.is_mandatory !== false ? '⚡ Mandatory (QCO)' : '✓ Voluntary'}
        </span>
      ),
    },
    {
      label: 'Estimated Timeline',
      render: (s: any) => <span className="font-semibold text-gray-900">{formatDays(s.timelineDays)}</span>,
    },
    {
      label: 'Estimated Total Cost',
      render: (s: any) => <span className="font-bold text-teal-700">{formatCurrency(s.totalCost)}</span>,
    },
    {
      label: 'Application Fee',
      render: (s: any) => formatCurrency(s.appFee),
    },
    {
      label: 'Testing Fee',
      render: (s: any) => formatCurrency(s.testFee),
    },
    {
      label: 'Inspection Fee',
      render: (s: any) => formatCurrency(s.inspFee),
    },
    {
      label: 'Stages / Phases',
      render: (s: any) => `${s.phasesCount} Phases`,
    },
    {
      label: 'Related Standards',
      render: (s: any) => (s.relatedList.length > 0 ? s.relatedList.join(', ') : '—'),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-16">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">⚖️ Standards Comparison</h1>
          <p className="text-gray-500 text-sm">Select 2–3 Indian Standards to compare side-by-side</p>
        </div>

        {/* Search & Selection area */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6 mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search standards by IS number, title, or category (e.g. 13252, Fan, Electronics)..."
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none mb-4"
          />

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
              {errorMsg}
            </div>
          )}

          <div className="flex flex-wrap gap-2 max-h-44 overflow-y-auto pr-2">
            {filteredStandards.map((std) => {
              const isSelected = selectedNumbers.includes(std.isNumber);
              return (
                <button
                  key={std.isNumber}
                  onClick={() => toggleSelect(std.isNumber)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{std.isNumber}</span>
                  <span className="text-[10px] opacity-80 truncate max-w-[150px]">
                    ({t(std.title, activeLanguage)})
                  </span>
                  {isSelected && <span className="ml-1 font-bold">✕</span>}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-gray-400 mt-4">
            Selected: {selectedNumbers.length} / 3 standards
          </p>
        </div>

        {/* Comparison Table */}
        {comparedStandards.length > 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-12">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-teal-50/50 border-b border-gray-200">
                    <th className="p-4 w-1/4 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                      Parameter
                    </th>
                    {comparedStandards.map((std) => (
                      <th key={std.isNumber} className="p-4 font-bold text-teal-950 text-base">
                        <div className="flex items-center justify-between">
                          <span>{std.isNumber}</span>
                          <button
                            onClick={() => toggleSelect(std.isNumber)}
                            className="text-gray-400 hover:text-red-500 text-xs font-normal"
                          >
                            Remove
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {attributes.map((attr, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}>
                      <td className="p-4 font-medium text-gray-500 text-xs">{attr.label}</td>
                      {comparedStandards.map((std) => (
                        <td key={std.isNumber} className="p-4 text-gray-800">
                          {attr.render(std)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 text-gray-400">
            <p className="text-sm">Select at least 1 standard above to view details</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
