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
  title: 'AI Automation & Enablement',
  description:
    'Workflow automation, AI assistants, document processing — concrete automations, not vague promises. AI audits from AED 6,500. Based in Dubai.',
  openGraph: {
    title: 'AI Automation & Enablement | Techwise IQ',
    description:
      'Workflow automation, AI assistants, document processing — concrete automations, not vague promises. AI audits from AED 6,500.',
    url: 'https://techwiseiq.com/services/ai',
  },
}

const DELIVERABLES = [
  'Workflow automation',
  'AI assistants on your data',
  'Document processing + extraction',
  'Email triage + routing',
  'Report generation',
  'WhatsApp Business flows',
  'AI audit + roadmap',
]

const PROCESS = [
  {
    num: '01',
    title: 'Audit',
    body: 'Map your workflows. Rank automation opportunities by ROI. Deliver a written roadmap.',
  },
  {
    num: '02',
    title: 'Pilot',
    body: 'One workflow automated end-to-end. Proof of value before scaling.',
  },
  {
    num: '03',
    title: 'Scale',
    body: 'Roll out across workflows and teams. Integration with your existing tools.',
  },
  {
    num: '04',
    title: 'Monitor',
    body: 'Performance tracking, error handling, continuous tuning. Automations that stay reliable.',
  },
]

const FAQS = [
  {
    question: 'Where do I start with AI?',
    answer:
      'With an AI Audit. We map your workflows, rank automation opportunities by ROI, and deliver a written roadmap. Starts from AED 6,500 \u2014 creditable against the build if you proceed.',
  },
  {
    question: 'What does AI automation cost?',
    answer:
      'Audits from AED 6,500. Single workflow automation from AED 14,000. AI assistants from AED 18,000. Every engagement gets a fixed scope.',
  },
  {
    question: 'What kind of automations do you build?',
    answer:
      'Invoice processing, email triage, report generation, WhatsApp flows, document extraction, customer support assistants. Concrete workflows \u2014 not vague promises.',
  },
  {
    question: 'Will AI replace our team?',
    answer:
      'No. It replaces the repetitive tasks your team hates. They spend time on decisions, not data entry.',
  },
  {
    question: 'Do you work with our existing tools?',
    answer:
      'Yes. We integrate with your CRM, email, accounting software, WhatsApp Business, and whatever else runs your operations.',
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

export default function AIServicePage() {
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
          label="003"
          title="AI Automation & Enablement"
          description="We hunt the busywork in your workflows and kill it. Invoice processing, email triage, report generation, WhatsApp flows — AI where it helps, plain code where it doesn't."
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
