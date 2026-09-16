import { getAllProblems } from '@/lib/actions/problems'
import ProblemsClient from './ProblemsClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Problem Statements',
  description: 'Browse all official SIH 2026 problem statements available for DSMNRU teams to select.',
}

export const dynamic = 'force-dynamic'

export default async function ProblemsPage() {
  const problems = await getAllProblems()

  return <ProblemsClient initialProblems={problems} totalCount={problems.length} />
}
