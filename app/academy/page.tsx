import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import PageHero from '@/components/ui/PageHero'
import SectionHeading from '@/components/ui/SectionHeading'
import Gallery from '@/components/ui/Gallery'
import Accordion from '@/components/ui/Accordion'
import { SparkIcon } from '@/components/ui/Icons'
import {
  whyJoin, courses, training, studentGallery, admissionSteps, academyFaqs,
} from '@/lib/content'
import styles from './academy.module.css'

export const metadata: Metadata = {
  title: 'Academy',
  description:
    'ISO-certified professional makeup and hair courses in Kot Kapura — hands-on training on real brides, portfolio building and placement assistance.',
}

export default function AcademyPage() {
  return (
    <>
      <PageHero
        variant="/images/academy-6.jpg"
        align="left"
        eyebrow="Beauty Academy"
        title="Build a career in beauty"
        body="Professional, hands-on makeup & hair courses with certification, real client practice and placement support."
      >
        <Link href="/contact" className="btn btn--gold" style={{ marginTop: 34 }}>
          Enquire About Admissions
        </Link>
      </PageHero>

      {/* Why join */}
      <section className="section">
        <div className="shell shell--narrow">
          <SectionHeading eyebrow="Why Join" title="More than a course — a launchpad" />
          <ul className={styles.whyGrid}>
            {whyJoin.map((w) => (
              <li key={w.no} className={styles.why}>
                <p className={styles.whyNo} aria-hidden="true">{w.no}</p>
                <h3 className={styles.whyTitle}>{w.title}</h3>
                <p className={styles.whyDesc}>{w.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Courses */}
      <section className="section bg-ivory">
        <div className="shell shell--narrow">
          <SectionHeading eyebrow="Courses" title="Certified batches" />
          <ul className={styles.courseGrid}>
            {courses.map((c) => (
              <li key={c.title} className={styles.course}>
                <span className={styles.courseBar} aria-hidden="true" />
                <div className={styles.courseBody}>
                  <p className={styles.duration}>{c.duration}</p>
                  <h3 className={styles.courseTitle}>{c.title}</h3>
                  <p className={styles.courseDesc}>{c.desc}</p>
                  <ul className={styles.points}>
                    {c.points.map((p) => (
                      <li key={p} className={styles.point}>
                        <SparkIcon className={styles.spark} />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <Link href="/contact" className="btn btn--dark" style={{ marginTop: 24 }}>
                    Enquire Now
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Practical training */}
      <section className="section">
        <div className={`shell shell--narrow ${styles.twoCol}`}>
          <div>
            <p className="eyebrow">Practical Training</p>
            <h2 className={styles.blockTitle}>Learn by doing, on real clients</h2>
            <p className={styles.blockBody}>
              From day one you&apos;ll work with brushes in hand — practising on live
              models and real brides under expert supervision. Small batches mean personal
              attention and a portfolio you can be proud of.
            </p>
            <ul className={styles.trainList}>
              {training.map((t) => (
                <li key={t} className={styles.trainItem}>
                  <SparkIcon size={18} className={styles.spark} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.trainImg}>
            <Image
              src="/images/academy-6.jpg"
              alt="Students practising makeup during a training session"
              fill sizes="(max-width: 980px) 100vw, 45vw"
              className={styles.cover}
            />
          </div>
        </div>
      </section>

      {/* Student gallery */}
      <section className="section bg-ivory">
        <div className="shell">
          <SectionHeading eyebrow="Student Gallery" title="Our proud graduates" />
          <Gallery
            items={studentGallery.map((src) => ({ src }))}
            cols={4}
            alt="Academy graduate"
          />
        </div>
      </section>

      {/* Certification + placement */}
      <section className="section">
        <div className={`shell shell--narrow ${styles.twoColTop}`}>
          <div>
            <p className="eyebrow">Certification</p>
            <h2 className={styles.smallTitle}>A certificate that opens doors</h2>
            <p className={styles.blockBody}>
              Every graduate receives an ISO-certified completion certificate from Surbhi
              Makeup Studio &amp; Academy — recognised proof of your professional training.
            </p>
          </div>
          <div>
            <p className="eyebrow">Placement Assistance</p>
            <h2 className={styles.smallTitle}>We stay with you after graduation</h2>
            <p className={styles.blockBody}>
              From building your kit to your first freelance bookings and salon
              opportunities — we guide you through launching your career with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Admission steps */}
      <section className="section bg-charcoal">
        <div className="shell shell--prose" style={{ maxWidth: 1000 }}>
          <SectionHeading
            eyebrow="Admission Process"
            title="Four simple steps"
            tone="dark"
          />
          <ol className={styles.steps}>
            {admissionSteps.map((a) => (
              <li key={a.no} className={styles.step}>
                <span className={styles.stepNo} aria-hidden="true">{a.no}</span>
                <h3 className={styles.stepTitle}>{a.title}</h3>
                <p className={styles.stepDesc}>{a.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Academy FAQ */}
      <section className="section bg-ivory">
        <div className="shell shell--prose">
          <SectionHeading eyebrow="FAQ" title="Academy questions" />
          <Accordion items={academyFaqs} />
        </div>
      </section>
    </>
  )
}
