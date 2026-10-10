import type { Metadata } from 'next'
import ImmersiveShell from '@/components/immersive/ImmersiveShell'
import { SiteHeader, SiteFooter } from '@/components/global'
import { RefHero, RefIntro, CapabilityGrid, PillNav } from '@/components/immersive/reference'
import { CASE_STUDIES } from '@/data/case-studies'
import { socialMetadata } from '@/lib/metadata'
import ConceptLab from './ConceptLab'
import FeaturedWork from './FeaturedWork'
import { getDeliveryMetrics } from './work-projects'
import styles from './work.module.css'

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Real projects, real decisions, real results. Case studies from Techwise IQ — web development, custom software, and AI automation.',
  alternates: { canonical: '/work' },
  ...socialMetadata({
    title: 'Work | Techwise IQ',
    description:
      'Real projects, real decisions, real results. Case studies from Techwise IQ.',
    url: '/work',
  }),
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': 'https://techwiseiq.com/work',
  name: 'Work — Techwise IQ case studies',
  description:
    'Real projects, real decisions, real results. Case studies from Techwise IQ.',
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: CASE_STUDIES.map((cs, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: cs.title,
      url: `https://techwiseiq.com/work/${cs.slug}`,
    })),
  },
}

const OPERATING = [
  ['01', 'Requirements', 'Your goals, your audience, and what success looks like.'],
  ['02', 'Options', 'A few directions, with our pick. You choose.'],
  ['03', 'Build', 'Working builds shown every week. Not slide decks.'],
  ['04', 'Ship', 'Testing, launch, and a clean handover of everything.'],
]

export default function WorkPage() {
  const deliveryMetrics = getDeliveryMetrics(CASE_STUDIES)

  return (
    <ImmersiveShell scene="web">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main id="main" data-work-experience data-testid="work-experience">
        <RefHero
          eyebrow="Our work"
          line="Proof, not"
          ghost="promises."
          lead="Real sites for real businesses. Open any of them and judge for yourself."
          primary={{ href: '#selected-work', label: 'See the work' }}
          secondary={{ href: '/contact', label: 'Bring us the problem' }}
          orbit
        >
          {deliveryMetrics.length > 0 && (
            <dl className={styles.heroProof} aria-label="Published work totals">
              {deliveryMetrics.map((metric) => (
                <div key={metric.label} className={styles.metric}>
                  <dt>{metric.label}</dt>
                  <dd>{metric.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </RefHero>
        <PillNav
          items={[
            ['selected-work', 'Client work'],
            ['concept-lab', 'Concept Lab'],
            ['how-we-work', 'How we work'],
          ]}
        />

        <RefIntro id="selected-work" count="01 / Selected client work" line="Live client" ghost="sites.">
          <FeaturedWork />
        </RefIntro>

        <ConceptLab />

        <RefIntro
          id="how-we-work"
          count="03 / How we work"
          line="Clear from kickoff"
          ghost="to launch."
          aside={
            <>
              A simple process, progress you can see, and <strong>straight answers</strong> all the
              way.
            </>
          }
        >
          <CapabilityGrid
            cols={4}
            items={OPERATING.map(([label, title, body]) => ({ label, title, body }))}
          />
        </RefIntro>
      </main>
      <SiteFooter />
    </ImmersiveShell>
  )
}
