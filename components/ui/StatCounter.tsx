'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Counts up when scrolled into view (the prototype started the animation on
 * mount, so on lower sections the numbers had finished before you got there).
 * Honours prefers-reduced-motion by rendering the final value immediately.
 */
export default function StatCounter({
  value,
  suffix = '',
  duration = 1700,
}: {
  value: number
  suffix?: string
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(0)
  const done = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setDisplay(value)
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || done.current) return
        done.current = true
        const start = performance.now()
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / duration)
          // ease-out so it decelerates into the final number
          setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [value, duration])

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  )
}
