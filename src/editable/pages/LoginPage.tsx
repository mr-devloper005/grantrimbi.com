import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { navTasks } from '@/editable/content/nav-visibility'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Login', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  const copy = pagesContent.auth.login
  const sections = navTasks()

  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-panel-bg)]">
        <section className="mx-auto grid w-full max-w-[var(--editable-container)] items-center gap-12 px-5 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
          <div className="min-w-0">
            <span className="gr-kicker text-[var(--slot4-accent)]">{copy.badge}</span>
            <h1 className="gr-display gr-balance mt-5 max-w-xl text-[2.4rem] font-semibold leading-[1.04] tracking-[-0.03em] sm:text-[3.2rem]">
              {copy.title}
            </h1>
            <p className="gr-serif mt-5 max-w-lg text-[1.0625rem] leading-8 text-[var(--slot4-muted-text)]">{copy.description}</p>

            <div className="mt-9 flex flex-wrap gap-2.5">
              {sections.map((task) => (
                <Link
                  key={task.key}
                  href={task.route}
                  className="rounded-full border border-[var(--editable-border-strong)] bg-[var(--slot4-surface-bg)] px-5 py-2.5 text-[13px] font-medium transition hover:-translate-y-0.5 hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]"
                >
                  Browse {task.label.toLowerCase()}
                </Link>
              ))}
            </div>
          </div>

          <div className="min-w-0 rounded-[1.6rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-7 shadow-[0_24px_60px_rgba(32,26,22,0.08)] sm:p-9">
            <h2 className="gr-display text-[1.7rem] font-semibold tracking-[-0.02em]">{copy.formTitle}</h2>
            <EditableLocalLoginForm />
            <p className="mt-7 border-t border-[var(--editable-border)] pt-6 text-sm text-[var(--slot4-muted-text)]">
              New here?{' '}
              <Link href="/signup" className="inline-flex items-center gap-1.5 font-semibold text-[var(--slot4-accent)] underline-offset-4 hover:underline">
                {copy.createCta} <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
