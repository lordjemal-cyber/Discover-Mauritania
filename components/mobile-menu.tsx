'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { copy, type Locale } from '@/content/locales'
import { ArrowIcon } from '@/components/arrow-icon'

export function MobileMenu({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false)
  const t = copy[locale]
  const pathname = usePathname()
  const urls = [`/${locale}`, `/${locale}/tours`, `/${locale}/destinations`, `/${locale}/about`, `/${locale}/faq`]
  return <div className="mobile-menu-wrap"><button className={`mobile-menu-toggle${open ? ' is-open' : ''}`} aria-label={t.menu} aria-expanded={open} onClick={() => setOpen((value) => !value)}><span/><span/><span/></button>{open && <nav className="mobile-menu-panel" aria-label={t.menu}>{t.nav.map((label, index) => {
    const active = index === 0 ? pathname === urls[index] : pathname === urls[index] || pathname.startsWith(`${urls[index]}/`)
    return <Link key={urls[index]} onClick={() => setOpen(false)} href={urls[index]} aria-current={active ? 'page' : undefined}>{label}<ArrowIcon/></Link>
  })}<Link onClick={() => setOpen(false)} className="mobile-menu-cta" href={`/${locale}/contact`} aria-current={pathname === `/${locale}/contact` ? 'page' : undefined}>{t.inquire}<ArrowIcon/></Link></nav>}</div>
}

