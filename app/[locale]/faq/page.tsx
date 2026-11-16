import { notFound } from 'next/navigation'
import { copy, localeCodes, type Locale } from '@/content/locales'
import { SiteFrame } from '@/components/site-frame'

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!localeCodes.includes(locale as Locale)) notFound()
  const language = locale as Locale
  const t = copy[language]
  return <SiteFrame locale={language}><section className="inner-hero"><p className="eyebrow-dark">{t.pagesEyebrows.faq}</p><h1>{t.faqTitle}</h1></section><section className="faq-list">{t.faqItems.map(([question, answer], index) => <details key={question} open={index === 0}><summary><span>0{index + 1}</span>{question}<b>+</b></summary><p>{answer}</p></details>)}</section></SiteFrame>
}
