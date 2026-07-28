'use client'

import Link from 'next/link'
import { Bookmark, Building2, FileText, Image as ImageIcon, Mail, MapPin, Phone, Sparkles } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

const shell = 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-6 lg:px-8'

function getLanes(kind: ReturnType<typeof getProductKind>) {
  if (kind === 'directory') {
    return [
      { icon: Building2, title: 'Adding an entry', body: 'Publish a notice or listing, confirm the details, and get it live on the directory.' },
      { icon: Phone, title: 'Corrections and updates', body: 'Something out of date? Send the change and it will be applied to the entry.' },
      { icon: MapPin, title: 'Coverage requests', body: 'Looking for a category or area that is not represented yet? Tell us about it.' },
    ]
  }
  if (kind === 'editorial') {
    return [
      { icon: FileText, title: 'Submissions', body: 'Pitch pieces, columns and longer ideas that would suit the publication.' },
      { icon: Mail, title: 'Partnerships', body: 'Coordinate collaborations, features and issue-level campaigns.' },
      { icon: Sparkles, title: 'Contributor support', body: 'Questions about voice, formatting or the publishing workflow.' },
    ]
  }
  if (kind === 'visual') {
    return [
      { icon: ImageIcon, title: 'Creator collaborations', body: 'Discuss gallery launches, features and visual campaigns.' },
      { icon: Sparkles, title: 'Licensing and use', body: 'Ask about usage rights, commercial requests and visual partnerships.' },
      { icon: Mail, title: 'Media kits', body: 'Request decks, editorial support or feature placement.' },
    ]
  }
  return [
    { icon: Bookmark, title: 'Collection submissions', body: 'Suggest resources, boards and links that deserve a place in the library.' },
    { icon: Mail, title: 'Resource partnerships', body: 'Coordinate curation projects, reference pages and link programmes.' },
    { icon: Sparkles, title: 'Curator support', body: 'Help with organising shelves, collections and connected boards.' },
  ]
}

export default function ContactPage() {
  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const lanes = getLanes(productKind)
  const contact = pagesContent.contact

  return (
    <EditableSiteShell>
      <main>
        <section className="relative overflow-hidden [background:var(--gr-sunrise-soft)]">
          <span className="pointer-events-none absolute -left-24 -bottom-32 h-[24rem] w-[24rem] rounded-full border border-white/50" aria-hidden="true" />
          <div className={`${shell} relative py-14 sm:py-20`}>
            <span className="gr-kicker text-[var(--slot4-accent)]">{contact.eyebrow}</span>
            <h1 className="gr-display gr-balance mt-5 max-w-3xl text-[2.3rem] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[3.2rem]">
              {contact.title}
            </h1>
            <p className="gr-serif mt-6 max-w-2xl text-[1.0625rem] leading-8 text-[var(--slot4-muted-text)]">
              {contact.description}
            </p>
          </div>
        </section>

        <section className={`${shell} grid gap-10 py-14 sm:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:items-start`}>
          <div className="min-w-0 space-y-4 lg:sticky lg:top-28">
            {lanes.map((lane) => (
              <div
                key={lane.title}
                className="flex gap-4 rounded-[1.4rem] border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-6 transition duration-500 hover:border-[var(--slot4-accent)]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.8rem] bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                  <lane.icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h2 className="gr-display text-[1.2rem] font-semibold tracking-[-0.01em]">{lane.title}</h2>
                  <p className="mt-2 text-[14px] leading-7 text-[var(--slot4-muted-text)]">{lane.body}</p>
                </div>
              </div>
            ))}
            <p className="px-2 text-[13px] leading-6 text-[var(--slot4-muted-text)]">
              Prefer to browse first?{' '}
              <Link href="/search" className="font-semibold text-[var(--slot4-accent)] underline-offset-4 hover:underline">
                Search the directory
              </Link>
              .
            </p>
          </div>

          <div className="min-w-0 rounded-[1.6rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6 shadow-[0_20px_60px_rgba(32,26,22,0.07)] sm:p-9">
            <span className="gr-kicker text-[var(--slot4-accent)]">Message</span>
            <h2 className="gr-display mt-3 text-[1.9rem] font-semibold tracking-[-0.02em]">{contact.formTitle}</h2>
            <EditableContactLeadForm />
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
