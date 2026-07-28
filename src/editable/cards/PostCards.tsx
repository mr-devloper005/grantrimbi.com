import Link from 'next/link'
import { ArrowUpRight, ImageOff, MapPin, Tag, UserRound } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

// The posting API repeats the same asset across `media[]`, `content.images[]`,
// `content.image`, `content.featuredImage` and `content.logo`. Any surface that
// collects several of those fields must de-duplicate, otherwise one picture is
// rendered as a gallery of identical copies (profile logos shown five times,
// image posts shown four times).
export function dedupeUrls(urls: Array<string | null | undefined>): string[] {
  return Array.from(
    new Set(
      urls
        .map((url) => (typeof url === 'string' ? url.trim() : ''))
        .filter((url) => url.length > 0),
    ),
  )
}

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  const featured = typeof content.featuredImage === 'string' ? content.featuredImage : ''
  const single = typeof content.image === 'string' ? content.image : ''
  return mediaUrl || contentImage || featured || single || logo || '/placeholder.svg?height=900&width=1400'
}

/** True when the post carries no real artwork and only the placeholder is left. */
export function hasRealImage(post?: SitePost | null) {
  return !getEditablePostImage(post).includes('placeholder')
}

// Reduce any content payload — rich HTML, entity-encoded HTML, or already-plain text — to
// a clean plain-text card summary. Card excerpts must never show raw markup regardless of
// what the content API sends. Two tag-strip passes (before + after entity decode) also catch
// entity-encoded markup like &lt;p&gt;.
export function toPlainText(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    (typeof post?.summary === 'string' && post.summary) ||
    (typeof content.body === 'string' && content.body) ||
    (typeof content.excerpt === 'string' && content.excerpt) ||
    ''
  const clean = toPlainText(raw)
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

/** First non-empty string field from the post content, for price/location/role. */
export function getEditableField(post: SitePost | null | undefined, keys: string[]) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  for (const key of keys) {
    const value = content[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return ''
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

/* ------------------------------------------------------------------ atoms */

export function CardArrow({ tone = 'light' }: { tone?: 'light' | 'accent' | 'ink' }) {
  const styles =
    tone === 'accent'
      ? 'bg-[var(--slot4-accent-fill)] text-white'
      : tone === 'ink'
        ? 'bg-[var(--slot4-dark-bg)] text-white'
        : 'bg-[var(--slot4-surface-bg)] text-[var(--slot4-accent)]'
  return (
    <span className={`gr-arrow-static flex h-10 w-10 items-center justify-center rounded-full ${styles} shadow-[0_6px_18px_rgba(32,26,22,0.14)]`}>
      <ArrowUpRight className="h-4 w-4" />
    </span>
  )
}

export function CardBadge({ children, tone = 'paper' }: { children: React.ReactNode; tone?: 'paper' | 'accent' | 'glass' }) {
  const styles =
    tone === 'accent'
      ? 'bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]'
      : tone === 'glass'
        ? 'bg-white/90 text-[var(--slot4-page-text)] backdrop-blur'
        : 'bg-[var(--slot4-panel-bg)] text-[var(--slot4-muted-text)]'
  return (
    <span className={`inline-flex max-w-full items-center gap-1.5 truncate rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.02em] ${styles}`}>
      {children}
    </span>
  )
}

function Media({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`absolute inset-0 h-full w-full object-cover transition duration-[900ms] group-hover:scale-[1.06] ${className}`}
    />
  )
}

/* ------------------------------------------------------- 1. featured card */
/** Large cinematic card — one per block, used to open a section. */
export function EditorialFeatureCard({ post, href, label = 'In focus' }: { post: SitePost; href: string; label?: string }) {
  const excerpt = getEditableExcerpt(post, 180)
  return (
    <Link href={href} className={`group relative block min-w-0 overflow-hidden rounded-[1.75rem] ${pal.mediaBg} ${dc.motion.lift}`}>
      <div className="relative min-h-[420px] sm:min-h-[500px] lg:min-h-[560px]">
        <Media src={getEditablePostImage(post)} alt={post.title || ''} />
        <div className="absolute inset-0 bg-[var(--gr-veil)]" />
        <span className="absolute right-5 top-5">
          <CardArrow />
        </span>
        <div className="relative z-10 flex h-full min-h-[420px] flex-col justify-end p-6 sm:min-h-[500px] sm:p-9 lg:min-h-[560px]">
          <span className="gr-kicker text-white/75">{label}</span>
          <h3 className="gr-display gr-balance mt-4 max-w-2xl text-[1.9rem] font-semibold leading-[1.08] tracking-[-0.02em] text-white sm:text-[2.6rem]">
            {post.title || 'Untitled entry'}
          </h3>
          {excerpt ? <p className="mt-4 max-w-xl text-[15px] leading-7 text-white/75">{excerpt}</p> : null}
          <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold text-[var(--slot4-page-text)]">
            Read the entry <ArrowUpRight className="h-4 w-4 text-[var(--slot4-accent)]" />
          </span>
        </div>
      </div>
    </Link>
  )
}

/* ---------------------------------------------------- 2. image-first card */
/** Portrait card where the photograph carries the whole tile. */
export function ImageFirstCard({ post, href, kicker }: { post: SitePost; href: string; kicker?: string }) {
  const image = getEditablePostImage(post)
  const caption = kicker || getEditableCategory(post)
  return (
    <Link href={href} className={`group relative block min-w-0 overflow-hidden rounded-[1.5rem] ${pal.mediaBg} ${dc.motion.lift}`}>
      <div className="relative aspect-[4/5] sm:aspect-[3/4]">
        <Media src={image} alt={post.title || ''} />
        <div className="absolute inset-0 bg-[var(--gr-veil)]" />
        <span className="absolute right-4 top-4">
          <CardArrow />
        </span>
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          {caption ? <span className="gr-kicker text-white/70">{caption}</span> : null}
          <h3 className="gr-display mt-2.5 line-clamp-3 text-[1.35rem] font-semibold leading-[1.15] text-white sm:text-[1.6rem]">
            {post.title || 'Untitled entry'}
          </h3>
        </div>
      </div>
    </Link>
  )
}

/* ------------------------------------------------------- 3. compact card */
/** Small stacked card for dense grids — image, category, title, one line. */
export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const excerpt = getEditableExcerpt(post, 96)
  const price = getEditableField(post, ['price', 'amount', 'budget'])
  return (
    <Link href={href} className={`group flex min-w-0 flex-col overflow-hidden ${dc.surface.card} ${dc.motion.lift}`}>
      <div className={`${dc.media.frame} aspect-[4/3] rounded-none`}>
        <Media src={getEditablePostImage(post)} alt={post.title || ''} />
        <span className="absolute left-3.5 top-3.5">
          <CardBadge tone="glass">{getEditableCategory(post)}</CardBadge>
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--slot4-soft-muted-text)]">
          <span>{String(index + 1).padStart(2, '0')}</span>
          {price ? <span className="text-[var(--slot4-accent)]">{price}</span> : null}
        </div>
        <h3 className="gr-display mt-2 line-clamp-2 text-[1.15rem] font-semibold leading-[1.25] text-[var(--slot4-page-text)] transition group-hover:text-[var(--slot4-accent)]">
          {post.title || 'Untitled entry'}
        </h3>
        {excerpt ? <p className="mt-2.5 line-clamp-2 flex-1 text-[13.5px] leading-6 text-[var(--slot4-muted-text)]">{excerpt}</p> : null}
      </div>
    </Link>
  )
}

