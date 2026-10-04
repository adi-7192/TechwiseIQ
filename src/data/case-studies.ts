import type { CaseStudy, Service } from '@/types'

export const SERVICE_LABELS: Record<Service['id'], string> = {
  web: 'Web Development',
  software: 'Custom Software',
  ai: 'AI Automation',
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'aaskra-realty',
    featured: true,
    title: 'AASKRA Realty',
    outcome:
      'Luxury positioning for a new Dubai real estate consultancy targeting high-net-worth investors',
    workSummary: {
      challenge: 'No digital presence in a trust-heavy market.',
      decision:
        'Build credibility through useful market data, location profiles, and a clear investor journey.',
      outcome:
        "An 11-page site built to carry the brand's authority while its track record grows.",
      proof: [
        { value: '11', label: 'pages' },
        { value: '6', label: 'location profiles' },
        { value: '6 wks', label: 'delivery' },
      ],
    },
    client: 'AASKRA Realty',
    industry: 'Real Estate / Dubai',
    service: 'web',
    timeline: '6 weeks',
    stack: ['Next.js', 'React', 'Tailwind CSS', 'Framer Motion', 'Vercel'],
    coverImage: '/work/aaskra-hero.webp',
    coverCaption:
      'An investor-first homepage built to establish authority before the first conversation.',
    storyTitle: 'Trust before track record.',
    problem:
      'AASKRA needed a digital presence that could compete with established Dubai real estate firms. They had RERA registration and developer relationships but no website \u2014 losing credibility with high-net-worth prospects who research online before engaging.',
    constraints:
      'Tight timeline with a key industry event approaching. The site had to project institutional credibility from day one while the firm was still building its track record.',
    decisions: [
      {
        title: 'Establish the luxury signal',
        body:
          'Use a dark, gold-accented visual system, architectural photography, and restrained motion to create an institutional first impression.',
      },
      {
        title: 'Make location data useful',
        body:
          'Build six location profiles around entry prices and ROI context so investors can compare real opportunities, not generic neighbourhood summaries.',
      },
      {
        title: 'Turn services into routes',
        body:
          'Structure off-plan acquisition, buying, and selling around concrete process steps instead of broad promises.',
      },
      {
        title: 'Shorten the path to a conversation',
        body:
          'Integrate WhatsApp Business and consultation booking where intent is highest, giving prospects a direct next step.',
      },
      {
        title: 'Build trust into the foundation',
        body:
          'Ship structured data, social metadata, discovery files, and RERA-compliant legal pages as part of the launch rather than after it.',
      },
    ],
    deliverables: [
      '11-page Next.js website with custom luxury design',
      'Cinematic animated loading screen + hero sequence',
      '6 interactive location profiles with ROI metrics',
      '3 strategy service pages (off-plan, buying, selling)',
      'Developer partnership showcase (EMAAR, DAMAC, SOBHA, etc.)',
      'WhatsApp Business + consultation booking integration',
      'Blog/insights content section',
      'Full SEO (Schema.org, OpenGraph, structured data)',
      'RERA-compliant legal pages',
    ],
    result:
      'An 11-page Next.js site that positions AASKRA alongside developers like EMAAR, DAMAC, and SOBHA. Integrated lead generation via WhatsApp and consultation booking. Built to carry the credibility burden while the client list grows.',
    stats: [
      { value: '11', label: 'pages shipped' },
      { value: '6', label: 'location profiles with real ROI data' },
      { value: '6 wks', label: 'brief to launch' },
    ],
    fullPageImage: {
      src: '/work/aaskra-desktop.webp',
      width: 1152,
      height: 5862,
    },
  },
  {
    slug: 'express-trade-financing',
    featured: true,
    title: 'Express Trade Financing',
    outcome:
      'Institutional-grade digital presence for a boutique trade finance firm facilitating USD 200M+ in instruments',
    workSummary: {
      challenge:
        'Significant deal history, but no credible digital presence.',
      decision:
        'Lead with real transaction stories, explain the process plainly, and balance institutional weight with accessibility.',
      outcome:
        'A live site that presents a boutique firm with institutional credibility.',
      proof: [
        { value: '10', label: 'pages' },
        { value: '25+', label: 'countries served' },
        { value: '5 wks', label: 'delivery' },
      ],
    },
    client: 'Express Trade Financing',
    industry: 'Trade Finance / Dubai',
    service: 'web',
    timeline: '5 weeks',
    stack: ['Vite', 'JavaScript', 'CSS Animations', 'Google Analytics'],
    liveUrl: 'https://www.expresstradefinancing.ae',
    coverImage: '/work/etf-hero.webp',
    coverCaption:
      'A trust-first homepage that balances institutional weight with an approachable route to enquiry.',
    storyTitle: 'Institutional weight, without the institution.',
    problem:
      'Express Trade Financing had facilitated over USD 200M in trade instruments across 25+ countries but had no website. Prospects in global trade \u2014 import/export firms, energy companies \u2014 expect a credible digital presence before engaging on six- and seven-figure deals.',
    constraints:
      'The firm needed to project the weight of a large institution while remaining approachable to mid-market SMEs. Content had to demonstrate real deal experience without disclosing confidential client details.',
    decisions: [
      {
        title: 'Lead with proof',
        body:
          "Anchor the experience in real market data, global transaction reach, and the firm's USD 200M+ track record.",
      },
      {
        title: 'Make experience concrete',
        body:
          'Turn three real transactions into detailed case studies with values, timelines, and outcomes while protecting client confidentiality.',
      },
      {
        title: 'Explain finance plainly',
        body:
          'Structure trade finance and SME support services around understandable processes rather than specialist jargon.',
      },
      {
        title: 'Publish an informed point of view',
        body:
          'Create a journal for market analysis that supports ongoing discovery and demonstrates subject-matter expertise.',
      },
      {
        title: 'Keep global enquiries close',
        body:
          'Use WhatsApp and consultation forms to create a direct response path for prospects operating across time zones.',
      },
    ],
    deliverables: [
      '10-page website with custom design and animations',
      'Global transaction map showing 25+ countries served',
      '3 detailed case studies with real deal outcomes',
      'Trade finance + SME support service pages',
      'Journal section with market analysis articles',
      'Animated hero with Dubai skyline panorama',
      'WhatsApp + consultation form integration',
      'Google Analytics + Schema.org SEO setup',
    ],
    result:
      'A 10-page website that gives a boutique firm the digital weight of an institutional player. The case studies \u2014 with real numbers, real timelines, real outcomes \u2014 do more for trust than any amount of stock photography. The site serves inquiries from 25+ countries.',
    stats: [
      { value: 'USD 200M+', label: 'in instruments behind the brand' },
      { value: '25+', label: 'countries served' },
      { value: '5 wks', label: 'brief to launch' },
    ],
    fullPageImage: {
      src: '/work/etf-desktop.webp',
      width: 1152,
      height: 6636,
    },
  },
]

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((cs) => cs.slug === slug)
}

export function getNextCaseStudy(slug: string): CaseStudy | undefined {
  const index = CASE_STUDIES.findIndex((caseStudy) => caseStudy.slug === slug)
  if (index === -1 || CASE_STUDIES.length < 2) return undefined

  return CASE_STUDIES[(index + 1) % CASE_STUDIES.length]
}
