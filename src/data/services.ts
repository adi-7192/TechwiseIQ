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
      'Custom websites that explain what you do, answer buyers’ questions, and get them to contact you.',
    fitSignals: ['Launch', 'Refresh', 'Get enquiries', 'Get found'],
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
        body: 'Who it’s for, what they need to hear, and in what order. Sorted before any pixels.',
      },
      {
        title: 'Custom art direction',
        body: 'A look built around your brand. Not a template with your logo swapped in.',
      },
      {
        title: 'Production development',
        body: 'Fast, clean code that works on every screen and for every visitor.',
      },
      {
        title: 'CMS + integrations',
        body: 'Edit your own content, with forms, analytics and your CRM all connected.',
      },
      {
        title: 'Search foundations',
        body: 'Built so Google and AI search tools can read and understand your site.',
      },
      {
        title: 'Launch + support',
        body: 'Testing, launch, handover, and help after go-live.',
      },
    ],
    process: [
      {
        num: '01',
        title: 'Requirements',
        body: 'What the site needs to do, who it’s for, and what goes on it.',
      },
      {
        num: '02',
        title: 'Design options',
        body: 'Several design directions, side by side. We tell you our pick and why; you choose.',
      },
      {
        num: '03',
        title: 'Build your choice',
        body: 'We build the design you picked. You see real progress every week.',
      },
      {
        num: '04',
        title: 'Launch + learn',
        body: 'Speed, accessibility and search checks, analytics, then a clean handover.',
      },
    ],
    faqs: [
      {
        question: 'How long does a website take?',
        answer:
          'Marketing sites usually take 3–4 weeks, sites you edit yourself (CMS) 5–7 weeks, and online shops 7–10 weeks. You see real progress every Friday.',
      },
      {
        question: 'Do I get a custom design or a template?',
        answer:
          'Custom, every time. Designed around your brand, your customers and your content.',
      },
      {
        question: 'Can my team update the website?',
        answer:
          'Yes. If editing is part of the plan, you get an easy editor (a CMS) and we show your team how to use it.',
      },
      {
        question: 'What happens after launch?',
        answer:
          'We stay close for a settling-in period, then hand over the docs and logins. Ongoing support is there if you want it.',
      },
      {
        question: 'What is included in the scope?',
        answer:
          'We agree in writing: the pages, the design direction, who writes what, editing needs, connected tools, and launch checks. Writing content, moving an old site and ongoing support are agreed separately if you need them.',
      },
      {
        question: 'Can you improve an existing website?',
        answer:
          'Yes. We look at what’s there (content, visitor journey, code) and tell you what to keep and what to rebuild.',
      },
      {
        question: 'Will you guarantee search rankings or enquiries?',
        answer:
          'No. We build a site search engines can read and visitors can act on. Results also depend on your market, your offer, your content and what you do after launch.',
      },
    ],
    proofSlugs: ['supreme-universal', 'express-trade-financing', 'express-petroleum'],
    motif: 'web',
  },
  software: {
    id: 'software',
    number: '002',
    slug: '/services/software',
    title: 'Custom Software',
    outcome: 'Friction into flow.',
    description:
      'Portals, internal tools and apps built around how your team actually works.',
    fitSignals: ['Portals', 'Dashboards', 'Connected tools', 'First versions'],
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
        body: 'Apps for your customers, partners or team, with the right screens and access for each person.',
      },
      {
        title: 'Internal dashboards',
        body: 'Status, owners and next steps in one place, so nobody has to chase updates.',
      },
      {
        title: 'Connecting your tools',
        body: 'Get your existing tools sharing data cleanly, so nobody types the same thing twice.',
      },
      {
        title: 'Replacing old systems',
        body: 'Swap out an old system step by step, without stopping the work that depends on it.',
      },
      {
        title: 'First app versions',
        body: 'A focused first version for iOS and Android with just the essentials, so real users can try it.',
      },
      {
        title: 'Improving after launch',
        body: 'We keep improving the app after launch, guided by what its users tell us.',
      },
    ],
    process: [
      {
        num: '01',
        title: 'Requirements',
        body: 'How the work runs today, who does it, what hurts, and which tools are involved.',
      },
      {
        num: '02',
        title: 'Solution options',
        body: 'Build new, extend what you have, or connect existing tools. Pros, cons and our pick. You choose.',
      },
      {
        num: '03',
        title: 'Build, week by week',
        body: 'Working software every week, built the way you chose.',
      },
      {
        num: '04',
        title: 'Ship',
        body: 'Launch, document, hand over, and plan the next round of improvements.',
      },
    ],
    faqs: [
      {
        question: 'How long does custom software take?',
        answer:
          'Focused internal tools often take 6–9 weeks and first app versions 10–14 weeks. Bigger builds get a timeline once we understand them.',
      },
      {
        question: 'Can you rebuild our existing system?',
        answer:
          'Yes. We look at what you have, then replace it in stages so the day-to-day work keeps running.',
      },
      {
        question: 'How do we stay involved?',
        answer:
          'You see and use working software every week. Decisions are written down and demos are part of the routine.',
      },
      {
        question: 'Do you support the software after launch?',
        answer:
          'Yes. We can keep maintaining and improving it, or hand the code and docs over to your team.',
      },
      {
        question: 'Should we build custom software or use an existing tool?',
        answer:
          'Start with the work, not the tool. If something off the shelf fits, setting it up or connecting it may be enough. Custom makes sense when your process is too specific for generic tools.',
      },
      {
        question: 'What do you need to scope a project?',
        answer:
          'A description of the work, the people involved, the tools you use now, and the first result you need. We turn that into a written plan before we build.',
      },
      {
        question: 'What do we receive at handover?',
        answer:
          'The app, its source code and docs, plus how to deploy and run it. We also agree whether your team takes over or we keep maintaining it.',
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
    outcome: 'Repetitive work into useful action.',
    description:
      'Automations that take the repetitive work off your team, with a person checking what matters.',
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
        body: 'Software does the repeat steps; people handle the odd ones out.',
      },
      {
        title: 'Useful action',
        body: 'Information arrives ready for a decision, response, or next step.',
      },
    ],
    capabilities: [
      {
        title: 'Workflow automation',
        body: 'Repeat tasks that run on their own, from start to finish.',
      },
      {
        title: 'AI assistants',
        body: 'Assistants that answer from your own approved documents.',
      },
      {
        title: 'Document extraction',
        body: 'Pull the data out of forms, invoices and PDFs, automatically.',
      },
      {
        title: 'Inbox sorting',
        body: 'Sort, route and draft replies, and flag the tricky ones.',
      },
      {
        title: 'Report generation',
        body: 'Regular reports pulled together from sources you trust.',
      },
      {
        title: 'AI check-up + plan',
        body: 'Where AI would actually help, what the risks are, and where to start.',
      },
    ],
    process: [
      {
        num: '01',
        title: 'Requirements',
        body: 'We map your repeat work and rank where automation would help most.',
      },
      {
        num: '02',
        title: 'Options',
        body: 'Which task first, which tools, how much human checking: options with our pick. You choose.',
      },
      {
        num: '03',
        title: 'Try it small',
        body: 'Automate the task you chose, end to end, and prove the checks work.',
      },
      {
        num: '04',
        title: 'Grow + watch',
        body: 'Roll it out to similar tasks and keep an eye on errors and odd cases.',
      },
    ],
    faqs: [
      {
        question: 'Where do I start with AI?',
        answer:
          'Start with a look at your workflows. We find the repeat work, spot where AI would help, and write down the risks and where a person should check.',
      },
      {
        question: 'What kind of automations do you build?',
        answer:
          'Document processing, inbox sorting, reports, WhatsApp flows, and assistants that answer from your own approved data.',
      },
      {
        question: 'Will AI replace our team?',
        answer:
          'No. The goal is to remove repetitive steps, not people’s judgment. Your team still handles the odd cases and the big decisions.',
      },
      {
        question: 'Do you work with our existing tools?',
        answer:
          'Yes. We build around the tools you already use, with a backup plan for when one of them fails.',
      },
      {
        question: 'Does every automation need AI?',
        answer:
          'No. Simple checks and actions often work best as plain rules. AI earns its place in jobs like reading text, pulling out information or drafting a reply.',
      },
      {
        question: 'How do you handle business data?',
        answer:
          'Before we build, we agree which data, access and outside services the automation can use. Please don’t send sensitive live data in your first message.',
      },
      {
        question: 'How do we know a pilot is ready to expand?',
        answer:
          'We agree what a good result looks like, then check real examples, odd cases, how often a person had to step in, and any tool failures. That tells us whether to improve it, expand it, or stop.',
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
    rationale: 'The message, the experience or the tech is stopping visitors from getting in touch.',
    examples: ['Clear message', 'More enquiries', 'Easy editing', 'Getting found'],
    primaryService: 'web',
    secondaryServices: [],
  },
  {
    id: 'manual-work',
    label: 'Manual work is eating the week',
    rationale: 'Repeat work can run faster while people keep control of the odd cases.',
    examples: ['Document processing', 'Email triage', 'Reporting', 'AI assistants'],
    primaryService: 'ai',
    secondaryServices: ['software'],
  },
  {
    id: 'disconnected-tools',
    label: "Our tools don't talk to each other",
    rationale:
      'Connecting your tools, or one shared app, ends the copy-paste and the dropped handoffs.',
    examples: ['Connected tools', 'Portals', 'Dashboards', 'Shared data'],
    primaryService: 'software',
    secondaryServices: ['ai'],
  },
  {
    id: 'launch-product',
    label: 'We need to launch a product',
    rationale: 'A focused first version turns the idea into something people can actually try.',
    examples: ['What to build first', 'Web app', 'Mobile app', 'Launch plan'],
    primaryService: 'software',
    secondaryServices: ['web'],
  },
  {
    id: 'unsure',
    label: "We're not sure where to begin",
    rationale: 'First find what’s really slowing you down, then pick the tool.',
    examples: ['Map the work', 'Rank the options', 'Pick a direction', 'Written scope'],
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
