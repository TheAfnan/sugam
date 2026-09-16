// Core application types for DSMNRU SIH 2026 Portal

export type UserRole = 'student' | 'faculty' | 'admin'

export type ProblemCategory = 'Software' | 'Hardware'

export type ProblemStatus = 'active' | 'disabled' | 'archived'

export type TeamStatus = 'forming' | 'complete' | 'submitted' | 'approved' | 'rejected'

export type SelectionStatus = 'pending' | 'approved' | 'rejected' | 'withdrawn'

export type AvailabilityStatus = 'available' | 'limited' | 'full'

export interface Profile {
  id: string
  email: string
  full_name: string
  enrollment_number?: string
  phone?: string
  department?: string
  year_of_study?: number
  role: UserRole
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Problem {
  id: string
  ps_id: string
  title: string
  category: ProblemCategory
  theme: string
  ministry?: string
  organization: string
  background?: string
  description: string
  expected_solution?: string
  constraints?: string
  reference_links?: string[]
  keywords?: string[]
  max_teams: number
  current_team_count: number
  status: ProblemStatus
  is_featured: boolean
  created_by?: string
  created_at: string
  updated_at: string
}

export interface Team {
  id: string
  team_id: string
  name: string
  leader_id: string
  department?: string
  description?: string
  status: TeamStatus
  max_size: number
  created_at: string
  updated_at: string
  // Joined
  leader?: Profile
  members?: TeamMember[]
  selection?: ProblemSelection
}

export interface TeamMember {
  id: string
  team_id: string
  user_id: string
  role: 'leader' | 'member'
  joined_at: string
  // Joined
  profile?: Profile
}

export interface ProblemSelection {
  id: string
  team_id: string
  problem_id: string
  selected_by: string
  status: SelectionStatus
  selected_at: string
  approved_at?: string
  approved_by?: string
  notes?: string
  // Joined
  problem?: Problem
  team?: Team
}

export interface Announcement {
  id: string
  title: string
  content: string
  is_important: boolean
  is_published: boolean
  published_by: string
  created_at: string
  updated_at: string
  expires_at?: string
  // Joined
  author?: Profile
}

export interface EventSettings {
  max_team_size: number
  min_team_size: number
  max_teams_per_problem: number
  allow_problem_change: boolean
  require_approval: boolean
  selection_locked: boolean
  registration_open: boolean
  event_dates: {
    registration_end: string
    problem_selection_end: string
    internal_event_date: string
  }
}

// UI / utility types
export interface FilterState {
  category: 'all' | 'Software' | 'Hardware'
  theme: string
  ministry: string
  status: 'all' | 'available' | 'limited' | 'full'
  search: string
  sortBy: 'ps_id' | 'title' | 'most_selected' | 'availability'
}

export interface PaginationState {
  page: number
  perPage: number
  total: number
}

export interface StatsData {
  total_problems: number
  software_problems: number
  hardware_problems: number
  total_teams: number
  teams_with_selection: number
  available_problems: number
  full_problems: number
  total_students: number
}
