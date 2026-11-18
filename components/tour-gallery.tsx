'use client'

import type { Locale } from '@/content/locales'
import { detailLabels } from '@/content/detail-labels'
import { useTourOverride } from '@/components/use-tour-override'

export function TourGallery({ locale, trip, photo }: { locale: Locale; trip: { id: string; title: string }; photo: { src: string; srcSet?: string; credit: string; license: string; page: string } }) {
  const saved = useTourOverride(trip.id, locale)
  const labels = detailLabels[locale]

  const images = [saved.image || photo.src, ...(saved.gallery || '').split('\n').map((url) => url.trim()).filter((url) => url.startsWith('https://'))].slice(0, 5)
  const title = labels.gallery
  return <section className="tour-gallery" aria-label={title}>
    <div className="tour-gallery-heading"><div><p className="eyebrow-dark">MAURITANIA · {trip.title}</p><h2>{title}</h2></div><span>{String(images.length).padStart(2, '0')} {labels.imageUnit}</span></div>
    <div className="tour-gallery-grid">{images.map((src, index) => <figure className={index === 0 ? 'gallery-main' : ''} key={`${src}-${index}`}><img src={src} srcSet={index === 0 && !saved.image ? photo.srcSet : undefined} sizes="(max-width: 760px) 100vw, 70vw" alt={`${trip.title} · ${index + 1}`} loading={index === 0 ? 'eager' : 'lazy'} decoding="async"/>{index === 0 && !saved.image && <figcaption><a href={photo.page} target="_blank" rel="noreferrer">{photo.credit} · {photo.license}</a></figcaption>}</figure>)}</div>
  </section>
}
