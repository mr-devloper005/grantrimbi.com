'use client'

import { useEffect, useState } from 'react'
import { Check, Link2, Printer, Share2 } from 'lucide-react'

/** Thin reading-progress line pinned under the masthead. */
export function EditableReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.body.scrollHeight - window.innerHeight
      setProgress(scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="sticky top-0 z-30 h-[3px] w-full bg-transparent" aria-hidden="true">
      <div
        className="h-full bg-[var(--tk-accent)] transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

/** Copy-link / share / print row. Falls back to clipboard when share is absent. */
export function EditableShareRow({ title, compact = false }: { title?: string; compact?: boolean }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable — the address bar still has the URL */
    }
  }

  const share = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: title || document.title, url: window.location.href })
        return
      } catch {
        /* dismissed — fall through to copying */
      }
    }
    void copy()
  }

  const buttonClass =
    'inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-4 py-2 text-[12.5px] font-semibold text-[var(--tk-muted)] transition hover:border-[var(--tk-accent)] hover:text-[var(--tk-accent)]'

  return (
    <div className={`flex flex-wrap items-center gap-2 ${compact ? '' : 'mt-6'}`}>
      <button type="button" onClick={copy} className={buttonClass}>
        {copied ? <Check className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> : <Link2 className="h-3.5 w-3.5" />}
        {copied ? 'Link copied' : 'Copy link'}
      </button>
      <button type="button" onClick={share} className={buttonClass}>
        <Share2 className="h-3.5 w-3.5" /> Share
      </button>
      {!compact ? (
        <button type="button" onClick={() => window.print()} className={buttonClass}>
          <Printer className="h-3.5 w-3.5" /> Print
        </button>
      ) : null}
    </div>
  )
}

/** Lightbox-free gallery: a large frame with selectable thumbnails. */
export function EditableGallery({ images, title }: { images: string[]; title?: string }) {
  const [active, setActive] = useState(0)
  const gallery = images.filter(Boolean)
  if (!gallery.length) return null
  const current = gallery[Math.min(active, gallery.length - 1)]

  return (
    <div>
      <div className="relative overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-raised)]">
        <img src={current} alt={title || ''} className="aspect-[16/10] w-full object-cover" />
      </div>
      {gallery.length > 1 ? (
        <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {gallery.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show image ${index + 1}`}
              aria-pressed={index === active}
              className={`h-20 w-24 shrink-0 overflow-hidden rounded-xl border transition ${
                index === active
                  ? 'border-[var(--tk-accent)] opacity-100'
                  : 'border-[var(--tk-line)] opacity-70 hover:opacity-100'
              }`}
            >
              <img src={image} alt="" className="h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
