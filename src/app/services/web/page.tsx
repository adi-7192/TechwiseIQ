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
  title: 'End-to-End Web Development',
  description:
    'Custom websites engineered to load fast, rank well, and convert visitors. Marketing sites from AED 9,500. Based in Dubai, serving clients worldwide.',
  openGraph: {
    title: 'End-to-End Web Development | Techwise IQ',
    description:
      'Custom websites engineered to load fast, rank well, and convert visitors. Marketing sites from AED 9,500.',
    url: 'https://techwiseiq.com/services/web',
  },
}

const DELIVERABLES = [
  'Custom design — no templates',
  'Responsive development',
  'CMS integration (client-editable)',
  'SEO + GEO foundations',
  'Performance optimisation',
  'Analytics setup',
  'Post-launch support (30 days)',
]

const PROCESS = [
  {
    num: '01',
    title: 'Discover',
    body: 'Goals, audience, competitors. We map the brief before we sketch a pixel.',
  },
  {
    num: '02',
    title: 'Design',
    body: 'Custom layout and art direction in-browser. No Figma-to-code drift.',
  },
  {
    num: '03',
    title: 'Build',
    body: 'Production code from day one. Working pages every Friday.',
  },
  {
    num: '04',
    title: 'Launch',
    body: 'Performance sweep, SEO setup, analytics wired. Live and fast.',
  },
]

const FAQS = [
  {
    question: 'How long does a website take?',
    answer:
      'Marketing sites: 3\u20134 weeks. CMS builds: 5\u20137 weeks. E-commerce: 7\u201310 weeks. You see working progress every Friday.',
  },
  {
    question: 'What does a website cost?',
    answer:
      'Marketing sites start from AED 9,500. CMS sites from AED 18,000. E-commerce from AED 32,000. Every project gets a fixed written scope before work begins.',
  },
  {
    question: 'Do I get a custom design or a template?',
    answer:
      'Custom design every time. We do not use templates. Your site is designed from scratch for your brand, your audience, your goals.',
  },
  {
    question: 'Do you work with clients outside the UAE?',
    answer:
      'Yes. We are based in Dubai and work with clients worldwide. Most communication is async plus weekly demo calls.',
  },
  {
    question: 'What happens after launch?',
    answer:
      '30 days of post-launch support included. Optional care retainers from AED 750 per month for ongoing maintenance, updates, and minor edits.',
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

export default function WebServicePage() {
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
          label="001"
          title="End-to-End Web Development"
          description="Strategy, design, build, launch — end to end. Sites engineered to load fast, rank well, and convert visitors. Custom design every time; templates are for agencies that bill by the hour."
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
