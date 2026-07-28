import Link from 'next/link'
import { ArrowUpRight, Compass, SearchX } from 'lucide-react'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

/*
  Shared empty state. Colour comes from `currentColor` so the same component
  reads correctly on the warm site surfaces and inside the per-task themes.
*/
export function EmptyState({
  title = 'Nothing published here yet',
  description = 'New entries appear here automatically as soon as this section has published content.',
  actionLabel = 'Back to home',
  actionHref = '/',
  className,
}: EmptyStateProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-[1.5rem] border border-dashed border-current/20 bg-current/[0.03] px-6 py-14 text-center sm:px-10',
        className,
      )}
    >
      <span className="gr-dotfield pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-current/10">
          <SearchX className="h-6 w-6" />
        </div>
        <h2 className="gr-display mx-auto mt-6 max-w-xl text-[1.6rem] font-semibold leading-[1.15] tracking-[-0.02em] sm:text-[2rem]">
          {title}
        </h2>
        <p className="gr-serif mx-auto mt-3.5 max-w-xl text-[15px] leading-8 opacity-70">{description}</p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={actionHref}
            className="group inline-flex items-center gap-2.5 rounded-full border border-current/25 px-6 py-3 text-[13px] font-semibold transition duration-500 hover:border-current/60"
          >
            {actionLabel}
            <ArrowUpRight className="gr-arrow-static h-4 w-4" />
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-[13px] font-semibold opacity-70 transition hover:opacity-100"
          >
            <Compass className="h-4 w-4" /> Try a search instead
          </Link>
        </div>
      </div>
    </section>
  )
}

export function TaskEmptyState({ taskLabel = 'posts', className }: { taskLabel?: string; className?: string }) {
  return (
    <EmptyState
      className={className}
      title={`No ${taskLabel} available yet`}
      description={`Published ${taskLabel} appear here automatically. The page keeps its shape even while the section is quiet — try another category, or check back shortly.`}
      actionLabel="Explore the site"
      actionHref="/"
    />
  )
}

export function ContactSuccessState({ className }: { className?: string }) {
  return (
    <EmptyState
      className={className}
      title="Message received"
      description="Thanks for getting in touch. Your message has been saved and routed to the right place."
      actionLabel="Return home"
      actionHref="/"
    />
  )
}