/* -------------------------------------------------- 4. editorial list row */
/** Numbered index row — no image, ruled like a contents page. */
export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const excerpt = getEditableExcerpt(post, 110)
  return (
    <Link
      href={href}
      className="group flex min-w-0 items-start gap-5 border-b border-[var(--editable-border)] py-5 transition duration-500 hover:border-[var(--slot4-accent)]"
    >
      <span className="gr-display mt-0.5 w-9 shrink-0 text-[1.35rem] font-semibold leading-none text-[var(--slot4-accent)]">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="min-w-0 flex-1">
        <span className="gr-kicker text-[var(--slot4-soft-muted-text)]">{getEditableCategory(post)}</span>
        <h3 className="gr-display mt-2 line-clamp-2 text-[1.2rem] font-semibold leading-[1.25] text-[var(--slot4-page-text)] transition group-hover:text-[var(--slot4-accent)]">
          {post.title || 'Untitled entry'}
        </h3>
        {excerpt ? <p className="mt-2 line-clamp-2 text-[13.5px] leading-6 text-[var(--slot4-muted-text)]">{excerpt}</p> : null}
      </div>
      <ArrowUpRight className="gr-arrow-static mt-1 h-4 w-4 shrink-0 text-[var(--slot4-soft-muted-text)] transition group-hover:text-[var(--slot4-accent)]" />
    </Link>
  )
}

