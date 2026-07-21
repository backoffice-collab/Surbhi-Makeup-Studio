import { site, whatsappUrl, telUrl } from '@/lib/site'
import styles from './CtaBand.module.css'

type Props = {
  eyebrow?: string
  heading?: string
  body?: string
}

/**
 * The closing CTA band. In the prototype this exact block was pasted five
 * times (About, Services, Portfolio, Academy, FAQ) — five copies to keep in
 * sync. Now one component; the Home page passes its own copy.
 */
export default function CtaBand({
  eyebrow = 'Ready when you are',
  heading = "Let's create something beautiful",
  body = 'Book your appointment or enquire about the academy today.',
}: Props) {
  return (
    <section className={styles.band}>
      <div className={styles.inner}>
        <p className="eyebrow eyebrow--gold">{eyebrow}</p>
        <h2 className={styles.heading}>{heading}</h2>
        <p className={styles.body}>{body}</p>
        <div className={styles.actions}>
          <a href={telUrl} className="btn btn--gold">
            Call {site.phoneDisplay}
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--ghost"
          >
            WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  )
}
