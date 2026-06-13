import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ServiceHero from '@/components/ServiceHero'
import DeliverablesSection from '@/components/DeliverablesSection'
import MiniProcess from '@/components/MiniProcess'
import FAQSection from '@/components/FAQSection'
import CTASection from '@/components/CTASection'
import { RevealObserver } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Custom Software Engineering',
  description:
    'Portals, dashboards, internal tools, and products — software shaped to how your business runs. App sprints from AED 45,000. Dubai-based, worldwide delivery.',
  openGraph: {
    title: 'Custom Software Engineering | Techwise IQ',
    description:
      'Portals, dashboards, internal tools, and products — software shaped to how your business runs. App sprints from AED 45,000.',
    url: 'https://techwiseiq.com/services/software',
  },
}

const DELIVERABLES = [
  'Web applications + portals',
  'Internal dashboards',
  'API development + integrations',
  'Legacy system rebuilds',
  'Mobile app MVPs (React Native / Flutter)',
  'Ongoing support + iteration',
]

const PROCESS = [
  {
    num: '01',
    title: 'Diagnose',
    body: 'Workflows, pain points, existing systems. We understand the problem before we write code.',
  },
  {
    num: '02',
    title: 'Architect',
    body: 'Stack decisions, data model, integration map. Everything documented before sprint one.',
  },
  {
    num: '03',
    title: 'Sprint',
    body: 'Working software every Friday. Each demo is clickable, not a slide deck.',
  },
  {
    num: '04',
    title: 'Ship',
    body: 'Production deploy, documentation, handover. Optional retainer for what comes next.',
  },
]

const FAQS = [
  {
    question: 'How long does custom software take?',
    answer:
      'Focused internal tools: 6\u20139 weeks. Mobile MVPs: 10\u201314 weeks. Larger builds are scoped individually after a diagnosis sprint.',
  },
  {
    question: 'What does custom software cost?',
    answer:
      'App sprints start from AED 45,000. Mobile MVPs from AED 60,000. Larger custom builds from AED 80,000. Every project gets a fixed written scope.',
  },
  {
    question: 'Can you rebuild our existing system?',
    answer:
      'Yes. We rebuild legacy systems into modern, maintainable stacks. We diagnose the current state first, then scope the migration in writing.',
  },
  {
    question: 'How do we stay in the loop during the build?',
    answer:
      'Working software every Friday. You click the product, not read status reports. Communication is async with a weekly demo call.',
  },
  {
    question: 'Do you support the software after launch?',
    answer:
      'Yes. Optional retainers for maintenance, new features, and scaling. Or we hand over the code and documentation cleanly \u2014 your call.',
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
}

export default function SoftwareServicePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <RevealObserver />
      <Nav />
      <main>
        <ServiceHero
          label="002"
          title="Custom Software Engineering"
          description="Portals, dashboards, internal tools, products — software shaped to how your business actually runs. Scoped tight in writing, shipped in weekly demos you can click."
        />
        <DeliverablesSection deliverables={DELIVERABLES} />
        <MiniProcess steps={PROCESS} />
        <FAQSection faqs={FAQS} />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
