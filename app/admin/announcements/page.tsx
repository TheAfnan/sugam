import { getAnnouncements } from '@/lib/actions/problems'
import AdminAnnouncementsClient from './AdminAnnouncementsClient'

export const dynamic = 'force-dynamic'

export default async function AdminAnnouncementsPage() {
  const announcements = await getAnnouncements(50)
  return <AdminAnnouncementsClient announcements={announcements} />
}
