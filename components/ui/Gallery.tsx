'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import styles from './Gallery.module.css'

export type GalleryItem = { src: string; cap?: string }

type Props = {
  items: GalleryItem[]
  /** Grid columns at desktop. Collapses responsively. */
  cols?: 3 | 4 | 6
  /** Disable the lightbox (e.g. the Instagram strip links out instead). */
  lightbox?: boolean
  alt?: string
}

export default function Gallery({
  items,
  cols = 3,
  lightbox = true,
  alt = 'Gallery image',
}: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const lastFocused = useRef<HTMLElement | null>(null)

  const close = useCallback(() => setOpenIdx(null), [])
  const next = useCallback(
    () => setOpenIdx((i) => (i === null ? i : (i + 1) % items.length)),
    [items.length],
  )
  const prev = useCallback(
    () => setOpenIdx((i) => (i === null ? i : (i - 1 + items.length) % items.length)),
    [items.length],
  )

  useEffect(() => {
    if (openIdx === null) return

    lastFocused.current = document.activeElement as HTMLElement
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'Tab') {
        // Focus trap — the prototype's lightbox let focus escape behind it.
        const f = dialogRef.current?.querySelectorAll<HTMLElement>('button')
        if (!f?.length) return
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
      document.body.style.overflow = ''
      lastFocused.current?.focus()
    }
  }, [openIdx, close, next, prev])

  const idx = openIdx
  const current = idx === null ? null : items[idx]

  return (
    <>
      <ul className={`${styles.grid} ${styles[`cols${cols}`]}`}>
        {items.map((item, i) => (
          <li key={`${item.src}-${i}`} className={styles.cell}>
            {lightbox ? (
              <button
                type="button"
                className={styles.tile}
                onClick={() => setOpenIdx(i)}
                aria-label={
                  item.cap ? `View ${item.cap} full size` : `View image ${i + 1} full size`
                }
              >
                <TileInner item={item} alt={alt} priority={i < 3} />
              </button>
            ) : (
              <div className={styles.tile}>
                <TileInner item={item} alt={alt} priority={i < 3} />
              </div>
            )}
          </li>
        ))}
      </ul>

      {current && idx !== null && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={current.cap || 'Image viewer'}
          tabIndex={-1}
          ref={dialogRef}
          onClick={close}
        >
          <button type="button" className={styles.close} onClick={close} aria-label="Close">
            &times;
          </button>
          <button
            type="button"
            className={`${styles.arrow} ${styles.prev}`}
            onClick={(e) => { e.stopPropagation(); prev() }}
            aria-label="Previous image"
          >
            &#8249;
          </button>

          <figure className={styles.figure} onClick={(e) => e.stopPropagation()}>
            <Image
              src={current.src}
              alt={current.cap || alt}
              width={1200}
              height={1500}
              quality={90}
              className={styles.lightboxImg}
            />
            {current.cap && <figcaption className={styles.caption}>{current.cap}</figcaption>}
          </figure>

          <button
            type="button"
            className={`${styles.arrow} ${styles.next}`}
            onClick={(e) => { e.stopPropagation(); next() }}
            aria-label="Next image"
          >
            &#8250;
          </button>

          <p className={styles.counter} aria-live="polite">
            {idx + 1} / {items.length}
          </p>
        </div>
      )}
    </>
  )
}

function TileInner({
  item,
  alt,
  priority,
}: {
  item: GalleryItem
  alt: string
  priority?: boolean
}) {
  return (
    <>
      <Image
        src={item.src}
        alt={item.cap || alt}
        fill
        sizes="(max-width: 560px) 50vw, (max-width: 980px) 33vw, 25vw"
        priority={priority}
        className={styles.img}
      />
      {item.cap && (
        <span className={styles.capBar}>
          <span className={styles.capText}>{item.cap}</span>
        </span>
      )}
    </>
  )
}
