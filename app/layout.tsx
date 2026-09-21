import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Communauté Virtuelle de Yopougon (CVY)',
  description: 'Plateforme de connexion et d\'échange pour la communauté de Yopougon',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/Logo.png',
        type: 'image/png',
        sizes: '283x285',
      },
    ],
    apple: '/Logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
