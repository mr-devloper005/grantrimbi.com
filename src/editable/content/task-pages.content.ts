import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

export const taskPageVoices = {
  article: {
    eyebrow: 'Reading room',
    headline: 'Longer pieces, given room to breathe.',
    description:
      'Essays, guides and explainers, set in a comfortable measure with the pacing of a publication rather than a feed.',
    filterLabel: 'Choose a topic',
    secondaryNote: 'Reading surfaces need space, hierarchy and fewer distractions.',
    chips: ['Long reads', 'Guides', 'Topic filters'],
  },
  classified: {
    eyebrow: 'The marketplace',
    headline: 'Current notices, offers and announcements.',
    description:
      'Everything available right now, arranged so the price, the place and the point of the notice are clear before you open it.',
    filterLabel: 'Filter by category',
    secondaryNote: 'Quick to scan, honest about the detail, easy to act on.',
    chips: ['Newest first', 'Clear pricing', 'Direct contact'],
  },
  sbm: {
    eyebrow: 'The shelf',
    headline: 'Saved references, grouped into collections.',
    description: 'Useful links, tools and reading kept tidy on shelves you can return to.',
    filterLabel: 'Filter collection',
    secondaryNote: 'Curated resources need grouping and calm metadata.',
    chips: ['Collections', 'Resources', 'Reference'],
  },
  profile: {
    eyebrow: 'The directory of people',
    headline: 'The makers, businesses and members behind the entries.',
    description:
      'Each profile gathers a proper introduction, a way to make contact and everything that person has published in one place.',
    filterLabel: 'Filter by category',
    secondaryNote: 'Identity and credibility, visible before the grid begins.',
    chips: ['Introductions', 'Contact details', 'Published work'],
  },
  pdf: {
    eyebrow: 'The archive',
    headline: 'Documents and papers, ready to read or download.',
    description: 'Reports, guides and reference files presented as a library rather than a list of attachments.',
    filterLabel: 'Filter document type',
    secondaryNote: 'Document surfaces need archive cues and clear file context.',
    chips: ['Documents', 'Guides', 'Downloads'],
  },
  listing: {
    eyebrow: 'The directory',
    headline: 'Places, services and spaces worth knowing about.',
    description: 'Listings built for comparison — location, contact and the detail that decides it, all on the card.',
    filterLabel: 'Filter by category',
    secondaryNote: 'Prioritise comparison, location and direct action paths.',
    chips: ['Compare', 'Location', 'Contact'],
  },
  image: {
    eyebrow: 'The gallery',
    headline: 'Photographs and visual sets, shown large.',
    description: 'Image-led entries where the picture carries the page and the words stay out of the way.',
    filterLabel: 'Filter visual category',
    secondaryNote: 'Let the images carry the page before the text does.',
    chips: ['Gallery', 'Visual first', 'Portfolio'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
