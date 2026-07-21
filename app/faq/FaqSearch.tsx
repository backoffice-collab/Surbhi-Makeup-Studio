'use client'

import { useMemo, useState } from 'react'
import Accordion, { type FaqItem } from '@/components/ui/Accordion'
import styles from './faq.module.css'

export default function FaqSearch({ items }: { items: FaqItem[] }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter(
      (f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q),
    )
  }, [items, query])

  return (
    <>
      <section className={styles.hero}>
        <div className={`shell shell--prose reveal ${styles.heroInner}`}>
          <p className="eyebrow">Help Centre</p>
          <h1 className={styles.title}>Frequently asked questions</h1>

          <div className={styles.searchWrap}>
            <label htmlFor="faq-search" className={styles.srOnly}>
              Search questions
            </label>
            <svg
              className={styles.searchIcon}
              width="18" height="18" viewBox="0 0 24 24" fill="none"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
              <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <input
              id="faq-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions..."
              className={styles.search}
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell shell--prose">
          <p className={styles.srOnly} role="status" aria-live="polite">
            {filtered.length} question{filtered.length === 1 ? '' : 's'} found
          </p>
          <Accordion items={filtered} />
        </div>
      </section>
    </>
  )
}
