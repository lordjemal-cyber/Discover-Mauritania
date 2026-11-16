import Link from 'next/link'
import { notFound } from 'next/navigation'
import { copy, localeCodes, photoAssets, type Locale } from '@/content/locales'
import { SiteFrame } from '@/components/site-frame'
import { ArrowIcon } from '@/components/arrow-icon'

export default async function DestinationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!localeCodes.includes(locale as Locale)) notFound()
  const language = locale as Locale
  const t = copy[language]
  const routes = [
    { name: t.destinations[0], image: photoAssets.adrar.src, route: 'adrar', number: '01', text: t.programs[0].subtitle },
    { name: t.destinations[1], image: photoAssets.adrar.src, route: 'adrar', number: '02', text: t.programs[0].route },
    { name: t.destinations[2], image: photoAssets.coast.src, route: 'coast', number: '03', text: t.programs[2].subtitle },
    { name: t.destinations[3], image: photoAssets.train.src, route: 'train', number: '04', text: t.programs[1].route },
  ]
  return <SiteFrame locale={language}><section className="inner-hero"><p className="eyebrow-dark">{t.pagesEyebrows.places}</p><h1>{t.destinationsTitle}</h1><p>{t.destinationsEyebrow}</p></section><section className="destination-directory">{routes.map((place) => <Link key={place.number} href={`/${language}/tours/${place.route}`} className="directory-card"><img src={place.image} alt={place.name} loading="lazy"/><span>{place.number} / {t.brand}</span><h2>{place.name}</h2><p>{place.text}</p><b><ArrowIcon/></b></Link>)}</section></SiteFrame>
}

