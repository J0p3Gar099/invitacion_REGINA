import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'
import { PARTY } from '@/lib/config'
import { AuthProvider } from '@/components/AuthProvider'
import { AuthGate } from '@/components/AuthGate'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm',
  display: 'swap',
  weight: ['300', '400', '500'],
})

export const metadata: Metadata = {
  title: `🎂 Cumpleaños de ${PARTY.name}`,
  description: `Estás invitado a celebrar los ${PARTY.age} años de ${PARTY.name}`,
  openGraph: {
    title: `🎂 Cumpleaños de ${PARTY.name}`,
    description: `¡Únete a la fiesta! ${PARTY.place}`,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${playfair.variable} ${dmSans.variable}`}>
      <body>
        <AuthProvider>
          <AuthGate>
            {children}
          </AuthGate>
        </AuthProvider>
      </body>
    </html>
  )
}
