import type { Metadata } from 'next';
import './globals.css';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'ManyMorgan | Premier Software Engineering & Digital Transformation Consultancy',
  description:
    'ManyMorgan delivers enterprise-grade mobile applications, modern web platforms, custom cloud architectures, UI/UX systems, and AI automation for high-growth businesses.',
  keywords: [
    'ManyMorgan',
    'software engineering consultancy',
    'mobile app development',
    'enterprise web development',
    'custom software',
    'AI automation',
    'UI/UX design systems',
    'cloud architecture',
  ],
  authors: [{ name: 'ManyMorgan Engineering' }],
  metadataBase: new URL('https://manymorgan.com'),
  openGraph: {
    title: 'ManyMorgan | Premier Software Engineering & Digital Transformation Consultancy',
    description:
      'Engineering transformative digital solutions: Mobile, Web, Custom Cloud Software, UI/UX, and AI Automation.',
    url: 'https://manymorgan.com',
    siteName: 'ManyMorgan',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/tailwind.css" />
      </head>
      <body
        className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-blue-600 selection:text-white antialiased"
        style={{ fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif" }}
      >
        <AnnouncementBanner />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
