import type { CSSProperties } from 'react'

/*
  Grantrimbi visual system — "warm editorial".

  A luxury-editorial palette: paper white surfaces, warm sand panels, a cool
  stone panel for calm sections, deep espresso ink for text and dark bands, and
  a single terracotta accent that carries every action. Headlines use a modern
  serif; interface text uses a quiet grotesk. Everything below is a token —
  sections, cards and pages read these instead of hard-coding colour.
*/
export const editableRootStyle = {
  '--slot4-page-bg': '#ffffff',
  '--slot4-page-text': '#201a16',
  '--slot4-panel-bg': '#f6f2ec',
  '--slot4-surface-bg': '#ffffff',
  '--slot4-muted-text': '#6e635b',
  '--slot4-soft-muted-text': '#9a8f86',
  '--slot4-accent': '#b75c2c',
  '--slot4-accent-fill': '#c2652f',
  '--slot4-accent-soft': '#fbede3',
  '--slot4-on-accent': '#ffffff',
  '--slot4-dark-bg': '#24201d',
  '--slot4-dark-text': '#f7f3ee',
  '--slot4-media-bg': '#ece5dd',
  '--slot4-cream': '#fbf8f4',
  '--slot4-warm': '#f6f2ec',
  '--slot4-lavender': '#edf1f6',
  '--slot4-gray': '#f2f4f7',
  '--slot4-body-gradient': 'none',

  '--editable-page-bg': '#ffffff',
  '--editable-page-text': '#201a16',
  '--editable-container': '1320px',
  '--editable-border': '#e7e0d8',
  '--editable-border-strong': '#d8cec2',
  '--editable-nav-bg': '#ffffff',
  '--editable-nav-text': '#201a16',
  '--editable-nav-active': '#b75c2c',
  '--editable-nav-active-text': '#ffffff',
  '--editable-cta-bg': '#c2652f',
  '--editable-cta-text': '#ffffff',
  '--editable-search-bg': '#ffffff',
  '--editable-footer-bg': '#24201d',
  '--editable-footer-text': '#f7f3ee',

  /* Signature surfaces used by the hero, banded sections and image masks. */
  '--gr-sunrise': 'linear-gradient(118deg,#fbcfa8 0%,#f4ac7a 44%,#e88c55 100%)',
  '--gr-sunrise-soft': 'linear-gradient(118deg,#fdf0e4 0%,#fbe0cc 100%)',
  '--gr-ink-band': 'linear-gradient(180deg,#292421 0%,#1e1a17 100%)',
  '--gr-stone': '#edf1f6',
  '--gr-veil': 'linear-gradient(180deg,rgba(32,26,22,0) 38%,rgba(32,26,22,0.86) 100%)',
  '--gr-ring': 'rgba(183,92,44,0.22)',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  onAccentText: 'text-[var(--slot4-on-accent)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[var(--editable-border)]',
  darkBorder: 'border-white/12',
  shadow: 'shadow-[0_2px_10px_rgba(32,26,22,0.05)]',
  shadowStrong: 'shadow-[0_26px_60px_rgba(32,26,22,0.14)]',
  overlay: 'bg-[var(--gr-veil)]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8',
    sectionY: 'py-16 sm:py-20 lg:py-24',
    wide: 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-6 lg:px-8',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center',
    rail: 'flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[260px] shrink-0 snap-start sm:w-[300px]',
  },
  type: {
    eyebrow: 'text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--slot4-accent)]',
    heroTitle: 'gr-display text-[2.65rem] font-semibold leading-[1.02] tracking-[-0.025em] sm:text-6xl lg:text-[4.1rem]',
    sectionTitle: 'gr-display text-[2rem] font-semibold leading-[1.08] tracking-[-0.02em] sm:text-[2.6rem]',
    body: 'text-base leading-[1.85]',
    lead: 'gr-serif text-lg leading-[1.85] sm:text-xl',
  },
  surface: {
    card: `rounded-[1.5rem] border ${editablePalette.border} ${editablePalette.surfaceBg} ${editablePalette.shadow}`,
    soft: `rounded-[1.5rem] border ${editablePalette.border} ${editablePalette.panelBg}`,
    dark: `rounded-[1.75rem] ${editablePalette.darkBg} ${editablePalette.darkText} ${editablePalette.shadowStrong}`,
    accent: 'rounded-[1.5rem] bg-[var(--slot4-accent-fill)] text-[var(--slot4-on-accent)]',
  },
  button: {
    primary:
      'gr-pill inline-flex items-center justify-center gap-3 rounded-full bg-[var(--slot4-accent-fill)] py-3 pl-7 pr-3 text-sm font-semibold text-[var(--slot4-on-accent)] transition duration-300 hover:brightness-105 active:scale-[0.98]',
    secondary:
      'inline-flex items-center justify-center gap-2.5 rounded-full border border-[var(--editable-border-strong)] bg-[var(--slot4-surface-bg)] px-7 py-3 text-sm font-semibold text-[var(--slot4-page-text)] transition duration-300 hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)] active:scale-[0.98]',
    accent:
      'inline-flex items-center justify-center gap-2.5 rounded-full bg-[var(--slot4-accent-fill)] px-7 py-3 text-sm font-semibold text-[var(--slot4-on-accent)] transition duration-300 hover:brightness-105 active:scale-[0.98]',
    ghost:
      'inline-flex items-center gap-2 text-sm font-semibold text-[var(--slot4-accent)] transition duration-300 hover:gap-3',
  },
  media: {
    frame: `relative overflow-hidden rounded-[1.35rem] ${editablePalette.mediaBg}`,
    ratio: 'aspect-[4/3]',
    circle: `relative overflow-hidden rounded-full ${editablePalette.mediaBg}`,
  },
  motion: {
    lift: 'transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_26px_60px_rgba(32,26,22,0.14)]',
    fade: 'transition duration-300 hover:opacity-80',
    zoom: 'transition duration-700 group-hover:scale-[1.05]',
  },
} as const

export const aiLayoutRules = [
  'Change the full site colour palette in editableRootStyle first; every section consumes those CSS variables.',
  'Keep homepage structure in src/editable/sections/HomeSections.tsx so the whole home experience can be redesigned in one file.',
  'Headlines use the serif display face (.gr-display); interface labels use the grotesk body face.',
  'Mix card styles deliberately — feature, image-first, compact, horizontal and editorial list — never one card everywhere.',
  'Keep dynamic post fetching intact; do not replace posts with mock arrays.',
  'Use postHref() for all post links so task-specific routes keep working.',
] as const
