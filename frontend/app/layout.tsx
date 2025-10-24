import './globals.css'
import { Analytics } from '@vercel/analytics/react'

export const metadata = {
  title: 'ExploraModelo — Guía Académica de Parámetros de Decodificación LLM',
  description: 'Aplicación educativa interactiva para comprender Temperature, Top-k Sampling, Top-p (Nucleus) Sampling y Penalización por Repetición en Modelos de Lenguaje. Aprende cómo estos parámetros afectan la generación de texto en GPT, Claude y otros LLMs.',
  keywords: [
    'modelos de lenguaje', 
    'Large Language Models',
    'LLM', 
    'decodificación', 
    'temperatura sampling', 
    'top-k sampling', 
    'top-p sampling',
    'nucleus sampling', 
    'penalización repetición', 
    'GPT',
    'educación IA',
    'machine learning',
    'natural language processing',
    'NLP',
    'generación de texto',
    'parámetros LLM',
    'Stanford NLP',
    'OpenAI'
  ],
  authors: [{ name: 'Pablo Cubides' }],
  creator: 'Pablo Cubides',
  publisher: 'ExploraModelo',
  category: 'Education',
  metadataBase: new URL('https://exploramodelo.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ExploraModelo — Guía Académica de Parámetros de Decodificación LLM',
    description: 'Aprende interactivamente cómo Temperature, Top-k y Top-p (Nucleus Sampling) influyen en la generación de texto por Large Language Models.',
    url: 'https://exploramodelo.vercel.app',
    siteName: 'ExploraModelo',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ExploraModelo - Parámetros de Decodificación en Large Language Models',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ExploraModelo — Guía Académica LLM',
    description: 'Experimenta con Temperature, Top-k y Top-p Sampling en tiempo real. Herramienta educativa para entender parámetros de LLMs.',
    images: ['/og-image.png'],
    creator: '@PabloCubides',
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
  verification: {
    google: 'google-site-verification-code', // Agregar código real después
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Structured data para SEO mejorado
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'ExploraModelo',
    applicationCategory: 'EducationalApplication',
    description: 'Aplicación educativa interactiva para comprender parámetros de decodificación en Large Language Models (LLM)',
    url: 'https://exploramodelo.vercel.app',
    author: {
      '@type': 'Person',
      name: 'Pablo Cubides',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    educationalUse: 'Learning about LLM parameters and text generation',
    teaches: [
      'Temperature Sampling in LLMs',
      'Top-k Sampling Strategy',
      'Top-p Nucleus Sampling',
      'Repetition Penalty in Text Generation'
    ],
    inLanguage: 'es',
    isAccessibleForFree: true,
  }

  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="bg-background text-white min-h-screen">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
