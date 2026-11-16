import { notFound } from 'next/navigation'
import { copy, localeCodes, type Locale } from '@/content/locales'
import { SiteFrame } from '@/components/site-frame'
import { ArrowIcon } from '@/components/arrow-icon'
import Link from 'next/link'

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!localeCodes.includes(locale as Locale)) notFound()
  const language = locale as Locale
  const t = copy[language]
  return <SiteFrame locale={language}><section className="inner-hero"><p className="eyebrow-dark">{t.pagesEyebrows.about}</p><h1>{t.aboutTitle}</h1><p>{t.aboutLead}</p></section><section className="about-layout"><div className="about-seal" lang="ar" dir="rtl">درب<br/>موريتانيا</div><div><p className="eyebrow-dark">{t.pagesEyebrows.aboutTrust}</p><h2>{t.proofTitle}</h2><p>{t.aboutLead}</p><p>{t.aboutNote}</p><Link className="button button-ink" href={`/${language}/tours`}>{t.discover}<ArrowIcon/></Link></div></section></SiteFrame>
}

