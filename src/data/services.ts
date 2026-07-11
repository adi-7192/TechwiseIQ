export type ServiceId = 'web' | 'software' | 'ai'
export type ServiceMotifId = ServiceId

export interface OutcomeStage {
  title: string
  body: string
}

export interface Capability {
  title: string
  body: string
}

export interface ServiceProcessStep {
  num: string
  title: string
  body: string
}

export interface ServiceFaq {
  question: string
  answer: string
}

export interface ServiceContent {
  id: ServiceId
  number: '001' | '002' | '003'
  slug: `/services/${ServiceId}`
  title: string
  outcome: string
  description: string
  fitSignals: string[]
  symptoms: string[]
  outcomes: OutcomeStage[]
  capabilities: Capability[]
  process: ServiceProcessStep[]
  faqs: ServiceFaq[]
  proofSlugs: string[]
  motif: ServiceMotifId
}

export interface ServiceProblem {
  id: string
  label: string
  rationale: string
  examples: string[]
  primaryService: ServiceId
  secondaryServices: ServiceId[]
}

export const SERVICES: Record<ServiceId, ServiceContent> = {
  web: {
    id: 'web',
    number: '001',
    slug: '/services/web',
    title: 'Web Development',
    outcome: 'Attention into action.',
    description:
      'Custom websites engineered to earn attention, answer the right questions, and turn interest into action.',
    fitSignals: ['Launch', 'Reposition', 'Convert', 'Rank'],
    symptoms: [
      'Your website no longer reflects the business.',
      'Visitors arrive but do not take the next step.',
      'Your team cannot update content without help.',
      'Performance, search, or mobile experience is slipping.',
    ],
    outcomes: [
      {
        title: 'Hard to explain',
        body: 'A generic site that makes visitors work for the answer.',
      },
      {
        title: 'Easy to choose',
        body: 'A clear story, confident proof, and an obvious next action.',
      },
      {
        title: 'Built to evolve',
        body: 'Fast foundations and content your team can manage.',
      },
    ],
    capabilities: [
      {
        title: 'Strategy + structure',
        body: 'Audience, positioning, journeys, and information architecture before decoration.',
      },
      {
        title: 'Custom art direction',
        body: 'A distinct interface shaped around your brand. No reskinned templates.',
      },
      {
        title: 'Production development',
        body: 'Responsive, accessible code engineered for speed and maintainability.',
      },
      {
        title: 'CMS + integrations',
        body: 'Content editing, analytics, CRM, forms, and the systems behind the site.',
      },
      {
        title: 'SEO + GEO foundations',
        body: 'Semantic structure and crawlable answers for search and AI discovery.',
      },
      {
        title: 'Launch + support',
        body: 'Quality assurance, analytics validation, handover, and post-launch care.',
      },
    ],
    process: [
      {
        num: '01',
        title: 'Discover',
        body: 'Goals, audience, competitors, and the decisions the site needs to support.',
      },
      {
        num: '02',
        title: 'Design in context',
        body: 'Shape the visual system in-browser so motion, content, and responsiveness work together.',
      },
      {
        num: '03',
        title: 'Build + demonstrate',
        body: 'Production code from day one, with working progress shown every week.',
      },
      {
        num: '04',
        title: 'Launch + learn',
        body: 'Performance, accessibility, SEO, analytics, and a clean handover.',
      },
    ],
    faqs: [
      {
        question: 'How long does a website take?',
        answer:
          'Marketing sites typically take 3–4 weeks, CMS builds 5–7 weeks, and e-commerce projects 7–10 weeks. You see working progress every Friday.',
      },
      {
        question: 'Do I get a custom design or a template?',
        answer:
          'Custom design every time. The interface is designed around your brand, audience, content, and goals.',
      },
      {
        question: 'Can my team update the website?',
        answer:
          'Yes. When content editing is part of the brief, we provide a CMS and a clear handover so your team can make routine updates.',
      },
      {
        question: 'What happens after launch?',
        answer:
          'Launch includes a stabilization period, documentation, and a clean handover. Ongoing support is available when you need it.',
      },
    ],
    proofSlugs: ['aaskra-realty', 'express-trade-financing'],
    motif: 'web',
  },
  software: {
    id: 'software',
    number: '002',
    slug: '/services/software',
    title: 'Custom Software',
    outcome: 'Friction into flow.',
    description:
      'Software shaped around the way your operation actually works—not the other way around.',
    fitSignals: ['Portals', 'Dashboards', 'Integrations', 'MVPs'],
    symptoms: [
      'Teams re-enter the same data in multiple places.',
      'Important work depends on spreadsheets and workarounds.',
      'Generic tools force your process into the wrong shape.',
      'A product idea needs a focused, testable first release.',
    ],
    outcomes: [
      {
        title: 'Disconnected',
        body: 'People, data, and tools work around each other.',
      },
      {
        title: 'One usable flow',
        body: 'The right information reaches the right person at the right time.',
      },
      {
        title: 'Ready to evolve',
        body: 'A documented product foundation that can grow with the operation.',
      },
    ],
    capabilities: [
      {
        title: 'Web applications',
        body: 'Purpose-built products for customers, partners, and teams.',
      },
      {
        title: 'Internal dashboards',
        body: 'Decision-ready views of the work that matters.',
      },
      {
        title: 'APIs + integrations',
        body: 'Reliable connections between existing systems.',
      },
      {
        title: 'Legacy rebuilds',
        body: 'Modern, maintainable replacements for fragile software.',
      },
      {
        title: 'Mobile MVPs',
        body: 'Focused first releases for iOS and Android.',
      },
      {
        title: 'Ongoing iteration',
        body: 'Measured improvements after the first release.',
      },
    ],
    process: [
      {
        num: '01',
        title: 'Diagnose',
        body: 'Map workflows, pain points, users, and existing systems.',
      },
      {
        num: '02',
        title: 'Architect',
        body: 'Document stack decisions, data model, and integration boundaries.',
      },
      {
        num: '03',
        title: 'Sprint',
        body: 'Demonstrate working software every week.',
      },
      {
        num: '04',
        title: 'Ship',
        body: 'Deploy, document, hand over, and plan the next measured iteration.',
      },
    ],
    faqs: [
      {
        question: 'How long does custom software take?',
        answer:
          'Focused internal tools often take 6–9 weeks, mobile MVPs 10–14 weeks, and larger builds are scoped after diagnosis.',
      },
      {
        question: 'Can you rebuild our existing system?',
        answer:
          'Yes. We diagnose the current state, define migration boundaries, and plan a staged replacement that protects critical operations.',
      },
      {
        question: 'How do we stay involved?',
        answer:
          'You see and use working software every week. Decisions are documented and demos are built into the delivery rhythm.',
      },
      {
        question: 'Do you support the software after launch?',
        answer:
          'Yes. We can continue with maintenance and iteration, or hand over the code and documentation cleanly to your team.',
      },
    ],
    proofSlugs: [],
    motif: 'software',
  },
  ai: {
    id: 'ai',
    number: '003',
    slug: '/services/ai',
    title: 'AI Automation',
    outcome: 'Busywork into leverage.',
    description:
      'Controlled automations that remove repetitive work while keeping human judgment visible.',
    fitSignals: ['Documents', 'Email', 'Reporting', 'Assistants'],
    symptoms: [
      'Skilled people spend hours copying and classifying information.',
      'Documents and inboxes create avoidable queues.',
      'Reports are rebuilt manually from the same sources.',
      'The team wants to use AI but lacks a safe starting point.',
    ],
    outcomes: [
      {
        title: 'Manual input',
        body: 'Repetitive work consumes attention and creates delays.',
      },
      {
        title: 'Controlled automation',
        body: 'Machines handle the repeatable steps while people own exceptions.',
      },
      {
        title: 'Useful action',
        body: 'Information arrives ready for a decision, response, or next step.',
      },
    ],
    capabilities: [
      {
        title: 'Workflow automation',
        body: 'Repeatable processes connected from trigger to result.',
      },
      {
        title: 'AI assistants',
        body: 'Grounded assistance using approved business knowledge.',
      },
      {
        title: 'Document extraction',
        body: 'Structured data from forms, invoices, and operational documents.',
      },
      {
        title: 'Email triage',
        body: 'Classification, routing, drafting, and escalation.',
      },
      {
        title: 'Report generation',
        body: 'Consistent summaries assembled from trusted sources.',
      },
      {
        title: 'AI audit + roadmap',
        body: 'Ranked opportunities, risks, and an evidence-based starting point.',
      },
    ],
    process: [
      {
        num: '01',
        title: 'Audit',
        body: 'Map workflows and rank opportunities by value, risk, and feasibility.',
      },
      {
        num: '02',
        title: 'Pilot',
        body: 'Automate one workflow end to end and prove the control model.',
      },
      {
        num: '03',
        title: 'Scale',
        body: 'Integrate with existing tools and extend to adjacent workflows.',
      },
      {
        num: '04',
        title: 'Monitor',
        body: 'Track errors, exceptions, performance, and ongoing reliability.',
      },
    ],
    faqs: [
      {
        question: 'Where do I start with AI?',
        answer:
          'Start with a workflow audit. We map repeatable work, identify useful opportunities, and document the risks and control points.',
      },
      {
        question: 'What kind of automations do you build?',
        answer:
          'Document processing, email triage, report generation, WhatsApp flows, and assistants grounded in approved business data.',
      },
      {
        question: 'Will AI replace our team?',
        answer:
          'The goal is to remove repetitive steps, not human judgment. People remain responsible for exceptions and important decisions.',
      },
      {
        question: 'Do you work with our existing tools?',
        answer:
          'Yes. We design around the systems already running your operation and add clear fallbacks where integrations fail.',
      },
    ],
    proofSlugs: [],
    motif: 'ai',
  },
}

