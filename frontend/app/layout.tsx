import './globals.css'
import { Analytics } from '@vercel/analytics/react'

export const metadata = {
  title: 'ExploraModelo — Guía Académica de Parámetros de Decodificación',
  description: 'Aplicación educativa para comprender y experimentar cómo los parámetros de muestreo (Temperatura, Top-k, Top-p, Penalización por repetición) afectan salidas de modelos de lenguaje.',
  keywords: ['modelos de lenguaje', 'decodificación', 'temperatura', 'top-k', 'top-p', 'penalización repetición', 'LLM', 'educación', 'IA'],
  authors: [{ name: 'Pablo Cubides' }],
  openGraph: {
    title: 'ExploraModelo — Guía Académica de Parámetros de Decodificación',
    description: 'Aprende paso a paso cómo los parámetros de decodificación influyen en la generación de texto por LLMs.',
    url: 'https://exploramodelo.vercel.app',
    siteName: 'ExploraModelo',
    images: [
      {
        url: '/og-image.png', // Placeholder, add image later
        width: 1200,
        height: 630,
        alt: 'ExploraModelo - Parámetros de Decodificación',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ExploraModelo — Guía Académica',
    description: 'Experimenta con parámetros de decodificación en LLMs de forma interactiva.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-background text-white min-h-screen">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
