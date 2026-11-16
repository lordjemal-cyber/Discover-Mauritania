import type { Metadata } from 'next'
import './globals.css'
import './responsive-refresh.css'

export const metadata: Metadata = {
  title: 'Discover Mauritania — Between the Atlantic and the Sahara',
  description: 'A thoughtful travel guide to Mauritania.',
  icons: { icon: '/icon.svg' },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl" data-scroll-behavior="smooth"><body>{children}</body></html>
}

