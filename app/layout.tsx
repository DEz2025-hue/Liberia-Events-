import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { FloatingSupport } from '@/components/ui/floating-support';
import { CONCERT_CONFIG } from '@/lib/concert-config';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: CONCERT_CONFIG.seoTitle,
  description: CONCERT_CONFIG.seoDescription,
  keywords: 'Liberia, concert, live stream, Christoph The Change, diaspora, music, culture',
  authors: [{ name: 'The Money Team' }],
  openGraph: {
    title: CONCERT_CONFIG.seoTitle,
    description: CONCERT_CONFIG.seoDescription,
    type: 'website',
    locale: 'en_US',
    siteName: 'The Money Team Live',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'The Money Team Live in Concert - Christoph The Change',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: CONCERT_CONFIG.seoTitle,
    description: CONCERT_CONFIG.seoDescription,
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <FloatingSupport />
        <Analytics />
      </body>
    </html>
  );
}
