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
        "A live platform that carries the brand's authority while its track record grows.",
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
    liveUrl: 'https://www.aaskrarealestate.ae',
    coverImage: '/work/aaskra-hero.webp',
    problem:
      'AASKRA needed a digital presence that could compete with established Dubai real estate firms. They had RERA registration and developer relationships but no website \u2014 losing credibility with high-net-worth prospects who research online before engaging.',
    constraints:
      'Tight timeline with a key industry event approaching. The site had to project institutional credibility from day one while the firm was still building its track record.',
    approach: [
      'Custom luxury design with cinematic loading sequence and animated hero \u2014 dark palette, gold accents, architectural photography',
      'Built 6 interactive location profiles (Palm Jumeirah, Downtown, Dubai Hills, JBR, Creek Harbour, Business Bay) with real ROI and entry-price data',
      '3 strategy pages (off-plan acquisition, buying, selling) structured around concrete process steps, not vague promises',
      'Integrated WhatsApp Business and consultation booking for direct lead capture',
      'Full SEO foundation: Schema.org (Organization, RealEstateAgent), OpenGraph, structured data, sitemap',
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
      'An 11-page Next.js site that positions AASKRA alongside developers like EMAAR, DAMAC, and SOBHA. Integrated lead generation via WhatsApp and consultation booking. The site carries the credibility burden while the client list grows.',
    stats: [
      { value: '11', label: 'pages shipped' },
      { value: '6', label: 'location profiles with real ROI data' },
      { value: '6 wks', label: 'brief to launch' },
    ],
    fullPageImage: {
      src: '/work/aaskra-desktop.webp',
      width: 1440,
      height: 7327,
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
    problem:
      'Express Trade Financing had facilitated over USD 200M in trade instruments across 25+ countries but had no website. Prospects in global trade \u2014 import/export firms, energy companies \u2014 expect a credible digital presence before engaging on six- and seven-figure deals.',
    constraints:
      'The firm needed to project the weight of a large institution while remaining approachable to mid-market SMEs. Content had to demonstrate real deal experience without disclosing confidential client details.',
    approach: [
      'Designed a professional, trust-first aesthetic with animated hero, global transaction map, and real market data',
      'Wrote and structured 3 detailed case studies from real deals: USD 1M letter of credit, USD 600K bid bond, cross-border usance LC \u2014 concrete proof of capability',
      'Built trade finance and SME support service pages with clear process explanations, not jargon',
      'Journal section with market analysis articles for ongoing SEO and thought leadership',
      'WhatsApp + consultation form integration for lead capture across time zones',
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
      width: 1440,
      height: 7603,
    },
  },
]

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((cs) => cs.slug === slug)
}
