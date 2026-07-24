import type { Metadata } from 'next'
import Image from 'next/image'
import PageHero from '@/components/ui/PageHero'
import SectionHeading from '@/components/ui/SectionHeading'
import Gallery from '@/components/ui/Gallery'
import { teamImages, certs } from '@/lib/content'
import styles from './about.module.css'

export const metadata: Metadata = {
  title: 'About',
  description:
    'The story behind Surbhi Makeup Studio & Academy — founder Surbhi, our mission and vision, certified graduates and recognition.',
}

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title="Beauty, crafted with intention"
        body="Surbhi Makeup Studio & Academy was born from a simple belief — that every woman carries a quiet radiance, and the artist's role is only to reveal it."
      />

      {/* Founder */}
      <section className="section">
        <div className={`shell shell--narrow ${styles.founder}`}>
          <div className={styles.portrait}>
            <Image
              src="/images/founder-image.jpg"
              alt="Surbhi, founder and lead makeup artist, applying bridal makeup to a client"
              fill
              sizes="(max-width: 980px) 100vw, 45vw"
              className={styles.portraitImg}
            />
          </div>
          <div>
            <p className="eyebrow">The Founder</p>
            <h2 className={styles.name}>Surbhi</h2>
            <p className={styles.role}>Pro Makeup Artist &middot; Educator</p>
            <p className={styles.bio}>
              What began as a passion for artistry has grown into one of Kot Kapura&apos;s
              most trusted names in bridal beauty. Surbhi&apos;s work is defined by
              precision, warmth and an editorial eye — looks that photograph beautifully
              and feel effortlessly like <em>you</em>.
            </p>
            <p className={styles.bio}>
              As an educator, she has trained a new generation of artists, sharing not
              just technique but the confidence to build a career in beauty.
            </p>
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="section bg-ivory">
        <div className={`shell shell--narrow ${styles.mv}`}>
          <article className={styles.mvCard}>
            <h2 className={styles.mvTitle} style={{ color: 'var(--rose)' }}>Our Mission</h2>
            <p className={styles.mvBody}>
              To make every client feel seen and celebrated — delivering flawless,
              long-lasting looks with hygienic, premium products and genuine care, on the
              most important days of their lives.
            </p>
          </article>
          <article className={styles.mvCard}>
            <h2 className={styles.mvTitle} style={{ color: 'var(--gold)' }}>Our Vision</h2>
            <p className={styles.mvBody}>
              To be Punjab&apos;s most loved bridal studio and academy — a place where
              beauty meets education, and where every graduate carries our standard of
              excellence forward.
            </p>
          </article>
        </div>
      </section>

      {/* Graduates */}
      <section className="section">
        <div className="shell shell--narrow">
          <SectionHeading
            eyebrow="Our Graduates"
            title="Certified by Surbhi Academy"
            body="Every batch celebrates a new group of trained, certified artists — proof of the hands-on standard behind our academy."
          />
          <Gallery
            items={teamImages.map((src) => ({ src }))}
            cols={4}
            alt="Certified graduate of Surbhi Academy"
          />
        </div>
      </section>

      {/* Certifications */}
      <section className="section bg-charcoal">
        <div className="shell shell--narrow" style={{ textAlign: 'center' }}>
          <p className="eyebrow eyebrow--gold" style={{ marginBottom: 30 }}>
            Certifications &amp; Recognition
          </p>
          <ul className={styles.pills}>
            {certs.map((c) => (
              <li key={c} className={styles.pill}>{c}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
