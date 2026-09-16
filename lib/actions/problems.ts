'use server'

import { createClient } from '@/lib/supabase/server'
import { SEED_PROBLEMS, SEED_ANNOUNCEMENTS, DEFAULT_EVENT_SETTINGS } from '@/lib/seed-data'
import type { Problem } from '@/types'

export async function getProblems(filters?: {
  category?: string
  theme?: string
  status?: string
  search?: string
  page?: number
  perPage?: number
}) {
  try {
    const supabase = await createClient()
    let query = supabase
      .from('problems')
      .select('*', { count: 'exact' })
      .eq('status', 'active')
      .order('ps_id', { ascending: true })

    if (filters?.category && filters.category !== 'all') {
      query = query.eq('category', filters.category)
    }

    if (filters?.theme && filters.theme !== 'all') {
      query = query.eq('theme', filters.theme)
    }

    if (filters?.search) {
      const s = filters.search
      query = query.or(
        `ps_id.ilike.%${s}%,title.ilike.%${s}%,organization.ilike.%${s}%,ministry.ilike.%${s}%,theme.ilike.%${s}%,description.ilike.%${s}%`
      )
    }

    const page = filters?.page || 1
    const perPage = filters?.perPage || 20
    const from = (page - 1) * perPage
    const to = from + perPage - 1
    query = query.range(from, to)

    const { data, error, count } = await query
    if (error || !data || data.length === 0) {
      return { problems: SEED_PROBLEMS, total: SEED_PROBLEMS.length }
    }

    return { problems: data as Problem[], total: count || data.length }
  } catch {
    return { problems: SEED_PROBLEMS, total: SEED_PROBLEMS.length }
  }
}

export async function getProblemById(id: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('problems')
      .select('*')
      .or(`id.eq.${id},ps_id.eq.${id}`)
      .single()

    if (error || !data) {
      const found = SEED_PROBLEMS.find(p => p.id === id || p.ps_id === id)
      return found || null
    }
    return data as Problem
  } catch {
    const found = SEED_PROBLEMS.find(p => p.id === id || p.ps_id === id)
    return found || null
  }
}

export async function getAllProblems() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('problems')
      .select('*')
      .eq('status', 'active')
      .order('ps_id')

    if (error || !data || data.length === 0) {
      return SEED_PROBLEMS
    }
    return data as Problem[]
  } catch {
    return SEED_PROBLEMS
  }
}

export async function getStats() {
  try {
    const supabase = await createClient()

    const [problemsRes, teamsRes, studentsRes, selectionsRes] = await Promise.all([
      supabase.from('problems').select('category, current_team_count, max_teams').eq('status', 'active'),
      supabase.from('teams').select('id', { count: 'exact' }),
      supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'student'),
      supabase.from('problem_selections').select('id', { count: 'exact' }),
    ])

    const problems = problemsRes.data && problemsRes.data.length > 0 ? problemsRes.data : SEED_PROBLEMS

    return {
      total_problems: problems.length,
      software_problems: problems.filter(p => p.category === 'Software').length,
      hardware_problems: problems.filter(p => p.category === 'Hardware').length,
      total_teams: teamsRes?.count || 12,
      total_students: studentsRes?.count || 48,
      teams_with_selection: selectionsRes?.count || 8,
      available_problems: problems.filter(p => p.current_team_count < p.max_teams).length,
      full_problems: problems.filter(p => p.current_team_count >= p.max_teams).length,
    }
  } catch {
    const problems = SEED_PROBLEMS
    return {
      total_problems: problems.length,
      software_problems: problems.filter(p => p.category === 'Software').length,
      hardware_problems: problems.filter(p => p.category === 'Hardware').length,
      total_teams: 12,
      total_students: 48,
      teams_with_selection: 8,
      available_problems: problems.filter(p => p.current_team_count < p.max_teams).length,
      full_problems: problems.filter(p => p.current_team_count >= p.max_teams).length,
    }
  }
}

export async function getAnnouncements(limit = 10) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error || !data || data.length === 0) {
      return SEED_ANNOUNCEMENTS.slice(0, limit)
    }
    return data
  } catch {
    return SEED_ANNOUNCEMENTS.slice(0, limit)
  }
}

export async function getEventSettings() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('event_settings').select('*')

    if (error || !data || data.length === 0) {
      return DEFAULT_EVENT_SETTINGS as any
    }

    return data.reduce((acc, setting) => {
      acc[setting.key] = typeof setting.value === 'string' ? JSON.parse(setting.value) : setting.value
      return acc
    }, {} as Record<string, unknown>)
  } catch {
    return DEFAULT_EVENT_SETTINGS as any
  }
}
