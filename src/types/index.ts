// Shared TypeScript types for Techwise IQ website

export type Service = {
  id: 'web' | 'software' | 'ai'
  title: string
  tagline: string
  description: string
  href: string
}

export type CaseStudy = {
  slug: string
  title: string
  outcome: string
  client: string
  industry: string
  service: Service['id']
  timeline: string
  stack: string[]
  liveUrl?: string
  coverImage?: string
}

export type NavLink = {
  label: string
  href: string
  isCta?: boolean
}
