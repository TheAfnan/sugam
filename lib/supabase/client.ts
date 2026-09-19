import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lzwddlsabppmggfsimzj.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_DPs0UpaJ5VK4QGK3CeV4Qg_KCrJOlW2'

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
