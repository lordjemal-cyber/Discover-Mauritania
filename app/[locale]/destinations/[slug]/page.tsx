import Link from 'next/link'
import { notFound } from 'next/navigation'
import { attractions, attractionName, attractionRegion, attractionTheme, attractionUi, getAttraction } from '@/content/attractions'
import { copy, localeCodes, photoAssets, type Locale } from '@/content/locales'
import { SiteFrame } from '@/components/site-frame'
import { ArrowIcon } from '@/components/arrow-icon'

export function generateStaticParams() {
  return localeCodes.flatMap((locale) => attractions.map(({ slug }) => ({ locale, slug })))
}

export default async function AttractionDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  if (!localeCodes.includes(locale as Locale)) notFound()
  const place = getAttraction(slug)
  if (!place) notFound()
  const language = locale as Locale
  const t = copy[language]
  const ui = attractionUi(language)
  const name = attractionName(place, language)
  const photo = photoAssets[place.image]
  const related = attractions.filter((item) => item.slug !== place.slug && (item.region === place.region || item.theme === place.theme)).slice(0, 4)
  return <SiteFrame locale={language}>
    <section className="attraction-detail-hero" data-theme={place.theme}>
      <img src={photo.src} alt={name} fetchPriority="high" />
      <div className="attraction-detail-shade" />
      <Link className="attraction-back" href={`/${language}/destinations`}>← {ui.back}</Link>
      <div className="attraction-detail-title"><p>{ui.detailEyebrow} · {ui.regions[place.region]}</p><h1>{name}</h1><span>{ui.regionLabel}: {attractionRegion(place, language)}</span></div>
    </section>
    <section className="attraction-detail-body">
      <div className="attraction-story"><p className="eyebrow-dark">{ui.routeTitle}</p><h2>{name}</h2><p>{attractionTheme(place, language)}</p></div>
      <aside className="attraction-plan-card"><span>{ui.detailEyebrow}</span><h2>{ui.combineTitle}</h2><p>{ui.combineLead}</p><Link className="button button-ink" href={`/${language}/contact?place=${place.slug}`}>{ui.planTrip}<ArrowIcon/></Link></aside>
    </section>
    {related.length > 0 && <section className="attraction-related"><div className="attraction-related-heading"><div><p className="eyebrow-dark">{t.pagesEyebrows.places}</p><h2>{ui.relatedTitle}</h2></div><Link className="underlined-action" href={`/${language}/destinations`}>{ui.seeAll}<ArrowIcon/></Link></div><div className="attraction-related-grid">{related.map((item) => <Link key={item.slug} href={`/${language}/destinations/${item.slug}`}><span>{ui.regions[item.region]}</span><strong>{attractionName(item, language)}</strong><ArrowIcon/></Link>)}</div></section>}
  </SiteFrame>
}
