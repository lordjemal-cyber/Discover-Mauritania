import type { Locale } from '@/content/locales'

const labels: Record<Locale, { action: string; message: string }> = {
  ar: { action: 'تواصل معنا عبر واتساب', message: 'مرحباً، أود الاستفسار عن رحلات موريتانيا.' },
  en: { action: 'Chat with us on WhatsApp', message: 'Hello, I would like to ask about trips in Mauritania.' },
  fr: { action: 'Nous contacter sur WhatsApp', message: 'Bonjour, je souhaite me renseigner sur les voyages en Mauritanie.' },
  es: { action: 'Escríbenos por WhatsApp', message: 'Hola, quisiera consultar sobre viajes en Mauritania.' },
  zh: { action: '通过 WhatsApp 联系我们', message: '您好，我想咨询毛里塔尼亚的旅行。' },
  ja: { action: 'WhatsAppで問い合わせる', message: 'こんにちは。モーリタニア旅行について問い合わせたいです。' },
  de: { action: 'Kontakt über WhatsApp', message: 'Hallo, ich möchte mich nach Reisen in Mauretanien erkundigen.' },
}

export function WhatsAppButton({ locale }: { locale: Locale }) {
  const text = encodeURIComponent(labels[locale].message)
  return <a className="whatsapp-float" href={`https://wa.me/22247315321?text=${text}`} target="_blank" rel="noreferrer" aria-label={`${labels[locale].action} · +222 47 31 53 21`}>
    <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3.2A12.5 12.5 0 0 0 5.2 22l-1.6 6 6.2-1.6A12.6 12.6 0 1 0 16 3.2Zm0 22.8a10 10 0 0 1-5.1-1.4l-.4-.2-3.7 1 1-3.6-.3-.4A10 10 0 1 1 16 26Zm5.5-7.5c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7 0a8.2 8.2 0 0 1-2.5-1.5 9.2 9.2 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.7l.5-.5c.2-.2.2-.4.3-.6s0-.4 0-.5-.7-1.7-1-2.3c-.2-.6-.5-.5-.7-.5H11c-.3 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.6s1.1 3 1.3 3.2c.2.2 2.2 3.4 5.4 4.7 2 .9 2.8 1 3.8.8.6-.1 1.8-.7 2.1-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.3-.6-.5Z"/></svg>
    <span>{labels[locale].action}</span>
  </a>
}
