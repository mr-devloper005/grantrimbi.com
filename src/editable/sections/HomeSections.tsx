import Link from 'next/link'
import {
  ArrowUpRight, Compass, LayoutGrid, Megaphone, Search, Sparkles, UserRound,
} from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { navTasks } from '@/editable/content/nav-visibility'
import {
  AccentNoteCard, ArticleListCard, CompactIndexCard, EditorialFeatureCard, ImageFirstCard,
  NoticeCard, PersonCard, RailPostCard, getEditableCategory, getEditableExcerpt,
  getEditablePostImage, hasRealImage, postHref,
} from '@/editable/cards/PostCards'
import { EditableHeroCollage } from '@/editable/sections/EditableHeroCollage'
import { EditableCountUp } from '@/editable/sections/EditableCountUp'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-6 lg:px-8'

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post?.slug || post?.id || post?.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

function poolOf({ posts, timeSections }: Pick<HomeSectionProps, 'posts' | 'timeSections'>) {
  return dedupePosts([...(posts || []), ...(timeSections || []).flatMap((section) => section?.posts || [])])
}

/** Newest real artwork, de-duplicated, placeholders dropped. */
function latestPostImages(posts: SitePost[], max = 6) {
  const seen = new Set<string>()
  const out: string[] = []
  for (const post of posts) {
    if (!hasRealImage(post)) continue
    const img = getEditablePostImage(post)
    if (seen.has(img)) continue
    seen.add(img)
    out.push(img)
    if (out.length >= max) break
  }
  return out
}

/** Real categories found in the feed, so the chips always mean something. */
function liveCategories(posts: SitePost[], max = 6) {
  const seen = new Set<string>()
  const out: string[] = []
  for (const post of posts) {
    const category = getEditableCategory(post)
    const key = category.trim().toLowerCase()
    if (!key || key === 'featured' || seen.has(key)) continue
    seen.add(key)
    out.push(category.trim())
    if (out.length >= max) break
  }
  return out
}

/** Picks the card style that suits the section a post belongs to. */
function TaskCard({ task, post, href, index }: { task: TaskKey; post: SitePost; href: string; index: number }) {
  if (task === 'profile') return <PersonCard post={post} href={href} />
  if (task === 'classified') return <NoticeCard post={post} href={href} />
  return <RailPostCard post={post} href={href} index={index} />
}

function SectionHead({
  eyebrow,
  title,
  description,
  href,
  linkLabel = 'View all',
  align = 'left',
}: {
  eyebrow: string
  title: string
  description?: string
  href?: string
  linkLabel?: string
  align?: 'left' | 'center'
}) {
  return (
    <div
      className={`flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between ${
        align === 'center' ? 'sm:flex-col sm:items-center sm:text-center' : ''
      }`}
    >
      <div className={align === 'center' ? 'max-w-2xl' : 'max-w-2xl'}>
        <span className="gr-kicker text-[var(--slot4-accent)]">{eyebrow}</span>
        <h2 className="gr-display gr-balance mt-3.5 text-[2rem] font-semibold leading-[1.08] tracking-[-0.02em] sm:text-[2.6rem]">
          {title}
        </h2>
        {description ? <p className="gr-serif mt-4 text-[1.0625rem] leading-8 text-[var(--slot4-muted-text)]">{description}</p> : null}
      </div>
      {href ? (
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-2.5 rounded-full border border-[var(--editable-border-strong)] px-5 py-2.5 text-[13px] font-semibold text-[var(--slot4-page-text)] transition duration-500 hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]"
        >
          {linkLabel}
          <ArrowUpRight className="gr-arrow-static h-4 w-4 text-[var(--slot4-accent)]" />
        </Link>
      ) : null}
    </div>
  )
}

/* ============================================================== 1. HERO === */

