import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AdminDashboard } from '@/components/admin-dashboard'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'لوحة الإدارة — اكتشف موريتانيا', robots: { index: false, follow: false } }

export default async function AdminPage() {
  if (!isSupabaseConfigured()) return <AdminDashboard/>

  const supabase = await createClient()
  if (!supabase) return <AdminDashboard/>

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) return <AdminDashboard/>

  const { data: isAdmin, error: adminError } = await supabase.rpc('is_site_admin')
  if (adminError || isAdmin !== true) notFound()

  return <AdminDashboard/>
}
