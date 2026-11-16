'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { copy, type Locale } from '@/content/locales'

export function PrimaryNav({ locale }: { locale: Locale }) {
  const pathname = usePathname()
  const t = copy[locale]
  const urls = [`/${locale}`, `/${locale}/tours`, `/${locale}/destinations`, `/${locale}/about`, `/${locale}/faq`]

  return <nav className="primary-nav" aria-label={t.menu}>
    {t.nav.map((label, index) => {
      const active = index === 0 ? pathname === urls[index] : pathname === urls[index] || pathname.startsWith(`${urls[index]}/`)
      return <Link key={urls[index]} href={urls[index]} aria-current={active ? 'page' : undefined} className={active ? 'is-current' : undefined}>{label}</Link>
    })}
  </nav>
}
