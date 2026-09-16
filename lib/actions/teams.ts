'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from './auth'

export async function getMyTeam() {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return null

  const { data: membership } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('user_id', user.id)
    .single()

  if (!membership) return null

  const { data: team } = await supabase
    .from('teams')
    .select(`
      *,
      leader:profiles!teams_leader_id_fkey(*),
      members:team_members(*, profile:profiles(*))
    `)
    .eq('id', membership.team_id)
    .single()

  if (!team) return null

  const { data: selection } = await supabase
    .from('problem_selections')
    .select('*, problem:problems(*)')
    .eq('team_id', team.id)
    .single()

  return { ...team, selection: selection || null }
}

export async function createTeam(formData: FormData) {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: existing } = await supabase
    .from('team_members')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (existing) return { error: 'You are already a member of a team' }

  const name = formData.get('name') as string
  const department = formData.get('department') as string
  const description = formData.get('description') as string

  if (!name?.trim()) return { error: 'Team name is required' }

  const { data: settingsData } = await supabase
    .from('event_settings')
    .select('value')
    .eq('key', 'max_team_size')
    .single()

  const maxSize = (settingsData?.value as number) || 6
  const teamId = `DSMNRU-${Math.floor(Math.random() * 9000) + 1000}`

  const { data: team, error } = await supabase
    .from('teams')
    .insert({
      team_id: teamId,
      name: name.trim(),
      leader_id: user.id,
      department,
      description,
      max_size: maxSize,
      status: 'forming',
    })
    .select()
    .single()

  if (error) return { error: error.message }

  const { error: memberError } = await supabase.from('team_members').insert({
    team_id: team.id,
    user_id: user.id,
    role: 'leader',
  })

  if (memberError) return { error: memberError.message }

  revalidatePath('/dashboard')
  return { success: true, team }
}

export async function joinTeam(teamCode: string) {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: existing } = await supabase
    .from('team_members')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (existing) return { error: 'You are already a member of a team' }

  const { data: team } = await supabase
    .from('teams')
    .select('*, members:team_members(id)')
    .eq('team_id', teamCode.trim().toUpperCase())
    .single()

  if (!team) return { error: 'Team not found. Please check the team code.' }
  if (team.status !== 'forming') return { error: 'This team is no longer accepting new members' }
  if (team.members.length >= team.max_size) return { error: 'This team is full' }

  const { error } = await supabase.from('team_members').insert({
    team_id: team.id,
    user_id: user.id,
    role: 'member',
  })

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function leaveTeam() {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: membership } = await supabase
    .from('team_members')
    .select('id, role, team_id')
    .eq('user_id', user.id)
    .single()

  if (!membership) return { error: 'You are not in a team' }
  if (membership.role === 'leader') {
    return { error: 'Team leader cannot leave. Transfer leadership or delete the team first.' }
  }

  const { error } = await supabase.from('team_members').delete().eq('id', membership.id)
  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function selectProblem(problemId: string) {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return { error: 'Not authenticated' }

  const { data, error } = await supabase.rpc('select_problem', {
    p_user_id: user.id,
    p_problem_id: problemId,
  })

  if (error) return { error: error.message }

  const result = data as { error?: string; success?: boolean; message?: string }
  if (result?.error) return { error: result.error }

  revalidatePath('/dashboard')
  revalidatePath('/problems')
  revalidatePath(`/problems/${problemId}`)
  return { success: true, message: result?.message }
}

export async function withdrawProblemSelection() {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: settings } = await supabase
    .from('event_settings')
    .select('value')
    .eq('key', 'allow_problem_change')
    .single()

  if (settings?.value === false) {
    return { error: 'Problem changes are not allowed at this time. Contact faculty.' }
  }

  const { data: membership } = await supabase
    .from('team_members')
    .select('team_id, role')
    .eq('user_id', user.id)
    .single()

  if (!membership) return { error: 'You are not in a team' }
  if (membership.role !== 'leader') return { error: 'Only the team leader can change problem selection' }

  const { error } = await supabase.rpc('withdraw_problem_selection', {
    p_team_id: membership.team_id,
  })

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath('/problems')
  return { success: true }
}

export async function removeMember(memberId: string) {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return { error: 'Not authenticated' }

  // Verify the current user is the team leader
  const { data: leadership } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('user_id', user.id)
    .eq('role', 'leader')
    .single()

  if (!leadership) return { error: 'Only team leader can remove members' }

  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('id', memberId)
    .eq('team_id', leadership.team_id)
    .neq('role', 'leader')

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  return { success: true }
}
