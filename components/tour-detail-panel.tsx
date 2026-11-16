'use client'

import Link from 'next/link'
import { copy, type Locale } from '@/content/locales'
import { detailLabels } from '@/content/detail-labels'
import { getLocalizedTour } from '@/components/tour-card'
import { useTourOverride } from '@/components/use-tour-override'
import { ArrowIcon } from '@/components/arrow-icon'

export function TourDetailPanel({ locale, trip }: { locale: Locale; trip: { id: string; title: string; subtitle: string; route: string }; }) {
  const t = copy[locale]
  const labels = detailLabels[locale]
  const tour = useTourOverride(trip.id, locale)
  let safeVideo = ''
  try { const parsed = new URL(tour.video || ''); if (parsed.protocol === 'https:' && /(^|\.)(youtube\.com|youtu\.be|vimeo\.com)$/.test(parsed.hostname)) safeVideo = parsed.href } catch { safeVideo = '' }
  const content = getLocalizedTour(tour, locale)
  const waText = encodeURIComponent(labels.waMessage(content.title || trip.title))
  return <aside className="price-panel"><h2>{content.title || trip.title}</h2><p className="panel-route">{content.route || trip.route}</p><div className="panel-highlights"><span>◷ {tour.duration || t.durationInquiry}</span>{tour.groupSize && <span>♙ {labels.groupSize(tour.groupSize)}</span>}</div><p>{t.availabilityLabel}</p><strong>{tour.available && tour.total ? `${tour.available} / ${tour.total}` : t.scheduleInquiry}</strong><div className="panel-rule"/><p>{t.priceLabel}</p><strong className="panel-price">{tour.price ? `${tour.price} ${tour.currency || 'USD'}` : t.priceInquiry}</strong>{tour.departure && <span className="panel-departure">{t.scheduleLabel}: {tour.departure}</span>}{safeVideo && <a className="panel-video" href={safeVideo} target="_blank" rel="noreferrer">▶ {labels.video}</a>}<a href={`https://wa.me/22247315321?text=${waText}`} target="_blank" rel="noreferrer" className="button button-whatsapp-inline">{labels.askWhatsApp}<ArrowIcon/></a><Link href={`/${locale}/contact`} className="panel-contact-link">{t.askDetails} <ArrowIcon/></Link><small>{t.formDemo}</small></aside>
}

