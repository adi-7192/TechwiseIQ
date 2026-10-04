import type { CaseStudy, Service } from '@/types'

export const SERVICE_LABELS: Record<Service['id'], string> = {
  web: 'Web Development',
  software: 'Custom Software',
  ai: 'AI Automation',
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'supreme-universal',
    featured: true,
    title: 'Supreme Universal Trading',
    outcome:
      'A trading-house site that maps origin to market across 49 commodities',
    workSummary: {
      challenge: 'No website, so no way to win new buyers online.',
      decision:
        'Make 49 commodities easy to browse, and show how a trade actually moves.',
      outcome:
        'A 76-page site that lets buyers see the range before they make contact.',
      proof: [
        { value: '76', label: 'pages' },
        { value: '49', label: 'commodity pages' },
        { value: '3 wks', label: 'delivery' },
      ],
    },
    client: 'Supreme Universal Trading L.L.C',
    industry: 'Agricultural Commodity Trading / Dubai',
    service: 'web',
    timeline: '3 weeks',
    stack: ['Next.js', 'React', 'GSAP', 'Lenis', 'Vercel'],
    liveUrl: 'https://www.supremeuniversal.co',
    coverImage: '/work/supreme-universal-hero.webp',
    coverCaption:
      'Trade routes through the Dubai hub, with the full commodity range two clicks away.',
    storyTitle: 'Forty-nine commodities, one clear route.',
    problem:
      'Supreme Universal Trading, part of The Supreme Group, trades agricultural commodities out of Dubai but had no website. Buyers who look for suppliers online found nothing, so new business depended entirely on existing relationships.',
    constraints:
      'The client brought their own design direction. Our job was to build it faithfully, keep a very large catalogue easy to navigate, and ship in about three weeks.',
    decisions: [
      {
        title: 'Group the catalogue by sector',
        body:
          'Organise 49 commodity pages into five sectors (grains, edible oils, sugar, oilseeds, pulses and spices, nuts and specialty) so a buyer reaches the right product in two clicks.',
      },
      {
        title: 'Show origin and market',
        body:
          'Give every commodity its origin-to-market route, and put the trade network on an animated globe running through the Dubai hub.',
      },
      {
        title: 'Explain how a trade moves',
        body:
          'Lay out the process (source, structure, execute, deliver) so buyers know what working together looks like before the first call.',
      },
      {
        title: 'Connect the group',
        body:
          'Add a group page for The Supreme Group’s companies, plus trading-desk insights that keep the site current.',
      },
      {
        title: 'Build the foundation in',
        body:
          'Ship security headers, structured data, a sitemap and an llms.txt for AI search at launch, with consent-based analytics and a light and dark theme.',
      },
    ],
    deliverables: [
      '76-page Next.js website built to the client’s design direction',
      '49 commodity pages across 5 sectors, each with origin → market routes',
      'Animated globe of trade routes through the Dubai hub',
      '“How a trade moves” process section',
      'Group page for The Supreme Group',
      'Trading-desk insights',
      'Light and dark theme',
      'Consent-based analytics',
      'Security headers, structured data, sitemap and llms.txt',
    ],
    result:
      'Supreme Universal now has a complete catalogue online that buyers can browse before they make contact. The client reports more leads and more visibility since launch.',
    stats: [
      { value: '76', label: 'pages shipped' },
      { value: '49', label: 'commodity pages' },
      { value: '3 wks', label: 'brief to launch' },
    ],
    fullPageImage: {
      src: '/work/supreme-universal-desktop.webp',
      width: 1152,
      height: 11413,
    },
  },
  {
    slug: 'aaskra-realty',
    featured: false,
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
    previewUrl: 'https://aaskra-realty.vercel.app',
    coverImage: '/work/aaskra-hero.webp',
    coverCaption:
      'An investor-first homepage built to establish authority before the first conversation.',
    storyTitle: 'Trust before track record.',
    problem:
      'AASKRA needed a digital presence that could compete with established Dubai real estate firms. They had RERA registration and developer relationships but no website, so they were losing credibility with high-net-worth prospects who research online before engaging.',
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
      { value: '6 wks', label: 'build time' },
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
      'A 10-page website that gives a boutique firm the digital weight of an institutional player. The case studies \u2014 with real numbers, real timelines, real outcomes \u2014 do more for trust than any amount of stock photography. The client reports enquiries from 25+ countries.',
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
  {
    slug: 'express-petroleum',
    featured: true,
    title: 'Express Petroleum',
    outcome:
      'A product-led trading site that turns a specification into an enquiry',
    workSummary: {
      challenge: 'No website, so no way to win new buyers online.',
      decision:
        'Lead with the product range, and tell buyers exactly what to send in an enquiry.',
      outcome:
        'A 28-page site that gets a buyer from product to enquiry.',
      proof: [
        { value: '28', label: 'pages' },
        { value: '14', label: 'product lines' },
        { value: '3 wks', label: 'delivery' },
      ],
    },
    client: 'Express Petroleum FZE',
    industry: 'Petroleum & Commodity Trading / Dubai',
    service: 'web',
    timeline: '3 weeks',
    stack: ['Next.js', 'React', 'Lenis', 'Vercel'],
    liveUrl: 'https://expresspetro.ae',
    coverImage: '/work/express-petroleum-hero.webp',
    coverCaption:
      'A product-first homepage for an independent petroleum and commodity trader.',
    storyTitle: 'From specification to enquiry.',
    problem:
      'Express Petroleum FZE, a Hamriyah Free Zone trader and sister company of Express Trade Financing, had no website. Buyers who look for suppliers online found nothing, so new business depended entirely on existing relationships.',
    constraints:
      'The client brought their own design direction. Our job was to build it faithfully, make product information precise enough for industrial buyers, and ship in about three weeks.',
    decisions: [
      {
        title: 'Organise by portfolio',
        body:
          'Split 14 product pages into three portfolios (energy, industrial energy, industrial commodities) so buyers start from what they need.',
      },
      {
        title: 'Tell buyers what to send',
        body:
          'List on every product page what to include in an enquiry, so the first message already contains a usable specification.',
      },
      {
        title: 'Explain the trade before the call',
        body:
          'Add “How we price” and “How we work” pages so buyers understand pricing and process before they make contact.',
      },
      {
        title: 'Publish buyer guides',
        body:
          'Write practical insights (marine fuel sulphur rules, EN 590 diesel, LNG vs LPG) that answer the questions buyers search for.',
      },
      {
        title: 'Connect the group',
        body:
          'Link to the parent company and share one enquiry path with Express Trade Financing, so either site leads to the right desk.',
      },
    ],
    deliverables: [
      '28-page Next.js website built to the client’s design direction',
      '14 product pages across 3 portfolios',
      '“How we price” and “How we work” pages',
      'Buyer-guide insights',
      'Shared enquiry path with Express Trade Financing',
      'Security headers (CSP, HSTS, frame protection)',
      'Structured data, sitemap and llms.txt for search and AI discovery',
    ],
    result:
      'Express Petroleum now has a product catalogue online that turns a buyer’s specification into an enquiry. The client reports more leads and more visibility since launch.',
    stats: [
      { value: '28', label: 'pages shipped' },
      { value: '14', label: 'product lines' },
      { value: '3 wks', label: 'brief to launch' },
    ],
    fullPageImage: {
      src: '/work/express-petroleum-desktop.webp',
      width: 1152,
      height: 4676,
    },
  },
  {
    slug: 'rsight',
    featured: false,
    title: 'RSiGHT Architectural Lighting',
    outcome: 'A dark, image-led portfolio for a boutique lighting studio',
    workSummary: {
      challenge: 'No website to show the studio’s lighting work.',
      decision:
        'Let the night photography carry the page, with a short route to an enquiry.',
      outcome:
        'A single-page portfolio, built and waiting for the client’s launch.',
      proof: [
        { value: '6', label: 'featured projects' },
        { value: '3', label: 'service lines' },
        { value: '3 wks', label: 'delivery' },
      ],
    },
    client: 'RSiGHT',
    industry: 'Architectural Lighting / India',
    service: 'web',
    timeline: '3 weeks',
    stack: ['Vite', 'GSAP', 'Lenis', 'Vercel'],
    previewUrl: 'https://rsight-opal.vercel.app',
    awaitingLaunch: true,
    coverImage: '/work/rsight-hero.webp',
    coverCaption:
      'A full-bleed night hero for a studio whose work is best seen after dark.',
    storyTitle: 'Work that only shows at night.',
    problem:
      'RSiGHT, an architectural lighting design studio in Ahmedabad, had no website. Its best work (façades, landscapes and interiors lit after dark) had nowhere to be seen by the architects and developers who commission it.',
    constraints:
      'The client brought their own design direction. Lighting work lives or dies on its photography, so the build had to keep images sharp and dark tones true, and ship in about three weeks.',
    decisions: [
      {
        title: 'Open on the night',
        body:
          'Start with a full-bleed night hero so visitors see the studio’s craft before they read a word.',
      },
      {
        title: 'Curate, don’t catalogue',
        body:
          'Feature six projects across façade, landscape and interior lighting rather than an exhaustive archive.',
      },
      {
        title: 'Keep it to one page',
        body:
          'Put three service lines, the founder’s profile and the enquiry form on a single scroll, with motion that follows it.',
      },
      {
        title: 'Ask the right questions',
        body:
          'Collect project type and city in the enquiry form so the studio can reply with something specific.',
      },
    ],
    deliverables: [
      'Single-page portfolio built to the client’s design direction',
      'Full-bleed night hero',
      '6 featured projects across façade, landscape and interior lighting',
      '3 service lines and founder profile',
      'Enquiry form with project type and city',
      'Scroll-driven motion with GSAP and Lenis',
    ],
    result:
      'Built and awaiting the client’s launch on their own domain. It is designed to put the studio’s night work in front of architects and developers, and to turn their interest into specific enquiries.',
    stats: [
      { value: '6', label: 'featured projects' },
      { value: '3', label: 'service lines' },
      { value: '3 wks', label: 'build time' },
    ],
    fullPageImage: {
      src: '/work/rsight-desktop.webp',
      width: 1152,
      height: 4899,
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
