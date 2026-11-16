import Link from 'next/link'
import { notFound } from 'next/navigation'
import { copy, localeCodes, photoAssets, type Locale } from '@/content/locales'
import { tourIds } from '@/content/catalog'
import { SiteFrame } from '@/components/site-frame'
import { TourDetailHero } from '@/components/tour-detail-hero'
import { TourDetailPanel } from '@/components/tour-detail-panel'
import { TourStoryDetails } from '@/components/tour-story-details'
import { TourGallery } from '@/components/tour-gallery'

export function generateStaticParams() { return localeCodes.flatMap((locale) => tourIds.map((slug) => ({ locale, slug }))) }

export default async function TourDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  if (!localeCodes.includes(locale as Locale) || !tourIds.includes(slug as (typeof tourIds)[number])) notFound()
  const language = locale as Locale
  const t = copy[language]
  const trip = t.programs.find((item) => item.id === slug)!
  const photo = photoAssets[trip.image as keyof typeof photoAssets]
  return <SiteFrame locale={language}><TourDetailHero locale={language} trip={trip} photo={photo}/><TourGallery locale={language} trip={trip} photo={photo}/><section className="tour-detail-layout"><div className="tour-detail-copy"><p className="eyebrow-dark">{t.tourLabel}</p><h2>{trip.subtitle}</h2><TourStoryDetails locale={language} trip={trip}/></div><TourDetailPanel locale={language} trip={trip}/></section><section className="inner-bottom"><span>YOUR JOURNEY, YOUR WAY</span><Link className="button button-ink" href={`/${language}/contact`}>{t.askDetails} ↗</Link></section></SiteFrame>
}
