'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguageStore } from '@/lib/store';
import { t, formatCurrency, formatDays } from '@/lib/utils';
import { motion } from 'framer-motion';

const VERTICAL_ICONS: Record<string, string> = {
  'Electronics and IT': '⚡',
  'Food and Beverages': '🥗',
  Furniture: '🪑',
  Textiles: '🧵',
  'Steel and Metal': '⚙️',
  Chemicals: '🧪',
};

const GRADIENTS: Record<string, string> = {
  'Electronics and IT': 'from-blue-600 to-indigo-600',
  'Food and Beverages': 'from-emerald-500 to-teal-600',
  Furniture: 'from-amber-500 to-orange-500',
  Textiles: 'from-pink-500 to-rose-600',
  'Steel and Metal': 'from-slate-600 to-gray-700',
  Chemicals: 'from-purple-600 to-violet-600',
};

export default function GuidesPage() {
  const { activeLanguage } = useLanguageStore();
  const [guides, setGuides] = useState<any[]>([]);
  const [selectedGuide, setSelectedGuide] = useState<any>(null);

  useEffect(() => {
    fetch('/data/guides.json')
      .then((res) => res.json())
      .then((data) => {
        const list = data.guides || [];
        setGuides(list);
        if (list.length > 0) {
          setSelectedGuide(list[0]);
        }
      })
      .catch((err) => console.error('Failed to load guides:', err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-16">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">📚 Industry Guides</h1>
          <p className="text-gray-500 text-sm">
            Step-by-step BIS certification roadmaps tailored for your industry vertical
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Vertical Selector List */}
          <div className="lg:col-span-1 space-y-3">
            {guides.map((g, idx) => {
              const icon = VERTICAL_ICONS[g.vertical] || '📋';
              const grad = GRADIENTS[g.vertical] || 'from-teal-600 to-emerald-600';
              const isSelected = selectedGuide?.id === g.id;

              return (
                <motion.button
                  key={g.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * idx }}
                  onClick={() => setSelectedGuide(g)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-3.5 ${
                    isSelected
                      ? 'border-teal-500 bg-teal-50/60 shadow-sm'
                      : 'border-gray-200/80 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className={`w-11 h-11 bg-gradient-to-br ${grad} rounded-xl flex items-center justify-center text-xl shadow-xs text-white`}>
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm">{g.vertical}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatDays(g.avgTimeline)} avg · {formatCurrency(g.avgCost)} est. cost
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Guide Details View */}
          <div className="lg:col-span-2">
            {selectedGuide ? (
              <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">{VERTICAL_ICONS[selectedGuide.vertical] || '📋'}</div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">{selectedGuide.vertical}</h2>
                    <p className="text-xs text-teal-700 font-semibold">
                      BIS Certification Path & Roadmap
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  {t(selectedGuide.content, activeLanguage) || selectedGuide.content?.en}
                </p>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4 mb-8 border border-gray-100">
                  <div>
                    <p className="text-xs font-medium text-gray-500">Average Certification Timeline</p>
                    <p className="text-lg font-extrabold text-teal-800">{formatDays(selectedGuide.avgTimeline)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Typical Testing & License Cost</p>
                    <p className="text-lg font-extrabold text-teal-800">{formatCurrency(selectedGuide.avgCost)}</p>
                  </div>
                </div>

                {/* Certification Stages */}
                <h3 className="text-base font-bold text-gray-900 mb-4">
                  Key Steps & Certification Stages
                </h3>

                <div className="space-y-4 mb-8">
                  {(selectedGuide.stages || []).map((stg: any, sIdx: number) => (
                    <div key={sIdx} className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                      <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        {sIdx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-1">
                          {t(stg.title, activeLanguage) || stg.title?.en}
                        </h4>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {t(stg.description, activeLanguage) || stg.description?.en}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Related Standards */}
                {selectedGuide.relatedStandards && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Key Related Standards
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedGuide.relatedStandards.map((std: string, i: number) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-teal-50 text-teal-700 font-semibold text-xs rounded-lg border border-teal-200"
                        >
                          {std}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 text-gray-400">
                Select an industry guide to view details
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
