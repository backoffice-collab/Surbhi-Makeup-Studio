'use client'

import { useId, useState } from 'react'
import styles from './Accordion.module.css'

export type FaqItem = { q: string; a: string }

/**
 * The prototype animated a hardcoded max-height (260px/300px), which clipped
 * longer answers. Uses a grid-rows transition instead — animates to the
 * content's real height, no magic numbers.
 */
export default function Accordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<Record<number, boolean>>({})
  const baseId = useId()

  if (!items.length) {
    return <p className={styles.empty}>No questions match your search.</p>
  }

  return (
    <div className={styles.list}>
      {items.map((item, i) => {
        const isOpen = !!open[i]
        const panelId = `${baseId}-panel-${i}`
        const btnId = `${baseId}-btn-${i}`
        return (
          <div key={item.q} className={styles.row}>
            <h3 className={styles.h}>
              <button
                type="button"
                id={btnId}
                className={styles.trigger}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen((s) => ({ ...s, [i]: !s[i] }))}
              >
                <span>{item.q}</span>
                <span
                  className={`${styles.plus} ${isOpen ? styles.plusOpen : ''}`}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}
            >
              <div className={styles.panelInner}>
                <p className={styles.answer}>{item.a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
