'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { navItems, darkHeroRoutes } from '@/lib/site'
import styles from './Header.module.css'

export default function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const overDarkHero =
    (darkHeroRoutes as readonly string[]).includes(pathname) && !scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the menu on route change, and lock body scroll while it's open.
  useEffect(() => setMenuOpen(false), [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  return (
    <>
      <header
        className={`${styles.header} ${overDarkHero ? styles.transparent : styles.solid}`}
      >
        <div className={styles.inner}>
          <Link href="/" className={styles.logo} aria-label="Surbhi Makeup Studio — home">
            <Image
              src="/images/logo.png"
              alt="Surbhi Makeup Studio & Academy"
              width={180}
              height={52}
              priority
              className={styles.logoImg}
            />
          </Link>

          <nav className={styles.nav} aria-label="Main">
            {navItems.map(({ label, href }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={`${styles.navLink} ${active ? styles.navLinkActive : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  {label}
                  <span className={styles.underline} aria-hidden="true" />
                </Link>
              )
            })}
          </nav>

          <div className={styles.actions}>
            <Link href="/contact" className={`btn btn--dark ${styles.bookBtn}`}>
              Book<span className={styles.bookBtnLong}>&nbsp;Appointment</span>
            </Link>
            <button
              type="button"
              className={styles.hamburger}
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-nav"
        className={`${styles.mobileNav} ${menuOpen ? styles.mobileNavOpen : ''}`}
        hidden={!menuOpen}
      >
        <div className={styles.mobileTop}>
          <span className={styles.mobileBrand}>Surbhi</span>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className={styles.close}
          >
            &times;
          </button>
        </div>
        <nav aria-label="Mobile">
          {navItems.map(({ label, href }) => (
            <Link key={href} href={href} className={styles.mobileLink}>
              {label}
            </Link>
          ))}
        </nav>
        <Link href="/contact" className={`btn btn--gold ${styles.mobileCta}`}>
          Book Appointment
        </Link>
      </div>
    </>
  )
}
