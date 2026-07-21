import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'
import ServiceCard from '@/components/ui/ServiceCard'
import { allServices } from '@/lib/content'
import styles from './services.module.css'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Bridal, HD and airbrush makeup, engagement and reception looks, hair styling, skin care and nail studio — every service at Surbhi Makeup Studio, Kot Kapura.',
}

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="The complete beauty menu"
        body="Makeup, hair, skin and nails — every service delivered with luxury products and a signature attention to detail."
      />
      <section className="section">
        <div className="shell">
          <ul className={styles.grid}>
            {allServices.map((s) => (
              <ServiceCard key={s.no} {...s} cta />
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
