'use client'

import { useCallback } from 'react'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { cn, SIH_THEMES } from '@/lib/utils'
import type { FilterState } from '@/types'

interface ProblemFiltersProps {
  filters: FilterState
  onChange: (filters: Partial<FilterState>) => void
  totalCount: number
  filteredCount: number
}

export default function ProblemFilters({ filters, onChange, totalCount, filteredCount }: ProblemFiltersProps) {
  const handleCategoryChange = useCallback((category: FilterState['category']) => {
    onChange({ category, theme: 'all', status: 'all' })
  }, [onChange])

  const handleReset = useCallback(() => {
    onChange({
      category: 'all',
      theme: 'all',
      ministry: '',
      status: 'all',
      search: '',
      sortBy: 'ps_id',
    })
  }, [onChange])

  const hasActiveFilters = filters.category !== 'all' || filters.theme !== 'all' ||
    filters.status !== 'all' || filters.search !== '' || filters.ministry !== ''

  return (
    <div className="space-y-4">
      {/* Category Tabs */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <span className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filter by Category
          </span>
          <span className="text-xs font-bold text-slate-400">
            Showing <span className="text-slate-700 font-black">{filteredCount}</span> of {totalCount} statements
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { key: 'all' as const, label: 'All Categories', icon: '📋', count: totalCount },
            { key: 'Software' as const, label: '💻 Software Edition', icon: null, count: null },
            { key: 'Hardware' as const, label: '⚡ Hardware Edition', icon: null, count: null },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleCategoryChange(key)}
              className={cn(
                'flex items-center justify-between p-4 rounded-2xl font-black text-sm border-2 transition-all cursor-pointer',
                filters.category === key
                  ? 'bg-[#1a237e] text-white border-[#1a237e] shadow-md ring-2 ring-blue-950/20'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
              )}
            >
              <span>{label}</span>
              {key === 'all' && (
                <span className={cn(
                  'text-xs px-2.5 py-0.5 rounded-full font-black',
                  filters.category === 'all' ? 'bg-amber-400 text-slate-900' : 'bg-slate-200 text-slate-700'
                )}>
                  {filteredCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Search + Filters */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-black uppercase tracking-widest text-slate-500">
            Search & Filter
          </span>
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Clear All
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Search Keywords / PS ID / Ministry:
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => onChange({ search: e.target.value })}
                placeholder="e.g. SIH26-1001, AI, Health, Education..."
                className="w-full pl-10 pr-9 py-3 text-sm font-medium bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-[#1a237e] focus:bg-white transition-all shadow-sm"
              />
              {filters.search && (
                <button
                  onClick={() => onChange({ search: '' })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Theme Filter */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Theme / Domain:
            </label>
            <div className="relative">
              <select
                value={filters.theme}
                onChange={(e) => onChange({ theme: e.target.value })}
                className="w-full appearance-none bg-slate-50 border-2 border-slate-200 text-slate-900 font-medium text-sm rounded-2xl px-4 py-3 pr-8 focus:outline-none focus:border-[#1a237e] focus:bg-white transition-all shadow-sm cursor-pointer"
              >
                <option value="all">★ All Themes</option>
                {SIH_THEMES.map((theme) => (
                  <option key={theme} value={theme}>{theme}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                ▾
              </div>
            </div>
          </div>

          {/* Status + Sort */}
          <div className="grid grid-cols-2 gap-3 lg:block lg:space-y-0">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">
                Availability:
              </label>
              <select
                value={filters.status}
                onChange={(e) => onChange({ status: e.target.value as FilterState['status'] })}
                className="w-full appearance-none bg-slate-50 border-2 border-slate-200 text-slate-900 font-medium text-sm rounded-2xl px-3 py-3 focus:outline-none focus:border-[#1a237e] focus:bg-white transition-all shadow-sm cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="limited">Limited</option>
                <option value="full">Full</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sort Row */}
        <div className="mt-3.5 flex items-center gap-3 flex-wrap">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Sort by:</span>
          {[
            { key: 'ps_id' as const, label: 'PS ID' },
            { key: 'title' as const, label: 'Title' },
            { key: 'most_selected' as const, label: 'Most Selected' },
            { key: 'availability' as const, label: 'Availability' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => onChange({ sortBy: key })}
              className={cn(
                'px-3 py-1.5 text-xs font-bold rounded-xl border transition-all',
                filters.sortBy === key
                  ? 'bg-[#1a237e] text-white border-[#1a237e]'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