export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = poolOf({ posts, timeSections })
  const heroImages = latestPostImages(pool)
  const heroTitle = pagesContent.home.hero.title?.join(' ') || `Everything worth finding on ${SITE_CONFIG.name}`
  const overlapCards = pool.slice(0, 3)
  const chips = liveCategories(pool, 5)
  const sections = navTasks()
  const marquee = [...pagesContent.home.marquee, ...chips]

  return (
    <section className="relative">
      {/* Sunrise band. */}
      <div className={`relative overflow-hidden [background:var(--gr-sunrise)] ${overlapCards.length ? 'pb-36 sm:pb-44' : 'pb-16 sm:pb-20'}`}>
        <span className="pointer-events-none absolute -right-24 -top-24 h-[26rem] w-[26rem] rounded-full border border-white/25" aria-hidden="true" />
        <span className="pointer-events-none absolute -bottom-40 -left-24 h-[30rem] w-[30rem] rounded-full border border-white/20" aria-hidden="true" />

        <div className={`${container} relative grid items-center gap-12 py-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:py-20`}>
          <div className="min-w-0">
            <p className="gr-serif text-[1.05rem] italic leading-7 text-[#5c3418]">
              {pagesContent.home.hero.badge}
            </p>
            <h1 className="gr-display gr-balance mt-4 max-w-[15ch] text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.028em] text-[#2a1a0e] sm:text-[3.6rem] lg:text-[4.15rem]">
              {heroTitle}
            </h1>
            <p className="mt-6 max-w-xl text-[1.0625rem] leading-8 text-[#4a3323]">
              {pagesContent.home.hero.description}
            </p>

            <form
              action="/search"
              className="mt-9 flex w-full max-w-xl items-center gap-2 rounded-full bg-white/95 p-2 pl-6 shadow-[0_18px_50px_rgba(90,50,20,0.20)] backdrop-blur"
            >
              <Search className="h-5 w-5 shrink-0 text-[var(--slot4-accent)]" />
              <input
                name="q"
                type="search"
                placeholder={pagesContent.home.hero.searchPlaceholder}
                aria-label="Search the directory"
                className="min-w-0 flex-1 bg-transparent py-3 text-[15px] outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
              />
              <button
                type="submit"
                className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] py-3 pl-5 pr-3 text-[13.5px] font-semibold text-white transition hover:brightness-105"
              >
                <span className="hidden sm:inline">Search</span>
                <span className="gr-arrow h-8 w-8 bg-white text-[var(--slot4-accent)]">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </button>
            </form>

            <div className="mt-7 flex flex-wrap items-center gap-2.5">
              <Link
                href={primaryRoute}
                className="inline-flex items-center gap-2 rounded-full bg-[#2a1a0e] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:opacity-90"
              >
                {pagesContent.home.hero.primaryCta.label}
              </Link>
              {sections
                .filter((task) => task.route !== primaryRoute)
                .slice(0, 3)
                .map((task) => (
                  <Link
                    key={task.key}
                    href={task.route}
                    className="inline-flex items-center rounded-full border border-[#2a1a0e]/25 px-5 py-2.5 text-[13px] font-semibold text-[#2a1a0e] transition hover:border-[#2a1a0e]/60 hover:bg-white/40"
                  >
                    {task.label}
                  </Link>
                ))}
            </div>
          </div>

          <div className="flex min-w-0 justify-center lg:justify-end">
            <EditableHeroCollage images={heroImages} />
          </div>
        </div>
      </div>

      {/* Overlapping image-first cards. */}
      {overlapCards.length ? (
        <div className={`${container} relative z-10 -mt-28 sm:-mt-32`}>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {overlapCards.map((post, index) => (
              <div key={post.id || post.slug || index} className={index === 2 ? 'sm:col-span-2 lg:col-span-1' : ''}>
                <ImageFirstCard post={post} href={postHref(primaryTask, post, primaryRoute)} />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Rolling topic strip. */}
      {marquee.length ? (
        <div className="gr-marquee-shell mt-14 overflow-hidden border-y border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] py-4 sm:mt-20">
          <div className="gr-marquee-track">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={copy === 1}>
                {marquee.map((item, index) => (
                  <span
                    key={`${copy}-${item}-${index}`}
                    className="inline-flex items-center gap-3 whitespace-nowrap text-[13px] font-medium text-[var(--slot4-muted-text)]"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-[var(--slot4-accent)]" />
                    {item}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}

/* ================================================ 2. LATEST & NOTEWORTHY === */

export function EditableStoryRail({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = poolOf({ posts, timeSections })
  const items = pool.slice(0, 4)
  if (!items.length) return null

  return (
    <section className="bg-[var(--slot4-page-bg)]">
      <div className={`${container} gr-reveal py-16 sm:py-20 lg:py-24`}>
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <span className="gr-kicker text-[var(--slot4-accent)]">{pagesContent.home.hero.featureCardBadge}</span>
            <h2 className="gr-display gr-balance mt-4 text-[2.1rem] font-semibold leading-[1.06] tracking-[-0.025em] sm:text-[2.9rem]">
              Latest and
              <br className="hidden sm:block" /> noteworthy
            </h2>
            <p className="gr-serif mt-5 max-w-md text-[1.0625rem] leading-8 text-[var(--slot4-muted-text)]">
              {pagesContent.home.hero.featureCardDescription}
            </p>
            <Link
              href={primaryRoute}
              className="group mt-8 inline-flex items-center gap-3 rounded-full bg-[var(--slot4-accent-fill)] py-2.5 pl-6 pr-2.5 text-[13.5px] font-semibold text-white transition hover:brightness-105"
            >
              Browse {taskLabel(primaryTask).toLowerCase()}
              <span className="gr-arrow h-8 w-8 bg-white text-[var(--slot4-accent)]">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {items.map((post, index) => {
              const href = postHref(primaryTask, post, primaryRoute)
              const key = post.id || post.slug || index
              // Alternate photograph tiles with solid type tiles.
              if (index === 1 || index === 2) return <AccentNoteCard key={key} post={post} href={href} />
              return <ImageFirstCard key={key} post={post} href={href} />
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ================================================= 3. EDITORIAL + STEPS === */

export function EditableMagazineSplit({ primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = poolOf({ posts, timeSections })
  const feature = pool.find((post) => hasRealImage(post)) || pool[0]
  const intro = pagesContent.home.intro
  const steps = pagesContent.home.steps

  return (
    <>
      <section className="bg-[var(--gr-stone)]">
        <div className={`${container} gr-reveal grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:py-24`}>
          <div className="min-w-0">
            <span className="gr-kicker text-[var(--slot4-accent)]">{intro.badge}</span>
            <h2 className="gr-display gr-balance mt-4 max-w-[16ch] text-[2.2rem] font-semibold leading-[1.06] tracking-[-0.025em] sm:text-[3rem]">
              {intro.title}
            </h2>
            <div className="mt-6 space-y-4">
              {intro.paragraphs.slice(0, 2).map((paragraph, index) => (
                <p
                  key={paragraph}
                  className={`gr-serif max-w-xl text-[1.0625rem] leading-8 ${
                    index === 0 ? 'text-[var(--slot4-page-text)]' : 'text-[var(--slot4-muted-text)]'
                  }`}
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <Link
              href={intro.primaryLink.href || primaryRoute}
              className="group mt-8 inline-flex items-center gap-3 rounded-full bg-[var(--slot4-accent-fill)] py-2.5 pl-6 pr-2.5 text-[13.5px] font-semibold text-white transition hover:brightness-105"
            >
              {intro.primaryLink.label}
              <span className="gr-arrow h-8 w-8 bg-white text-[var(--slot4-accent)]">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </div>

          <div className="flex min-w-0 justify-center lg:justify-end">
            <div className="relative aspect-square w-full max-w-[400px] lg:max-w-[440px]">
              <span className="absolute -inset-4 rounded-full border border-[var(--editable-border-strong)]" aria-hidden="true" />
              <div className="relative h-full w-full overflow-hidden rounded-full bg-[var(--slot4-media-bg)] shadow-[0_26px_70px_rgba(32,26,22,0.16)]">
                <img
                  src={getEditablePostImage(feature)}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-[1200ms] hover:scale-105"
                />
              </div>
              {feature ? (
                <div className="absolute -bottom-2 left-0 max-w-[16rem] rounded-[1.15rem] border border-[var(--editable-border)] bg-white p-4 shadow-[0_16px_40px_rgba(32,26,22,0.12)] sm:-left-6">
                  <span className="gr-kicker text-[var(--slot4-accent)]">{getEditableCategory(feature)}</span>
                  <p className="gr-display mt-2 line-clamp-2 text-[15px] font-semibold leading-snug">{feature.title || 'Latest entry'}</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Dark "getting started" band. */}
      <section className="[background:var(--gr-ink-band)] text-[var(--slot4-dark-text)]">
        <div className={`${container} py-14 sm:py-16`}>
          <p className="gr-kicker text-white/45">{steps.eyebrow}</p>
          <div className="mt-8 grid gap-10 border-t border-white/10 pt-10 md:grid-cols-2">
            {steps.items.map((item, index) => (
              <div key={item.title} className="flex gap-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.8rem] bg-[var(--slot4-accent-fill)]/20 text-[#e9a075]">
                  {index === 0 ? <Megaphone className="h-5 w-5" /> : <UserRound className="h-5 w-5" />}
                </span>
                <div className="min-w-0">
                  <h3 className="gr-display text-[1.35rem] font-semibold leading-snug">{item.title}</h3>
                  <p className="mt-2.5 max-w-md text-[14.5px] leading-7 text-white/60">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

/* ================================================== 4. TOPIC COLLECTIONS === */

const sectionCopy: Record<string, { eyebrow: string; title: string; description: string }> = {
  spotlight: {
    eyebrow: 'This week',
    title: 'Published in the last seven days',
    description: 'The most recent entries to arrive in the directory, newest first.',
  },
  browse: {
    eyebrow: 'Gathering interest',
    title: 'Drawing attention this month',
    description: 'Entries people keep returning to, pulled from across every category.',
  },
  index: {
    eyebrow: 'From the archive',
    title: 'Still worth a look',
    description: 'Older entries that have held up — quietly useful long after they were posted.',
  },
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections =
    timeSections?.length
      ? timeSections
      : ([
          { key: 'spotlight', posts: posts.slice(0, 8), href: primaryRoute },
          { key: 'browse', posts: posts.slice(8, 16), href: primaryRoute },
          { key: 'index', posts: posts.slice(16, 24), href: primaryRoute },
        ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])

  const visible = sections.filter((section) => section?.posts?.length)
  if (!visible.length) return null

  const quoteSource = poolOf({ posts, timeSections })[0]

  return (
    <>
      {visible.map((section, blockIndex) => {
        const copy = sectionCopy[section.key] || {
          eyebrow: 'Discover',
          title: 'More to explore',
          description: 'A further selection from across the directory.',
        }
        const href = section.href || primaryRoute
        const items = section.posts.filter(Boolean)
        const layout = blockIndex % 3

        return (
          <section
            key={section.key}
            className={blockIndex % 2 === 0 ? 'bg-[var(--slot4-page-bg)]' : 'bg-[var(--slot4-panel-bg)]'}
          >
            <div className={`${container} gr-reveal py-16 sm:py-20`}>
              <SectionHead eyebrow={copy.eyebrow} title={copy.title} description={copy.description} href={href} />

              {/* Layout A — one feature beside a ruled index. */}
              {layout === 0 ? (
                <div className="mt-10 grid gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:gap-12">
                  <EditorialFeatureCard
                    post={items[0]}
                    href={postHref(primaryTask, items[0], primaryRoute)}
                    label={copy.eyebrow}
                  />
                  <div className="min-w-0">
                    {items.slice(1, 6).map((post, index) => (
                      <CompactIndexCard
                        key={post.id || post.slug || index}
                        post={post}
                        href={postHref(primaryTask, post, primaryRoute)}
                        index={index}
                      />
                    ))}
                    {items.length <= 1 ? (
                      <p className="pt-4 text-sm text-[var(--slot4-muted-text)]">More entries will appear here as they are published.</p>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {/* Layout B — wide horizontal reads. */}
              {layout === 1 ? (
                <div className="mt-10 grid gap-5 xl:grid-cols-2">
                  {items.slice(0, 4).map((post, index) => (
                    <ArticleListCard
                      key={post.id || post.slug || index}
                      post={post}
                      href={postHref(primaryTask, post, primaryRoute)}
                      index={index}
                    />
                  ))}
                </div>
              ) : null}

              {/* Layout C — a compact grid in the section's own card style. */}
              {layout === 2 ? (
                <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {items.slice(0, 8).map((post, index) => (
                    <TaskCard
                      key={post.id || post.slug || index}
                      task={primaryTask}
                      post={post}
                      href={postHref(primaryTask, post, primaryRoute)}
                      index={index}
                    />
                  ))}
                </div>
              ) : null}
            </div>

            {/* Editorial pull quote, once, between blocks. */}
            {blockIndex === 0 && quoteSource ? (
              <div className="border-t border-[var(--editable-border)]">
                <div className={`${container} grid gap-8 py-14 sm:py-16 lg:grid-cols-[0.9fr_1.1fr]`}>
                  <div className="gr-quote">
                    <p className="gr-serif max-w-lg text-[1.35rem] leading-[1.65] text-[var(--slot4-page-text)] sm:text-[1.6rem]">
                      {getEditableExcerpt(quoteSource, 190) || pagesContent.home.intro.paragraphs[0]}
                    </p>
                    <p className="mt-5 text-[12px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-soft-muted-text)]">
                      From “{quoteSource.title || 'a recent entry'}”
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {pagesContent.home.intro.sidePoints.slice(0, 4).map((point, index) => (
                      <div
                        key={point}
                        className="rounded-[1.2rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-5"
                      >
                        <span className="gr-display text-[1.1rem] font-semibold text-[var(--slot4-accent)]">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <p className="mt-2 text-[13.5px] leading-6 text-[var(--slot4-muted-text)]">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </section>
        )
      })}
    </>
  )
}

/* ================================================== 5. COVERAGE + CLOSE === */

export function EditableHomeCta({ posts = [], timeSections = [] }: Partial<HomeSectionProps> = {}) {
  const pool = poolOf({ posts, timeSections })
  const categories = liveCategories(pool, 8)
  const sections = navTasks()
  const coverage = pagesContent.home.coverage
  const cta = pagesContent.home.cta

  const stats = [
    { value: pool.length, suffix: '+', label: 'entries published' },
    { value: categories.length || sections.length, suffix: '', label: 'active categories' },
    { value: sections.length, suffix: '', label: 'sections to browse' },
  ]

  return (
    <>
      {/* Coverage panel. */}
      <section className="bg-[var(--slot4-page-bg)]">
        <div className={`${container} gr-reveal grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:py-24`}>
          <div className="min-w-0">
            <span className="gr-kicker text-[var(--slot4-accent)]">{coverage.eyebrow}</span>
            <h2 className="gr-display gr-balance mt-4 max-w-[14ch] text-[2.1rem] font-semibold leading-[1.06] tracking-[-0.025em] sm:text-[2.9rem]">
              {coverage.title}
            </h2>
            <p className="gr-serif mt-5 max-w-xl text-[1.0625rem] leading-8 text-[var(--slot4-muted-text)]">
              {coverage.description}
            </p>

            <div className="mt-9 grid max-w-lg grid-cols-3 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="border-l border-[var(--editable-border-strong)] pl-4">
                  <p className="gr-display text-[1.9rem] font-semibold leading-none text-[var(--slot4-page-text)]">
                    <EditableCountUp value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-2 text-[12.5px] leading-5 text-[var(--slot4-muted-text)]">{stat.label}</p>
                </div>
              ))}
            </div>

            <Link
              href={coverage.cta.href}
              className="group mt-9 inline-flex items-center gap-3 rounded-full border border-[var(--editable-border-strong)] py-2.5 pl-6 pr-2.5 text-[13.5px] font-semibold transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]"
            >
              {coverage.cta.label}
              <span className="gr-arrow h-8 w-8 bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </div>

          <div className="relative min-w-0 overflow-hidden rounded-[1.75rem] border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-7 sm:p-10">
            <span className="gr-dotfield pointer-events-none absolute inset-0 text-[var(--slot4-accent)]" aria-hidden="true" />
            <div className="relative">
              <div className="flex items-center gap-2.5 text-[var(--slot4-accent)]">
                <Compass className="h-5 w-5" />
                <span className="gr-kicker">Browse by category</span>
              </div>
              <div className="mt-6 flex flex-wrap gap-2.5">
                {(categories.length ? categories : sections.map((task) => task.label)).map((label) => (
                  <Link
                    key={label}
                    href={`/search?q=${encodeURIComponent(label)}`}
                    className="rounded-full border border-[var(--editable-border-strong)] bg-[var(--slot4-surface-bg)] px-4 py-2 text-[13px] font-medium text-[var(--slot4-page-text)] transition hover:-translate-y-0.5 hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]"
                  >
                    {label}
                  </Link>
                ))}
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {sections.slice(0, 4).map((task) => (
                  <Link
                    key={task.key}
                    href={task.route}
                    className="group flex items-center justify-between gap-3 rounded-[1.1rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-5 py-4 transition hover:border-[var(--slot4-accent)]"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[14.5px] font-semibold">{task.label}</span>
                      <span className="mt-0.5 block truncate text-[12.5px] text-[var(--slot4-muted-text)]">{task.description}</span>
                    </span>
                    <LayoutGrid className="h-4 w-4 shrink-0 text-[var(--slot4-accent)]" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing call to action. */}
      <section id="get-app" className="relative scroll-mt-24 overflow-hidden [background:var(--gr-sunrise)]">
        <span className="pointer-events-none absolute -left-20 -top-24 h-[24rem] w-[24rem] rounded-full border border-white/25" aria-hidden="true" />
        <div className={`${container} relative flex flex-col items-center gap-6 py-16 text-center sm:py-20`}>
          <span className="gr-kicker text-[#7a4a24]">{cta.badge}</span>
          <h2 className="gr-display gr-balance max-w-2xl text-[2.2rem] font-semibold leading-[1.06] tracking-[-0.025em] text-[#2a1a0e] sm:text-[3rem]">
            {cta.title}
          </h2>
          <p className="max-w-xl text-[1.0625rem] leading-8 text-[#4a3323]">{cta.description}</p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Link
              href={cta.primaryCta.href}
              className="group inline-flex items-center gap-3 rounded-full bg-[#2a1a0e] py-3 pl-7 pr-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              {cta.primaryCta.label}
              <span className="gr-arrow h-9 w-9 bg-white text-[var(--slot4-accent)]">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
