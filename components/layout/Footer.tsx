import Link from 'next/link'
import Image from 'next/image'
import { site, footerLinks, footerServices, whatsappUrl, telUrl } from '@/lib/site'
import { InstagramIcon, FacebookIcon } from '@/components/ui/Icons'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div>
          <Image
            src="/images/logo.png"
            alt={site.name}
            width={228}
            height={66}
            className={styles.logo}
          />
          <p className={styles.blurb}>{site.tagline}</p>
          <div className={styles.socials}>
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.social}
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
            <a
              href={site.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.social}
              aria-label="Facebook"
            >
              <FacebookIcon />
            </a>
          </div>
        </div>

        <div>
          <h2 className={styles.heading}>Quick Links</h2>
          <ul className={styles.list}>
            {footerLinks.map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className={styles.link}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className={styles.heading}>Services</h2>
          <ul className={styles.list}>
            {footerServices.map((s) => (
              <li key={s} className={styles.plain}>
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className={styles.heading}>Contact</h2>
          <address className={styles.contact}>
            {site.address.street}, {site.address.locality},
            <br />
            {site.address.region} {site.address.postalCode}
            <br />
            <a href={telUrl} className={styles.link}>
              {site.phoneDisplay}
            </a>
            <br />
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              WhatsApp: {site.whatsappDisplay}
            </a>
            <br />
            <span className={styles.plain}>{site.hours}</span>
          </address>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>
          &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
        </span>
        <span>An ISO Certified Company</span>
      </div>
    </footer>
  )
}
