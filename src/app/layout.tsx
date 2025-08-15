import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { AuthProvider } from '@/components/providers/auth-provider'
import { Toaster } from '@/components/ui/toaster'
import { ErrorBoundary } from '@/components/ui/error-boundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'CFA Quantum - Revolutionary CFA Exam Preparation',
    template: '%s | CFA Quantum'
  },
  description: 'Master the CFA exam with our AI-powered platform featuring real-time battles, personalized study plans, and comprehensive analytics.',
  keywords: ['CFA', 'exam preparation', 'finance', 'education', 'study', 'practice'],
  authors: [{ name: 'CFA Quantum Team' }],
  creator: 'CFA Quantum',
  publisher: 'CFA Quantum',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://cfaquantum.netlify.app'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://cfaquantum.netlify.app',
    title: 'CFA Quantum - Revolutionary CFA Exam Preparation',
    description: 'Master the CFA exam with our AI-powered platform featuring real-time battles, personalized study plans, and comprehensive analytics.',
    siteName: 'CFA Quantum',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CFA Quantum Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CFA Quantum - Revolutionary CFA Exam Preparation',
    description: 'Master the CFA exam with our AI-powered platform featuring real-time battles, personalized study plans, and comprehensive analytics.',
    images: ['/og-image.png'],
    creator: '@cfaquantum',
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
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/favicon.ico',
    shortcut: '/icons/favicon-16x16.png',
    apple: '/icons/apple-touch-icon.png',
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <div className="relative flex min-h-screen flex-col">
                <div className="flex-1">
                  {children}
                </div>
              </div>
              <Toaster />
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}