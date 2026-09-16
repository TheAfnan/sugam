import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/actions/auth'
import { getMyTeam } from '@/lib/actions/teams'
import TeamPageClient from './TeamPageClient'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ action?: string }>
}

export default async function TeamPage({ searchParams }: Props) {
  const { action } = await searchParams
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')

  const team = await getMyTeam()

  return <TeamPageClient team={team as any} user={user} initialAction={action} />
}
