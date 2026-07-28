'use client'

import Link from 'next/link'
import { ArrowUpRight, Compass, Leaf, Mail, Smartphone } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { navTasks } from '@/editable/content/nav-visibility'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

const promiseIcons = [Leaf, Compass, Smartphone]

export function EditableFooter() {
  const taskLinks = navTasks()
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="mt-auto bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      {/* Value strip. */}
      <div className="border-b border-white/10">
        <div className="mx-auto grid w-full max-w-[var(--editable-container)] gap-8 px-5 py-12 sm:px-6 md:grid-cols-3 lg:px-8 lg:py-14">
          {globalContent.footer.promises.map((promise, index) => {
            const Icon = promiseIcons[index] || Leaf
            return (
              <div key={promise.title} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.8rem] bg-[var(--slot4-accent-fill)]/18 text-[#e9a075]">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="gr-display text-[1.1rem] font-semibold tracking-[-0.01em]">{promise.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/60">{promise.body}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Columns. */}
      <div className="mx-auto grid w-full max-w-[var(--editable-container)] gap-10 px-5 py-14 sm:px-6 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-[0.75rem] bg-white/10">
              <img src="/favicon.png?v=20260413" alt="" className="h-6 w-6 object-contain" />
            </span>
            <span className="gr-display text-[1.45rem] font-semibold tracking-[-0.02em]">{SITE_CONFIG.name}</span>
          </Link>
          <p className="gr-serif mt-5 max-w-sm text-[15px] leading-8 text-white/60">
            {globalContent.footer.description || SITE_CONFIG.description}
          </p>
        </div>

        {globalContent.footer.columns.map((column) => (
          <div key={column.title}>
            <h3 className="gr-kicker text-[#e9a075]">{column.title}</h3>
            <div className="mt-5 grid gap-3">
              {column.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="gr-underline w-fit text-sm font-medium text-white/70 transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
              {column.title === 'Browse'
                ? taskLinks
                    .filter((task) => !column.links.some((link) => link.href === task.route))
                    .map((task) => (
                      <Link
                        key={task.key}
                        href={task.route}
                        className="gr-underline w-fit text-sm font-medium text-white/70 transition hover:text-white"
                      >
                        {task.label}
                      </Link>
                    ))
                : null}
              {column.title === 'Site' && session ? (
                <button
                  type="button"
                  onClick={logout}
                  className="w-fit text-left text-sm font-medium text-white/70 transition hover:text-white"
                >
                  Sign out
                </button>
              ) : null}
            </div>
          </div>
        ))}

        <div>
          <h3 className="gr-kicker text-[#e9a075]">Add an entry</h3>
          <p className="mt-5 text-sm leading-7 text-white/60">
            {globalContent.footer.tagline}. Share a notice or introduce yourself in a few minutes.
          </p>
          <Link
            href={session ? '/create' : '/signup'}
            className="group mt-6 inline-flex items-center gap-3 rounded-full bg-[var(--slot4-accent-fill)] py-2.5 pl-6 pr-2.5 text-sm font-semibold text-[var(--slot4-on-accent)] transition hover:brightness-105"
          >
            {session ? 'Post an entry' : 'Get started'}
            <span className="gr-arrow h-8 w-8 bg-white text-[var(--slot4-accent)]">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </Link>
          <Link
            href="/contact"
            className="mt-4 flex items-center gap-2 text-sm font-medium text-white/60 transition hover:text-white"
          >
            <Mail className="h-4 w-4" /> Get in touch
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[var(--editable-container)] flex-col gap-2 px-5 py-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {year} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <p>{globalContent.footer.bottomNote}</p>
        </div>
      </div>
    </footer>
  )
}
