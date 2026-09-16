import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getProblemById } from '@/lib/actions/problems'
import { getCurrentUser } from '@/lib/actions/auth'
import { getMyTeam } from '@/lib/actions/teams'
import { getAvailabilityStatus, getSlotsRemaining, cn } from '@/lib/utils'
import {
  Building2, Tag, Cpu, Zap, Users, ArrowLeft, ExternalLink,
  Lock, CheckCircle, AlertCircle, BookOpen, Lightbulb,
  ChevronRight, Shield, Clock
} from 'lucide-react'
import SelectProblemButton from './SelectProblemButton'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const problem = await getProblemById(id)
  if (!problem) return { title: 'Problem Not Found' }
  return {
    title: `${problem.ps_id} — ${problem.title}`,
    description: problem.description.slice(0, 160),
  }
}

export default async function ProblemDetailPage({ params }: Props) {
  const { id } = await params
  const [problem, user] = await Promise.all([
    getProblemById(id),
    getCurrentUser(),
  ])
  const team = user ? await getMyTeam() : null

  if (!problem) notFound()

  const availability = getAvailabilityStatus(problem)
  const slotsLeft = getSlotsRemaining(problem)
  const teamSelection = team?.selection
  const alreadySelected = teamSelection?.problem_id === problem.id
  const teamHasOtherProblem = teamSelection && !alreadySelected

  // Determine CTA state
  let ctaState: 'select' | 'already_selected' | 'team_has_other' | 'full' | 'login' | 'no_team' = 'select'
  if (!user) ctaState = 'login'
  else if (!team) ctaState = 'no_team'
  else if (alreadySelected) ctaState = 'already_selected'
  else if (teamHasOtherProblem) ctaState = 'team_has_other'
  else if (availability === 'full') ctaState = 'full'

  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-1 bg-slate-50 pt-[68px]">
        {/* Breadcrumb */}
        <div className="border-b border-slate-200 bg-white">
          <div className="container-main py-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Link href="/" className="hover:text-slate-700 no-underline font-medium">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/problems" className="hover:text-slate-700 no-underline font-medium">Problem Statements</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-black text-slate-700">{problem.ps_id}</span>
            </div>
          </div>
        </div>

        <div className="container-main py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Back */}
              <Link
                href="/problems"
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 no-underline transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Problem Statements
              </Link>

              {/* Header Card */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-sm font-mono font-black text-white bg-[#1a237e] px-3 py-1.5 rounded-xl tracking-wider">
                      {problem.ps_id}
                    </span>
                    <span className={cn(
                      'text-xs font-black uppercase px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5',
                      problem.category === 'Software' ? 'badge-software' : 'badge-hardware'
                    )}>
                      {problem.category === 'Software'
                        ? <><Cpu className="w-3.5 h-3.5" /> Software</>
                        : <><Zap className="w-3.5 h-3.5" /> Hardware</>
                      }
                    </span>
                    {problem.is_featured && (
                      <span className="text-xs font-black px-2.5 py-1.5 rounded-xl bg-amber-100 text-amber-800 border border-amber-200">
                        ⭐ Featured
                      </span>
                    )}
                  </div>
                  <span className={cn(
                    'text-sm font-black px-3 py-1.5 rounded-full border flex items-center gap-1.5',
                    availability === 'available' ? 'badge-available' :
                    availability === 'limited' ? 'badge-limited' : 'badge-full'
                  )}>
                    <span className={cn(
                      'w-2 h-2 rounded-full',
                      availability === 'available' ? 'bg-emerald-500' :
                      availability === 'limited' ? 'bg-orange-500' : 'bg-red-500'
                    )} />
                    {availability === 'available' ? `${slotsLeft} Slots Available` :
                     availability === 'limited' ? `${slotsLeft} Slot${slotsLeft !== 1 ? 's' : ''} Left` :
                     'Problem Full'}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-black text-slate-950 leading-tight">
                  {problem.title}
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3">
                    <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Organization</p>
                      <p className="text-sm font-bold text-slate-800">{problem.organization}</p>
                    </div>
                  </div>
                  {problem.ministry && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3">
                      <Shield className="w-4 h-4 text-slate-400 shrink-0" />
                      <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Ministry</p>
                        <p className="text-sm font-bold text-slate-800 line-clamp-2">{problem.ministry}</p>
                      </div>
                    </div>
                  )}
                  <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center gap-3">
                    <Tag className="w-4 h-4 text-blue-500 shrink-0" />
                    <div>
                      <p className="text-[10px] font-black uppercase text-blue-400 tracking-wider">Theme</p>
                      <p className="text-sm font-bold text-blue-800">{problem.theme}</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3">
                    <Users className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Teams Selected</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-sm font-bold text-slate-800">
                          {problem.current_team_count} / {problem.max_teams}
                        </p>
                        <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full',
                              availability === 'available' ? 'bg-emerald-400' :
                              availability === 'limited' ? 'bg-orange-400' : 'bg-red-400'
                            )}
                            style={{ width: `${(problem.current_team_count / problem.max_teams) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Keywords */}
                {problem.keywords && problem.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {problem.keywords.map((kw) => (
                      <span key={kw} className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-600 rounded-full border border-slate-200">
                        #{kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Problem Content */}
              {[
                { title: 'Background', icon: BookOpen, content: problem.background },
                { title: 'Problem Statement', icon: AlertCircle, content: problem.description },
                { title: 'Expected Solution', icon: Lightbulb, content: problem.expected_solution },
                { title: 'Constraints', icon: Lock, content: problem.constraints },
              ].filter(s => s.content).map(({ title, icon: Icon, content }) => (
                <div key={title} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                  <h2 className="flex items-center gap-2.5 text-lg font-black text-slate-900 mb-4">
                    <div className="w-8 h-8 rounded-xl bg-[#1a237e]/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-[#1a237e]" />
                    </div>
                    {title}
                  </h2>
                  <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {content}
                  </div>
                </div>
              ))}

              {/* Reference Links */}
              {problem.reference_links && problem.reference_links.length > 0 && (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                  <h2 className="text-lg font-black text-slate-900 mb-4">Reference Links</h2>
                  <ul className="space-y-2">
                    {problem.reference_links.map((link, idx) => (
                      <li key={idx}>
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Selection Card */}
              <div className={cn(
                'bg-white rounded-3xl border-2 p-6 shadow-sm sticky top-[84px] space-y-5',
                alreadySelected ? 'border-emerald-200' :
                availability === 'full' ? 'border-red-100' :
                'border-[#1a237e]/20'
              )}>
                <div className="text-center space-y-2">
                  <h3 className="font-black text-slate-900">Problem Selection</h3>
                  <div className={cn(
                    'text-xs font-black px-3 py-1.5 rounded-full inline-flex items-center gap-1.5',
                    availability === 'available' ? 'bg-emerald-100 text-emerald-700' :
                    availability === 'limited' ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  )}>
                    <span className={cn(
                      'w-1.5 h-1.5 rounded-full',
                      availability === 'available' ? 'bg-emerald-500' :
                      availability === 'limited' ? 'bg-orange-500' : 'bg-red-500'
                    )} />
                    {availability === 'full' ? 'No Slots Available' :
                     `${slotsLeft} of ${problem.max_teams} slots remaining`}
                  </div>
                </div>

                {/* Team count visual */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-500">
                    <span>Teams selected</span>
                    <span>{problem.current_team_count}/{problem.max_teams}</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        availability === 'available' ? 'bg-emerald-400' :
                        availability === 'limited' ? 'bg-orange-400' : 'bg-red-400'
                      )}
                      style={{ width: `${Math.min(100, (problem.current_team_count / problem.max_teams) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between">
                    {Array.from({ length: problem.max_teams }).map((_, i) => (
                      <div key={i} className={cn(
                        'w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-black',
                        i < problem.current_team_count
                          ? 'bg-[#1a237e] border-[#1a237e] text-white'
                          : 'bg-slate-100 border-slate-200 text-slate-400'
                      )}>
                        <Users className="w-3.5 h-3.5" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <SelectProblemButton
                  problemId={problem.id}
                  ctaState={ctaState}
                  teamHasOtherProblem={teamHasOtherProblem || false}
                  otherProblemTitle={teamSelection?.problem?.title}
                />

                {/* Info messages */}
                {ctaState === 'already_selected' && (
                  <div className="flex items-start gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    Your team has selected this problem. Good luck!
                  </div>
                )}

                {ctaState === 'no_team' && (
                  <div className="text-xs font-medium text-slate-500 bg-slate-50 border border-slate-200 rounded-xl p-3">
                    You need to create or join a team before selecting a problem.
                    <Link href="/dashboard" className="block mt-1 text-[#1a237e] font-bold no-underline">
                      Go to Dashboard →
                    </Link>
                  </div>
                )}
              </div>

              {/* Quick Info */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Quick Info</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Problem ID</span>
                    <span className="font-mono font-black text-slate-800">{problem.ps_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Category</span>
                    <span className="font-bold text-slate-800">{problem.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Max Teams</span>
                    <span className="font-bold text-slate-800">{problem.max_teams}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
