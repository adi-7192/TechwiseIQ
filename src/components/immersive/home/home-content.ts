import { BOOKING_URL, CONTACT_EMAIL, WHATSAPP_URL } from '@/lib/site'

/**
 * Homepage content for the immersive redesign.
 *
 * Structure follows docs/02_TARGET_INFORMATION_ARCHITECTURE.md +
 * docs/08_CONTENT_AND_ROUTE_MATRIX.md: hero → framing → four capability
 * chapters → selected work → operating model → final CTA. Copy is the approved
 * homepage architecture from those docs and the visual reference; no client
 * names, metrics or testimonials are fabricated (real proof lives in
 * `@/data/case-studies`, surfaced by SelectedWork).
 */

export type Scene = 'web' | 'automation' | 'apps' | 'advisory'

export type ProofVariant = 'website' | 'automation' | 'console' | 'opportunity'

export type Capability = {
  type: string
  head: string
  body: string
}

export type ChapterContent = {
  id: string
  scene: Scene
  index: string
  kicker: string
  title: string
  thesis: string
  thesisBody: string
  transformation: { from: string; to: string }
  proof: ProofVariant
  proofCaption: string
  link: { href: string; label: string }
  capabilities: readonly Capability[]
}

/** Per-scene accent — one signal colour dominates each chapter's viewport. */
export const SCENE_ACCENT: Record<Scene, string> = {
  web: 'var(--tw-acid)',
  automation: 'var(--tw-violet)',
  apps: 'var(--tw-orange)',
  advisory: 'var(--tw-acid)',
}

export const HERO = {
  sup: 'Techwise IQ / Dubai technology studio',
  titleLead: 'Technology that',
  titleTail: 'moves the work.',
  support:
    'Websites, automation, custom software and AI advisory for businesses that need the bottleneck removed—not another layer of process.',
  primary: { href: '/contact', label: 'Bring us the bottleneck' },
  secondary: { href: '/work', label: 'See the work' },
  scrollNote: 'Four build worlds below',
} as const

export const FRAMING = {
  index: 'Field guide / 04 chapters',
  titleLines: ['One studio.', 'Four ways to remove', 'business friction.'],
  aside:
    'The order here is deliberate. Instead of a service menu, each chapter shows what the work can look like—then explains what Techwise IQ builds around it. You bring the bottleneck; we choose the technical path.',
} as const

