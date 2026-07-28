import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowUpRight, Bookmark, Building2, Camera, CheckCircle2, Download, ExternalLink,
  FileText, Globe2, Mail, MapPin, Phone, Tag, UserRound,
} from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { dedupeUrls } from '@/editable/cards/PostCards'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { EditableGallery, EditableReadingProgress, EditableShareRow } from '@/editable/components/EditableDetailUtilities'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

/* ------------------------------------------------------------- helpers --- */

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  // De-duplicate: the API ships the same asset in several of these fields, so a
  // plain concat renders one picture as a gallery of identical copies (and, on
  // profiles, the logo repeated down the page).
  return dedupeUrls([...media, ...images, ...singleImages]).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'

const linkifyMarkdown = (value: string) => value
  .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) => linkifyMarkdown(value)
  .replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})

const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
// Compare on letters/digits only, so punctuation, casing or a stray keyword
// paragraph appended by the generator cannot defeat the duplicate check.
const comparable = (value: string) => stripHtml(value).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim()
// Plain-text lead intro, but only when it isn't already part of the body. The
// API commonly returns identical text in `description` and `body`; rendering
// both is what showed the summary twice on listing and profile pages.
const leadText = (post: SitePost) => {
  const summary = summaryText(post)
  if (!summary) return ''
  const lead = stripHtml(summary)
  if (!lead) return ''
  const leadKey = comparable(lead)
  return leadKey && comparable(getBody(post)).includes(leadKey) ? '' : lead
}
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

const dateLabel = (post: SitePost) => {
  const raw = post.publishedAt || post.createdAt || ''
  if (!raw) return ''
  const parsed = new Date(raw)
  if (Number.isNaN(parsed.getTime())) return ''
  return parsed.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        <EditableReadingProgress />
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

/* --------------------------------------------------------------- atoms --- */

const shell = 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-6 lg:px-8'

function Crumbs({ task, title }: { task: TaskKey; title: string }) {
  const taskConfig = getTaskConfig(task)
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[12.5px] text-[var(--tk-muted)]">
      <Link href="/" className="transition hover:text-[var(--tk-accent)]">Home</Link>
      <span aria-hidden="true">/</span>
      <Link href={taskConfig?.route || '/'} className="transition hover:text-[var(--tk-accent)]">
        {taskConfig?.label || 'Entries'}
      </Link>
      <span aria-hidden="true">/</span>
      <span className="max-w-[16rem] truncate text-[var(--tk-text)]">{title}</span>
    </nav>
  )
}

function Kicker({ task, children }: { task: TaskKey; children: React.ReactNode }) {
  const theme = getTaskTheme(task)
  return (
    <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--tk-accent)]">
      <span>{theme.kicker}</span>
      <span className="h-1 w-1 rounded-full bg-[var(--tk-accent)] opacity-50" />
      <span className="text-[var(--tk-muted)]">{children}</span>
    </div>
  )
}

function MetaRow({ post, category, center = false }: { post: SitePost; category?: string; center?: boolean }) {
  const published = dateLabel(post)
  const items = [category, published, SITE_CONFIG.name].filter(Boolean) as string[]
  if (!items.length) return null
  return (
    <div className={`mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px] text-[var(--tk-muted)] ${center ? 'justify-center' : ''}`}>
      {items.map((item, index) => (
        <span key={`${item}-${index}`} className="flex items-center gap-3">
          {index > 0 ? <span className="h-1 w-1 rounded-full bg-[var(--tk-muted)] opacity-50" aria-hidden="true" /> : null}
          <span>{item}</span>
        </span>
      ))}
    </div>
  )
}

function Divider() {
  return <div className="my-10 h-px bg-[var(--tk-line)]" />
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return (
    <div
      className={`article-content mt-8 max-w-none text-[var(--tk-text)] ${compact ? 'text-[15px] leading-7' : 'text-[1.0625rem] leading-[1.85]'}`}
      dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }}
    />
  )
}

function InfoGrid({ items }: { items: Array<[string, string, typeof MapPin]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2">
      {visible.map(([label, value, Icon]) => (
        <div key={label} className="rounded-[1.1rem] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-4">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--tk-muted)]">
            <Icon className="h-4 w-4 text-[var(--tk-accent)]" /> {label}
          </div>
          <p className="gr-break mt-2 text-sm font-medium leading-6">{value}</p>
        </div>
      ))}
    </div>
  )
}

