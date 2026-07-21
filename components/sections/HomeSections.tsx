import Link from 'next/link'
import Image from 'next/image'
import SectionHeading from '@/components/ui/SectionHeading'
import ServiceCard from '@/components/ui/ServiceCard'
import Gallery from '@/components/ui/Gallery'
import StatCounter from '@/components/ui/StatCounter'
import { CheckIcon, ArrowRightIcon } from '@/components/ui/Icons'
import { site } from '@/lib/site'
import {
  featuredServices, whyPoints, featuredWork, academyFeatures,
  academyPreviewImgs, featuredReviews, instaImages,
} from '@/lib/content'
import styles from './HomeSections.module.css'

export function FeaturedServices() {
  return (
    <section className="section">
      <div className="shell">
        <SectionHeading
          eyebrow="Signature Services"
          title="Artistry for every occasion"
          body="From your wedding day to every celebration in between — luxury looks crafted to last from first light to last dance."
        />
        <ul className={styles.serviceGrid}>
          {featuredServices.map((s) => (
            <ServiceCard key={s.no} {...s} />
          ))}
        </ul>
        <p className={styles.centerLink}>
          <Link href="/services" className="btn-text">
            Explore all services <ArrowRightIcon size={14} />
          </Link>
        </p>
      </div>
    </section>
  )
}

export function WhyChoose() {
  return (
    <section className="section bg-ivory">
      <div className={`shell ${styles.twoCol}`}>
        <div>
          <p className="eyebrow">Why Choose Surbhi</p>
          <h2 className={styles.blockTitle}>A studio built on trust, skill &amp; detail</h2>
          <ul className={styles.points}>
            {whyPoints.map((w) => (
              <li key={w.no} className={styles.point}>
                <span className={styles.pointNo} aria-hidden="true">{w.no}</span>
                <div>
                  <h3 className={styles.pointTitle}>{w.title}</h3>
                  <p className={styles.pointDesc}>{w.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.collage}>
          <div className={styles.collageTall}>
            <Image
              src="/images/hero-section-image.jpg"
              alt="Bridal makeup application at the studio"
              fill sizes="(max-width: 980px) 50vw, 25vw"
              className={styles.collageImg}
            />
          </div>
          <div className={styles.collageSq}>
            <Image
              src="/images/signature-bride.jpg"
              alt="Signature bridal look"
              fill sizes="(max-width: 980px) 50vw, 25vw"
              className={styles.collageImg}
            />
          </div>
          <div className={styles.collageSq}>
            <Image
              src="/images/reception-glam.jpg"
              alt="Reception glam look"
              fill sizes="(max-width: 980px) 50vw, 25vw"
              className={styles.collageImg}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export function FeaturedWork() {
  return (
    <section className="section">
      <div className="shell">
        <div className={styles.splitHead}>
          <div>
            <p className="eyebrow">Featured Work</p>
            <h2 className={styles.blockTitle}>Brides we&apos;ve had the honour to create</h2>
          </div>
          <Link href="/portfolio" className="btn-text">
            Full portfolio <ArrowRightIcon size={14} />
          </Link>
        </div>
        <Gallery items={featuredWork} cols={3} alt="Bridal work" />
      </div>
    </section>
  )
}

export function AcademyPreview() {
  return (
    <section className="section bg-charcoal">
      <div className={`shell ${styles.twoCol}`}>
        <div>
          <p className="eyebrow eyebrow--gold">Beauty Academy</p>
          <h2 className={`${styles.blockTitle} ${styles.onDark}`}>
            Turn your passion into a profession
          </h2>
          <p className={styles.darkBody}>
            Learn from a working artist. Our certified batches blend hands-on bridal
            training, real client practice and placement guidance — so you graduate
            studio-ready.
          </p>

          <ul className={styles.featureGrid}>
            {academyFeatures.map((f) => (
              <li key={f} className={styles.featureItem}>
                <span className={styles.check} aria-hidden="true"><CheckIcon /></span>
                {f}
              </li>
            ))}
          </ul>

          <div className={styles.statRow}>
            <div className={styles.statCard}>
              <p className={styles.statValue}><StatCounter value={300} suffix="+" /></p>
              <p className={styles.statLabel}>Students Trained</p>
            </div>
            <div className={styles.statCard}>
              <p className={styles.statValue}><StatCounter value={3} /></p>
              <p className={styles.statLabel}>Certified Courses</p>
            </div>
          </div>

          <Link href="/academy" className={styles.goldCta}>
            Explore the Academy <ArrowRightIcon />
          </Link>
        </div>

        <ul className={styles.academyGrid}>
          {academyPreviewImgs.map((src, i) => (
            <li key={src} className={styles.academyCell}>
              <Image
                src={src}
                alt="Academy students in training"
                fill sizes="(max-width: 980px) 50vw, 25vw"
                className={styles.collageImg}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function TestimonialsPreview() {
  return (
    <section className="section bg-ivory">
      <div className="shell">
        <SectionHeading eyebrow="Kind Words" title="Loved by brides & students" />
        <ul className={styles.reviewGrid}>
          {featuredReviews.map((r) => (
            <li key={r.name} className={styles.reviewCard}>
              <p className={styles.stars} aria-label="Rated 5 out of 5">
                <span aria-hidden="true">★★★★★</span>
              </p>
              <blockquote className={styles.quote}>“{r.quote}”</blockquote>
              <p className={styles.reviewName}>{r.name}</p>
              <p className={styles.reviewTag}>{r.tag}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function InstagramStrip() {
  return (
    <section className="section">
      <div className="shell">
        <SectionHeading
          eyebrow={site.social.instagramHandle}
          title="Follow the studio"
        />
        <ul className={styles.instaGrid}>
          {instaImages.map((src, i) => (
            <li key={`${src}-${i}`}>
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.instaTile}
                aria-label={`View post ${i + 1} on Instagram`}
              >
                <Image
                  src={src}
                  alt=""
                  fill sizes="(max-width: 560px) 33vw, (max-width: 1180px) 33vw, 16vw"
                  className={styles.collageImg}
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
