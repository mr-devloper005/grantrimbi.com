import type { Metadata } from 'next'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Sign up', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  const copy = pagesContent.auth.signup
  const perks = pagesContent.home.intro.sidePoints.slice(0, 3)

  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-panel-bg)]">
        <section className="mx-auto grid w-full max-w-[var(--editable-container)] items-center gap-12 px-5 py-14 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-20">
          <div className="order-2 min-w-0 rounded-[1.6rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-7 shadow-[0_24px_60px_rgba(32,26,22,0.08)] sm:p-9 lg:order-1">
            <h1 className="gr-display text-[1.7rem] font-semibold tracking-[-0.02em]">{copy.formTitle}</h1>
            <EditableLocalSignupForm />
            <p className="mt-7 border-t border-[var(--editable-border)] pt-6 text-sm text-[var(--slot4-muted-text)]">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-[var(--slot4-accent)] underline-offset-4 hover:underline">
                {copy.loginCta}
              </Link>
            </p>
          </div>

          <div className="order-1 min-w-0 lg:order-2">
            <span className="gr-kicker text-[var(--slot4-accent)]">{copy.badge}</span>
            <h2 className="gr-display gr-balance mt-5 max-w-xl text-[2.4rem] font-semibold leading-[1.04] tracking-[-0.03em] sm:text-[3.1rem]">
              {copy.title}
            </h2>
            <p className="gr-serif mt-5 max-w-lg text-[1.0625rem] leading-8 text-[var(--slot4-muted-text)]">{copy.description}</p>
            <ul className="mt-8 grid gap-3">
              {perks.map((perk) => (
                <li key={perk} className="flex items-start gap-3 text-[14.5px] leading-7 text-[var(--slot4-page-text)]">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                    <Check className="h-3 w-3" />
                  </span>
                  {perk}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
