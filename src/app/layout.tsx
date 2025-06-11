import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CTAReady - AI-Powered Corporate Transparency Act Compliance',
  description: 'Simplify your Corporate Transparency Act compliance with AI-powered tools. Identify beneficial owners, prepare BOI reports, and ensure regulatory compliance.',
  keywords: 'Corporate Transparency Act, CTA, BOI reports, beneficial ownership, compliance, FinCEN, AI assistant',
  authors: [{ name: 'CTAReady Team' }],
  robots: 'index, follow',
  openGraph: {
    title: 'CTAReady - AI-Powered CTA Compliance Platform',
    description: 'Streamline your Corporate Transparency Act compliance with intelligent automation and expert guidance.',
    type: 'website',
    siteName: 'CTAReady',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CTAReady - AI-Powered CTA Compliance',
    description: 'Simplify Corporate Transparency Act compliance with AI-powered tools.',
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
        <AuthProvider>
          <div className="min-h-screen bg-background">
            {children}
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}