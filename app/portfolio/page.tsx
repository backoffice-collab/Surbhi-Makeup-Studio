import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'
import Gallery from '@/components/ui/Gallery'
import { portfolio } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Portfolio',
  description:
    'A gallery of real brides styled by Surbhi Makeup Studio — traditional bridal, reception glam, engagement looks and more.',
}

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        variant="charcoal"
        eyebrow="Bridal Portfolio"
        title="A gallery of unforgettable brides"
        body="Real brides, real celebrations. Tap any image to view it up close."
      />
      <section className="section">
        <div className="shell shell--narrow">
          <Gallery items={portfolio} cols={3} alt="Bridal portfolio" />
        </div>
      </section>
    </>
  )
}
