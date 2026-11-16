'use client'

import { createClient } from '@/lib/supabase/client'
import type { Locale } from '@/content/locales'
import type { TourOverride, TourText } from '@/components/tour-card'

type DbRow = Record<string, any>

function lines(value?: string) {
  return (value || '').split('\n').map((line) => line.trim()).filter(Boolean)
}

function parseFaqs(value?: string) {
  return lines(value).map((line) => {
    const [question, ...answer] = line.split('|')
    return { question: question.trim(), answer: answer.join('|').trim() }
  }).filter((item) => item.question && item.answer)
}

export async function loadPublicTourOverride(slug: string, locale: Locale): Promise<TourOverride | null> {
  const supabase = createClient()
  if (!supabase) return null

  const [translation, departure, media] = await Promise.all([
    supabase.from('tour_translations').select('title,summary,route,itinerary,destinations,inclusions,faqs').eq('tour_slug', slug).eq('locale', locale).maybeSingle(),
    supabase.from('departures').select('label,duration,price,currency,group_size_limit,capacity,seats_available').eq('tour_slug', slug).eq('is_public', true).order('is_primary', { ascending: false }).order('created_at', { ascending: false }).limit(1).maybeSingle(),
    supabase.from('tour_media').select('media_type,external_url,storage_path,sort_order').eq('tour_slug', slug).eq('is_published', true).order('sort_order'),
  ])
  if (translation.error || departure.error || media.error) return null

  const copy = translation.data as DbRow | null
  const schedule = departure.data as DbRow | null
  const files = (media.data || []) as DbRow[]
  if (!copy && !schedule && files.length === 0) return null

  const publicUrl = (file: DbRow) => {
    if (file.external_url) return String(file.external_url)
    if (file.storage_path && supabase) return supabase.storage.from('tour-media').getPublicUrl(String(file.storage_path)).data.publicUrl
    return ''
  }
  const images = files.filter((file) => file.media_type === 'image').map(publicUrl).filter(Boolean)
  const video = files.find((file) => file.media_type === 'video')
  const localized: TourText = copy ? {
    title: String(copy.title || ''),
    subtitle: String(copy.summary || ''),
    route: String(copy.route || ''),
    itinerary: Array.isArray(copy.itinerary) ? copy.itinerary.join('\n') : '',
    destinations: Array.isArray(copy.destinations) ? copy.destinations.join('\n') : '',
    included: Array.isArray(copy.inclusions) ? copy.inclusions.join('\n') : '',
    faq: Array.isArray(copy.faqs) ? copy.faqs.map((item: DbRow) => `${item.question} | ${item.answer}`).join('\n') : '',
  } : {}

  return {
    translations: { [locale]: localized },
    price: schedule?.price == null ? '' : String(schedule.price),
    currency: schedule?.currency ? String(schedule.currency) : 'USD',
    departure: schedule?.label ? String(schedule.label) : '',
    duration: schedule?.duration ? String(schedule.duration) : '',
    groupSize: schedule?.group_size_limit == null ? '' : String(schedule.group_size_limit),
    available: schedule?.seats_available == null ? '' : String(schedule.seats_available),
    total: schedule?.capacity == null ? '' : String(schedule.capacity),
    image: images[0] || '',
    gallery: images.slice(1).join('\n'),
    video: video ? publicUrl(video) : '',
  }
}

export async function saveTourToSupabase(slug: string, category: string, locale: Locale, values: TourOverride) {
  const supabase = createClient()
  if (!supabase) throw new Error('Supabase is not configured.')
  const imageUrls = [values.image, ...lines(values.gallery)].map((item) => item?.trim() || '').filter(Boolean)
  const media = [
    ...imageUrls.map((url, index) => ({ media_type: 'image', sort_order: index, url })),
    ...(values.video?.trim() ? [{ media_type: 'video', sort_order: 0, url: values.video.trim() }] : []),
  ]
  const translation = {
    title: values.title || '',
    subtitle: values.subtitle || '',
    route: values.route || '',
    itinerary: lines(values.itinerary),
    destinations: lines(values.destinations),
    included: lines(values.included),
    faqs: parseFaqs(values.faq),
  }
  const departure = {
    label: values.departure || '',
    duration: values.duration || '',
    price: values.price || '',
    currency: values.currency || 'USD',
    group_size_limit: values.groupSize || '',
    capacity: values.total || '',
    seats_available: values.available || '',
  }
  const { error } = await supabase.rpc('admin_save_tour', {
    p_slug: slug,
    p_category: category,
    p_locale: locale,
    p_translation: translation,
    p_departure: departure,
    p_media: media,
  })
  if (error) throw new Error(error.message)
}
