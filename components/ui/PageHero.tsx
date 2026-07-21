import Image from 'next/image'
import styles from './PageHero.module.css'

type Props = {
  eyebrow: string
  title: string
  body?: string
  /** 'ivory' light band, 'charcoal' dark band, or an image path for a photo hero. */
  variant?: 'ivory' | 'charcoal' | string
  align?: 'center' | 'left'
  children?: React.ReactNode
}

export default function PageHero({
  eyebrow,
  title,
  body,
  variant = 'ivory',
  align = 'center',
  children,
}: Props) {
  const isImage = variant !== 'ivory' && variant !== 'charcoal'

  return (
    <section
      className={[
        styles.hero,
        variant === 'ivory' ? styles.ivory : '',
        variant === 'charcoal' ? styles.charcoal : '',
        isImage ? styles.image : '',
        align === 'left' ? styles.left : styles.center,
      ].join(' ')}
    >
      {isImage && (
        <>
          <Image
            src={variant}
            alt=""
            fill priority quality={82} sizes="100vw"
            className={styles.bg}
          />
          <div className={styles.overlay} aria-hidden="true" />
        </>
      )}

      <div className={`${styles.inner} reveal`}>
        <p className={`eyebrow ${variant === 'ivory' ? '' : 'eyebrow--gold'}`}>
          {eyebrow}
        </p>
        <h1 className={styles.title}>{title}</h1>
        {body && <p className={styles.body}>{body}</p>}
        {children}
      </div>
    </section>
  )
}
