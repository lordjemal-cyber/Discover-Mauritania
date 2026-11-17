import Link from 'next/link'
import { notFound } from 'next/navigation'
import { copy, localeCodes, type Locale } from '@/content/locales'
import { SiteFrame } from '@/components/site-frame'
import { TourCard } from '@/components/tour-card'
import { ArrowIcon } from '@/components/arrow-icon'

export default async function ToursPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!localeCodes.includes(locale as Locale)) notFound()
  const language = locale as Locale
  const t = copy[language]
  return <SiteFrame locale={language}><section className="inner-hero"><p className="eyebrow-dark">{t.pagesEyebrows.tours}</p><h1>{t.tripsTitle}</h1><p>{t.tripsLead}</p></section><section className="journeys-section inner-list"><div className="tour-grid">{t.programs.map((tour) => <TourCard key={tour.id} locale={language} tour={tour}/>)}</div></section><section className="inner-bottom"><span>{t.brand}</span><Link className="button button-ink" href={`/${language}/contact`}>{t.inquire}<ArrowIcon/></Link></section></SiteFrame>
}
