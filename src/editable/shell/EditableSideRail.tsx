'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowUp, Mail, Search } from 'lucide-react'

type RailItem = { label: string; href: string; icon: typeof Search }

const RAIL_ITEMS: RailItem[] = [
  { label: 'Search', href: '/search', icon: Search },
  { label: 'Contact', href: '/contact', icon: Mail },
]

/*
  Floating quick-action rail, pinned to the right edge on larger screens.
  The back-to-top control fades in once the reader has moved down the page.
  Hidden entirely on small screens so it can never overlap mobile content.
*/
export function EditableSideRail() {
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 520)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="pointer-events-none fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-2.5 xl:flex">
      {RAIL_ITEMS.map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.label}
            className="group pointer-events-auto flex h-12 items-center gap-0 overflow-hidden rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] pl-0 pr-0 shadow-[0_10px_28px_rgba(32,26,22,0.10)] transition-all duration-500 hover:border-[var(--slot4-accent)]"
          >
            <span className="max-w-0 overflow-hidden whitespace-nowrap text-[13px] font-semibold text-[var(--slot4-page-text)] opacity-0 transition-all duration-500 group-hover:max-w-[9rem] group-hover:pl-5 group-hover:opacity-100">
              {item.label}
            </span>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center text-[var(--slot4-accent)]">
              <Icon className="h-[18px] w-[18px]" />
            </span>
          </Link>
        )
      })}

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        className={`pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--slot4-accent-fill)] text-[var(--slot4-on-accent)] shadow-[0_12px_30px_rgba(183,92,44,0.32)] transition-all duration-500 hover:brightness-105 ${
          showTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
        }`}
      >
        <ArrowUp className="h-[18px] w-[18px]" />
      </button>
    </div>
  )
}
