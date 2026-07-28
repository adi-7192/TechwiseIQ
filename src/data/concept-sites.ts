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
    slug: 'saas-concept',
    title: 'SaaS product concept',
    category: 'B2B SaaS / product platform',
    summary:
      'A reserved demo slot for a technical product story and conversion journey.',
    tags: ['Product story', 'Data UI', 'Conversion'],
    status: 'draft',
  },
  {
    slug: 'commerce-concept',
    title: 'Commerce concept',
    category: 'E-commerce / lifestyle',
    summary:
      'A reserved demo slot for product storytelling and a focused shopping path.',
    tags: ['E-commerce', 'Editorial UI', 'Product UX'],
    status: 'draft',
  },
]
