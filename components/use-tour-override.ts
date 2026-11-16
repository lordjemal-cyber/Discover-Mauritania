'use client'

import { useEffect, useState } from 'react'
import type { Locale } from '@/content/locales'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { loadPublicTourOverride } from '@/lib/supabase/tours'
import { getSavedTour, type TourOverride } from '@/components/tour-card'

export function useTourOverride(slug: string, locale: Locale) {
  const [override, setOverride] = useState<TourOverride>({})

  useEffect(() => {
    let alive = true
    const refresh = async () => {
      if (!isSupabaseConfigured()) {
        setOverride(process.env.NODE_ENV === 'development' ? getSavedTour(slug) : {})
        return
      }
      try {
        const value = await loadPublicTourOverride(slug, locale)
        if (alive) setOverride(value || {})
      } catch {
        if (alive) setOverride({})
      }
    }
    const onPreviewUpdate = () => { void refresh() }
    void refresh()
    window.addEventListener('storage', onPreviewUpdate)
    window.addEventListener('tour-catalog-updated', onPreviewUpdate)
    return () => {
      alive = false
      window.removeEventListener('storage', onPreviewUpdate)
      window.removeEventListener('tour-catalog-updated', onPreviewUpdate)
    }
  }, [slug, locale])

  return override
}