function ImageStrip({ images, label, large = false }: { images: string[]; label: string; large?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-10">
      <p className="gr-kicker text-[var(--tk-muted)]">{label}</p>
      <div className={`mt-4 grid gap-3 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.slice(0, large ? 4 : 8).map((image, index) => (
          <img
            key={`${image}-${index}`}
            src={image}
            alt=""
            loading="lazy"
            className="aspect-[4/3] w-full rounded-[1.1rem] border border-[var(--tk-line)] object-cover transition duration-700 hover:scale-[1.02]"
          />
        ))}
      </div>
    </section>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)]">
      <div className="flex items-center gap-2 p-4 text-sm font-semibold">
        <MapPin className="h-4 w-4 text-[var(--tk-accent)]" /> {label || 'Map location'}
      </div>
      <iframe src={src} title="Map" loading="lazy" className="h-64 w-full border-0" />
    </div>
  )
}

function ContactAction({ website, phone, email, bare = false }: { website?: string; phone?: string; email?: string; bare?: boolean }) {
  if (!website && !phone && !email) return null
  const buttons = (
    <div className={`flex flex-wrap gap-2.5 ${bare ? 'justify-center' : ''}`}>
      {website ? (
        <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-2.5 text-[13px] font-semibold text-[var(--tk-on-accent)] transition hover:brightness-105">
          Website <ExternalLink className="h-4 w-4" />
        </Link>
      ) : null}
      {phone ? (
        <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-5 py-2.5 text-[13px] font-semibold transition hover:border-[var(--tk-accent)] hover:text-[var(--tk-accent)]">
          <Phone className="h-4 w-4" /> Call
        </a>
      ) : null}
      {email ? (
        <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-5 py-2.5 text-[13px] font-semibold transition hover:border-[var(--tk-accent)] hover:text-[var(--tk-accent)]">
          <Mail className="h-4 w-4" /> Email
        </a>
      ) : null}
    </div>
  )
  if (bare) return <div className="mt-6">{buttons}</div>
  return (
    <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
      <p className="gr-kicker text-[var(--tk-muted)]">Get in touch</p>
      <div className="mt-4">{buttons}</div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[0.9rem] border border-[var(--tk-line)] bg-[var(--tk-raised)] px-4 py-3 text-sm">
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--tk-muted)]">{label}</span>
      <span className="gr-break text-right font-semibold">{value}</span>
    </div>
  )
}

function RelatedPanel({ task, related }: { task: TaskKey; post?: SitePost; related: SitePost[] }) {
  const taskConfig = getTaskConfig(task)
  return (
    <div className="space-y-6">
      <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
        <p className="gr-kicker text-[var(--tk-muted)]">About this entry</p>
        <div className="mt-4 grid gap-2.5 text-sm text-[var(--tk-muted)]">
          <p className="inline-flex items-center gap-2"><Tag className="h-4 w-4 text-[var(--tk-accent)]" /> {taskConfig?.label || task}</p>
          <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[var(--tk-accent)]" /> {SITE_CONFIG.name}</p>
        </div>
        <EditableShareRow compact />
      </div>
      {related.length ? (
        <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="gr-display text-[1.15rem] font-semibold tracking-[-0.02em]">More like this</h2>
            <Link href={taskConfig?.route || '/'} className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--tk-accent)]">
              View all
            </Link>
          </div>
          <div className="mt-5 grid gap-3">
            {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} />)}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function RelatedStrip({ task, related }: { task: TaskKey; related: SitePost[] }) {
  if (!related.length) return null
  const taskConfig = getTaskConfig(task)
  return (
    <section className="border-t border-[var(--tk-line)] bg-[var(--tk-raised)]">
      <div className={`${shell} py-14 sm:py-16`}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="gr-kicker text-[var(--tk-accent)]">Keep browsing</span>
            <h2 className="gr-display mt-3 text-[1.75rem] font-semibold tracking-[-0.02em] sm:text-[2.1rem]">
              More {(taskConfig?.label || 'entries').toLowerCase()}
            </h2>
          </div>
          <Link href={taskConfig?.route || '/'} className="group inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-5 py-2.5 text-[13px] font-semibold transition hover:border-[var(--tk-accent)] hover:text-[var(--tk-accent)]">
            View all <ArrowUpRight className="gr-arrow-static h-4 w-4 text-[var(--tk-accent)]" />
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} grid />)}
        </div>
      </div>
    </section>
  )
}

function RelatedCard({ task, post, grid = false }: { task: TaskKey; post: SitePost; grid?: boolean }) {
  const image = getImages(post)[0]
  // Build the detail URL from the task route (e.g. /classified/<slug>) — the same
  // base the archive cards use. buildPostUrl() can fall back to /posts when the
  // task isn't in the enabled taskViews map, which 404s.
  const href = `${getTaskConfig(task)?.route || `/${task}`}/${post.slug}`
  if (grid) {
    return (
      <Link href={href} className="group block overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_22px_50px_rgba(32,26,22,0.12)]">
        <div className="aspect-[16/10] overflow-hidden bg-[var(--tk-raised)]">
          {image ? (
            <img src={image} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" />
          ) : (
            <div className="flex h-full items-center justify-center"><FileText className="h-7 w-7 text-[var(--tk-muted)]" /></div>
          )}
        </div>
        <div className="p-5">
          <h3 className="gr-display line-clamp-2 text-[1.05rem] font-semibold leading-snug transition group-hover:text-[var(--tk-accent)]">
            {post.title || 'Untitled entry'}
          </h3>
          <p className="mt-2 line-clamp-2 text-[13.5px] leading-6 text-[var(--tk-muted)]">{stripHtml(summaryText(post))}</p>
        </div>
      </Link>
    )
  }
  return (
    <Link href={href} className="group flex gap-3 rounded-[0.9rem] border border-[var(--tk-line)] p-3 transition hover:border-[var(--tk-accent)]">
      {image && task !== 'sbm' ? (
        <img src={image} alt="" loading="lazy" className="h-16 w-16 shrink-0 rounded-lg object-cover" />
      ) : (
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[var(--tk-raised)]"><FileText className="h-5 w-5 text-[var(--tk-muted)]" /></div>
      )}
      <div className="min-w-0">
        <h3 className="line-clamp-2 text-[13.5px] font-semibold leading-snug">{post.title || 'Untitled entry'}</h3>
        <p className="mt-1.5 line-clamp-2 text-[12px] leading-5 text-[var(--tk-muted)]">{stripHtml(summaryText(post))}</p>
      </div>
    </Link>
  )
}

/* ------------------------------------------------- classified (primary) --- */

function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const mapSrc = mapSrcFor(post)
  const lead = leadText(post)

  return (
    <>
      {/* Masthead. */}
      <header className="border-b border-[var(--tk-line)] bg-[var(--tk-raised)]">
        <div className={`${shell} py-10 sm:py-14`}>
          <Crumbs task="classified" title={post.title || 'Entry'} />
          <div className="mt-7 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="min-w-0">
              <Kicker task="classified">{categoryOf(post, 'Notice')}</Kicker>
              <h1 className="gr-display gr-balance mt-4 max-w-3xl text-[2.2rem] font-semibold leading-[1.05] tracking-[-0.028em] sm:text-[3rem]">
                {post.title || 'Untitled entry'}
              </h1>
              <MetaRow post={post} category={location || undefined} />
            </div>
            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
              <span className="gr-display rounded-[1.1rem] bg-[var(--tk-accent)] px-6 py-3 text-[1.6rem] font-semibold leading-none text-[var(--tk-on-accent)]">
                {price || 'Enquire'}
              </span>
              {condition ? (
                <span className="rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-4 py-2 text-[12.5px] font-semibold text-[var(--tk-muted)]">
                  {condition}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <section className={`${shell} grid gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_23rem]`}>
        <article className="min-w-0">
          {images.length ? <EditableGallery images={images} title={post.title} /> : null}
          {lead ? <p className="gr-serif mt-8 text-[1.15rem] leading-[1.85] text-[var(--tk-muted)]">{lead}</p> : null}
          <BodyContent post={post} />
          <InfoGrid
            items={[
              ['Location', location, MapPin],
              ['Price', price, Tag],
              ['Phone', phone, Phone],
              ['Email', email, Mail],
              ['Website', website, Globe2],
            ]}
          />
          <EditableShareRow title={post.title} />
        </article>

        <aside className="min-w-0 space-y-6 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6 shadow-[0_18px_50px_rgba(32,26,22,0.08)]">
            <p className="gr-kicker text-[var(--tk-accent)]">Enquire about this</p>
            <p className="gr-display mt-3 text-[2rem] font-semibold leading-none">{price || 'Open offer'}</p>
            <div className="mt-5 space-y-2.5">
              {condition ? <BadgeLine label="Condition" value={condition} /> : null}
              {location ? <BadgeLine label="Location" value={location} /> : null}
              {dateLabel(post) ? <BadgeLine label="Posted" value={dateLabel(post)} /> : null}
            </div>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {phone ? (
                <a href={`tel:${phone}`} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-3 text-[13px] font-semibold text-[var(--tk-on-accent)] transition hover:brightness-105">
                  <Phone className="h-4 w-4" /> Call
                </a>
              ) : null}
              {email ? (
                <a href={`mailto:${email}`} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[var(--tk-line)] px-5 py-3 text-[13px] font-semibold transition hover:border-[var(--tk-accent)] hover:text-[var(--tk-accent)]">
                  <Mail className="h-4 w-4" /> Email
                </a>
              ) : null}
              {!phone && !email ? (
                <Link href="/contact" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-3 text-[13px] font-semibold text-[var(--tk-on-accent)] transition hover:brightness-105">
                  Contact about this entry
                </Link>
              ) : null}
            </div>
          </div>
          {mapSrc ? <MapBox src={mapSrc} label={location || post.title} /> : null}
          <RelatedPanel task="classified" related={related} />
        </aside>
      </section>

      <RelatedStrip task="classified" related={related} />
    </>
  )
}

/* ---------------------------------------------------- profile (primary) --- */

function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company'])
  const location = getField(post, ['location', 'city', 'address'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const lead = leadText(post)

  return (
    <>
      {/* Banner + portrait. */}
      <header className="relative">
        <div className="h-40 w-full [background:var(--gr-sunrise)] sm:h-52" />
        <div className={shell}>
          <div className="-mt-16 flex flex-col gap-6 sm:-mt-20 sm:flex-row sm:items-end">
            <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-[var(--tk-bg)] bg-[var(--tk-raised)] shadow-[0_18px_44px_rgba(32,26,22,0.18)] sm:h-40 sm:w-40">
              {images[0] ? (
                <img src={images[0]} alt="" className="h-full w-full object-cover" />
              ) : (
                <UserRound className="h-14 w-14 text-[var(--tk-muted)]" />
              )}
            </div>
            <div className="min-w-0 pb-2">
              <Kicker task="profile">{categoryOf(post, 'Member')}</Kicker>
              <h1 className="gr-display gr-balance mt-3 text-[2.1rem] font-semibold leading-[1.06] tracking-[-0.028em] sm:text-[2.8rem]">
                {post.title || 'Member profile'}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13.5px] text-[var(--tk-muted)]">
                {role ? <span className="font-semibold text-[var(--tk-accent)]">{role}</span> : null}
                {location ? (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" /> {location}
                  </span>
                ) : null}
                {dateLabel(post) ? <span>Joined {dateLabel(post)}</span> : null}
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className={`${shell} grid gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_22rem]`}>
        <article className="min-w-0">
          {lead ? <p className="gr-serif text-[1.2rem] leading-[1.85] text-[var(--tk-text)]">{lead}</p> : null}
          <BodyContent post={post} />
          <ImageStrip images={images.slice(1)} label="From the gallery" />
          <EditableShareRow title={post.title} />
        </article>

        <aside className="min-w-0 space-y-6 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
            <p className="gr-kicker text-[var(--tk-accent)]">Details</p>
            <div className="mt-4 space-y-2.5">
              {role ? <BadgeLine label="Role" value={role} /> : null}
              {location ? <BadgeLine label="Based in" value={location} /> : null}
              {website ? <BadgeLine label="Website" value={website.replace(/^https?:\/\//, '').replace(/\/$/, '')} /> : null}
            </div>
            <ContactAction website={website} phone={phone} email={email} bare />
          </div>
          <RelatedPanel task="profile" related={related} />
        </aside>
      </section>

      <RelatedStrip task="profile" related={related} />
    </>
  )
}

/* ------------------------------------------------------------- article --- */

function ArticleDetail({ post, related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  const lead = leadText(post)
  return (
    <>
      <article className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
        <Crumbs task="article" title={post.title || 'Article'} />
        <p className="gr-kicker mt-9 text-[var(--tk-accent)]">{categoryOf(post, 'Article')}</p>
        <h1 className="gr-display gr-balance mt-4 text-[2.3rem] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[3.1rem]">
          {post.title || 'Untitled article'}
        </h1>
        <MetaRow post={post} />
        {lead ? <p className="gr-serif mt-7 text-[1.2rem] leading-[1.85] text-[var(--tk-muted)]">{lead}</p> : null}
        {images[0] ? (
          <img src={images[0]} alt="" className="mt-9 aspect-[16/9] w-full rounded-[var(--tk-radius)] border border-[var(--tk-line)] object-cover" />
        ) : null}
        <BodyContent post={post} />
        <ImageStrip images={images.slice(1)} label="More images" />
        <EditableShareRow title={post.title} />
        <EditableArticleComments slug={post.slug} comments={comments} />
      </article>
      <RelatedStrip task="article" related={related} />
    </>
  )
}

/* ------------------------------------------------------------- listing --- */

function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const logo = images[0]
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const mapSrc = mapSrcFor(post)
  return (
    <>
      <header className="border-b border-[var(--tk-line)] bg-[var(--tk-raised)]">
        <div className={`${shell} py-10 sm:py-14`}>
          <Crumbs task="listing" title={post.title || 'Listing'} />
          <div className="mt-7 flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[1.2rem] border border-[var(--tk-line)] bg-[var(--tk-surface)]">
              {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <Building2 className="h-10 w-10 text-[var(--tk-muted)]" />}
            </div>
            <div className="min-w-0">
              <Kicker task="listing">{categoryOf(post, 'Listing')}</Kicker>
              <h1 className="gr-display gr-balance mt-3 text-[2.1rem] font-semibold leading-[1.05] tracking-[-0.028em] sm:text-[2.9rem]">
                {post.title || 'Untitled listing'}
              </h1>
              <MetaRow post={post} category={address || undefined} />
            </div>
          </div>
        </div>
      </header>

      <section className={`${shell} grid gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_22rem]`}>
        <article className="min-w-0">
          {leadText(post) ? <p className="gr-serif text-[1.15rem] leading-[1.85] text-[var(--tk-muted)]">{leadText(post)}</p> : null}
          <InfoGrid items={[['Location', address, MapPin], ['Phone', phone, Phone], ['Email', email, Mail], ['Website', website, Globe2]]} />
          <Divider />
          <BodyContent post={post} />
          <ImageStrip images={images.slice(1)} label="Showcase" />
          <EditableShareRow title={post.title} />
        </article>
        <aside className="min-w-0 space-y-6 lg:sticky lg:top-28 lg:self-start">
          {mapSrc ? <MapBox src={mapSrc} label={address || post.title} /> : null}
          <ContactAction website={website} phone={phone} email={email} />
          <RelatedPanel task="listing" related={related} />
        </aside>
      </section>
      <RelatedStrip task="listing" related={related} />
    </>
  )
}

/* --------------------------------------------------------------- image --- */

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const gallery = images.length ? images : ['/placeholder.svg?height=900&width=1200']
  return (
    <>
      <section className={`${shell} py-12 sm:py-16`}>
        <Crumbs task="image" title={post.title || 'Image'} />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.45fr_0.55fr]">
          <div className="min-w-0 columns-1 gap-5 [column-fill:_balance] sm:columns-2">
            {gallery.map((image, index) => (
              <figure key={`${image}-${index}`} className="mb-5 break-inside-avoid overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)]">
                <img src={image} alt="" loading="lazy" className="w-full object-cover transition duration-700 hover:scale-[1.03]" />
              </figure>
            ))}
          </div>
          <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-3.5 py-1.5 text-[12px] font-medium text-[var(--tk-muted)]">
              <Camera className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> Image story
            </div>
            <h1 className="gr-display gr-balance mt-5 text-[2rem] font-semibold leading-[1.06] tracking-[-0.028em] sm:text-[2.6rem]">
              {post.title || 'Untitled set'}
            </h1>
            {leadText(post) ? <p className="gr-serif mt-5 text-[1.05rem] leading-8 text-[var(--tk-muted)]">{leadText(post)}</p> : null}
            <BodyContent post={post} compact />
            <EditableShareRow title={post.title} />
          </aside>
        </div>
      </section>
      <RelatedStrip task="image" related={related} />
    </>
  )
}

/* ----------------------------------------------------------- bookmarks --- */

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <>
      <article className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
        <Crumbs task="sbm" title={post.title || 'Bookmark'} />
        <div className="mt-9 flex h-14 w-14 items-center justify-center rounded-[1.1rem] bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
          <Bookmark className="h-6 w-6" />
        </div>
        <div className="mt-5"><Kicker task="sbm">{categoryOf(post, 'Saved resource')}</Kicker></div>
        <h1 className="gr-display gr-balance mt-4 text-[2.1rem] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[2.8rem]">
          {post.title || 'Saved resource'}
        </h1>
        {leadText(post) ? <p className="gr-serif mt-6 text-[1.15rem] leading-[1.85] text-[var(--tk-muted)]">{leadText(post)}</p> : null}
        {website ? (
          <Link href={website} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-6 py-3 text-[13px] font-semibold text-[var(--tk-on-accent)] transition hover:brightness-105">
            Open resource <ExternalLink className="h-4 w-4" />
          </Link>
        ) : null}
        <BodyContent post={post} />
        <EditableShareRow title={post.title} />
      </article>
      <RelatedStrip task="sbm" related={related} />
    </>
  )
}

/* ----------------------------------------------------------------- pdf --- */

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  return (
    <section className={`${shell} py-12 sm:py-16`}>
      <Crumbs task="pdf" title={post.title || 'Document'} />
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <article className="min-w-0">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.2rem] bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
              <FileText className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <Kicker task="pdf">{categoryOf(post, 'Document')}</Kicker>
              <h1 className="gr-display mt-3 text-[1.9rem] font-semibold leading-[1.06] tracking-[-0.025em] sm:text-[2.4rem]">
                {post.title || 'Untitled document'}
              </h1>
            </div>
          </div>
          <BodyContent post={post} />
          {fileUrl ? (
            <div className="mt-10 overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)]">
              <div className="flex items-center justify-between gap-3 border-b border-[var(--tk-line)] p-4">
                <span className="text-sm font-semibold">Document preview</span>
                <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-4 py-2 text-[12px] font-semibold text-[var(--tk-on-accent)] transition hover:brightness-105">
                  Download <Download className="h-4 w-4" />
                </Link>
              </div>
              {/* min-height as well as the viewport height: a collapsed parent
                  must never be able to squash the embed to 0px, which is how the
                  document silently disappeared while the link still worked. */}
              <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[78vh] min-h-[520px] w-full bg-[var(--tk-raised)]" />
              <div className="border-t border-[var(--tk-line)] p-4 text-sm text-[var(--tk-muted)]">
                Can&apos;t see the document?{' '}
                <Link href={fileUrl} target="_blank" rel="noreferrer" className="font-semibold text-[var(--tk-accent)] underline">Open it in a new tab</Link>.
              </div>
            </div>
          ) : null}
          <EditableShareRow title={post.title} />
        </article>
        <aside className="min-w-0 space-y-6 lg:sticky lg:top-28 lg:self-start">
          {fileUrl ? (
            <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
              <p className="text-sm font-semibold">Get this document</p>
              <p className="mt-2 text-sm leading-6 text-[var(--tk-muted)]">Open or download the full file in a new tab.</p>
              <Link href={fileUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-3 text-[13px] font-semibold text-[var(--tk-on-accent)] transition hover:brightness-105">
                Download <Download className="h-4 w-4" />
              </Link>
            </div>
          ) : null}
          <RelatedPanel task="pdf" related={related} />
        </aside>
      </div>
    </section>
  )
}
