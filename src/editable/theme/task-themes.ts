import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

/*
  Task surfaces — Grantrimbi "warm editorial".

  Every task archive and detail page shares one cohesive identity: paper-white
  surfaces, warm sand panels, espresso ink text and a single terracotta accent,
  with a modern serif display face. Only the voice tokens (kicker / note) and a
  small tint shift vary per task, so Classifieds and Profiles each keep a little
  character without breaking the visual system. Tokens ship as `--tk-*` vars.
*/

export type TaskTheme = {
  /** short flavour word shown as an eyebrow kicker */
  kicker: string
  /** one-line mood note for the page intro */
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const DISPLAY = "'Fraunces', 'Newsreader', ui-serif, Georgia, serif"
const BODY = "'DM Sans', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

const base = {
  dark: false,
  fontDisplay: DISPLAY,
  fontBody: BODY,
  bg: '#ffffff',
  surface: '#ffffff',
  raised: '#f6f2ec',
  text: '#201a16',
  muted: '#6e635b',
  line: '#e7e0d8',
  accent: '#b75c2c',
  accentSoft: '#fbede3',
  onAccent: '#ffffff',
  glow: 'rgba(183,92,44,0.10)',
  radius: '1.35rem',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...base, kicker: 'Reading room', note: 'Considered writing, guides and long-form pieces worth the time.' },
  listing: { ...base, kicker: 'The directory', note: 'Places, services and spaces, presented with the detail they deserve.' },
  classified: {
    ...base,
    raised: '#f6f2ec',
    kicker: 'The marketplace',
    note: 'Current offers and announcements, laid out to be read at a glance.',
  },
  image: { ...base, raised: '#edf1f6', kicker: 'The gallery', note: 'Photographs and visual sets, given room to breathe.' },
  sbm: { ...base, kicker: 'The shelf', note: 'Saved references and collections, kept tidy and easy to return to.' },
  pdf: { ...base, kicker: 'The archive', note: 'Documents, guides and papers available to read or download.' },
  profile: {
    ...base,
    raised: '#edf1f6',
    glow: 'rgba(120,140,170,0.14)',
    kicker: 'The directory of people',
    note: 'Makers, businesses and contributors, introduced properly.',
  },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

/** All `--tk-*` tokens + font overrides for a task surface, ready for `style`. */
export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    // Re-point the shared article-body accent vars so post HTML (headings,
    // links) inherits this task's accent instead of the global site accent.
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
