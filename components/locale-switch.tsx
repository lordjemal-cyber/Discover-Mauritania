'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { localeCodes, type Locale } from '@/content/locales'

const languages: { code: Locale; flag: string; nativeName: string; englishName: string }[] = [
  { code: 'en', flag: '🇬🇧', nativeName: 'English', englishName: 'English' },
  { code: 'ar', flag: '🇲🇷', nativeName: 'العربية', englishName: 'Arabic' },
  { code: 'fr', flag: '🇫🇷', nativeName: 'Français', englishName: 'French' },
  { code: 'es', flag: '🇪🇸', nativeName: 'Español', englishName: 'Spanish' },
  { code: 'zh', flag: '🇨🇳', nativeName: '中文', englishName: 'Chinese (Simplified)' },
  { code: 'ja', flag: '🇯🇵', nativeName: '日本語', englishName: 'Japanese' },
  { code: 'de', flag: '🇩🇪', nativeName: 'Deutsch', englishName: 'German' },
]
const languageLabels: Record<Locale, string> = { en: 'Choose language', ar: 'اختر اللغة', fr: 'Choisir la langue', es: 'Elegir idioma', zh: '选择语言', ja: '言語を選択', de: 'Sprache wählen' }

export function LocaleSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const container = useRef<HTMLDivElement>(null)
  const segments = pathname.split('/').filter(Boolean)
  const route = localeCodes.includes(segments[0] as Locale) ? segments.slice(1).join('/') : ''
  const current = languages.find((language) => language.code === locale) || languages[0]

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !container.current?.contains(event.target)) setOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOutside)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  return <div className="locale-switch" ref={container}>
    <button className="locale-switch-trigger" type="button" aria-label={languageLabels[locale]} aria-controls="site-locale-menu" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
      <span className="locale-flag" aria-hidden="true">{current.flag}</span><span className="locale-current-name">{current.nativeName}</span>
      <svg aria-hidden="true" viewBox="0 0 12 8"><path d="m1 1 5 5 5-5"/></svg>
    </button>
    {open && <nav id="site-locale-menu" className="locale-menu" aria-label={languageLabels[locale]}>
      {languages.map((language) => <Link className="locale-option" key={language.code} href={`/${language.code}${route ? `/${route}` : ''}`} lang={language.code === 'zh' ? 'zh-Hans' : language.code} dir={language.code === 'ar' ? 'rtl' : 'ltr'} aria-current={language.code === locale ? 'page' : undefined} aria-label={`${language.englishName}: ${language.nativeName}`} onClick={() => setOpen(false)}>
        <span className="locale-flag" aria-hidden="true">{language.flag}</span><span className="locale-option-name">{language.nativeName}<small>{language.englishName}</small></span><span className="locale-option-check" aria-hidden="true">{language.code === locale ? '✓' : ''}</span>
      </Link>)}
    </nav>}
  </div>
}
