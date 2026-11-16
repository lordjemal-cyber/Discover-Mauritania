'use client'

import { createBrowserClient } from '@supabase/ssr'
import { isSupabaseConfigured } from '@/lib/supabase/config'

let browserClient: ReturnType<typeof createBrowserClient> | undefined

export function createClient() {
  if (!isSupabaseConfigured()) return null
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) return null
  browserClient ??= createBrowserClient(url, key)
  return browserClient
}
