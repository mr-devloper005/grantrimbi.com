'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, LogIn, Menu, PenLine, Search, UserRound, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { navTasks } from '@/editable/content/nav-visibility'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

/*
  Two-tier masthead.

  Tier one is a quiet utility strip (audience tabs + secondary links) that
  retracts once the reader scrolls, leaving a single clean bar. Tier two holds
  the mark, the primary sections and the member action. A single mobile drawer
  carries search and every link — there is only ever one navigation region.
*/
export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  const taskLinks = useMemo(
    () => navTasks().map((task) => ({ label: task.label, href: task.route })),
    [],
  )

  const primaryLinks = useMemo(() => {
    const extras = [
      { label: 'Search', href: '/search' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ]
    const seen = new Set<string>()
    return [...taskLinks, ...extras].filter((item) => {
      if (seen.has(item.href)) return false
      seen.add(item.href)
      return true
    })
  }, [taskLinks])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the drawer whenever the route changes.
  useEffect(() => setOpen(false), [pathname])

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className="sticky top-0 z-50">
      {/* Main bar. */}
      <div
        className={`border-b border-[var(--editable-border)] bg-[var(--editable-nav-bg)]/95 backdrop-blur-md transition-shadow duration-500 ${
          scrolled ? 'shadow-[0_10px_30px_rgba(32,26,22,0.07)]' : ''
        }`}
      >
        <nav
          className={`mx-auto flex w-full max-w-[var(--editable-container)] items-center gap-4 px-5 transition-all duration-500 sm:px-6 lg:px-8 ${
            scrolled ? 'h-[64px]' : 'h-[78px]'
          }`}
        >
          <Link href="/" className="group flex shrink-0 items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-[0.7rem] bg-[var(--slot4-accent-soft)] transition duration-500 group-hover:rotate-[-6deg]">
              <img src="/favicon.png?v=20260413" alt="" className="h-6 w-6 object-contain" />
            </span>
            <span className="min-w-0">
              <span className="gr-display block max-w-[190px] truncate text-[1.35rem] font-semibold leading-none tracking-[-0.02em]">
                {SITE_CONFIG.name}
              </span>
              <span className="mt-1 hidden max-w-[190px] truncate text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-muted-text)] sm:block">
                {globalContent.nav.tagline || SITE_CONFIG.tagline}
              </span>
            </span>
          </Link>

          <div className="mx-auto hidden items-center gap-1 lg:flex">
            {primaryLinks.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative rounded-full px-4 py-2 text-[13.5px] font-semibold transition duration-300 ${
                    active
                      ? 'text-[var(--slot4-accent)]'
                      : 'text-[var(--slot4-page-text)] hover:text-[var(--slot4-accent)]'
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute inset-x-4 -bottom-0.5 h-[2px] origin-left rounded-full bg-[var(--slot4-accent)] transition-transform duration-500 ${
                      active ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </Link>
              )
            })}
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0">
            {session ? (
              <>
                <Link
                  href="/create"
                  className="hidden items-center gap-2.5 rounded-full bg-[var(--editable-cta-bg)] py-2 pl-5 pr-2 text-[13px] font-semibold text-[var(--editable-cta-text)] transition duration-300 hover:brightness-105 sm:inline-flex"
                >
                  Post an entry
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[var(--slot4-accent)]">
                    <PenLine className="h-3.5 w-3.5" />
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="hidden rounded-full border border-[var(--editable-border)] px-4 py-2 text-[13px] font-semibold text-[var(--slot4-muted-text)] transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)] md:inline-flex"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="hidden rounded-full border border-[var(--editable-border)] px-4 py-2 text-[13px] font-semibold text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)] md:inline-flex"
                >
                  Join
                </Link>
                <Link
                  href="/login"
                  className="hidden items-center gap-2.5 rounded-full bg-[var(--editable-cta-bg)] py-2 pl-5 pr-2 text-[13px] font-semibold text-[var(--editable-cta-text)] transition duration-300 hover:brightness-105 sm:inline-flex"
                >
                  {globalContent.nav.actions.primary.label}
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[var(--slot4-accent)]">
                    <UserRound className="h-4 w-4" />
                  </span>
                </Link>
              </>
            )}

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border)] text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)] lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile drawer. */}
      <div
        className={`overflow-hidden border-b border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition-all duration-500 lg:hidden ${
          open ? 'max-h-[38rem] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="mx-auto w-full max-w-[var(--editable-container)] px-5 py-6 sm:px-6">
          <form action="/search" className="flex items-center gap-3 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] px-5 py-3">
            <Search className="h-4 w-4 shrink-0 text-[var(--slot4-accent)]" />
            <input
              name="q"
              type="search"
              placeholder="Search notices, profiles, categories"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--slot4-muted-text)]"
            />
          </form>

          <div className="mt-5 grid gap-1">
            {[{ label: 'Home', href: '/' }, ...primaryLinks, { label: 'Notes', href: '/comments' }].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between rounded-2xl px-4 py-3 text-[15px] font-semibold transition ${
                  isActive(item.href)
                    ? 'bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]'
                    : 'text-[var(--slot4-page-text)] hover:bg-[var(--slot4-panel-bg)]'
                }`}
              >
                {item.label}
                <ArrowUpRight className="h-4 w-4 opacity-50" />
              </Link>
            ))}
          </div>

          <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {session ? (
              <>
                <Link
                  href="/create"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--editable-cta-bg)] px-6 py-3 text-sm font-semibold text-[var(--editable-cta-text)]"
                >
                  <PenLine className="h-4 w-4" /> Post an entry
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout()
                    setOpen(false)
                  }}
                  className="inline-flex items-center justify-center rounded-full border border-[var(--editable-border)] px-6 py-3 text-sm font-semibold"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--editable-cta-bg)] px-6 py-3 text-sm font-semibold text-[var(--editable-cta-text)]"
                >
                  <LogIn className="h-4 w-4" /> Sign in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center rounded-full border border-[var(--editable-border)] px-6 py-3 text-sm font-semibold"
                >
                  Create an account
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
