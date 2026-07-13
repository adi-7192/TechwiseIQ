export type HomeServiceId = 'web' | 'software' | 'ai'

export type HomeService = {
  id: HomeServiceId
  number: string
  outcome: string
  title: string
  summary: string
  deliverables: readonly string[]
  href: string
}

export const PROBLEM_SIGNALS = [
  'The website looks smaller than the business',
  'Busywork owns the calendar',
  'Your tools refuse to talk',
  'Good leads die in the handoff',
] as const

export const HOME_SERVICES: readonly HomeService[] = [
  {
    id: 'web',
    number: '001',
    outcome: 'Make choosing easy',
    title: 'Web Development',
    summary:
      'Strategy, design and development in one continuous build. Websites engineered to explain the business clearly and earn the next click.',
    deliverables: [
      'Marketing sites',
      'E-commerce',
      'CMS builds',
      'SEO + GEO',
    ],
    href: '/services/web',
  },
  {
    id: 'software',
    number: '002',
    outcome: 'Make operations lighter',
    title: 'Custom Software',
    summary:
      'Portals, dashboards, internal tools and products shaped around how your business actually runs.',
    deliverables: [
      'Web apps',
      'Portals',
      'APIs',
      'Integrations',
      'Legacy rebuilds',
    ],
    href: '/services/software',
  },
  {
    id: 'ai',
    number: '003',
    outcome: 'Make repetition optional',
    title: 'AI Automation',
    summary:
      'Documents processed, emails triaged and reports assembled, with human review wherever judgment matters.',
    deliverables: [
      'Workflow automation',
      'AI on your data',
      'Document processing',
      'AI audits',
    ],
    href: '/services/ai',
  },
] as const

export const DELIVERY_PROMISES = [
  ['Fixed scope', 'Written before the build.'],
  ['Weekly demos', 'Progress you can click.'],
  ['Direct access', 'Talk to the builders.'],
  ['Clean ownership', 'Your product and code.'],
] as const

export const PROCESS_STEPS = [
  ['01', 'Diagnose', 'Map the bottleneck.'],
  ['02', 'Scope', 'Fix timeline and cost.'],
  ['03', 'Build', 'Demo every week.'],
  ['04', 'Run', 'Launch and hand over.'],
] as const
