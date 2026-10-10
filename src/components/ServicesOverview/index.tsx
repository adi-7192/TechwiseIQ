import Link from 'next/link'
import { FeatureSpace } from '@/components/immersive/home/Illustrations'
import {
  RefHero,
  RefIntro,
  Chapter,
  CapabilityGrid,
  Panel,
  PillNav,
} from '@/components/immersive/reference'
import { SERVICE_LIST } from '@/data/services'
import ProblemNavigator from './ProblemNavigator'
import ConnectedSystem from './ConnectedSystem'
import styles from './ServicesOverview.module.css'

const ENGAGEMENT = [
  ['We gather your requirements', 'Your goals, users, tools and deadline. No technical brief needed.'],
  ['We bring you options', 'Several designs or solution routes, each with our honest recommendation.'],
  ['You choose', 'Pick what fits your goals, budget and timing. Scope and price in writing.'],
  ['We build your choice', 'Exactly what you picked, with progress you see every week, then handover.'],
]
const WORD = { web: 'Websites', software: 'Software', ai: 'Automation' } as const
const ACCENT = { web: 'acid', software: 'orange', ai: 'violet' } as const
const NAV = [
  ['disciplines', 'Services'],
  ['problems', 'Starting point'],
  ['engage', 'How we engage'],
] as const

const EDITORIAL = {
  web: {
    heading: 'Make the right first impression.',
    fit: 'For a new launch, a fresh look, or a website that needs to pull its weight.',
    output: 'A website customers enjoy and your team can update.',
  },
  software: {
    heading: 'Give your operation room to grow.',
    fit: 'For teams buried in spreadsheets, juggling tools, or stuck with software that doesn’t fit.',
    output: 'An app or internal tool built around how you actually work.',
  },
  ai: {
    heading: 'Put repetitive work on a better path.',
    fit: 'For piles of documents, copy-paste handoffs and overflowing inboxes.',
    output: 'Automations that do the busywork, with a person in control.',
  },
}

export default function ServicesOverview() {
  return (
    <div className={styles.experience} data-service-experience>
      <RefHero
        eyebrow="Web / Software / AI"
        line="Your next move."
        ghost="Built right."
        lead={
          <>
            <strong>Websites</strong> that bring people in. <strong>Software</strong> that stops the
            spreadsheet juggling. <strong>Automation</strong> that hands your team their afternoons
            back.
          </>
        }
        primary={{ href: '/contact', label: 'Bring us the problem' }}
        secondary={{ href: '#disciplines', label: 'Explore services' }}
      >
        <div className={styles.heroSystem}>
          <Panel depth={18}>
            <ConnectedSystem />
          </Panel>
        </div>
      </RefHero>
      <PillNav items={NAV} />

      <RefIntro
        id="disciplines"
        count="01 / What we build"
        line="Three services."
        ghost="One team."
        aside={
          <>
            Start with what needs fixing. We make sure it <strong>works with everything around
            it</strong>.
          </>
        }
      />
      {SERVICE_LIST.map((service, index) => {
        const content = EDITORIAL[service.id]
        return (
          <Chapter
            key={service.id}
            id={`service-${service.id}`}
            count={`${String(index + 1).padStart(2, '0')} / ${service.title}`}
            word={WORD[service.id]}
            title={content.heading}
            body={
              <>
                {content.fit} <strong>{content.output}</strong>
              </>
            }
            cta={{ href: service.slug, label: `Explore ${service.title}` }}
            accent={ACCENT[service.id]}
          >
            <FeatureSpace kind={service.id} />
            <CapabilityGrid
              items={service.capabilities.slice(0, 3).map((capability) => ({
                title: capability.title,
                body: capability.body,
              }))}
            />
          </Chapter>
        )
      })}

      <RefIntro
        id="problems"
        count="02 / Find your starting point"
        line="What’s slowing"
        ghost="you down?"
        aside="You don’t need a technical brief. Choose the closest problem to see where we would start."
      >
        <ProblemNavigator />
        <p className={styles.navigatorNote}>
          More than one sounds familiar?{' '}
          <Link href="/contact">
            Let&apos;s work through it together <span aria-hidden="true">↗</span>
          </Link>
        </p>
      </RefIntro>

      <RefIntro
        id="engage"
        count="03 / How we engage"
        line="You decide."
        ghost="We deliver."
        aside={
          <>
            Every project starts with your requirements, not a package. We come back with options
            and tell you which one we would pick and why. No price list: each quote is for the
            option you choose.{' '}
            <Link href="/contact" className={styles.directoryLink}>
              Bring us your requirement <span aria-hidden="true">↗</span>
            </Link>
          </>
        }
      >
        <CapabilityGrid
          cols={4}
          items={ENGAGEMENT.map(([title, body]) => ({ title, body }))}
        />
        <p className={styles.navigatorNote}>
          <Link href="/bottleneck-review">
            Or start with the free 20-minute review <span aria-hidden="true">↗</span>
          </Link>
        </p>
      </RefIntro>

    </div>
  )
}
