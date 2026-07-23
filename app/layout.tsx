import type { Metadata } from 'next'
import { Playfair_Display, Jost, Marcellus } from 'next/font/google'
import { site } from '@/lib/site'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FloatingActions from '@/components/layout/FloatingActions'
import WelcomeModal from '@/components/ui/WelcomeModal'
import dynamic from 'next/dynamic'
import './globals.css'

// Lazy-loaded: the chat widget isn't needed for first paint, so it stays out
// of the initial bundle and loads after the page is interactive.
const Chatbot = dynamic(() => import('@/components/chat/Chatbot'))

/* Self-hosted at build time — no runtime request to Google, no CLS. */
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-playfair',
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-jost',
})

const marcellus = Marcellus({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-marcellus',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Bridal Makeup & Beauty Academy, Kot Kapura`,
    template: `%s | ${site.shortName}`,
  },
  description:
    'Luxury bridal makeup studio and ISO-certified professional beauty academy in Kot Kapura, Punjab. Bridal, HD & airbrush makeup, hair, skin and nails. Book a consultation today.',
  keywords: [
    'bridal makeup Kot Kapura',
    'makeup artist Punjab',
    'beauty academy Kot Kapura',
    'HD airbrush makeup',
    'makeup course Punjab',
    'bridal makeup artist Faridkot',
  ],
  authors: [{ name: site.name }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: site.url,
    siteName: site.name,
    title: `${site.name} | Bridal Makeup & Beauty Academy`,
    description: site.tagline,
    images: [
      {
        url: '/images/hero-section-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Bridal makeup by Surbhi Makeup Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: site.name,
    description: site.tagline,
    images: ['/images/hero-section-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: { canonical: '/' },
}

/** LocalBusiness schema — critical for a location-based business in local search. */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BeautySalon',
  name: site.name,
  description: site.tagline,
  url: site.url,
  telephone: site.phone,
  image: `${site.url}/images/hero-section-image.jpg`,
  logo: `${site.url}/images/logo.png`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.address.street,
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  },
  openingHours: site.hoursStructured,
  priceRange: '₹₹',
  sameAs: [site.social.instagram, site.social.facebook],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    reviewCount: '8',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-IN"
      className={`${playfair.variable} ${jost.variable} ${marcellus.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <FloatingActions />
        <Chatbot />
        <WelcomeModal clientName="Surbhi" />
      </body>
    </html>
  )
}
