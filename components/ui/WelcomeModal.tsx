'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import styles from './WelcomeModal.module.css'

const STORAGE_KEY = 'sms-welcome-seen-v1'

type Props = {
  /** Highlighted in italic gold within the headline. */
  clientName?: string
}

/**
 * Full-screen "First Look" welcome modal, shown once per browser.
 *
 * Behaviour:
 *  · Appears on first visit only (localStorage flag).
 *  · Closes via the primary button or Escape — NOT by clicking the backdrop.
 *  · Blurs the page behind it (backdrop-filter) and locks scroll while open.
 *  · Focus is trapped inside and returned to the previous element on close.
 *  · Respects prefers-reduced-motion.
 *
 * Mount/visibility are tracked separately and unmount is driven explicitly by
 * onAnimationComplete — NOT by AnimatePresence, which was leaving a
 * click-blocking overlay node behind after the exit animation. While closing,
 * the overlay is pointer-events:none so the page is usable immediately.
 */
export default function WelcomeModal({ clientName = 'Surbhi' }: Props) {
  const [mounted, setMounted] = useState(false) // in the DOM at all
  const [closing, setClosing] = useState(false) // playing the exit animation
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const lastFocused = useRef<HTMLElement | null>(null)
  const reduce = useReducedMotion()

  // Decide on the client only (avoids hydration mismatch / flash for returners).
  useEffect(() => {
    let seen = false
    try {
      seen = localStorage.getItem(STORAGE_KEY) === '1'
    } catch {
      /* storage blocked — show once for this load */
    }
    if (!seen) setMounted(true)
  }, [])

  // Scroll lock, focus, and key handling — while open (mounted, not closing).
  useEffect(() => {
    if (!mounted || closing) return

    lastFocused.current = document.activeElement as HTMLElement
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => closeBtnRef.current?.focus(), 60)

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
      } else if (e.key === 'Tab') {
        const f = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, [tabindex]:not([tabindex="-1"])',
        )
        if (!f || f.length === 0) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = '' // restore scroll the moment we close
      clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, closing])

  const finish = () => {
    lastFocused.current?.focus()
    setMounted(false)
  }

  const close = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      /* ignore */
    }
    setClosing(true) // fade out
    // Guaranteed unmount: onAnimationComplete can be unreliable with this
    // framer-motion + React combo, so a timeout past the exit duration ensures
    // the node is always removed.
    setTimeout(finish, 550)
  }

  // Also unmount when the exit animation reports complete (whichever is first).
  const handleAnimationComplete = () => {
    if (closing) finish()
  }

  if (!mounted) return null

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: closing ? 0 : 1 }}
      transition={{ duration: 0.35 }}
      onAnimationComplete={handleAnimationComplete}
      // Once closing starts, let clicks fall through to the page immediately.
      style={{ pointerEvents: closing ? 'none' : 'auto' }}
    >
      <motion.div
        ref={dialogRef}
        className={styles.card}
        role="dialog"
        aria-modal="true"
        aria-labelledby="wm-title"
        aria-describedby="wm-body"
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 16 }}
        animate={
          closing
            ? reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }
            : reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }
        }
        transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <span className={styles.divider} aria-hidden="true" />
        <p className={styles.label}>A First Look</p>

        <h2 id="wm-title" className={styles.title}>
          Welcome, <span className={styles.name}>{clientName}</span>.
        </h2>

        <div id="wm-body" className={styles.body}>
          <p>
            This is the first look of your website—a foundation, not the finished
            product.
          </p>
          <p>
            Every section has been carefully created to help visualize the direction
            of your brand.
          </p>
          <p>
            Explore every page, note anything you&apos;d like to refine, and we&apos;ll
            continue shaping it together into something truly exceptional.
          </p>
        </div>

        <button ref={closeBtnRef} type="button" className={styles.cta} onClick={close}>
          Explore Website
        </button>

        <p className={styles.fine}>This preview is for review purposes only.</p>
      </motion.div>
    </motion.div>
  )
}
