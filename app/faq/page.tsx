import type { Metadata } from 'next'
import FaqSearch from './FaqSearch'
import { faqs } from '@/lib/content'

export const metadata: Metadata = {
  title: 'FAQs',
  description:
    'Answers about bridal makeup booking, trials, on-location services, products, academy courses and studio location.',
}

/** FAQPage schema — makes answers eligible for rich results in search. */
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FaqSearch items={faqs} />
    </>
  )
}
