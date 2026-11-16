'use client'

import { copy, type Locale } from '@/content/locales'
import { detailLabels } from '@/content/detail-labels'
import { getLocalizedTour } from '@/components/tour-card'
import { useTourOverride } from '@/components/use-tour-override'

export function TourStoryDetails({ locale, trip }: { locale: Locale; trip: { id: string; route: string; subtitle: string } }) {
  const t = copy[locale]
  const labels = detailLabels[locale]
  const tour = useTourOverride(trip.id, locale)
  const content = getLocalizedTour(tour, locale)
  const lines = (value?: string) => (value || '').split('\n').map((line) => line.trim()).filter(Boolean)
  const faqs = lines(content.faq).map((line) => { const [question, ...answer] = line.split('|'); return { question: question.trim(), answer: answer.join('|').trim() } })
  return <><p>{content.subtitle || trip.subtitle}</p><div className="detail-facts"><div><span>{t.routeLabel}</span><strong>{content.route || trip.route}</strong></div><div><span>{t.durationLabel}</span><strong>{tour.duration || t.durationInquiry}</strong></div><div><span>{t.scheduleLabel}</span><strong>{tour.departure || t.scheduleInquiry}</strong></div>{tour.groupSize && <div><span>{locale === 'ar' ? 'حجم المجموعة' : locale === 'en' ? 'Group size' : locale === 'fr' ? 'Taille du groupe' : locale === 'es' ? 'Tamaño del grupo' : locale === 'zh' ? '团队人数' : locale === 'ja' ? 'グループ人数' : 'Gruppengröße'}</span><strong>{tour.groupSize}</strong></div>}</div>
    {content.itinerary && <section className="trip-detail-section"><h3>{labels.itinerary}</h3><ol className="itinerary-list">{lines(content.itinerary).map((item, index) => <li key={`${index}-${item}`}><span>{String(index + 1).padStart(2, '0')}</span>{item}</li>)}</ol></section>}
    {content.destinations && <section className="trip-detail-section"><h3>{labels.destinations}</h3><ul className="trip-chip-list">{lines(content.destinations).map((place) => <li key={place}>{place}</li>)}</ul></section>}
    {content.included && <section className="trip-detail-section"><h3>{labels.included}</h3><ul className="included-list">{lines(content.included).map((item) => <li key={item}><span>✓</span>{item}</li>)}</ul></section>}
    {faqs.length > 0 && <section className="trip-detail-section trip-faq"><h3>{labels.faq}</h3>{faqs.map((item) => <details key={item.question}><summary>{item.question}<b>+</b></summary><p>{item.answer}</p></details>)}</section>}
    <div className="detail-video-note"><span>▶</span><p>{labels.videoPanel}</p></div>
  </>
}
