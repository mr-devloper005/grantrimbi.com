'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, MessageSquare, RefreshCw, Search } from 'lucide-react'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EmptyState } from '@/editable/components/EmptyStates'

type StoredComment = {
  id: string
  name: string
  email?: string
  comment: string
  createdAt: string
  articleTitle?: string
  articleSlug?: string
}

const COMMENTS_PER_PAGE = 8
const COMMENT_KEY_PREFIX = 'slot4:article-comments:'
const shell = 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-6 lg:px-8'

const formatDate = (value: string) => {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value))
  } catch {
    return 'Just now'
  }
}

const readCommentsFromStorage = (): StoredComment[] => {
  const items: StoredComment[] = []
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index)
    if (!key?.startsWith(COMMENT_KEY_PREFIX)) continue
    const articleSlug = key.replace(COMMENT_KEY_PREFIX, '')
    try {
      const parsed = JSON.parse(window.localStorage.getItem(key) || '[]')
      if (!Array.isArray(parsed)) continue
      for (const item of parsed) {
        if (!item || typeof item !== 'object') continue
        if (typeof item.name !== 'string' || typeof item.comment !== 'string') continue
        items.push({
          id: typeof item.id === 'string' ? item.id : `${articleSlug}-${items.length}`,
          name: item.name,
          email: typeof item.email === 'string' ? item.email : undefined,
          comment: item.comment,
          createdAt: typeof item.createdAt === 'string' ? item.createdAt : new Date().toISOString(),
          articleTitle: typeof item.articleTitle === 'string' ? item.articleTitle : undefined,
          articleSlug: typeof item.articleSlug === 'string' ? item.articleSlug : articleSlug,
        })
      }
    } catch {
      // Ignore corrupted local comment records.
    }
  }

  return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export default function CommentsPage() {
  const [comments, setComments] = useState<StoredComment[]>([])
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    setComments(readCommentsFromStorage())
  }, [])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return comments
    return comments.filter((item) => {
      return [item.name, item.email, item.comment, item.articleTitle, item.articleSlug]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    })
  }, [comments, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / COMMENTS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const visibleComments = filtered.slice((currentPage - 1) * COMMENTS_PER_PAGE, currentPage * COMMENTS_PER_PAGE)

  function refreshComments() {
    setComments(readCommentsFromStorage())
    setPage(1)
  }

  return (
    <EditableSiteShell>
      <main>
        <section className="border-b border-[var(--editable-border)] bg-[var(--slot4-panel-bg)]">
          <div className={`${shell} py-12 sm:py-16`}>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <span className="gr-kicker inline-flex items-center gap-2 text-[var(--slot4-accent)]">
                  <MessageSquare className="h-3.5 w-3.5" /> Saved locally
                </span>
                <h1 className="gr-display gr-balance mt-4 text-[2.2rem] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[3rem]">
                  Your notes and comments
                </h1>
                <p className="gr-serif mt-4 max-w-2xl text-[1.0625rem] leading-8 text-[var(--slot4-muted-text)]">
                  Everything you have written on entry pages from this browser, gathered in one place.
                </p>
              </div>
              <button
                type="button"
                onClick={refreshComments}
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[var(--editable-border-strong)] bg-[var(--slot4-surface-bg)] px-5 py-2.5 text-[13px] font-semibold transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]"
              >
                <RefreshCw className="h-4 w-4" /> Refresh
              </button>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex w-full items-center gap-3 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-5 py-3 sm:max-w-md">
                <Search className="h-4 w-4 shrink-0 text-[var(--slot4-accent)]" />
                <input
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value)
                    setPage(1)
                  }}
                  placeholder="Search your comments…"
                  aria-label="Search comments"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
                />
              </label>
              <p className="text-[13px] text-[var(--slot4-muted-text)]">
                {filtered.length} comment{filtered.length === 1 ? '' : 's'} found
              </p>
            </div>
          </div>
        </section>

        <section className={`${shell} py-12 sm:py-16`}>
          {visibleComments.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {visibleComments.map((item) => (
                <article
                  key={`${item.articleSlug}-${item.id}`}
                  className="rounded-[1.4rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6 transition duration-500 hover:-translate-y-1 hover:border-[var(--slot4-accent)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="gr-display truncate text-[1.05rem] font-semibold">{item.name}</p>
                      <p className="mt-1 text-[12px] text-[var(--slot4-muted-text)]">{formatDate(item.createdAt)}</p>
                    </div>
                    {item.articleSlug ? (
                      <Link
                        href={`/article/${item.articleSlug}`}
                        className="inline-flex shrink-0 items-center gap-1.5 text-[12.5px] font-semibold text-[var(--slot4-accent)] hover:underline"
                      >
                        Open <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    ) : null}
                  </div>
                  {item.articleTitle ? (
                    <p className="mt-4 truncate text-[13px] font-semibold text-[var(--slot4-muted-text)]">{item.articleTitle}</p>
                  ) : null}
                  <p className="gr-break mt-3 text-[14.5px] leading-7 text-[var(--slot4-page-text)]">{item.comment}</p>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No comments yet"
              description="Add a comment on any entry page and it will be collected here for you."
              actionLabel="Browse entries"
              actionHref="/"
            />
          )}

          {filtered.length > COMMENTS_PER_PAGE ? (
            <div className="mt-10 flex flex-wrap items-center justify-between gap-3 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-6 py-4 text-[13px] text-[var(--slot4-muted-text)]">
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-full border border-[var(--editable-border)] px-5 py-2 font-semibold transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)] disabled:opacity-40"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="rounded-full border border-[var(--editable-border)] px-5 py-2 font-semibold transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)] disabled:opacity-40"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                >
                  Next
                </button>
              </div>
            </div>
          ) : null}
        </section>
      </main>
    </EditableSiteShell>
  )
}
