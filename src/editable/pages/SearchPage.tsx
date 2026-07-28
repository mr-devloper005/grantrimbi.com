import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { toPlainText } from '@/editable/cards/PostCards'
import { EmptyState } from '@/editable/components/EmptyStates'
import { pagesContent } from '@/editable/content/pages.content'
import { navTasks } from '@/editable/content/nav-visibility'

export const revalidate = 3

const shell = 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-6 lg:px-8'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? content.images.find((item) => typeof item === 'string') as string | undefined : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const summaryOf = (post: SitePost) => {
  const content = getContent(post)
  // compactRaw only trims — it does NOT strip HTML — so the raw payload could leak markup
  // into the card summary. Route every candidate through toPlainText so cards stay plain,
  // and fall back to the article body when there's no dedicated summary/description.
  return toPlainText(
    (typeof post.summary === 'string' && post.summary) ||
    compactRaw(content.description) ||
    compactRaw(content.excerpt) ||
    compactRaw(content.body) ||
    '',
  )
}

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  // Route from the task config (e.g. /classified/<slug>); buildPostUrl can fall
  // back to /posts for tasks missing from the enabled taskViews map, which 404s.
  const taskRoute = SITE_CONFIG.tasks.find((item) => item.key === task)?.route
  const href = `${taskRoute || `/${task || 'article'}`}/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const taskLabel = SITE_CONFIG.tasks.find((item) => item.key === task)?.label || 'Entry'
  const wide = index % 5 === 0

  return (
    <Link
      href={href}
      className={`group flex min-w-0 flex-col overflow-hidden rounded-[1.5rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_56px_rgba(32,26,22,0.12)] ${
        wide ? 'md:col-span-2 md:flex-row' : ''
      }`}
    >
      {image ? (
        <div className={`relative overflow-hidden bg-[var(--slot4-media-bg)] ${wide ? 'aspect-[16/10] md:aspect-auto md:w-[46%]' : 'aspect-[16/10]'}`}>
          <img
            src={image}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
          />
          <span className="absolute left-3.5 top-3.5 rounded-full bg-white/92 px-3 py-1 text-[11px] font-semibold text-[var(--slot4-page-text)] backdrop-blur">
            {taskLabel}
          </span>
        </div>
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col p-6">
        {!image ? (
          <span className="w-fit rounded-full bg-[var(--slot4-accent-soft)] px-3 py-1 text-[11px] font-semibold text-[var(--slot4-accent)]">
            {taskLabel}
          </span>
        ) : null}
        <h2 className={`gr-display ${image ? '' : 'mt-4'} line-clamp-3 text-[1.3rem] font-semibold leading-[1.2] tracking-[-0.02em] transition group-hover:text-[var(--slot4-accent)] ${wide ? 'sm:text-[1.7rem]' : ''}`}>
          {post.title || 'Untitled entry'}
        </h2>
        {summary ? <p className="mt-3 line-clamp-3 flex-1 text-[14px] leading-7 text-[var(--slot4-muted-text)]">{summary}</p> : null}
        <span className="mt-5 inline-flex items-center gap-2 text-[13px] font-semibold text-[var(--slot4-accent)]">
          Open entry <ArrowUpRight className="gr-arrow-static h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = navTasks()

  return (
    <EditableSiteShell>
      <main>
        {/* Search-first masthead. */}
        <section className="relative overflow-hidden [background:var(--gr-sunrise)]">
          <span className="pointer-events-none absolute -right-24 -top-32 h-[26rem] w-[26rem] rounded-full border border-white/30" aria-hidden="true" />
          <div className={`${shell} relative py-14 sm:py-20`}>
            <span className="gr-kicker text-[#7a4a24]">{pagesContent.search.hero.badge}</span>
            <h1 className="gr-display gr-balance mt-5 max-w-3xl text-[2.3rem] font-semibold leading-[1.05] tracking-[-0.03em] text-[#2a1a0e] sm:text-[3.2rem]">
              {pagesContent.search.hero.title}
            </h1>
            <p className="mt-5 max-w-2xl text-[1.0625rem] leading-8 text-[#4a3323]">{pagesContent.search.hero.description}</p>

            <form action="/search" className="mt-9 rounded-[1.6rem] bg-white/95 p-4 shadow-[0_20px_60px_rgba(90,50,20,0.18)] backdrop-blur sm:p-5">
              <input type="hidden" name="master" value="1" />
              <label className="flex items-center gap-3 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] px-5 py-3.5">
                <Search className="h-5 w-5 shrink-0 text-[var(--slot4-accent)]" />
                <input
                  name="q"
                  defaultValue={query}
                  placeholder={pagesContent.search.hero.placeholder}
                  aria-label="Search"
                  className="min-w-0 flex-1 bg-transparent text-[15px] font-medium outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
                />
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <label className="flex items-center gap-2.5 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] px-5 py-3">
                  <Filter className="h-4 w-4 shrink-0 text-[var(--slot4-accent)]" />
                  <input
                    name="category"
                    defaultValue={category}
                    placeholder="Category"
                    aria-label="Category"
                    className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
                  />
                </label>
                <select
                  name="task"
                  defaultValue={task}
                  aria-label="Content type"
                  className="rounded-full border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] px-5 py-3 text-sm font-medium outline-none"
                >
                  <option value="">All sections</option>
                  {enabledTasks.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
                </select>
                <button
                  type="submit"
                  className="rounded-full bg-[var(--slot4-accent-fill)] px-8 py-3 text-sm font-semibold text-white transition hover:brightness-105"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Results. */}
        <section className={`${shell} py-14 sm:py-16`}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
              <span className="gr-kicker text-[var(--slot4-accent)]">{results.length} {results.length === 1 ? 'result' : 'results'}</span>
              <h2 className="gr-display mt-3 max-w-2xl truncate text-[1.8rem] font-semibold tracking-[-0.02em] sm:text-[2.3rem]">
                {query ? `Results for “${query}”` : pagesContent.search.resultsTitle}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {enabledTasks.map((item) => (
                <Link
                  key={item.key}
                  href={`/search?task=${item.key}${query ? `&q=${encodeURIComponent(query)}` : ''}`}
                  className={`rounded-full border px-4 py-2 text-[13px] font-medium transition ${
                    task === item.key
                      ? 'border-[var(--slot4-accent)] bg-[var(--slot4-accent)] text-white'
                      : 'border-[var(--editable-border)] text-[var(--slot4-muted-text)] hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {results.length ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {results.map((post, index) => <SearchResultCard key={post.id || post.slug} post={post} index={index} />)}
            </div>
          ) : (
            <EmptyState
              className="mt-10"
              title="No matching entries"
              description="Nothing came back for that search. Try a broader keyword, a different category, or browse a section directly."
              actionLabel="Browse everything"
              actionHref={enabledTasks[0]?.route || '/'}
            />
          )}
        </section>
      </main>
    </EditableSiteShell>
  )
}
