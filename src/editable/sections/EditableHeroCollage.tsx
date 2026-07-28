'use client'

import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'

const FALLBACK = '/placeholder.svg?height=1200&width=1200'
const DURATION = 5200

/*
  Circular hero medallion.

  Cross-fades the newest post images inside a large circle, with a visible
  progress track, dot markers and a pause control — so the motion is always
  the reader's to stop. The first frame is deterministic (index 0) so the
  server and client render the same markup, and rotation is disabled entirely
  for prefers-reduced-motion.
*/
export function EditableHeroCollage({ images }: { images: string[] }) {
  const pool = images.filter(Boolean).length ? images.filter(Boolean) : [FALLBACK]
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const reduced = useRef(false)

  useEffect(() => {
    reduced.current = Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
    if (reduced.current) setPlaying(false)
  }, [])

  useEffect(() => {
    if (!playing || pool.length <= 1) return
    const started = Date.now()
    const tick = window.setInterval(() => {
      const elapsed = Date.now() - started
      setProgress(Math.min(100, (elapsed / DURATION) * 100))
    }, 90)
    const next = window.setTimeout(() => {
      setIndex((value) => (value + 1) % pool.length)
      setProgress(0)
    }, DURATION)
    return () => {
      window.clearInterval(tick)
      window.clearTimeout(next)
    }
  }, [playing, index, pool.length])

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="relative aspect-square w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[480px]">
        <span className="absolute -inset-3 rounded-full border border-white/35" aria-hidden="true" />
        <div className="relative h-full w-full overflow-hidden rounded-full bg-[var(--slot4-media-bg)] shadow-[0_30px_80px_rgba(32,26,22,0.22)]">
          {pool.map((src, i) => (
            <img
              key={`${src}-${i}`}
              src={src}
              alt=""
              aria-hidden="true"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ${
                i === index ? 'gr-drift opacity-100' : 'opacity-0'
              }`}
              loading={i === 0 ? 'eager' : 'lazy'}
              {...(i === 0 ? { fetchPriority: 'high' as const } : {})}
            />
          ))}
        </div>
      </div>

      {pool.length > 1 ? (
        <div className="flex items-center gap-4 text-white">
          <button
            type="button"
            onClick={() => setPlaying((value) => !value)}
            aria-label={playing ? 'Pause image rotation' : 'Play image rotation'}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[var(--slot4-accent)] shadow-[0_8px_20px_rgba(32,26,22,0.18)] transition hover:scale-105"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>

          <div className="flex items-center gap-2.5">
            {pool.slice(0, 6).map((src, i) => {
              const active = i === index
              return (
                <button
                  key={`dot-${src}-${i}`}
                  type="button"
                  onClick={() => {
                    setIndex(i)
                    setProgress(0)
                  }}
                  aria-label={`Show image ${i + 1}`}
                  className="group py-2"
                >
                  {active ? (
                    <span className="gr-progress block h-[3px] w-24 overflow-hidden rounded-full bg-white/35 text-white">
                      <span style={{ width: `${playing ? progress : 100}%` }} />
                    </span>
                  ) : (
                    <span className="block h-[7px] w-[7px] rounded-full bg-white/45 transition group-hover:bg-white/80" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}
