import Link from 'next/link'
import type { Locale } from '@/content/locales'
import { copy, photoAssets } from '@/content/locales'
import { MobileMenu } from '@/components/mobile-menu'
import { PrimaryNav } from '@/components/primary-nav'
import { LocaleSwitch } from '@/components/locale-switch'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { ArrowIcon } from '@/components/arrow-icon'
import { attractions, attractionName, attractionUi } from '@/content/attractions'

export function SiteFrame({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const t = copy[locale]
  const places = attractionUi(locale)
  return <main className="site" lang={locale === 'zh' ? 'zh-Hans' : locale} dir={t.dir}>
    <header className="masthead">
      <Link className="wordmark" href={`/${locale}`} aria-label={t.brand}><img className="brand-logo" src="/trip-in-mauritania-logo.jpg" alt={t.brand}/></Link>
      <MobileMenu locale={locale}/><PrimaryNav locale={locale}/>
      <div className="masthead-tools"><LocaleSwitch locale={locale}/><Link className="button button-reserve" href={`/${locale}/contact`}>{t.inquire}<ArrowIcon/></Link></div>
    </header>
    {children}
    <WhatsAppButton locale={locale}/>
    <footer className="footer">
      <div className="footer-top"><Link className="wordmark footer-logo" href={`/${locale}`} aria-label={t.brand}><img className="brand-logo" src="/trip-in-mauritania-logo.jpg" alt={t.brand}/></Link><p>{t.footerLine}</p><Link className="footer-cta" href={`/${locale}/contact`}>{t.inquire} <ArrowIcon/></Link></div>
      <nav className="footer-destinations" aria-label={places.footerTitle}><div><h2>{places.footerTitle}</h2><p>{places.footerLead}</p></div><ul>{attractions.map((place) => <li key={place.slug}><Link href={`/${locale}/destinations/${place.slug}`}>{attractionName(place, locale)}<ArrowIcon/></Link></li>)}</ul></nav>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} {t.brand}</span><div><Link href={`/${locale}/about`}>{t.nav[3]}</Link><Link href={`/${locale}/faq`}>{t.nav[4]}</Link></div><details className="photo-credits"><summary>{t.photoCredit}</summary><ul>{Object.entries(photoAssets).map(([id, photo]) => <li key={id}><a href={photo.page} target="_blank" rel="noreferrer">{photo.credit} · {photo.license}</a></li>)}</ul></details></div>
    </footer>
  </main>
}
