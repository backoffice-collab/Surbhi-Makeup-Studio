import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'
import StatCounter from '@/components/ui/StatCounter'
import { stats, allReviews } from '@/lib/content'
import styles from './testimonials.module.css'

export const metadata: Metadata = {
  title: 'Testimonials',
  description:
    'Rated 5.0 by clients. Read what brides and academy graduates say about Surbhi Makeup Studio & Academy, Kot Kapura.',
}

export default function TestimonialsPage() {
  return (
    <>
      <PageHero
        eyebrow="Testimonials"
        title="Words from our brides & students"
      />

      <section className="section bg-ivory" style={{ paddingTop: 0 }}>
        <div className="shell shell--narrow">
          <ul className={styles.statGrid}>
            {stats.map((s) => (
              <li key={s.label} className={styles.statCard}>
                <p className={styles.statValue}>
                  {s.static ? `${s.value}${s.suffix}` : <StatCounter value={s.value} suffix={s.suffix} />}
                </p>
                <p className={styles.statLabel}>{s.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="shell shell--narrow">
          <p className={styles.rating}>
            <span className={styles.stars} aria-hidden="true">★★★★★</span>
            <span>Rated 5.0 by clients on Google</span>
          </p>

          <ul className={styles.reviewCols}>
            {allReviews.map((r) => (
              <li key={r.name} className={styles.card}>
                <div className={styles.head}>
                  <span className={styles.avatar} aria-hidden="true">{r.name[0]}</span>
                  <div>
                    <p className={styles.name}>{r.name}</p>
                    <p className={styles.cardStars} aria-label="Rated 5 out of 5">
                      <span aria-hidden="true">★★★★★</span>
                    </p>
                  </div>
                </div>
                <blockquote className={styles.quote}>“{r.quote}”</blockquote>
                <p className={styles.tag}>{r.tag}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
