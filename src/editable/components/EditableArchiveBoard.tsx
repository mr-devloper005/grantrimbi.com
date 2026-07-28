'use client'

import { useMemo, useState } from 'react'
import { LayoutGrid, Rows3, Search, SlidersHorizontal, X } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import {
  AccentNoteCard, ArticleListCard, CompactIndexCard, EditorialFeatureCard, ImageFirstCard,
  NoticeCard, PersonCard, RailPostCard, getEditableCategory, getEditableExcerpt, getEditableField,
} from '@/editable/cards/PostCards'
import { TaskEmptyState } from '@/editable/components/EmptyStates'

type SortKey = 'newest' | 'title' | 'price'
type ViewKey = 'gallery' | 'list'

const SORTS: Array<{ key: SortKey; label: string }> = [
  { key: 'newest', label: 'Newest' },
  { key: 'title', label: 'A–Z' },
  { key: 'price', label: 'Price' },
]

const numericPrice = (post: SitePost) => {
  const raw = getEditableField(post, ['price', 'amount', 'budget'])
  const parsed = Number(String(raw).replace(/[^0-9.]/g, ''))
  return Number.isFinite(parsed) && parsed > 0 ? parsed : Number.POSITIVE_INFINITY
}

const timeOf = (post: SitePost) => {
  const value = post.publishedAt || post.createdAt || post.updatedAt || ''
  const parsed = new Date(value).getTime()
  return Number.isFinite(parsed) ? parsed : 0
}

const haystack = (post: SitePost) =>
  [post.title, getEditableCategory(post), getEditableExcerpt(post, 260), (post.tags || []).join(' ')]
    .join(' ')
    .toLowerCase()

/*
  Client board for a task archive.

  The server still fetches and paginates; this only refines what is already on
  the page — instant text filter, sort order and a gallery/list switch — and it
  chooses a different card style depending on the task and the position in the
  grid, so a page never reads as one repeated tile.
*/
export function EditableArchiveBoard({
  task,
  posts,
  basePath,
  taskLabel,
}: {
  task: TaskKey
  posts: SitePost[]
  basePath: string
  taskLabel: string
}) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('newest')
  const [view, setView] = useState<ViewKey>('gallery')

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase()
    const filtered = term ? posts.filter((post) => haystack(post).includes(term)) : [...posts]
    if (sort === 'title') filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
    if (sort === 'price') filtered.sort((a, b) => numericPrice(a) - numericPrice(b))
    if (sort === 'newest') filtered.sort((a, b) => timeOf(b) - timeOf(a))
    return filtered
  }, [posts, query, sort])

  const href = (post: SitePost) => `${basePath}/${post.slug}`

  return (
    <div>
      {/* Toolbar. */}
      <div className="flex flex-col gap-4 rounded-[1.35rem] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-3 sm:flex-row sm:items-center sm:gap-3">
        <label className="flex min-w-0 flex-1 items-center gap-3 rounded-full bg-[var(--tk-raised)] px-5 py-3">
          <Search className="h-4 w-4 shrink-0 text-[var(--tk-accent)]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Filter these ${taskLabel.toLowerCase()}…`}
            aria-label={`Filter ${taskLabel}`}
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--tk-muted)]"
          />
          {query ? (
            <button type="button" onClick={() => setQuery('')} aria-label="Clear filter" className="shrink-0 text-[var(--tk-muted)] transition hover:text-[var(--tk-accent)]">
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </label>

        <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <span className="hidden shrink-0 items-center gap-1.5 pl-1 pr-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--tk-muted)] sm:inline-flex">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Sort
          </span>
          {SORTS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setSort(item.key)}
              className={`shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition ${
                sort === item.key
                  ? 'bg-[var(--tk-accent)] text-[var(--tk-on-accent)]'
                  : 'text-[var(--tk-muted)] hover:bg-[var(--tk-raised)] hover:text-[var(--tk-text)]'
              }`}
            >
              {item.label}
            </button>
          ))}

          <span className="mx-1 hidden h-6 w-px shrink-0 bg-[var(--tk-line)] sm:block" />

          <button
            type="button"
            onClick={() => setView('gallery')}
            aria-label="Gallery view"
            aria-pressed={view === 'gallery'}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${
              view === 'gallery' ? 'bg-[var(--tk-raised)] text-[var(--tk-accent)]' : 'text-[var(--tk-muted)] hover:text-[var(--tk-text)]'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setView('list')}
            aria-label="List view"
            aria-pressed={view === 'list'}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${
              view === 'list' ? 'bg-[var(--tk-raised)] text-[var(--tk-accent)]' : 'text-[var(--tk-muted)] hover:text-[var(--tk-text)]'
            }`}
          >
            <Rows3 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="mt-4 text-[13px] text-[var(--tk-muted)]">
        Showing <span className="font-semibold text-[var(--tk-text)]">{visible.length}</span> of {posts.length}{' '}
        {posts.length === 1 ? 'entry' : 'entries'}
        {query ? ` matching “${query}”` : ''}
      </p>

      {/* Results. */}
      {!visible.length ? (
        <TaskEmptyState taskLabel={taskLabel.toLowerCase()} className="mt-8" />
      ) : view === 'list' ? (
        <div className="mt-8 grid gap-5 xl:grid-cols-2">
          {visible.map((post, index) => (
            <ArticleListCard key={post.id || post.slug || index} post={post} href={href(post)} index={index} />
          ))}
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {/* Lead feature. */}
          {visible[0] ? (
            <EditorialFeatureCard post={visible[0]} href={href(visible[0])} label={`Latest ${taskLabel.toLowerCase()}`} />
          ) : null}

          {/* Mixed grid. */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.slice(1).map((post, offset) => {
              const index = offset + 1
              const key = post.id || post.slug || index
              const slot = offset % 7

              if (slot === 3) return <AccentNoteCard key={key} post={post} href={href(post)} />
              if (slot === 5) return <ImageFirstCard key={key} post={post} href={href(post)} />
              if (task === 'profile') return <PersonCard key={key} post={post} href={href(post)} />
              if (task === 'classified') return <NoticeCard key={key} post={post} href={href(post)} />
              return <RailPostCard key={key} post={post} href={href(post)} index={index} />
            })}
          </div>

          {/* Ruled index of everything on the page, for quick scanning. */}
          {visible.length > 6 ? (
            <div className="rounded-[1.35rem] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6 sm:p-8">
              <p className="gr-kicker text-[var(--tk-accent)]">On this page</p>
              <div className="mt-4">
                {visible.slice(0, 10).map((post, index) => (
                  <CompactIndexCard key={`index-${post.id || post.slug || index}`} post={post} href={href(post)} index={index} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
