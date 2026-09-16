import { getEventSettings } from '@/lib/actions/problems'
import AdminSettingsClient from './AdminSettingsClient'

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
  const settings = await getEventSettings()
  return <AdminSettingsClient initialSettings={settings} />
}
