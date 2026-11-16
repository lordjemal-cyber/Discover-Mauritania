import { notFound } from 'next/navigation'
import { copy, localeCodes, type Locale } from '@/content/locales'
import { SiteFrame } from '@/components/site-frame'

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!localeCodes.includes(locale as Locale)) notFound()
  const language = locale as Locale
  const t = copy[language]
  return <SiteFrame locale={language}><section className="inner-hero"><p className="eyebrow-dark">{t.pagesEyebrows.contact}</p><h1>{t.contactTitle}</h1><p>{t.contactLead}</p></section><section className="contact-layout"><div><p className="eyebrow-dark">{t.pagesEyebrows.contactBody}</p><h2>{t.ctaTitle}</h2><p>{t.aboutNote}</p></div><form className="inquiry-form"><label>{t.name}<input name="name" autoComplete="name"/></label><label>{t.email}<input name="email" type="email" autoComplete="email"/></label><div className="form-row"><label>{t.travelers}<input name="travelers" type="number" min="1"/></label><label>{t.travelDate}<input name="date" type="date"/></label></div><label>{t.message}<textarea rows={4}/></label><button className="button button-ink" disabled>{t.formSend}<span>↗</span></button><p className="form-disclaimer">{t.formDemo}</p></form></section></SiteFrame>
}
