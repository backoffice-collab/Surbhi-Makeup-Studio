import type { Metadata } from 'next'
import PageHero from '@/components/ui/PageHero'
import ContactForm from './ContactForm'
import CtaBand from '@/components/ui/CtaBand'
import { site, whatsappUrl, telUrl } from '@/lib/site'
import { PhoneIcon, WhatsAppIcon, InstagramIcon, FacebookIcon } from '@/components/ui/Icons'
import styles from './contact.module.css'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Book an appointment or enquire about the academy. Surbhi Makeup Studio, Fauji Road, Kot Kapura, Punjab. Open daily 9 AM – 9 PM.',
}

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get in Touch"
        title="Let's talk beauty"
        body="Book an appointment, enquire about the academy, or just say hello."
      />

      <section className="section">
        <div className={`shell shell--narrow ${styles.grid}`}>
          <ContactForm />

          <div className={styles.aside}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle} style={{ color: 'var(--rose)' }}>
                Visit the studio
              </h2>
              <address className={styles.address}>
                {site.address.street}, {site.address.locality},
                <br />
                {site.address.region} {site.address.postalCode}
              </address>
              <ul className={styles.contactList}>
                <li>
                  <a href={telUrl} className={styles.contactLink}>
                    <span className={styles.iconGold}><PhoneIcon size={18} /></span>
                    Call: {site.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.contactLink}
                  >
                    <span className={styles.iconGreen}><WhatsAppIcon size={18} /></span>
                    WhatsApp: {site.whatsappDisplay}
                  </a>
                </li>
              </ul>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle} style={{ color: 'var(--gold)' }}>
                Business hours
              </h2>
              <p className={styles.hours}>
                <span>Monday – Sunday</span>
                <span className={styles.hoursTime}>9:00 AM – 9:00 PM</span>
              </p>
            </div>

            <div className={styles.socialRow}>
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialBtn}
              >
                <InstagramIcon size={16} /> Instagram
              </a>
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialBtn}
              >
                <FacebookIcon size={16} /> Facebook
              </a>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Studio location map">
        <iframe
          title="Map showing Surbhi Makeup Studio on Fauji Road, Kot Kapura"
          src="https://maps.google.com/maps?q=Fauji%20Road%20Kot%20Kapura%20Punjab&z=14&output=embed"
          className={styles.map}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>

      <CtaBand />
    </>
  )
}
