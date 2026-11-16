import Link from 'next/link'
import { copy, photoAssets, type Locale } from '@/content/locales'
import { SiteFrame } from '@/components/site-frame'
import { TourCard } from '@/components/tour-card'
import { ArrowIcon } from '@/components/arrow-icon'

export function HomeExperience({ locale }: { locale: Locale }) {
  const t = copy[locale]
  return <SiteFrame locale={locale}>
    <section className="hero-v2">
      <div className="hero-content">
        <p className="hero-eyebrow"><span/>{t.heroEyebrow}</p>
        <h1>{t.heroTitle}</h1>
        <p className="hero-lead">{t.heroLead}</p>
        <div className="hero-buttons"><Link className="button button-gold" href={`/${locale}/tours`}>{t.discover}<ArrowIcon/></Link><Link className="hero-link" href={`/${locale}/destinations`}>{t.nav[2]}<ArrowIcon/></Link></div>
        <div className="hero-meta"><span>MAURITANIA</span><i/><span>SAHARA · ATLANTIC</span></div>
      </div>
      <div className="hero-visual">
          <img className="hero-photo" src={photoAssets.adrar.src} alt={t.heroPhotoAlt} fetchPriority="high"/>
        <div className="hero-visual-wash"/>
        <div className="hero-photo-caption"><span>01 / {t.destinations[0]}</span><a href={photoAssets.adrar.page} target="_blank" rel="noreferrer">Radosław Botev · CC BY 3.0 PL</a></div>
        <div className="hero-location-card"><span>{t.homeLocationEyebrow}</span><strong>{t.homeLocationTitle}</strong><small>{t.homeLocationNote}</small></div>
      </div>
      <Link className="hero-scroll" href="#journeys"><span>{t.allTrips}</span><b aria-hidden="true">↓</b></Link>
    </section>
    <section className="promise-strip"><div className="promise-intro"><span className="promise-star" aria-hidden="true">✳</span><div><strong>{t.proofTitle}</strong><span>{t.proofText}</span></div></div><div className="promise-statement"><span>{t.pagesEyebrows.contactBody}</span><b>{t.homePromiseLine}</b></div><Link href={`/${locale}/about`} className="promise-link">{t.nav[3]} <ArrowIcon/></Link></section>
    <section className="journeys-section" id="journeys"><div className="section-heading"><div><p className="eyebrow-dark">{t.tripsEyebrow}</p><h2>{t.tripsTitle}</h2><p className="section-intro">{t.tripsLead}</p></div><Link className="underlined-action" href={`/${locale}/tours`}>{t.allTrips}<ArrowIcon/></Link></div><div className="tour-grid">{t.programs.map((tour) => <TourCard key={tour.id} locale={locale} tour={tour}/>)}</div></section>
    <section className="destinations-band"><div className="destination-statement"><p className="eyebrow-dark">{t.destinationsEyebrow}</p><h2>{t.destinationsTitle}</h2><p>{t.destinationLead}</p><Link className="button button-ink" href={`/${locale}/destinations`}>{t.nav[2]} <ArrowIcon/></Link></div><div className="destination-tiles"><Link href={`/${locale}/tours/adrar`} className="destination-tile tile-adrar"><img src={photoAssets.adrar.src} alt={t.programs[0].category} loading="lazy"/><span>01 / ADRAR</span><strong>{t.destinations[0]}</strong><i aria-hidden="true"><ArrowIcon/></i><small>Radosław Botev · CC BY 3.0 PL</small></Link><Link href={`/${locale}/tours/train`} className="destination-tile tile-train"><img src={photoAssets.train.src} alt={t.programs[1].category} loading="lazy"/><span>02 / IRON ROAD</span><strong>{t.destinations[1]}</strong><i aria-hidden="true"><ArrowIcon/></i><small>stringer_bel · CC BY 2.0</small></Link><Link href={`/${locale}/tours/coast`} className="destination-tile tile-coast"><img src={photoAssets.coast.src} alt={t.programs[2].category} loading="lazy"/><span>03 / ATLANTIC</span><strong>{t.destinations[2]}</strong><i aria-hidden="true"><ArrowIcon/></i><small>NASA JSC · Public domain</small></Link></div></section>
    <section className="journey-process"><div className="process-title"><p className="eyebrow-dark">{t.processEyebrow}</p><h2>{t.processTitle}</h2></div><div className="process-steps">{t.steps.map((step) => <article key={step.n}><span>{step.n}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div></section>
    <section className="closing-cta"><div><p className="eyebrow-light">{t.closingEyebrow}</p><h2>{t.ctaTitle}</h2><p>{t.ctaText}</p></div><Link className="button button-gold" href={`/${locale}/contact`}>{t.ctaButton}<ArrowIcon/></Link><div className="cta-orbit" aria-hidden="true">M</div></section>
  </SiteFrame>
}

