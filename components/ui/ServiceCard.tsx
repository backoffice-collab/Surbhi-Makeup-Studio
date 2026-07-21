import Link from 'next/link'
import { SparkIcon } from './Icons'
import styles from './ServiceCard.module.css'

type Props = {
  no: string
  title: string
  desc: string
  features?: string[]
  cta?: boolean
}

export default function ServiceCard({ no, title, desc, features, cta }: Props) {
  return (
    <li className={styles.card}>
      <p className={styles.no} aria-hidden="true">{no}</p>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.desc}>{desc}</p>

      {features && (
        <ul className={styles.features}>
          {features.map((f) => (
            <li key={f} className={styles.feature}>
              <SparkIcon className={styles.spark} />
              {f}
            </li>
          ))}
        </ul>
      )}

      {cta && (
        <Link href="/contact" className={`btn ${styles.enquire}`}>
          Enquire Now
        </Link>
      )}
    </li>
  )
}