export const SERVICE_PROBLEMS: ServiceProblem[] = [
  {
    id: 'website',
    label: 'Our website is underperforming',
    rationale:
      'The story, experience, or technical foundation is stopping visitors from acting.',
    examples: ['Positioning', 'Conversion', 'CMS', 'Search visibility'],
    primaryService: 'web',
    secondaryServices: [],
  },
  {
    id: 'manual-work',
    label: 'Manual work is eating the week',
    rationale:
      'Repeatable work can move faster while people keep control of exceptions.',
    examples: [
      'Document processing',
      'Email triage',
      'Reporting',
      'AI assistants',
    ],
    primaryService: 'ai',
    secondaryServices: ['software'],
  },
  {
    id: 'disconnected-tools',
    label: "Our tools don't talk to each other",
    rationale:
      'A shared workflow or custom integration can remove duplicate work and broken handoffs.',
    examples: ['APIs', 'Portals', 'Dashboards', 'Integrations'],
    primaryService: 'software',
    secondaryServices: ['ai'],
  },
  {
    id: 'launch-product',
    label: 'We need to launch a product',
    rationale:
      'A focused product sprint can turn the idea into something users can test.',
    examples: ['Product scope', 'Web app', 'Mobile MVP', 'Launch system'],
    primaryService: 'software',
    secondaryServices: ['web'],
  },
  {
    id: 'unsure',
    label: "We're not sure where to begin",
    rationale:
      'Start with diagnosis: map the constraint before choosing a tool.',
    examples: [
      'Workflow map',
      'Opportunity ranking',
      'Technical direction',
      'Written scope',
    ],
    primaryService: 'software',
    secondaryServices: ['web', 'ai'],
  },
]

export const SERVICE_LIST = Object.values(SERVICES)

export function createServiceJsonLd(service: ServiceContent) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FAQPage',
        mainEntity: service.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
      {
        '@type': 'Service',
        '@id': `https://techwiseiq.com${service.slug}#service`,
        name: service.title,
        serviceType: service.title,
        url: `https://techwiseiq.com${service.slug}`,
        provider: { '@id': 'https://techwiseiq.com/#organization' },
        areaServed: ['Dubai', 'United Arab Emirates', 'Worldwide'],
        description: service.description,
      },
    ],
  }
}
