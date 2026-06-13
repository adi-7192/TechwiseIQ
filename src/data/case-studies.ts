import type { CaseStudy } from '@/types'

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'aaskra-realty',
    title: 'AASKRA Realty',
    outcome:
      'Luxury positioning for a new Dubai real estate consultancy targeting high-net-worth investors',
    client: 'AASKRA Realty',
    industry: 'Real Estate / Dubai',
    service: 'web',
    timeline: '6 weeks',
    stack: ['Next.js', 'React', 'Tailwind CSS', 'Framer Motion', 'Vercel'],
    liveUrl: 'https://www.aaskrarealestate.ae',
    coverImage: '/work/aaskra-hero.png',
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
    result:
      'An 11-page Next.js site that positions AASKRA alongside developers like EMAAR, DAMAC, and SOBHA. Integrated lead generation via WhatsApp and consultation booking. The site carries the credibility burden while the client list grows.',
  },
  {
    slug: 'express-trade-financing',
    title: 'Express Trade Financing',
    outcome:
      'Institutional-grade digital presence for a boutique trade finance firm facilitating USD 200M+ in instruments',
    client: 'Express Trade Financing',
    industry: 'Trade Finance / Dubai',
    service: 'web',
    timeline: '5 weeks',
    stack: ['Vite', 'JavaScript', 'CSS Animations', 'Google Analytics'],
    liveUrl: 'https://www.expresstradefinancing.ae',
    coverImage: '/work/etf-hero.png',
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
    result:
      'A 10-page website that gives a boutique firm the digital weight of an institutional player. The case studies \u2014 with real numbers, real timelines, real outcomes \u2014 do more for trust than any amount of stock photography. The site serves inquiries from 25+ countries.',
  },
]

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((cs) => cs.slug === slug)
}
