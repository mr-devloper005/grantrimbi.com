import Link from 'next/link'
import { ArrowUpRight, ChevronLeft } from 'lucide-react'
import type { SitePost, SiteFeedPagination } from '@/lib/site-connector'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { ArticleListCard, CompactIndexCard, postHref } from '@/editable/cards/PostCards'
import { EmptyState } from '@/editable/components/EmptyStates'

/*
  Article-specific archive + detail shells. These keep the same exports and
  props they always had, restyled onto the warm editorial system so any route
  that reaches for them stays visually consistent with the rest of the site.
*/

export function EditableArticleArchive({
  posts,
  pagination,
  category = 'all',
  basePath = '/article',
}: {
  posts: SitePost[]
  pagination: SiteFeedPagination
  category?: string
  basePath?: string
}) {
  const voice = taskPageVoices.article
  const page = pagination?.page || 1
  const pageHref = (nextPage: number) =>
    `${basePath}?${new URLSearchParams({ ...(category && category !== 'all' ? { category } : {}), page: String(nextPage) }).toString()}`

  return (
    <main className={dc.shell.page}>
      <section className="border-b border-[var(--editable-border)] bg-[var(--slot4-panel-bg)]">
        <div className={`${dc.shell.wide} py-14 sm:py-20`}>
          <span className="gr-kicker text-[var(--slot4-accent)]">{voice.eyebrow}</span>
          <h1 className="gr-display gr-balance mt-5 max-w-3xl text-[2.4rem] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[3.3rem]">
            {voice.headline}
          </h1>
          <p className="gr-serif mt-5 max-w-2xl text-[1.0625rem] leading-8 text-[var(--slot4-muted-text)]">{voice.description}</p>

          <form action={basePath} className="mt-9 flex max-w-xl flex-col gap-3 sm:flex-row">
            <select
              name="category"
              defaultValue={category || 'all'}
              aria-label={voice.filterLabel}
              className="min-w-0 flex-1 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-5 py-3 text-sm font-medium outline-none transition focus:border-[var(--slot4-accent)]"
            >
              <option value="all">All categories</option>
              {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
            </select>
            <button className="rounded-full bg-[var(--slot4-accent-fill)] px-7 py-3 text-sm font-semibold text-white transition hover:brightness-105">
              Filter
            </button>
          </form>
        </div>
      </section>

      <section className={`${dc.shell.wide} ${dc.shell.sectionY}`}>
        {posts.length ? (
          <>
            <div className="grid gap-5 xl:grid-cols-2">
              {posts.slice(0, 6).map((post, index) => (
                <ArticleListCard
                  key={post.id || post.slug || index}
                  post={post}
                  href={postHref('article', post, basePath)}
                  index={index + (page - 1) * (pagination?.limit || 0)}
                />
              ))}
            </div>
            {posts.length > 6 ? (
              <div className="mt-10 rounded-[1.5rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6 sm:p-8">
                <span className="gr-kicker text-[var(--slot4-accent)]">Also on this page</span>
                <div className="mt-4">
                  {posts.slice(6).map((post, index) => (
                    <CompactIndexCard
                      key={post.id || post.slug || index}
                      post={post}
                      href={postHref('article', post, basePath)}
                      index={index + 6}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <EmptyState
            title="No articles found"
            description="Try another category, or head back to the full list of articles."
            actionLabel="All articles"
            actionHref={basePath}
          />
        )}

        <div className="mt-12 flex flex-wrap items-center justify-center gap-2.5">
          {pagination?.hasPrevPage ? (
            <Link href={pageHref(page - 1)} className="rounded-full border border-[var(--editable-border-strong)] px-5 py-2.5 text-[13px] font-semibold transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]">
              Previous
            </Link>
          ) : null}
          <span className="rounded-full bg-[var(--slot4-dark-bg)] px-5 py-2.5 text-[13px] font-semibold text-white">
            Page {page} of {pagination?.totalPages || 1}
          </span>
          {pagination?.hasNextPage ? (
            <Link href={pageHref(page + 1)} className="rounded-full border border-[var(--editable-border-strong)] px-5 py-2.5 text-[13px] font-semibold transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]">
              Next
            </Link>
          ) : null}
        </div>
      </section>
    </main>
  )
}

export function EditableArticleDetailShell({ slug, post }: { slug: string; post: SitePost | null }) {
  const voice = taskPageVoices.article
  return (
    <main className={dc.shell.page}>
      <section className="border-b border-[var(--editable-border)] bg-[var(--slot4-panel-bg)]">
        <div className={`${dc.shell.wide} py-12 sm:py-16`}>
          <Link
            href="/article"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-accent)]"
          >
            <ChevronLeft className="h-4 w-4" /> All articles
          </Link>
          <span className="gr-kicker mt-8 block text-[var(--slot4-accent)]">{voice.eyebrow}</span>
          <h1 className="gr-display gr-balance mt-4 max-w-4xl text-[2.4rem] font-semibold leading-[1.04] tracking-[-0.03em] sm:text-[3.3rem]">
            {post?.title || pagesContent.detailPages.article.fallbackTitle}
          </h1>
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-6 lg:px-8">
        <p className="gr-serif text-[1.0625rem] leading-[1.9] text-[var(--slot4-muted-text)]">
          {post?.summary || `Details for ${slug} will render through the editable detail page.`}
        </p>
        <Link
          href="/contact"
          className="group mt-9 inline-flex items-center gap-3 rounded-full bg-[var(--slot4-accent-fill)] py-3 pl-6 pr-3 text-sm font-semibold text-white transition hover:brightness-105"
        >
          Get in touch
          <span className="gr-arrow h-9 w-9 bg-white text-[var(--slot4-accent)]">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </Link>
      </section>
    </main>
  )
}
