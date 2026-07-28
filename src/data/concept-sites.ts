export type ConceptSite = {
  slug: string
  title: string
  category: string
  summary: string
  tags: string[]
  demoPath?: string
  previewMode?: 'live-auto-scroll'
  status: 'draft' | 'published'
}

export const CONCEPT_SITES: ConceptSite[] = [
  {
    slug: 'terra-elix',
    title: 'TerraElix',
    category: 'Wellness / supplements',
    summary:
      'A cinematic plant-based supplement launch built around natural balance and clean energy.',
    tags: ['Art direction', 'Responsive UI', 'Motion'],
    demoPath: '/concepts/terra-elix/index.html',
    previewMode: 'live-auto-scroll',
    status: 'published',
  },
  {
    slug: 'mentality',
    title: 'mėntality',
    category: 'Mental wellbeing',
    summary:
      'An editorial mental-health resource experience combining calm guidance with conversational discovery.',
    tags: ['Editorial UI', 'Video', 'Glass UI'],
    demoPath: '/concepts/mentality/index.html',
    previewMode: 'live-auto-scroll',
    status: 'published',
  },
  {
    slug: 'lumora',
    title: 'Lumora',
    category: 'Mindfulness / focus',
    summary:
      'A cinematic focus experience that turns ambient worlds into a calm invitation to work with intention.',
    tags: ['Cinematic UI', 'Ambient video', 'Interaction'],
    demoPath: '/concepts/lumora/index.html',
    previewMode: 'live-auto-scroll',
    status: 'published',
  },
]
