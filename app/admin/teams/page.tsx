import { getAdminTeams } from '@/lib/actions/admin'
import AdminTeamsClient from './AdminTeamsClient'

export const dynamic = 'force-dynamic'

export default async function AdminTeamsPage() {
  const teams = await getAdminTeams()
  return <AdminTeamsClient teams={teams} />
}
