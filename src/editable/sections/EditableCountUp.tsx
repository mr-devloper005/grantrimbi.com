'use client'

import { useEffect, useRef, useState } from 'react'

/*
  Counts a number up once it scrolls into view. Falls back to the final value
  immediately when IntersectionObserver is unavailable or the reader prefers
  reduced motion, so the figure is never hidden.
*/
export function EditableCountUp({
  value,
  suffix = '',
  duration = 1200,
  className = '',
}: {
  value: number
  suffix?: string
  duration?: number
  className?: string
}) {
  const target = Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0
  const [display, setDisplay] = useState(target)
  const ref = useRef<HTMLSpanElement | null>(null)
  const done = useRef(false)

  useEffect(() => {
    const node = ref.current
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (!node || reduced || typeof IntersectionObserver === 'undefined' || target === 0) {
      setDisplay(target)
      return
    }

    setDisplay(0)
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || done.current) return
        done.current = true
        observer.disconnect()
        const started = performance.now()
        const step = (now: number) => {
          const progress = Math.min(1, (now - started) / duration)
          const eased = 1 - Math.pow(1 - progress, 3)
          setDisplay(Math.round(target * eased))
          if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      },
      { threshold: 0.4 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [target, duration])

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  )
}
