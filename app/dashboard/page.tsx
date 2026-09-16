'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import {
  MessageSquare,
  Search,
  Bookmark,
  Clock,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { motion } from 'framer-motion';

const POPULAR_CATEGORIES = [
  { name: 'Electronics', slug: 'electronics', count: 45, cost: '₹25K–₹1.5L', icon: '⚡' },
  { name: 'Food Products', slug: 'food', count: 38, cost: '₹15K–₹80K', icon: '🥗' },
  { name: 'Furniture', slug: 'furniture', count: 22, cost: '₹10K–₹60K', icon: '🪑' },
  { name: 'Textiles', slug: 'textiles', count: 31, cost: '₹20K–₹90K', icon: '🧵' },
  { name: 'Steel & Metal', slug: 'steel', count: 28, cost: '₹30K–₹1.2L', icon: '⚙️' },
  { name: 'Chemicals', slug: 'chemicals', count: 35, cost: '₹40K–₹2L', icon: '🧪' },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [stats, setStats] = useState<any>({
    totalChats: 18,
    standardsExplored: 16,
    savedStandards: 3,
    lastActivity: 'Today',
  });
  const [recentSearches, setRecentSearches] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    Promise.all([
      fetch('/api/dashboard/stats').then((r) => (r.ok ? r.json() : null)),
      fetch('/api/dashboard/recent-searches').then((r) => (r.ok ? r.json() : null)),
      fetch('/api/dashboard/favorites').then((r) => (r.ok ? r.json() : null)),
    ]).then(([s, r, f]) => {
      if (s) setStats(s);
      if (r) setRecentSearches(r);
      if (f) setFavorites(f);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 text-sm font-medium">
        Loading dashboard...
      </div>
    );
  }

  const firstName = user?.name ? user.name.split(' ')[0] : 'Innovator';

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-slate-900 to-teal-950 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden"
      >
        <div className="relative z-10 max-w-xl">
          <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold backdrop-blur-md">
            Welcome Back
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-2 mb-2">
            Hello, {firstName}! 👋
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            Track your standards compliance roadmap, calculate testing fees, and interact with the AI assistant.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
            >
              <MessageSquare size={14} />
              <span>Ask SUGAM Assistant</span>
            </Link>
            <Link
              href="/timeline"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors border border-white/10"
            >
              <span>Calculate Timeline</span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Counter Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Conversations', val: stats.totalChats, icon: MessageSquare },
          { label: 'Standards Explored', val: stats.standardsExplored, icon: Search },
          { label: 'Saved Standards', val: stats.savedStandards, icon: Bookmark },
          { label: 'Last Activity', val: stats.lastActivity, icon: Clock },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500">{item.label}</span>
                <Icon size={16} className="text-teal-600" />
              </div>
              <div className="text-2xl font-black text-gray-900">{item.val}</div>
            </div>
          );
        })}
      </div>

      {/* Categories Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900">Industry Categories</h3>
          <Link href="/guides" className="text-xs font-semibold text-teal-600 hover:underline">
            View All Guides →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {POPULAR_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href="/compare"
              className="bg-white rounded-2xl border border-gray-200/80 p-5 hover:border-teal-400 hover:shadow-md transition-all group"
            >
              <div className="text-2xl mb-2">{cat.icon}</div>
              <h4 className="font-bold text-gray-900 text-sm group-hover:text-teal-700 transition-colors">
                {cat.name}
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                {cat.count} Standards · Est. {cat.cost}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity & Saved Standards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Searches */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-2xs">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock size={16} className="text-teal-600" />
            <span>Recent Queries & Searches</span>
          </h3>
          <div className="space-y-3">
            {recentSearches.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50/70 border border-gray-100 text-xs"
              >
                <div>
                  <p className="font-bold text-gray-800">{s.query}</p>
                  <p className="text-[10px] text-gray-400">{s.timestamp}</p>
                </div>
                <span className="px-2 py-0.5 bg-teal-50 text-teal-700 font-semibold rounded">
                  {s.resultsCount} matches
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Favorites */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-2xs">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Bookmark size={16} className="text-teal-600" />
            <span>Saved Compliance Standards</span>
          </h3>
          <div className="space-y-3">
            {favorites.map((fav) => (
              <Link
                key={fav.id}
                href="/compare"
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50/70 hover:bg-teal-50/50 border border-gray-100 text-xs transition-colors group"
              >
                <div className="min-w-0 pr-2">
                  <p className="font-bold text-teal-800 group-hover:underline">{fav.number}</p>
                  <p className="text-[11px] text-gray-600 truncate">{fav.title}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-extrabold text-gray-900">~{fav.timelineDays}d</p>
                  <p className="text-[10px] text-gray-500">₹{fav.costRange?.min?.toLocaleString('en-IN')}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
