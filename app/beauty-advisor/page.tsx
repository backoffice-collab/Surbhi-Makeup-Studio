import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'
import AdvisorClient from './AdvisorClient'

export const metadata: Metadata = {
  title: 'AI Beauty Advisor',
  description:
    'Upload a selfie and get personalised makeup and jewellery suggestions — lip shades, eye makeup and everyday jewellery — from your visible features. A free styling tool from Surbhi Makeup Studio.',
}

export default function BeautyAdvisorPage() {
  return (
    <>
      <PageHero
        eyebrow="AI Beauty Advisor"
        title="Discover what suits you"
        body="Upload a selfie and our AI will suggest a few things that could flatter your visible features — lip shades, eye makeup and everyday jewellery. Personalised suggestions, not rules."
      />
      <section className="section">
        <AdvisorClient />
      </section>
    </>
  )
}
