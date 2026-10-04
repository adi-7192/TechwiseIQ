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
      'Marketing sites, sites you edit yourself, and online shops. We agree the pages, content, tools and support before we write any code.',
    examples: {
      'Strategy + structure':
        'For example: a services page that answers buyers’ questions before they reach the form.',
      'Custom art direction':
        'For example: a brand-led site with motion that means something, and a phone version that feels designed, not squeezed.',
      'Production development':
        'For example: a multi-page site where menus, forms and loading all just work.',
      'CMS + integrations':
        'For example: a news section your team edits, connected to analytics and your enquiry inbox.',
      'Search foundations':
        'For example: clear page titles, structured data, and service pages search engines can read.',
      'Launch + support':
        'For example: device checks, test enquiries, an editing guide, and fixes after go-live.',
    },
    expertiseTitle: 'Good design goes all the way through.',
    expertiseIntro:
      'Looking good matters. So does being useful, easy to find, and easy to run.',
    standards: [
      {
        title: 'A clear message before a layout',
        body: 'We put content in the order visitors need it: understand, believe, act. Every section earns its spot.',
      },
      {
        title: 'Motion with a job to do',
        body: 'Animation shows how things work. Menus, reading and buttons still work on phones and with motion turned off.',
      },
      {
        title: 'Fast by design',
        body: 'Images, fonts and animation are kept light while we build, then checked on the real pages.',
      },
      {
        title: 'A launch that works beyond the homepage',
        body: 'We test enquiry forms, phone layouts, page titles and editing. We build for search, but nobody can promise rankings.',
      },
    ],
    handover: [
      'Agreed pages, working on every screen',
      'An editing guide (if editing is in scope)',
      'Notes on connected tools and analytics',
      'Launch checks and a support plan',
    ],
    brief:
      'Bring your current site, brand files, and what you want visitors to do. New business? Start with what you sell and who buys it.',
    demoCaption:
      'A page builds itself, fits a phone, and turns one clear button into an enquiry.',
    reviewTitle: 'See the decisions in the finished work.',
    reviewBody: 'Real projects, with the thinking behind the design.',
    reviewChecks: [],
  },
  software: {
    promise: 'Software that fits the work.',
    introduction:
      'Customer portals, internal tools, web applications, and mobile MVPs built around your users and processes. Connect the information, decisions, and systems your business depends on.',
    fitTitle: 'When the work has outgrown the workaround.',
    buildTitle: 'The right tool for the way your team operates.',
    buildIntro:
      'Start with one workflow that matters, or a small first version. Grow it as people use it and priorities get clearer.',
    examples: {
      'Web applications':
        'For example: a portal where customers send requests and track progress.',
      'Internal dashboards':
        'For example: a team queue showing who owns what and what happens next.',
      'Connecting your tools':
        'For example: send approved records between a portal, your CRM and back-office tools.',
      'Replacing old systems':
        'For example: replace a fragile old system in stages while the work keeps running.',
      'First app versions':
        'For example: a focused iOS or Android app that lets people try the core idea.',
      'Improving after launch':
        'For example: smooth out a busy workflow after hearing from the first users.',
    },
    expertiseTitle: 'The screens are only half the job.',
    expertiseIntro:
      'Behind every screen sit the data, the permissions and the connections that keep daily work running. We build those too.',
    standards: [
      {
        title: 'Map the work before the screens',
        body: 'First we work out the people, the records and the handoffs. Good screens come from knowing who decides what.',
      },
      {
        title: 'Clear roles and rules',
        body: 'Who can see, change and approve what. Rules are checked behind the scenes, not just on screen.',
      },
      {
        title: 'Plan for when things go wrong',
        body: 'Failed connections, duplicate requests, missing data: we plan for them up front. Recovery is part of the design.',
      },
      {
        title: 'Built for whoever maintains it next',
        body: 'We document how it’s built and connected, show working software, and plan the switch-over and handover with the release.',
      },
    ],
    handover: [
      'The app and its source code',
      'Docs on how it’s built and connected',
      'How to deploy and set it up',
      'A plan for who maintains it',
    ],
    brief:
      'Bring one workflow, the people involved and the tools it touches. A few screenshots or a spreadsheet is enough to start.',
    demoCaption:
      'A request moves through its checks to a recorded approval.',
    reviewTitle: 'Look at how the work moves.',
    reviewBody:
      'The demo app above shows a request moving through review to approval. When you review a project, check the rules behind the screens too.',
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
      'We mix simple rules, connected tools, and AI only where it helps. Not every step needs AI, and not every task should run without a person.',
    examples: {
      'Workflow automation':
        'For example: catch an enquiry, check it’s complete, and send it to the right team.',
      'AI assistants':
        'For example: help your team find answers in approved documents, with a link to the source.',
      'Document extraction':
        'For example: turn invoice details into a clean record and flag anything missing.',
      'Inbox sorting':
        'For example: sort incoming emails, suggest a reply, and flag the unusual ones.',
      'Report generation':
        'For example: pull a weekly summary from agreed sources for a person to check.',
      'AI check-up + plan':
        'For example: compare tasks by value, effort, data quality and risk.',
    },
    expertiseTitle: 'The checks are part of the product.',
    expertiseIntro:
      'A good automation has clear limits, an owner, and a plan for the odd cases.',
    standards: [
      {
        title: 'Plain rules first, AI second',
        body: 'Known checks run on simple rules. AI only gets focused jobs like reading, sorting or drafting.',
      },
      {
        title: 'A person checks what matters',
        body: 'We agree when the automation stops and hands over to a person. Unsure answers and big actions always get a review.',
      },
      {
        title: 'Approved data and tools only',
        body: 'We agree what it can access, and what happens when a connected tool is down.',
      },
      {
        title: 'Test, track, improve',
        body: 'We test on real examples during the pilot and keep logs, so your team can see what happened and make it better.',
      },
    ],
    handover: [
      'The working automation, connected to your tools',
      'Written rules and review points',
      'What the pilot taught us, limits included',
      'A plan for monitoring and ownership',
    ],
    brief:
      'Bring a repetitive task and a few examples you’re allowed to share. We can map it out before touching any live systems.',
    demoCaption:
      'An enquiry gets sorted, passes the routing rules, and lands with a person for review.',
    reviewTitle: 'Judge the workflow by its exceptions, too.',
    reviewBody:
      'The demo above ends with a person reviewing. In a pilot, the messy inputs and failures get as much attention as the happy path.',
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
