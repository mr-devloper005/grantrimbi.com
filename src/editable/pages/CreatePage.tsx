'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, CheckCircle2, Lock, Send } from 'lucide-react'
import { type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { navTasks } from '@/editable/content/nav-visibility'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const shell = 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-6 lg:px-8'
const fieldClass =
  'w-full rounded-[1.1rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-5 py-3.5 text-[15px] font-medium text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-soft-muted-text)] focus:border-[var(--slot4-accent)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  // Entries are filed under the site's primary section; the picker is gone.
  const activeTask = navTasks()[0]
  const task = (activeTask?.key || 'article') as TaskKey
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="bg-[var(--slot4-panel-bg)]">
          <section className={`${shell} py-16 sm:py-24`}>
            <div className="mx-auto grid max-w-5xl gap-10 rounded-[1.75rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-7 shadow-[0_24px_60px_rgba(32,26,22,0.08)] md:grid-cols-[0.85fr_1.15fr] md:p-10">
              <div className="flex min-h-56 items-center justify-center rounded-[1.4rem] [background:var(--gr-sunrise)]">
                <Lock className="h-16 w-16 text-white/85" />
              </div>
              <div className="self-center">
                <span className="gr-kicker text-[var(--slot4-accent)]">{pagesContent.create.locked.badge}</span>
                <h1 className="gr-display gr-balance mt-4 text-[2.1rem] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[2.8rem]">
                  {pagesContent.create.locked.title}
                </h1>
                <p className="gr-serif mt-5 max-w-xl text-[1.0625rem] leading-8 text-[var(--slot4-muted-text)]">
                  {pagesContent.create.locked.description}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/login"
                    className="group inline-flex items-center gap-3 rounded-full bg-[var(--slot4-accent-fill)] py-3 pl-6 pr-3 text-sm font-semibold text-white transition hover:brightness-105"
                  >
                    Sign in
                    <span className="gr-arrow h-9 w-9 bg-white text-[var(--slot4-accent)]">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                  <Link
                    href="/signup"
                    className="inline-flex items-center rounded-full border border-[var(--editable-border-strong)] px-7 py-3 text-sm font-semibold transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]"
                  >
                    Create an account
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-panel-bg)]">
        <section className={`${shell} py-12 sm:py-16`}>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
              <span className="gr-kicker text-[var(--slot4-accent)]">{pagesContent.create.hero.badge}</span>
              <h1 className="gr-display gr-balance mt-4 text-[2.1rem] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[2.7rem]">
                {pagesContent.create.hero.title}
              </h1>
              <p className="gr-serif mt-5 max-w-md text-[1.0625rem] leading-8 text-[var(--slot4-muted-text)]">
                {pagesContent.create.hero.description}
              </p>
            </aside>

            <form onSubmit={submit} className="min-w-0 rounded-[1.6rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6 shadow-[0_20px_56px_rgba(32,26,22,0.07)] sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="gr-kicker text-[var(--slot4-accent)]">New {activeTask?.label || 'entry'}</span>
                  <h2 className="gr-display mt-2 text-[1.7rem] font-semibold tracking-[-0.02em]">{pagesContent.create.formTitle}</h2>
                </div>
                <span className="truncate rounded-full bg-[var(--slot4-panel-bg)] px-4 py-2 text-[12.5px] font-semibold text-[var(--slot4-muted-text)]">
                  {session.name}
                </span>
              </div>

              <div className="mt-7 grid gap-4">
                <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Entry title" required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" />
                  <input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Website or source URL" />
                </div>
                <input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="Featured image URL" />
                <textarea className={`${fieldClass} min-h-24 resize-y leading-7`} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Short summary" required />
                <textarea className={`${fieldClass} min-h-48 resize-y leading-7`} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Main content, details or description" required />
              </div>

              {created ? (
                <div className="mt-6 rounded-[1.1rem] bg-emerald-50 px-5 py-4 text-emerald-900">
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    <CheckCircle2 className="h-5 w-5" /> {pagesContent.create.successTitle}
                  </p>
                  <p className="mt-1 text-sm opacity-80">{created.title}</p>
                </div>
              ) : null}

              <button
                type="submit"
                className="group mt-7 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[var(--slot4-accent-fill)] py-4 pl-7 pr-3 text-sm font-semibold text-white transition hover:brightness-105"
              >
                <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
                <span className="gr-arrow h-9 w-9 bg-white text-[var(--slot4-accent)]">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </button>
            </form>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
