import { site, whatsappUrl, telUrl } from '@/lib/site'
import { PhoneIcon, WhatsAppIcon } from '@/components/ui/Icons'
import styles from './FloatingActions.module.css'

export default function FloatingActions() {
  return (
    <div className={styles.stack}>
      <a
        href={telUrl}
        className={`${styles.fab} ${styles.call}`}
        aria-label={`Call ${site.phoneDisplay}`}
      >
        <PhoneIcon />
      </a>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.fab} ${styles.whatsapp}`}
        aria-label={`WhatsApp ${site.whatsappDisplay}`}
      >
        <WhatsAppIcon />
      </a>
    </div>
  )
}
