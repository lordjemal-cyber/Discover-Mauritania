import { notFound } from 'next/navigation'
import { localeCodes, type Locale } from '@/content/locales'
import { HomeExperience } from '@/components/home-experience'

export function generateStaticParams() { return localeCodes.map((locale) => ({ locale })) }

export default async function LocalizedHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!localeCodes.includes(locale as Locale)) notFound()
  return <HomeExperience locale={locale as Locale}/>
}
