export function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  return Boolean(url?.startsWith('https://') && !url.includes('your-project-ref') && key && key !== 'sb_publishable_replace_me')
}
