import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { globalContent } from '@/editable/content/global.content'
import { navTasks } from '@/editable/content/nav-visibility'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

const shell = 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-6 lg:px-8'

export default function AboutPage() {
  const about = pagesContent.about
  const sections = navTasks()

  return (
    <EditableSiteShell>
      <main>
        {/* Masthead. */}
        <section className="relative overflow-hidden [background:var(--gr-sunrise-soft)]">
          <span className="pointer-events-none absolute -right-24 -top-32 h-[26rem] w-[26rem] rounded-full border border-white/50" aria-hidden="true" />
          <div className={`${shell} relative py-16 sm:py-20`}>
            <span className="gr-kicker text-[var(--slot4-accent)]">{about.badge}</span>
            <h1 className="gr-display gr-balance mt-5 max-w-3xl text-[2.4rem] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[3.4rem]">
              {about.title}
            </h1>
            <p className="gr-serif mt-6 max-w-2xl text-[1.15rem] leading-[1.85] text-[var(--slot4-muted-text)]">
              {about.description}
            </p>
          </div>
        </section>

        {/* Story + values. */}
        <section className={`${shell} grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr]`}>
          <article className="min-w-0">
            <span className="gr-kicker text-[var(--slot4-accent)]">In short</span>
            <div className="mt-6 space-y-5">
              {about.paragraphs.map((paragraph, index) => (
                <p
                  key={paragraph}
                  className={`gr-serif text-[1.0625rem] leading-[1.9] ${
                    index === 0 ? 'text-[var(--slot4-page-text)]' : 'text-[var(--slot4-muted-text)]'
                  }`}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {sections.map((task) => (
                <Link
                  key={task.key}
                  href={task.route}
                  className="group flex items-center justify-between gap-4 rounded-[1.2rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-5 py-4 transition duration-500 hover:-translate-y-1 hover:border-[var(--slot4-accent)]"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-[15px] font-semibold">{task.label}</span>
                    <span className="mt-0.5 block truncate text-[13px] text-[var(--slot4-muted-text)]">{task.description}</span>
                  </span>
                  <ArrowUpRight className="gr-arrow-static h-4 w-4 shrink-0 text-[var(--slot4-accent)]" />
                </Link>
              ))}
            </div>
          </article>

          <aside className="min-w-0 space-y-4">
            {about.values.map((value, index) => (
              <div
                key={value.title}
                className="rounded-[1.4rem] border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-6 transition duration-500 hover:border-[var(--slot4-accent)] sm:p-7"
              >
                <span className="gr-display text-[1.2rem] font-semibold text-[var(--slot4-accent)]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h2 className="gr-display mt-3 text-[1.35rem] font-semibold tracking-[-0.02em]">{value.title}</h2>
                <p className="mt-3 text-[14.5px] leading-7 text-[var(--slot4-muted-text)]">{value.description}</p>
              </div>
            ))}
          </aside>
        </section>

        {/* Closing note. */}
        <section className="[background:var(--gr-ink-band)] text-[var(--slot4-dark-text)]">
          <div className={`${shell} flex flex-col items-start gap-6 py-14 sm:flex-row sm:items-center sm:justify-between sm:py-16`}>
            <div className="max-w-xl">
              <h2 className="gr-display text-[1.8rem] font-semibold leading-tight tracking-[-0.02em] sm:text-[2.2rem]">
                {globalContent.footer.tagline}
              </h2>
              <p className="mt-3 text-[15px] leading-7 text-white/60">{globalContent.footer.description}</p>
            </div>
            <Link
              href="/contact"
              className="group inline-flex shrink-0 items-center gap-3 rounded-full bg-[var(--slot4-accent-fill)] py-3 pl-7 pr-3 text-sm font-semibold text-white transition hover:brightness-105"
            >
              Get in touch
              <span className="gr-arrow h-9 w-9 bg-white text-[var(--slot4-accent)]">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
