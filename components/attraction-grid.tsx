import Link from 'next/link'
import { attractions, attractionName, attractionUi } from '@/content/attractions'
import { photoAssets, type Locale } from '@/content/locales'
import { ArrowIcon } from '@/components/arrow-icon'

export function AttractionGrid({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const ui = attractionUi(locale)
  return <div className={`attraction-grid${compact ? ' attraction-grid-compact' : ''}`}>
    {attractions.map((place, index) => {
      const name = attractionName(place, locale)
      return <Link className="attraction-card" href={`/${locale}/destinations/${place.slug}`} key={place.slug}>
        <img src={photoAssets[place.image].src} alt="" loading="lazy" />
        <span className="attraction-card-region">{ui.regions[place.region]}</span>
        <h3>{name}</h3>
        <span className="attraction-card-index">{String(index + 1).padStart(2, '0')}</span>
        <i aria-hidden="true"><ArrowIcon /></i>
      </Link>
    })}
  </div>
}
