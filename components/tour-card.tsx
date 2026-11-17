'use client'

import Link from 'next/link'
import { copy, photoAssets, type Locale } from '@/content/locales'
import { useTourOverride } from '@/components/use-tour-override'
import { ArrowIcon } from '@/components/arrow-icon'

export type TourText = { title?: string; subtitle?: string; route?: string; itinerary?: string; included?: string; destinations?: string; faq?: string }
export type TourOverride = TourText & { price?: string; currency?: string; departure?: string; duration?: string; available?: string; total?: string; groupSize?: string; image?: string; gallery?: string; video?: string; translations?: Partial<Record<Locale, TourText>> }
export const TOUR_STORAGE_KEY = 'discover-mauritania-demo-catalog-v1'

export function getSavedTour(id: string): TourOverride {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem(TOUR_STORAGE_KEY) || '{}')[id] || {} } catch { return {} }
}

export function getLocalizedTour(override: TourOverride, locale: Locale): TourOverride {
  return { ...override, ...override.translations?.[locale] }
}

export function TourCard({ locale, tour }: { locale: Locale; tour: (typeof copy)[Locale]['programs'][number] }) {
  const t = copy[locale]
  const override = useTourOverride(tour.id, locale)
  const photo = photoAssets[tour.image as keyof typeof photoAssets]
  const content = getLocalizedTour(override, locale)
  const href = `/${locale}/tours/${tour.id}`
  const title = content.title || tour.title
  return <article className="tour-card">
    <Link className="tour-photo-link" href={href} aria-label={title}><img className="tour-photo" src={override.image || photo.src} alt={tour.category} loading="lazy"/><span className="tour-photo-shade"/><span className="tour-badge">{tour.type}</span><span className="tour-arrow"><ArrowIcon/></span>{!override.image && <span className="photo-credit-link">{photo.credit} · {photo.license}</span>}</Link>
    <div className="tour-card-body"><div className="tour-card-meta"><span>{tour.category}</span><span className="tour-duration">◷ {override.duration || t.durationInquiry}</span></div><h3><Link href={href}>{title}</Link></h3><p className="tour-subtitle">{content.subtitle || tour.subtitle}</p><div className="tour-route"><span className="route-dot"/>{content.route || tour.route}</div><div className="tour-card-foot"><div className="tour-price"><small>{t.priceLabel}</small><strong>{override.price ? `${override.price} ${override.currency || 'USD'}` : t.priceInquiry}</strong>{override.departure && <small>{override.departure}</small>}</div><Link className="button button-ink" href={href}>{t.askDetails}<ArrowIcon/></Link></div></div>
  </article>
}

