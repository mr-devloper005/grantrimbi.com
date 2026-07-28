import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Classifieds and profiles, arranged with care',
      description:
        'Browse current notices, offers and the people behind them through a calm, well-spaced directory built for reading rather than skimming.',
      openGraphTitle: 'Classifieds and profiles, arranged with care',
      openGraphDescription:
        'A considered directory of current notices, offers and member profiles — easy to search, easy to read, refreshed as new entries arrive.',
      keywords: ['classifieds', 'local notices', 'member profiles', 'directory', 'listings'],
    },
    hero: {
      badge: 'Because a good find deserves a good page',
      title: ['Everything worth', 'finding, in one place.'],
      description:
        'Current notices, honest descriptions and the people behind them — presented with the space and typography a real entry deserves.',
      primaryCta: { label: 'Browse the marketplace', href: '/classified' },
      searchPlaceholder: 'Search notices, categories, names…',
      focusLabel: 'In focus',
      featureCardBadge: 'Latest entries',
      featureCardTitle: 'The newest entries set the tone of the front page.',
      featureCardDescription:
        'Recent photography and headlines stay at the centre of the experience, refreshed as new posts are published.',
    },
    intro: {
      badge: 'What this is',
      title: 'A directory that reads like a publication.',
      paragraphs: [
        'Most listing pages ask you to scan. This one asks you to read. Each notice keeps its own photography, its own description and enough room around it to be understood properly.',
        'Classifieds and profiles sit side by side rather than in separate silos, so an interesting entry always leads somewhere — to the person who posted it, or to something similar worth a look.',
        'Everything is organised around two simple questions: what is available right now, and who is behind it.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'A front page shaped by the newest entries, not a fixed template.',
        'Classifieds and profiles connected through shared categories.',
        'Search that looks across every section at once.',
        'Layouts that stay readable on a phone as well as a desktop.',
      ],
      primaryLink: { label: 'Browse classifieds', href: '/classified' },
    },
    cta: {
      badge: 'Add your own',
      title: 'Have something worth listing?',
      description:
        'Post a notice, introduce yourself, or ask a question. Entries appear alongside everything else, with the same care and the same amount of room.',
      primaryCta: { label: 'Post an entry', href: '/create' },
      secondaryCta: { label: 'Talk to us', href: '/contact' },
    },
    /* Rotating strip under the hero. */
    marquee: [
      'Fresh notices daily',
      'Verified member profiles',
      'Category-led browsing',
      'Photography-first entries',
      'Search across every section',
      'Clear contact details',
    ],
    /* Dark band, mirrors the "getting started" strip in the reference layout. */
    steps: {
      eyebrow: 'Getting started is simple',
      items: [
        { title: 'Find what is current', body: 'Open the marketplace and browse by category, price or the newest arrivals.' },
        { title: 'Meet who is behind it', body: 'Every profile collects the entries, contact details and background in one place.' },
      ],
    },
    /* Coverage / stats panel. */
    coverage: {
      eyebrow: 'Where we are',
      title: 'Close to whatever you are looking for',
      description:
        'Entries arrive from every corner of the directory — small independent notices as often as established names. Browse by category to narrow it down in a step.',
      cta: { label: 'Open the categories', href: '/classified' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'The newest entries published in this section.',
    },
  },
  about: {
    badge: 'Our approach',
    title: 'A calmer way to browse listings and people.',
    description: `${slot4BrandConfig.siteName} brings notices, offers and member profiles together into one directory that is pleasant to read and quick to search.`,
    paragraphs: [
      'Rather than splitting everything into disconnected pages, entries stay linked: a notice leads to the person who posted it, and a profile collects everything they have shared.',
      'The design does very little on purpose. Generous type, honest photography and plenty of white space let each entry speak for itself.',
    ],
    values: [
      {
        title: 'Readable before clever',
        description: 'Clear hierarchy, real sentences and enough room around every entry to take it in properly.',
      },
      {
        title: 'Connected sections',
        description: 'Classifieds and profiles share categories and search, so browsing naturally leads somewhere useful.',
      },
      {
        title: 'Straightforward throughout',
        description: 'Simple navigation, obvious contact routes and pages that behave the same on every screen.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Tell us what you are trying to publish, fix or find.',
    description:
      'Whether it is a new entry, a correction to an existing one, or a question about how a section works — send it across and it will be routed to the right place.',
    formTitle: 'Send a message',
  },

  search: {
    metadata: {
      title: 'Search',
      description: 'Search notices, profiles, categories and content from every section of the site.',
    },
    hero: {
      badge: 'Search everything',
      title: 'Find the entry you had in mind.',
      description:
        'Search across classifieds, profiles and every other published section at once — by keyword, category or content type.',
      placeholder: 'Search by keyword, category, name or title',
    },
    resultsTitle: 'Recently published',
  },
  create: {
    metadata: {
      title: 'Create',
      description: 'Prepare and submit a new entry for the site.',
    },
    locked: {
      badge: 'Member access',
      title: 'Sign in to add an entry.',
      description: 'Use your account to open the publishing desk and prepare a new entry for any active section of the site.',
    },
    hero: {
      badge: 'Publishing desk',
      title: 'Prepare an entry worth reading.',
      description:
        'Pick the section, add the details, and give the entry a proper description, an image and a clear way to get in touch.',
    },
    formTitle: 'Entry details',
    submitLabel: 'Save entry',
    successTitle: 'Entry saved.',
  },
  auth: {
    login: {
      metadataDescription: 'Sign in to your account on this site.',
      badge: 'Member access',
      title: 'Welcome back.',
      description: 'Sign in to keep browsing, manage what you have published and prepare new entries.',
      formTitle: 'Sign in',
      submitLabel: 'Continue',
      noAccount: 'No account matched those details. Create an account first, then sign in.',
      success: 'Signed in. Taking you through…',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Create an account on this site.',
      badge: 'Join the directory',
      title: 'Create an account and start publishing.',
      description: 'An account gives you the publishing desk, saved details and a profile of your own.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created. Taking you through…',
      loginCta: 'Sign in',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related reading',
      fallbackTitle: 'Entry details',
    },
    listing: {
      relatedTitle: 'Related listings',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'More from the directory',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit official site',
    },
  },
} as const
