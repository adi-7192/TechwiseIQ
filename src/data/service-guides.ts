import type { ServiceId } from './services'

/** Editorial detail drawn from the service catalogue; examples are possibilities, not client claims. */
interface ServiceGuide {
  promise: string
  introduction: string
  fitTitle: string
  buildTitle: string
  buildIntro: string
  examples: Record<string, string>
  expertiseTitle: string
  expertiseIntro: string
  standards: { title: string; body: string }[]
  handover: string[]
  brief: string
  demoCaption: string
  reviewTitle: string
  reviewBody: string
  reviewChecks: string[]
  /** Our own automations (D-032), not client work. */
  ownStack?: { title: string; body: string }[]
}

export const SERVICE_GUIDES: Record<ServiceId, ServiceGuide> = {
  web: {
    promise: 'Make your business easier to choose.',
    introduction:
      'Custom websites that explain your offer, earn trust, and give visitors a clear next step. Strategy, design, development, and launch shaped around your business.',
    fitTitle: 'Your website should carry the business forward.',
    buildTitle: 'From the first impression to the final enquiry.',
    buildIntro:
      'Marketing websites, CMS builds, and e-commerce projects. We agree the pages, content, integrations, and support you need before development starts.',
    examples: {
      'Strategy + structure':
        'For example: a service journey that answers buyer questions before the enquiry form.',
      'Custom art direction':
        'For example: a brand-led marketing site with purposeful motion and a distinct mobile experience.',
      'Production development':
        'For example: a responsive multi-page site with usable navigation, forms, and loading states.',
      'CMS + integrations':
        'For example: an editable insights section connected to analytics and your enquiry workflow.',
      'SEO + GEO foundations':
        'For example: descriptive page titles, structured data, and crawlable service content.',
      'Launch + support':
        'For example: device checks, enquiry testing, editor guidance, and post-launch stabilization.',
    },
    expertiseTitle: 'Good design goes all the way through.',
    expertiseIntro:
      'The visual finish matters. So do the decisions that make a site useful, discoverable, and easy to run.',
    standards: [
      {
        title: 'A clear argument before a layout',
        body: 'We organize content around what a visitor needs to understand, believe, and do. Each section earns its place in that journey.',
      },
      {
        title: 'Motion with a job to do',
        body: 'Interfaces demonstrate the offer. Navigation, reading, and calls to action stay usable on touch screens and with reduced motion.',
      },
      {
        title: 'Performance built into the experience',
        body: 'Image sizing, font loading, rendering, and animation cost are considered during the build, then checked on the actual pages.',
      },
      {
        title: 'A launch that works beyond the homepage',
        body: 'We check enquiry paths, mobile layouts, metadata, and content editing. Search foundations support discovery; rankings are not a guaranteed deliverable.',
      },
    ],
    handover: [
      'Agreed pages and responsive components',
      'CMS/editor guidance when scoped',
      'Integration and analytics setup notes',
      'Launch checks and support arrangements',
    ],
    brief:
      'Bring your current URL, brand material, and the action you want visitors to take. A new business can start with the offer and audience.',
    demoCaption:
      'A page assembles, adapts to mobile, and turns a clear call to action into an enquiry.',
    reviewTitle: 'See the decisions in the finished work.',
    reviewBody: 'Real projects, with the context and reasoning behind the design.',
    reviewChecks: [],
  },
  software: {
    promise: 'Software that fits the work.',
    introduction:
      'Customer portals, internal tools, web applications, and mobile MVPs built around your users and processes. Connect the information, decisions, and systems your business depends on.',
    fitTitle: 'When the work has outgrown the workaround.',
    buildTitle: 'The right tool for the way your team operates.',
    buildIntro:
      'Start with one valuable workflow or a focused first release. The scope can expand as users test the software and the priorities become clearer.',
    examples: {
      'Web applications':
        'For example: a customer or partner portal for submitting requests and tracking progress.',
      'Internal dashboards':
        'For example: an operations queue with ownership, status, and the next action in one view.',
      'APIs + integrations':
        'For example: pass approved records between a portal, CRM, and existing back-office tools.',
      'Legacy rebuilds':
        'For example: replace a fragile internal system in stages while keeping essential work running.',
      'Mobile MVPs':
        'For example: a focused iOS or Android app that lets users test the core product journey.',
      'Ongoing iteration':
        'For example: improve a frequently used workflow after reviewing feedback from the first release.',
    },
    expertiseTitle: 'The interface is only part of the system.',
    expertiseIntro:
      'We connect the visible experience to the data, permissions, and integration decisions that keep daily work dependable.',
    standards: [
      {
        title: 'Model the workflow before the screens',
        body: 'Identify the people, records, states, and handoffs first. A useful screen follows from understanding who needs to decide or act.',
      },
      {
        title: 'Make roles and rules explicit',
        body: 'Define who can view, change, and approve information. Validation belongs in the application logic as well as the interface.',
      },
      {
        title: 'Design for interrupted work',
        body: 'Discuss failed integrations, duplicate requests, and incomplete data during scoping. The recovery path is part of the workflow.',
      },
      {
        title: 'Build for the next person maintaining it',
        body: 'Document architecture and integration boundaries, demonstrate working software, and plan migration and handover alongside the release.',
      },
    ],
    handover: [
      'Agreed application and source code',
      'Architecture and integration documentation',
      'Deployment and configuration guidance',
      'Maintenance or internal handover plan',
    ],
    brief:
      'Bring one workflow, the people involved, and the tools it touches. Screenshots or a spreadsheet can be enough to start the discussion.',
    demoCaption:
      'An operational app assembles around a request, its checks, and a recorded approval.',
    reviewTitle: 'Look at how the work moves.',
    reviewBody:
      'The illustrative app above shows a request moving through review to approval. A project review should examine the rules behind those screens, too.',
    reviewChecks: [
      'Can each role see and act on the right information?',
      'What happens when a check fails or information is missing?',
      'Can the team trace a decision and continue the work?',
    ],
  },
  ai: {
    promise: 'Less repetitive work. More human control.',
    introduction:
      'Practical AI assistants and connected workflows for documents, inboxes, reporting, and business knowledge. We identify a useful starting point, build a controlled pilot, and expand what proves valuable.',
    fitTitle: 'Give your team their attention back.',
    buildTitle: 'Useful automation, from input to action.',
    buildIntro:
      'We combine explicit rules, integrations, and AI where judgment is useful. Not every step needs a model, and not every process should run without a person.',
    examples: {
      'Workflow automation':
        'For example: capture an enquiry, check required fields, and route it to the right team.',
      'AI assistants':
        'For example: help a team find answers in approved internal documents with a path to source material.',
      'Document extraction':
        'For example: turn invoice fields into a structured record and flag missing information for review.',
      'Email triage':
        'For example: classify incoming messages, suggest a response, and escalate an exception.',
      'Report generation':
        'For example: assemble a recurring summary from agreed sources for a person to check.',
      'AI audit + roadmap':
        'For example: compare candidate workflows by value, feasibility, data readiness, and risk.',
    },
    expertiseTitle: 'The control model is part of the product.',
    expertiseIntro:
      'A useful automation needs clear boundaries, an accountable owner, and a reliable route through exceptions.',
    standards: [
      {
        title: 'Explicit rules before AI judgment',
        body: 'Use deterministic rules for known checks. Keep model tasks bounded to work such as extraction, classification, or drafting.',
      },
      {
        title: 'Human review where it matters',
        body: 'Define the conditions that stop a workflow or send it to a person. Uncertain outputs and important actions need an agreed review path.',
      },
      {
        title: 'Approved information and integrations',
        body: 'Agree which sources and systems the workflow can use, what access it needs, and the fallback when an integration is unavailable.',
      },
      {
        title: 'Evaluate, trace, and improve',
        body: 'Use representative examples to review outputs and exceptions during the pilot. Plan logging and monitoring so the team can inspect what happened and improve the flow.',
      },
    ],
    handover: [
      'Agreed workflow and connected integrations',
      'Documented rules and review points',
      'Pilot findings and known limitations',
      'Monitoring and ongoing ownership plan',
    ],
    brief:
      'Bring a repetitive process and representative examples you are authorized to share. We can begin by mapping the workflow before accessing live systems.',
    demoCaption:
      'An enquiry becomes structured information, passes routing rules, and reaches a person for review.',
    reviewTitle: 'Judge the workflow by its exceptions, too.',
    reviewBody:
      'The illustrative flow above ends with human review. In a pilot, the difficult inputs and failure paths deserve as much attention as the successful run.',
    reviewChecks: [
      'Does an incomplete input stop or reach the right reviewer?',
      'Can a person inspect the source and correct the output?',
      'Is the next action clear when a connected tool fails?',
    ],
    ownStack: [
      {
        title: 'Motion graphics from code',
        body: 'We write our motion graphics as code, then render them. Edit a line, get a new cut.',
      },
      {
        title: 'Gmail automation',
        body: 'Routine inbox handling runs on its own. A person still reviews anything that needs a reply.',
      },
      {
        title: 'Lead generation',
        body: 'Finding and qualifying prospects runs as a workflow. A person decides who we approach.',
      },
      {
        title: 'Customer outreach',
        body: 'Follow-ups are prepared and scheduled automatically. A person approves what gets sent.',
      },
    ],
  },
}
