import { notFound } from 'next/navigation'
import { copy, localeCodes, type Locale } from '@/content/locales'
import { attractionUi } from '@/content/attractions'
import { SiteFrame } from '@/components/site-frame'
import { AttractionGrid } from '@/components/attraction-grid'

export default async function DestinationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!localeCodes.includes(locale as Locale)) notFound()
  const language = locale as Locale
  const t = copy[language]
  const places = attractionUi(language)
  return <SiteFrame locale={language}>
    <section className="inner-hero destination-index-hero">
      <p className="eyebrow-dark">{t.pagesEyebrows.places}</p>
      <h1>{places.sectionTitle}</h1>
      <p>{places.sectionLead}</p>
    </section>
    <section className="destination-index-list" aria-label={places.sectionTitle}>
      <AttractionGrid locale={language}/>
    </section>
  </SiteFrame>
}
