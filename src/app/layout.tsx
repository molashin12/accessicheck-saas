import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/components/auth-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'AccessiCheck - AI-Powered Website Accessibility Checker',
    template: '%s | AccessiCheck'
  },
  description: 'Make your website ADA compliant and accessible to 1+ billion people with disabilities. AI-powered accessibility scanning and compliance reports.',
  keywords: [
    'accessibility',
    'ADA compliance',
    'WCAG',
    'website scanner',
    'AI accessibility',
    'disability compliance',
    'web accessibility audit'
  ],
  authors: [{ name: 'AccessiCheck Team' }],
  creator: 'AccessiCheck',
  publisher: 'AccessiCheck',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'AccessiCheck - AI-Powered Website Accessibility Checker',
    description: 'Make your website ADA compliant and accessible to 1+ billion people with disabilities.',
    siteName: 'AccessiCheck',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AccessiCheck - AI-Powered Website Accessibility Checker',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AccessiCheck - AI-Powered Website Accessibility Checker',
    description: 'Make your website ADA compliant and accessible to 1+ billion people with disabilities.',
    images: ['/og-image.png'],
    creator: '@accessicheck',
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
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />
        {/* Theme color */}
        <meta name="theme-color" content="#3b82f6" />
        {/* Accessibility enhancements */}
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative flex min-h-screen flex-col">
              <div className="flex-1">{children}</div>
            </div>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
        
        {/* Skip to main content link for screen readers */}
        <a
          href="#main-content"
          className="screen-reader-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
        >
          Skip to main content
        </a>
        
        {/* Analytics */}
        {process.env.NODE_ENV === 'production' && (
          <>
            {/* Google Analytics */}
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  )
}