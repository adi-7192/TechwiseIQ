/*
 * About copy (D-041, docs/specs/10.1-about.md). Owner-approved 2026-10-07;
 * all page copy lives here, in one place.
 * Numbers never live here: totals, countries and statuses come from
 * src/app/work/work-projects.ts.
 */

const COUNTRY_PHRASE: Record<string, string> = { UAE: 'the UAE' }

/** ['UAE', 'India'] → "the UAE and India" */
export function countryPhrase(countries: readonly string[]) {
  const names = countries.map((country) => COUNTRY_PHRASE[country] ?? country)
  if (names.length < 3) return names.join(' and ')
  return `${names.slice(0, -1).join(', ')} and ${names.at(-1)}`
}

export const ABOUT_META = {
  title: 'About Techwise IQ | Websites, Software & AI in Dubai',
  description: (countries: readonly string[]) =>
    `A team of experts in Dubai building websites, custom software and AI automation for businesses in Dubai and beyond. Clients in ${countryPhrase(countries)}.`,
  ogTitle: 'About Techwise IQ',
  ogDescription:
    'You bring the problem. We bring options, a written scope and price, and the team that builds it.',
  jsonLdDescription:
    'Dubai-based team building websites, custom software and AI automation.',
}

export const HERO = {
  label: 'About Techwise IQ / Dubai',
  // h1: owner picked option B (2026-10-07).
  title: 'Websites, software and AI automation.',
  titleAccent: 'Minus the agency theatre.',
  ledeStart: 'Techwise IQ is a team of experts in Dubai, turning business bottlenecks into',
  ledeStrong: 'websites, custom software and AI automation',
  promise: 'You bring the goal. We sweat the technical path.',
}

export const FACTS = {
  label: 'Fact sheet',
  based: ['Based', 'Dubai, UAE'],
  build: ['We build', 'Websites\u00a0· Custom software\u00a0· AI automation'],
  clients: 'Clients in',
  liveSites: 'Live client sites',
  speed: 'Live sites, brief to launch', // never "typical": 3–5 is the live-site range only
  reply: ['First reply', 'Within 24 hours'],
} as const

export const SHORT = {
  label: 'The short version',
  title: 'Agencies sell hours.',
  titleAccent: 'We sell outcomes.',
  body: 'Billing by the hour rewards slow work. We’d rather be judged on what ships. So the scope and price are agreed in writing before we build, and the people you talk to are the people doing the work.',
  closing: 'Building for businesses in Dubai and beyond.',
}

export const TRACK = {
  label: 'Track record',
  title: 'Work you can',
  titleAccent: 'open and check.',
  intro:
    'Real clients, real sites. Live ones count toward the numbers. Preview builds are labelled and never counted.',
  caption: (countries: readonly string[]) =>
    `Run from Dubai. Clients in ${countryPhrase(countries)}.`,
  hub: 'Dubai (hub)',
  cardLink: 'Read full case study',
}

export const PROCESS = {
  label: 'How we work with you',
  title: 'You decide.',
  titleAccent: 'We deliver.',
  intro: 'Four steps, every project. Here’s each one on a sample brief.',
  sample: 'Sample brief: a clinic that takes every booking by phone.',
  tag: 'Illustrative',
  caption: 'Sample brief, not a client project.',
  pickTag: 'Our pick',
  approved: 'Approved',
}

type FrameBody =
  | { kind: 'fields'; rows: readonly (readonly [string, string])[]; approved?: true }
  | {
      kind: 'options'
      options: readonly { key: string; text: string; pick?: true }[]
      why: readonly [string, string]
    }
  | { kind: 'log'; rows: readonly string[] }

/** D-033 steps on a fictional brief. No digits or currency in the price line (D-003). */
export const STEPS: readonly {
  title: string
  body: string
  frame: string
  content: FrameBody
}[] = [
  {
    title: 'You tell us the problem.',
    body: 'Goals, users, what has to stay. We ask until it’s clear.',
    frame: 'Requirements',
    content: {
      kind: 'fields',
      rows: [
        ['Goal', 'patients book online, not by phone'],
        ['Used by', 'patients, front desk'],
        ['Must keep', 'the current calendar'],
        ['Done when', 'the front desk stops taking booking calls'],
      ],
    },
  },
  {
    title: 'We come back with options.',
    body: 'Several ways to solve it, plus the one we’d pick and why.',
    frame: 'Options',
    content: {
      kind: 'options',
      options: [
        { key: 'A', text: 'Booking page on your current site' },
        { key: 'B', text: 'New site with booking built in', pick: true },
        { key: 'C', text: 'Booking app for staff and patients' },
      ],
      why: ['Why B', 'fits your calendar, fastest to launch.'],
    },
  },
  {
    title: 'You choose. It goes in writing.',
    body: 'Scope and price, on paper, before we build anything.',
    frame: 'Scope',
    content: {
      kind: 'fields',
      rows: [
        ['Chosen', 'option B'],
        ['In', 'site pages, online booking, calendar sync'],
        ['Out', 'patient app'],
        ['Price', 'agreed in writing'],
      ],
      approved: true,
    },
  },
  {
    title: 'We build what you chose.',
    body: 'The people who planned it build it, then hand it over in your name.',
    frame: 'Build log',
    content: {
      kind: 'log',
      rows: [
        'Design direction approved',
        'Booking connected to calendar',
        'Tested on phones',
        'Launched, accounts handed over',
      ],
    },
  },
]

export const COMMITMENTS_HEAD = {
  label: 'What we commit to',
  title: 'The',
  titleAccent: 'non-negotiables.',
}

/** `id` = the decision each promise traces to (rendered as data-commitment, never shown). Owner-approved 2026-10-07. */
export const COMMITMENTS = [
  {
    id: 'D-027',
    statement: 'We reply within 24 hours.',
    detail: 'Then a short call, then a written scope.',
  },
  {
    id: 'D-033',
    statement: 'Options, with our pick.',
    detail: 'Several ways to solve it, and the one we’d choose. You decide.',
  },
  {
    id: 'D-033',
    statement: 'Scope and price in writing, before we build.',
    detail: 'You know what you’re getting and what it costs before work starts.',
  },
  {
    id: 'D-041',
    statement: 'The people who plan it build it.',
    detail: 'One team, one conversation. No game of telephone.',
  },
  {
    id: 'D-037',
    statement: 'Your accounts, your code.',
    detail: 'At handover, accounts and code are in your name, with the logins.',
  },
] as const

export const PATHS_HEAD = {
  label: 'What we build',
  title: 'Pick your',
  titleAccent: 'problem.',
  problemLabel: 'The problem',
  outcomeLabel: 'What you get',
}

export const EXPERTISE_PATHS = [
  {
    name: 'Websites.',
    href: '/services/web',
    problem: 'A website that undersells you',
    outcome: 'A website that gets noticed and gets people to act.',
  },
  {
    name: 'Custom software.',
    href: '/services/software',
    problem: 'Work trapped in spreadsheets',
    outcome: 'Software built around how your business really runs.',
  },
  {
    name: 'AI automation.',
    href: '/services/ai',
    problem: 'Repetitive work slowing people down',
    outcome: 'Automation that does the busywork, with a person in charge.',
  },
] as const

export const CTA = {
  label: 'Your turn',
  title: 'Got a problem worth',
  titleAccent: 'fixing?',
  body: 'Tell us what you need. We reply within 24 hours, then send a written scope after a short call.',
  button: 'Bring us the problem',
}
