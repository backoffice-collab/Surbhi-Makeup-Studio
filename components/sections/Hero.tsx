import Link from 'next/link'
import Image from 'next/image'
import styles from './Hero.module.css'

/**
 * Home hero.
 *
 * Changed from the prototype:
 *  · The background was a CSS `background-image`, which browsers discover late
 *    and can't optimize. It's now a real <Image priority fill> — served as
 *    AVIF/WebP with a responsive srcset, and preloaded as the LCP element.
 *  · The gradient overlay moved to its own layer so it sits above the image.
 *  · min-height uses 100svh so mobile browser chrome doesn't clip the CTAs.
 *  · Type scale is fluid via tokens rather than a one-off clamp().
 * Visual output is unchanged.
 */
export default function Hero() {
  return (
    <section className={styles.hero}>
      <Image
        src="/images/hero-section-image.jpg"
        alt=""
        fill
        priority
        quality={82}
        sizes="100vw"
        className={styles.bg}
      />
      <div className={styles.overlay} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={`${styles.content} reveal`}>
          <p className={`eyebrow eyebrow--gold eyebrow--rule ${styles.eyebrow}`}>
            Bridal Makeup Studio &amp; Academy
          </p>

          <h1 className={styles.title}>
            The Art of
            <br />
            <em className={styles.accent}>Timeless</em> Bridal Beauty
          </h1>

          <p className={styles.lead}>
            Where every bride becomes the most radiant version of herself.
            Signature bridal artistry and a professional makeup academy in
            Kot Kapura, Punjab.
          </p>

          <div className={styles.actions}>
            <Link href="/contact" className="btn btn--gold">
              Book Appointment
            </Link>
            <Link href="/portfolio" className="btn btn--ghost">
              View Portfolio
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.scroll} aria-hidden="true">
        <span className={styles.scrollLabel}>Scroll</span>
        <span className={styles.scrollLine} />
      </div>
    </section>
  )
}
