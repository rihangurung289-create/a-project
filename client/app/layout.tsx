import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'AI Media Generator',
    template: '%s | AI Media Generator',
  },
  description: 'Create stunning images, videos, and audio with the power of AI. Generate content using Stable Diffusion, DALL·E, Runway, and more.',
  keywords: ['AI', 'image generation', 'video generation', 'audio generation', 'Stable Diffusion', 'DALL·E', 'Runway', 'AI media'],
  authors: [{ name: 'AI Media Generator' }],
  creator: 'AI Media Generator',
  publisher: 'AI Media Generator',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'AI Media Generator',
    description: 'Create stunning images, videos, and audio with the power of AI',
    siteName: 'AI Media Generator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Media Generator',
    description: 'Create stunning images, videos, and audio with the power of AI',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}



