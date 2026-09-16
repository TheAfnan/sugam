'use client'

import { useState, useMemo, useCallback } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProblemCard from '@/components/problems/ProblemCard'
import ProblemFilters from '@/components/problems/ProblemFilters'
import { getAvailabilityStatus } from '@/lib/utils'
import type { Problem, FilterState } from '@/types'
import { ChevronLeft, ChevronRight, AlertCircle, Loader2 } from 'lucide-react'

interface ProblemsClientProps {
  initialProblems: Problem[]
  totalCount: number
}

const ITEMS_PER_PAGE = 12

export default function ProblemsClient({ initialProblems, totalCount }: ProblemsClientProps) {
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    theme: 'all',
    ministry: '',
    status: 'all',
    search: '',
    sortBy: 'ps_id',
  })
  const [page, setPage] = useState(1)

  const handleFilterChange = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    setPage(1)
  }, [])

  // Client-side filtering on the initial dataset
  const filteredProblems = useMemo(() => {
    let result = [...initialProblems]

    if (filters.category !== 'all') {
      result = result.filter(p => p.category === filters.category)
    }

    if (filters.theme !== 'all') {
      result = result.filter(p => p.theme === filters.theme)
    }

    if (filters.status !== 'all') {
      result = result.filter(p => {
        const status = getAvailabilityStatus(p)
        return status === filters.status
      })
    }

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase()
      result = result.filter(p =>
        p.ps_id.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.organization.toLowerCase().includes(q) ||
        (p.ministry || '').toLowerCase().includes(q) ||
        p.theme.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.keywords || []).some(k => k.toLowerCase().includes(q))
      )
    }

    // Sort
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'most_selected':
          return b.current_team_count - a.current_team_count
        case 'availability':
          return (a.max_teams - a.current_team_count) - (b.max_teams - b.current_team_count)
        default:
          return a.ps_id.localeCompare(b.ps_id)
      }
    })

    return result
  }, [initialProblems, filters])

  // Pagination
  const totalPages = Math.ceil(filteredProblems.length / ITEMS_PER_PAGE)
  const paginatedProblems = filteredProblems.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-1 bg-slate-50/70 pt-[68px]">
        <div className="container-main py-10 sm:py-14 space-y-8">

          {/* Page Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a237e] text-amber-400 text-xs font-black uppercase tracking-wider shadow-sm">
              ✦ Government of India · SIH 2026 Release
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
              Official Problem Bank
            </h1>
            <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed">
              Browse {totalCount} verified government problem statements.
              Filter by category, theme, or keyword with live team quotas.
            </p>
          </div>

          {/* Filters */}
          <ProblemFilters
            filters={filters}
            onChange={handleFilterChange}
            totalCount={totalCount}
            filteredCount={filteredProblems.length}
          />

          {/* Results Header */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-xl font-black text-slate-950 tracking-tight">
              Problem Statements{' '}
              <span className="text-slate-400 font-bold">({filteredProblems.length})</span>
            </h2>
            {filteredProblems.length > 0 && (
              <p className="text-sm text-slate-500 font-medium">
                Page {page} of {totalPages}
              </p>
            )}
          </div>

          {/* Problem Grid */}
          {paginatedProblems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {paginatedProblems.map((problem) => (
                <ProblemCard key={problem.id} problem={problem} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 space-y-4">
              <AlertCircle className="w-12 h-12 mx-auto text-slate-300" />
              <h3 className="text-lg font-black text-slate-500">No problems found</h3>
              <p className="text-sm text-slate-400">
                Try adjusting your search or filters.
              </p>
              <button
                onClick={() => handleFilterChange({
                  category: 'all', theme: 'all', status: 'all', search: '', sortBy: 'ps_id'
                })}
                className="text-sm font-bold text-[#1a237e] hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (page <= 3) {
                  pageNum = i + 1
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = page - 2 + i
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-9 h-9 text-sm font-bold rounded-xl transition-all ${
                      page === pageNum
                        ? 'bg-[#1a237e] text-white shadow-md'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
