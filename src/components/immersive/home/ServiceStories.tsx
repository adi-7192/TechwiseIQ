import type { CSSProperties } from 'react'
import SectionLabel from '@/components/immersive/primitives/SectionLabel'
import PrimaryCTA from '@/components/ui/PrimaryCTA'
import ServiceDemo from './ServiceDemo'
import styles from './studio.module.css'

const services = [
  {
    id: 'websites',
    scene: 'web',
    number: '01',
    name: 'Websites',
    title: ['Make your first', 'impression count.'],
    body: 'For businesses whose website no longer reflects what they can do. We turn your offer into a clear, distinctive experience that makes the next step easy.',
    items: ['Strategy & UX', 'Design & development', 'Performance & SEO'],
    href: '/services/web',
    link: 'Explore web development',
    accent: 'var(--tw-acid)',
    demo: 'web',
  },
  {
    id: 'apps',
    scene: 'apps',
    number: '02',
    name: 'Custom software',
    title: ['Your workflow.', 'Your software.'],
    body: 'When spreadsheets and disconnected tools start slowing you down. We build portals, internal tools, and applications around how your team actually works.',
    items: ['Internal tools', 'Customer portals', 'System integrations'],
    href: '/services/software',
    link: 'Explore custom software',
    accent: 'var(--tw-orange)',
    demo: 'software',
  },
  {
    id: 'automation',
    scene: 'automation',
    number: '03',
    name: 'AI automation & advisory',
    title: ['Less repetitive.', 'More productive.'],
    body: 'Find where AI can make a useful difference, then put it to work. Connect your tools, process information, and move everyday tasks forward—with people in control.',
    items: ['Opportunity discovery', 'Workflow automation', 'Human review'],
    href: '/services/ai',
    link: 'Explore AI services',
    accent: 'var(--tw-violet)',
    demo: 'ai',
  },
] as const

export default function ServiceStories() {
  return (
    <>
      <section id="services" className={styles.servicesIntro} aria-labelledby="services-title">
        <div className={`tw-wrap ${styles.introGrid}`} data-home-reveal>
          <SectionLabel>What we build</SectionLabel>
          <div>
            <h2 id="services-title">
              Three ways forward.
              <br />
              <span>One team to build them.</span>
            </h2>
            <p>Start with what your business needs. We’ll find the right way to build it.</p>
          </div>
          <nav className={styles.serviceIndex} aria-label="Explore our services">
            {services.map((s) => (
              <a key={s.id} href={`#${s.id}`}>
                <span>{s.number}</span>
                {s.name}
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </nav>
        </div>
      </section>
      {services.map((s) => (
        <section
          key={s.id}
          id={s.id}
          data-scene={s.scene}
          data-service-story
          className={styles.service}
          style={{ '--tw-accent': s.accent } as CSSProperties}
          aria-labelledby={`${s.id}-title`}
        >
          <div className={`tw-wrap ${styles.serviceGrid}`}>
            <div className={styles.serviceCopy} data-home-reveal>
              <SectionLabel index={s.number}>{s.name}</SectionLabel>
              <h2 id={`${s.id}-title`}>
                {s.title[0]}
                <br />
                <span>{s.title[1]}</span>
              </h2>
              <p>{s.body}</p>
              <ul>
                {s.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <PrimaryCTA href={s.href} variant="ghost">
                {s.link}
              </PrimaryCTA>
            </div>
            <div className={styles.demoWrap} data-home-reveal>
              <ServiceDemo kind={s.demo} />
            </div>
          </div>
        </section>
      ))}
    </>
  )
}