export const CHAPTERS: readonly ChapterContent[] = [
  {
    id: 'websites',
    scene: 'web',
    index: '01',
    kicker: 'Websites',
    title: 'Websites',
    thesis: 'Make the site itself evidence that you can do the work.',
    thesisBody:
      'Positioning, interaction and front-end execution designed around the buyer’s decision—not around a template’s section order.',
    transformation: { from: 'Unclear presence', to: 'Obvious capability' },
    proof: 'website',
    proofCaption: 'Illustrative marketing site — layout, proof and one clear next action.',
    link: { href: '/services/web', label: 'Explore web development' },
    capabilities: [
      {
        type: 'Positioning',
        head: 'One sharp promise before the scroll',
        body: 'Clarify what changes for the buyer, then make every section prove it.',
      },
      {
        type: 'Interaction',
        head: 'Motion with an explanatory job',
        body: 'Animation reveals systems and cause-and-effect—it doesn’t decorate empty space.',
      },
      {
        type: 'Proof',
        head: 'Demonstrations before service taxonomy',
        body: 'Let product thinking, prototypes and case evidence carry the trust burden.',
      },
      {
        type: 'Build',
        head: 'Responsive front-end execution',
        body: 'The visual idea survives mobile, accessibility requirements and real content.',
      },
      {
        type: 'Conversion',
        head: 'One clear next action',
        body: 'Remove competing calls to action and design the page around one buyer move.',
      },
      {
        type: 'System',
        head: 'A reusable visual language',
        body: 'Tokens and components that let the site grow without becoming generic.',
      },
    ],
  },
  {
    id: 'automation',
    scene: 'automation',
    index: '02',
    kicker: 'AI Automation',
    title: 'Automation',
    thesis: 'Put AI inside a flow people can understand and control.',
    thesisBody:
      'Good automation is not a chatbot glued to the operation. Inputs, rules, model judgment, system actions and human checkpoints stay explicit.',
    transformation: { from: 'Manual queue', to: 'Accountable flow' },
    proof: 'automation',
    proofCaption: 'Illustrative workflow — intake, deterministic rules, bounded AI, human checkpoint.',
    link: { href: '/services/ai', label: 'Explore AI automation' },
    capabilities: [
      {
        type: 'Lead operations',
        head: 'Qualify, enrich and route inbound demand',
        body: 'Turn forms and emails into structured next actions inside the CRM.',
      },
      {
        type: 'Documents',
        head: 'Extract and validate operational data',
        body: 'Move invoices, forms and PDFs through deterministic checks plus bounded AI review.',
      },
      {
        type: 'Knowledge',
        head: 'Give teams answers with source context',
        body: 'Retrieval systems that show where the answer came from, not just confidence.',
      },
      {
        type: 'Email + CRM',
        head: 'Remove repetitive coordination',
        body: 'Draft, route, tag and update systems without adding another inbox to watch.',
      },
      {
        type: 'Human control',
        head: 'Escalate by consequence, not novelty',
        body: 'Low-risk repetition can automate; expensive uncertainty surfaces to a person.',
      },
      {
        type: 'Observability',
        head: 'Know why an automation acted',
        body: 'Logs, confidence and rule traces make the system operable after launch.',
      },
    ],
  },
  {
    id: 'apps',
    scene: 'apps',
    index: '03',
    kicker: 'Custom Apps',
    title: 'Apps',
    thesis: 'Build the focused tool the workflow actually deserves.',
    thesisBody:
      'When the process is specific enough to be an advantage, forcing it into generic software costs more than making the smaller, sharper product.',
    transformation: { from: 'Spreadsheet workarounds', to: 'Focused product' },
    proof: 'console',
    proofCaption: 'Illustrative operations console — one interface around queues, decisions and context.',
    link: { href: '/services/software', label: 'Explore custom software' },
    capabilities: [
      {
        type: 'Internal tools',
        head: 'One operating console instead of five tabs',
        body: 'Bring queues, decisions and critical context into one role-shaped interface.',
      },
      {
        type: 'Portals',
        head: 'Give customers the next useful action',
        body: 'Focused self-service with explicit states and fewer support handoffs.',
      },
      {
        type: 'Workflow products',
        head: 'Software around a real sequence of work',
        body: 'Model the states and transitions first; add features only when needed.',
      },
      {
        type: 'Data',
        head: 'Surface the decision, not just the dashboard',
        body: 'Charts and metrics matter when they change what someone does next.',
      },
      {
        type: 'Permissions',
        head: 'Right action, right person, right moment',
        body: 'Role-aware interfaces reduce cognitive load and operational risk.',
      },
      {
        type: 'Iteration',
        head: 'Ship the core before the wishlist',
        body: 'Validate the operating model with a usable version before scaling.',
      },
    ],
  },
  {
    id: 'advisory',
    scene: 'advisory',
    index: '04',
    kicker: 'AI Advisory',
    title: 'Advisory',
    thesis: 'Know what is worth building before AI becomes the requirement.',
    thesisBody:
      'Opportunity discovery, build-vs-buy judgment and fast prototypes for teams that need a useful AI roadmap—not a catalogue of everything models can do.',
    transformation: { from: '“We should use AI”', to: 'Prioritized roadmap' },
    proof: 'opportunity',
    proofCaption: 'Illustrative opportunity map — value against feasibility, a few builds worth sequencing.',
    link: { href: '/services/ai', label: 'Explore AI services' },
    capabilities: [
      {
        type: 'Opportunity map',
        head: 'Prioritize value × feasibility × risk',
        body: 'Find the few workflows where AI changes economics or service quality enough to matter.',
      },
      {
        type: 'Build vs buy',
        head: 'Don’t custom-build commodity capability',
        body: 'Own only the layers where your workflow or differentiation actually requires it.',
      },
      {
        type: 'Prototype',
        head: 'Test model behaviour against real edge cases',
        body: 'A convincing demo isn’t enough; evaluate the uncertainty that can kill the model.',
      },
      {
        type: 'Roadmap',
        head: 'Turn experiments into a sequence',
        body: 'Frame, prototype, ship and operationalize instead of running disconnected pilots.',
      },
      {
        type: 'Governance',
        head: 'Match control to consequence',
        body: 'Define where human approval, traceability and deterministic rules are mandatory.',
      },
      {
        type: 'Adoption',
        head: 'Change the work, not just the toolset',
        body: 'An AI project only succeeds when the new behaviour is easier than the old workaround.',
      },
    ],
  },
]

export const OPERATING_MODEL = {
  index: 'Operating model',
  title: 'Small studio. Legible process.',
  body: 'Small-studio speed comes from reducing translation layers between thinking and making—not from skipping product discipline.',
  promises: [
    ['Written scope', 'Timeline and cost agreed before the build starts.'],
    ['Weekly demos', 'Progress you can click, every week—not status decks.'],
    ['Direct access', 'Talk to the people building it, not an account layer.'],
    ['Clean ownership', 'You keep the product, the code and the accounts.'],
  ],
} as const

export const FINAL_CTA = {
  index: 'Start here',
  titleLead: 'Bring the problem.',
  titleTail: 'We’ll find the build.',
  support:
    'You don’t need a polished brief. Send the awkward workflow, the underperforming website, the internal tool idea or the AI opportunity nobody has framed properly yet.',
  primary: { href: '/contact', label: 'Start a project' },
  secondary: { href: WHATSAPP_URL, label: 'WhatsApp' },
  ghost: { href: `mailto:${CONTACT_EMAIL}`, label: CONTACT_EMAIL },
  booking: { href: BOOKING_URL, label: 'Book a 20-minute call' },
} as const
