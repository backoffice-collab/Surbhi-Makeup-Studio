import styles from './SectionHeading.module.css'

type Props = {
  eyebrow: string
  title: string
  body?: string
  align?: 'center' | 'left'
  tone?: 'light' | 'dark'
  as?: 'h1' | 'h2'
  narrow?: boolean
}

/** The eyebrow + heading + optional lead block, repeated ~18× in the prototype. */
export default function SectionHeading({
  eyebrow,
  title,
  body,
  align = 'center',
  tone = 'light',
  as: Tag = 'h2',
  narrow = true,
}: Props) {
  return (
    <div
      className={[
        styles.wrap,
        align === 'center' ? styles.center : '',
        narrow && align === 'center' ? styles.narrow : '',
      ].join(' ')}
    >
      <p className={`eyebrow ${tone === 'dark' ? 'eyebrow--gold' : ''}`}>{eyebrow}</p>
      <Tag className={`${styles.title} ${tone === 'dark' ? styles.onDark : ''}`}>
        {title}
      </Tag>
      {body && (
        <p className={`${styles.body} ${tone === 'dark' ? styles.bodyDark : ''}`}>
          {body}
        </p>
      )}
    </div>
  )
}
