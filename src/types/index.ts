// Shared TypeScript types for Techwise IQ website

export type Service = {
  id: 'web' | 'software' | 'ai'
  title: string
  tagline: string
  description: string
  href: string
}

export type WorkSummary = {
  challenge: string
  decision: string
  outcome: string
  proof: { value: string; label: string }[]
}

export type CaseStudy = {
  slug: string
  featured: boolean
  title: string
  outcome: string
  workSummary: WorkSummary
  client: string
  industry: string
  service: Service['id']
  timeline: string
  stack: string[]
  liveUrl?: string
  coverImage?: string
  problem: string
  constraints: string
  approach: string[]
  deliverables: string[]
  result: string
  stats?: { value: string; label: string }[]
  fullPageImage?: { src: string; width: number; height: number }
  images?: string[]
}

export type NavLink = {
  label: string
  href: string
  isCta?: boolean
}
