import Link from 'next/link'
import { ArrowLeft, ArrowRight, Search } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { navTasks } from '@/editable/content/nav-visibility'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArchiveBoard } from '@/editable/components/EditableArchiveBoard'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

function categoryHref(basePath: string, slug: string) {
  return slug === 'all' ? basePath : `${basePath}?category=${slug}`
}

/** Compact page window: first, last and a couple either side of the current page. */
function pageWindow(current: number, total: number) {
  const pages = new Set<number>([1, total, current, current - 1, current + 1])
  return [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b)
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return (
    <TaskArchiveView
      task={task}
      posts={posts}
      pagination={pagination}
      category={category}
      basePath={basePath || taskConfig?.route || `/${task}`}
    />
  )
}

export function TaskArchiveView({
  task,
  posts,
  pagination,
  category,
  basePath,
}: {
  task: TaskKey
  posts: SitePost[]
  pagination: SiteFeedPagination
  category: string
  basePath: string
}) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const theme = getTaskTheme(task)
  const page = pagination?.page || 1
  const totalPages = Math.max(1, pagination?.totalPages || 1)
  const label = taskConfig?.label || task
  const categoryLabel =
    category === 'all' ? 'Everything' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category
  const chipCategories = CATEGORY_OPTIONS.slice(0, 14)
  const otherSections = navTasks().filter((item) => item.key !== task)

  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {/* Masthead. */}
        <header className="relative overflow-hidden border-b border-[var(--tk-line)] bg-[var(--tk-raised)]">
          <span
            className="pointer-events-none absolute -right-32 -top-40 h-[32rem] w-[32rem] rounded-full"
            style={{ background: `radial-gradient(circle, ${theme.glow}, transparent 68%)` }}
            aria-hidden="true"
          />
          <div className="relative mx-auto w-full max-w-[var(--editable-container)] px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[12.5px] font-medium text-[var(--tk-muted)] transition hover:text-[var(--tk-accent)]"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Home
            </Link>

            <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div className="min-w-0">
                <span className="gr-kicker text-[var(--tk-accent)]">{voice?.eyebrow || theme.kicker}</span>
                <h1 className="gr-display gr-balance mt-4 max-w-3xl text-[2.4rem] font-semibold leading-[1.05] tracking-[-0.028em] sm:text-[3.2rem] lg:text-[3.6rem]">
                  {voice?.headline || `Browse ${label}`}
                </h1>
                <p className="gr-serif mt-5 max-w-2xl text-[1.0625rem] leading-8 text-[var(--tk-muted)]">
                  {voice?.description || theme.note}
                </p>
                {voice?.chips?.length ? (
                  <div className="mt-7 flex flex-wrap gap-2">
                    {voice.chips.map((chip) => (
                      <span
                        key={chip}
                        className="rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-3.5 py-1.5 text-[12.5px] font-medium text-[var(--tk-muted)]"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="min-w-0 rounded-[1.35rem] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6 shadow-[0_18px_50px_rgba(32,26,22,0.07)]">
                <p className="gr-kicker text-[var(--tk-accent)]">Search everything</p>
                <form action="/search" className="mt-4 flex items-center gap-2 rounded-full border border-[var(--tk-line)] bg-[var(--tk-raised)] py-2 pl-5 pr-2">
                  <Search className="h-4 w-4 shrink-0 text-[var(--tk-accent)]" />
                  <input
                    name="q"
                    type="search"
                    placeholder={`Search ${label.toLowerCase()} and more`}
                    aria-label="Search the site"
                    className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-[var(--tk-muted)]"
                  />
                  <button
                    type="submit"
                    className="shrink-0 rounded-full bg-[var(--tk-accent)] px-5 py-2.5 text-[13px] font-semibold text-[var(--tk-on-accent)] transition hover:brightness-105"
                  >
                    Go
                  </button>
                </form>
                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-[var(--tk-muted)]">
                  <span>
                    <span className="font-semibold text-[var(--tk-text)]">{posts.length}</span> on this page
                  </span>
                  <span>
                    Page <span className="font-semibold text-[var(--tk-text)]">{page}</span> of {totalPages}
                  </span>
                  <span className="truncate">{categoryLabel}</span>
                </div>
                {otherSections.length ? (
                  <div className="mt-5 flex flex-wrap gap-2 border-t border-[var(--tk-line)] pt-5">
                    <span className="text-[12.5px] text-[var(--tk-muted)]">Also browse:</span>
                    {otherSections.map((item) => (
                      <Link
                        key={item.key}
                        href={item.route}
                        className="text-[12.5px] font-semibold text-[var(--tk-accent)] transition hover:underline"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </header>

        {/* Category chips. */}
        <nav aria-label="Categories" className="border-b border-[var(--tk-line)] bg-[var(--tk-surface)]">
          <div className="mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-6 lg:px-8">
            <div className="flex gap-2 overflow-x-auto py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {[{ name: 'All', slug: 'all' }, ...chipCategories].map((item) => {
                const active = category === item.slug
                return (
                  <Link
                    key={item.slug}
                    href={categoryHref(basePath, item.slug)}
                    className={`shrink-0 rounded-full border px-4 py-2 text-[13px] font-medium transition duration-300 ${
                      active
                        ? 'border-[var(--tk-accent)] bg-[var(--tk-accent)] text-[var(--tk-on-accent)]'
                        : 'border-[var(--tk-line)] text-[var(--tk-muted)] hover:-translate-y-0.5 hover:border-[var(--tk-accent)] hover:text-[var(--tk-accent)]'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        </nav>

        {/* Board. */}
        <section className="mx-auto w-full max-w-[var(--editable-container)] px-5 py-12 sm:px-6 sm:py-16 lg:px-8">
          <EditableArchiveBoard task={task} posts={posts} basePath={basePath} taskLabel={label} />

          {/* Pagination. */}
          {totalPages > 1 ? (
            <nav aria-label="Pagination" className="mt-14 flex flex-wrap items-center justify-center gap-2">
              {pagination?.hasPrevPage ? (
                <Link
                  href={pageHref(basePath, category, page - 1)}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-5 py-2.5 text-[13px] font-semibold transition hover:border-[var(--tk-accent)] hover:text-[var(--tk-accent)]"
                >
                  <ArrowLeft className="h-4 w-4" /> Previous
                </Link>
              ) : null}

              {pageWindow(page, totalPages).map((item, index, all) => {
                const previous = all[index - 1]
                const gap = previous && item - previous > 1
                return (
                  <span key={item} className="flex items-center gap-2">
                    {gap ? <span className="px-1 text-[var(--tk-muted)]">…</span> : null}
                    <Link
                      href={pageHref(basePath, category, item)}
                      aria-current={item === page ? 'page' : undefined}
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-semibold transition ${
                        item === page
                          ? 'bg-[var(--tk-accent)] text-[var(--tk-on-accent)]'
                          : 'border border-[var(--tk-line)] text-[var(--tk-muted)] hover:border-[var(--tk-accent)] hover:text-[var(--tk-accent)]'
                      }`}
                    >
                      {item}
                    </Link>
                  </span>
                )
              })}

              {pagination?.hasNextPage ? (
                <Link
                  href={pageHref(basePath, category, page + 1)}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-5 py-2.5 text-[13px] font-semibold transition hover:border-[var(--tk-accent)] hover:text-[var(--tk-accent)]"
                >
                  Next <ArrowRight className="h-4 w-4" />
                </Link>
              ) : null}
            </nav>
          ) : null}
        </section>
      </main>
    </EditableSiteShell>
  )
}
