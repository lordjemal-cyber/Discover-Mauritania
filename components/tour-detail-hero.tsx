'use client'

import Link from 'next/link'
import type { Locale } from '@/content/locales'
import { detailLabels } from '@/content/detail-labels'
import { getLocalizedTour } from '@/components/tour-card'
import { useTourOverride } from '@/components/use-tour-override'

export function TourDetailHero({ locale, trip, photo }: { locale: Locale; trip: { id: string; title: string; category: string; subtitle: string }; photo: { src: string; credit: string; license: string; page: string } }) {
  const override = useTourOverride(trip.id, locale)
  const labels = detailLabels[locale]
  const content = getLocalizedTour(override, locale)
  return <section className="tour-detail-hero"><img src={override.image || photo.src} alt={trip.category}/><div/><Link href={`/${locale}/tours`} className="detail-back">← {labels.allTrips}</Link><div className="detail-title"><p>{trip.category} · MAURITANIA</p><h1>{content.title || trip.title}</h1><span>{content.subtitle || trip.subtitle}</span></div>{!override.image && <a className="detail-photo-credit" href={photo.page} target="_blank" rel="noreferrer">{photo.credit} · {photo.license}</a>}</section>
}
