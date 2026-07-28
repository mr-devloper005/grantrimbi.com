import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'Listings and profiles, considered',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Listings & profiles',
    primaryLinks: [
      { label: 'Classifieds', href: '/classified' },
      { label: 'Search', href: '/search' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Member area', href: '/login' },
      secondary: { label: 'Post a notice', href: '/create' },
    },
  },
  footer: {
    tagline: 'A calmer place to browse listings and people',
    description:
      'A considered directory of current notices and the people behind them — arranged to be read slowly, searched quickly, and returned to often.',
    /* Value strip rendered above the footer columns. */
    promises: [
      {
        title: 'Kept current',
        body: 'Notices and profiles refresh as new entries are published, so the front page always reflects today.',
      },
      {
        title: 'Easy to navigate',
        body: 'Clear categories, an honest search, and pages that load quickly on whatever you are holding.',
      },
      {
        title: 'Built to be read',
        body: 'Generous type, real photography and layouts that put the entry itself ahead of the decoration.',
      },
    ],
    columns: [
      {
        title: 'Browse',
        links: [
          { label: 'Classifieds', href: '/classified' },
          { label: 'Search', href: '/search' },
        ],
      },
      {
        title: 'Site',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Notes', href: '/comments' },
        ],
      },
    ],
    bottomNote: 'Made for clear browsing and connected publishing.',
  },
  commonLabels: {
    readMore: 'Read the entry',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Published',
  },
} as const
