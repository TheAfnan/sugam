import { getAllProblems } from '@/lib/actions/problems'
import AdminProblemsClient from './AdminProblemsClient'

export const dynamic = 'force-dynamic'

export default async function AdminProblemsPage() {
  const problems = await getAllProblems()
  return <AdminProblemsClient problems={problems} />
}
