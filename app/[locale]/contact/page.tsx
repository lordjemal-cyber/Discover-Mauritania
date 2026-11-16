import { notFound } from 'next/navigation'
import { copy, localeCodes, type Locale } from '@/content/locales'
import { SiteFrame } from '@/components/site-frame'
import { InquiryForm } from '@/components/inquiry-form'

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!localeCodes.includes(locale as Locale)) notFound()
  const language = locale as Locale
  const t = copy[language]
  return <SiteFrame locale={language}><section className="inner-hero"><p className="eyebrow-dark">{t.pagesEyebrows.contact}</p><h1>{t.contactTitle}</h1><p>{t.contactLead}</p></section><section className="contact-layout"><div><p className="eyebrow-dark">{t.pagesEyebrows.contactBody}</p><h2>{t.ctaTitle}</h2><p>{t.aboutNote}</p></div><InquiryForm locale={language} labels={{ name: t.name, email: t.email, travelers: t.travelers, travelDate: t.travelDate, message: t.message }}/></section></SiteFrame>
}