/* --------------------------------------------------- 5. horizontal card */
/** Wide split card — image on the left, the entry read on the right. */
export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const excerpt = getEditableExcerpt(post, 190)
  const location = getEditableField(post, ['location', 'address', 'city'])
  return (
    <Link
      href={href}
      className={`group grid min-w-0 gap-0 overflow-hidden ${dc.surface.card} ${dc.motion.lift} sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]`}
    >
      <div className={`${dc.media.frame} aspect-[16/10] rounded-none sm:aspect-auto sm:min-h-[15rem]`}>
        <Media src={getEditablePostImage(post)} alt={post.title || ''} />
      </div>
      <div className="min-w-0 p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <CardBadge tone="accent">
            <Tag className="h-3 w-3" />
            {getEditableCategory(post)}
          </CardBadge>
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--slot4-soft-muted-text)]">
            No. {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <h2 className="gr-display mt-4 line-clamp-2 text-[1.5rem] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--slot4-page-text)] transition group-hover:text-[var(--slot4-accent)] sm:text-[1.85rem]">
          {post.title || 'Untitled entry'}
        </h2>
        {excerpt ? <p className="mt-3.5 line-clamp-3 text-[14.5px] leading-7 text-[var(--slot4-muted-text)]">{excerpt}</p> : null}
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-medium text-[var(--slot4-muted-text)]">
          {location ? (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[var(--slot4-accent)]" /> {location}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-2 font-semibold text-[var(--slot4-accent)]">
            Read the entry <ArrowUpRight className="gr-arrow-static h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}

/* ------------------------------------------------------ 6. accent tile */
/** Solid terracotta tile — used to break up image grids with pure type. */
export function AccentNoteCard({ post, href, kicker }: { post: SitePost; href: string; kicker?: string }) {
  const excerpt = getEditableExcerpt(post, 110)
  return (
    <Link
      href={href}
      className={`group flex min-w-0 flex-col justify-between rounded-[1.5rem] bg-[var(--slot4-accent-fill)] p-6 text-[var(--slot4-on-accent)] transition duration-500 hover:-translate-y-1.5 hover:brightness-105 sm:p-7`}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="gr-kicker text-white/75">{kicker || getEditableCategory(post)}</span>
        <CardArrow />
      </div>
      <div className="mt-10">
        <h3 className="gr-display line-clamp-3 text-[1.45rem] font-semibold leading-[1.15] sm:text-[1.7rem]">
          {post.title || 'Untitled entry'}
        </h3>
        {excerpt ? <p className="mt-3 line-clamp-2 text-[13.5px] leading-6 text-white/75">{excerpt}</p> : null}
      </div>
    </Link>
  )
}

/* ------------------------------------------------------ 7. person card */
/** Circular portrait card for the people directory. */
export function PersonCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getEditablePostImage(post)
  const role = getEditableField(post, ['role', 'designation', 'company', 'location'])
  const excerpt = getEditableExcerpt(post, 96)
  const real = hasRealImage(post)
  return (
    <Link
      href={href}
      className={`group flex min-w-0 flex-col items-center rounded-[1.5rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-7 text-center ${dc.motion.lift}`}
    >
      <span className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[var(--slot4-panel-bg)] ring-1 ring-[var(--editable-border)] transition duration-500 group-hover:ring-[var(--slot4-accent)]">
        {real ? (
          <img src={avatar} alt="" className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <UserRound className="h-9 w-9 text-[var(--slot4-soft-muted-text)]" />
        )}
      </span>
      <h3 className="gr-display mt-5 line-clamp-2 text-[1.15rem] font-semibold leading-tight text-[var(--slot4-page-text)] transition group-hover:text-[var(--slot4-accent)]">
        {post.title || 'Member'}
      </h3>
      {role ? <p className="mt-1.5 line-clamp-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--slot4-accent)]">{role}</p> : null}
      {excerpt ? <p className="mt-3 line-clamp-2 text-[13px] leading-6 text-[var(--slot4-muted-text)]">{excerpt}</p> : null}
    </Link>
  )
}

/* ------------------------------------------------------ 8. notice card */
/** Price-forward marketplace card with a quiet image band. */
export function NoticeCard({ post, href }: { post: SitePost; href: string }) {
  const price = getEditableField(post, ['price', 'amount', 'budget'])
  const location = getEditableField(post, ['location', 'address', 'city'])
  const condition = getEditableField(post, ['condition', 'availability', 'type'])
  const excerpt = getEditableExcerpt(post, 120)
  const real = hasRealImage(post)
  return (
    <Link href={href} className={`group flex min-w-0 flex-col overflow-hidden ${dc.surface.card} ${dc.motion.lift}`}>
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--slot4-media-bg)]">
        {real ? (
          <Media src={getEditablePostImage(post)} alt={post.title || ''} />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center bg-[var(--slot4-panel-bg)] text-[var(--slot4-soft-muted-text)]">
            <ImageOff className="h-7 w-7" />
          </span>
        )}
        {condition ? (
          <span className="absolute left-3.5 top-3.5">
            <CardBadge tone="glass">{condition}</CardBadge>
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-baseline justify-between gap-3">
          <span className="gr-display text-[1.5rem] font-semibold tracking-[-0.02em] text-[var(--slot4-accent)]">
            {price || 'Enquire'}
          </span>
          <span className="truncate text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--slot4-soft-muted-text)]">
            {getEditableCategory(post)}
          </span>
        </div>
        <h3 className="gr-display mt-3 line-clamp-2 text-[1.2rem] font-semibold leading-[1.2] text-[var(--slot4-page-text)] transition group-hover:text-[var(--slot4-accent)]">
          {post.title || 'Untitled entry'}
        </h3>
        {excerpt ? <p className="mt-2.5 line-clamp-2 flex-1 text-[13.5px] leading-6 text-[var(--slot4-muted-text)]">{excerpt}</p> : null}
        <div className="mt-5 flex items-center justify-between border-t border-[var(--editable-border)] pt-4 text-[12.5px] font-medium text-[var(--slot4-muted-text)]">
          <span className="inline-flex min-w-0 items-center gap-1.5 truncate">
            {location ? (
              <>
                <MapPin className="h-3.5 w-3.5 shrink-0 text-[var(--slot4-accent)]" />
                <span className="truncate">{location}</span>
              </>
            ) : (
              'Details inside'
            )}
          </span>
          <ArrowUpRight className="gr-arrow-static h-4 w-4 shrink-0 text-[var(--slot4-accent)]" />
        </div>
      </div>
    </Link>
  )
}
