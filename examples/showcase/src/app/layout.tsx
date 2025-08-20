import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://showcase.ai-portfolio.dev'),
  title: 'Alex Chen - Full-Stack Developer & AI Engineer',
  description: 'Portfolio of Alex Chen, a full-stack developer specializing in AI-powered applications, modern web technologies, and innovative digital solutions.',
  keywords: ['developer', 'portfolio', 'AI', 'full-stack', 'React', 'Next.js', 'TypeScript'],
  authors: [{ name: 'Alex Chen' }],
  creator: 'Alex Chen',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://alexchen.dev',
    siteName: 'Alex Chen Portfolio',
    title: 'Alex Chen - Full-Stack Developer & AI Engineer',
    description: 'Portfolio showcasing innovative AI-powered applications and modern web solutions',
    images: [
      {
        url: 'https://alexchen.dev/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Alex Chen Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alex Chen - Full-Stack Developer',
    description: 'Portfolio showcasing AI-powered applications',
    creator: '@alexchen',
    images: ['https://alexchen.dev/og-image.png'],
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <Navigation />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}