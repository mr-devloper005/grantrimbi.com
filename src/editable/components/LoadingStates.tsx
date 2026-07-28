import { cn } from '@/lib/utils'

type LoadingStateProps = {
  label?: string
  className?: string
}

function PulseBlock({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-[0.9rem] bg-current/10', className)} />
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.28em] opacity-55">
      <span className="flex h-1.5 w-1.5 animate-pulse rounded-full bg-current" aria-hidden="true" />
      {children}
    </p>
  )
}

/* Skeletons mirror the real layouts: a masthead, a lead feature and a mixed grid. */
export function PageLoadingState({ label = 'Loading page', className }: LoadingStateProps) {
  return (
    <div
      className={cn('mx-auto w-full max-w-7xl px-5 py-14 sm:px-6 lg:px-8', className)}
      aria-live="polite"
      aria-busy="true"
    >
      <Label>{label}</Label>
      <PulseBlock className="mt-6 h-14 w-3/4 max-w-3xl rounded-[1.1rem]" />
      <PulseBlock className="mt-4 h-5 w-2/3 max-w-2xl" />
      <PulseBlock className="mt-10 h-64 w-full rounded-[1.5rem]" />
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="rounded-[1.5rem] border border-current/10 p-5">
            <PulseBlock className="h-40 w-full rounded-[1.1rem]" />
            <PulseBlock className="mt-5 h-5 w-4/5" />
            <PulseBlock className="mt-3 h-4 w-3/5" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function CardGridLoadingState({ count = 6, className }: LoadingStateProps & { count?: number }) {
  return (
    <div className={cn('grid gap-5 sm:grid-cols-2 lg:grid-cols-3', className)} aria-live="polite" aria-busy="true">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-[1.5rem] border border-current/10">
          <PulseBlock className="h-44 w-full rounded-none" />
          <div className="p-5">
            <PulseBlock className="h-4 w-24" />
            <PulseBlock className="mt-4 h-5 w-5/6" />
            <PulseBlock className="mt-3 h-4 w-2/3" />
            <PulseBlock className="mt-6 h-9 w-32 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function DetailLoadingState({ label = 'Loading detail', className }: LoadingStateProps) {
  return (
    <div
      className={cn('mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-8', className)}
      aria-live="polite"
      aria-busy="true"
    >
      <div>
        <Label>{label}</Label>
        <PulseBlock className="mt-6 h-12 w-4/5 rounded-[1.1rem]" />
        <PulseBlock className="mt-8 h-72 w-full rounded-[1.5rem]" />
        <PulseBlock className="mt-6 h-4 w-full" />
        <PulseBlock className="mt-3 h-4 w-5/6" />
        <PulseBlock className="mt-3 h-4 w-2/3" />
      </div>
      <div className="space-y-4">
        <PulseBlock className="h-52 w-full rounded-[1.5rem]" />
        <PulseBlock className="h-40 w-full rounded-[1.5rem]" />
      </div>
    </div>
  )
}
