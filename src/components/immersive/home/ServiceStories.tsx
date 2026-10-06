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
    body: (
      <>
        Your business has grown; your website hasn’t. We turn what you do into a{' '}
        <strong>clear, good-looking site</strong> that makes getting in touch easy.
      </>
    ),
    items: ['Plan & structure', 'Design & build', 'Speed & search'],
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
    body: (
      <>
        Drowning in spreadsheets and tools that don’t talk? We build portals, internal tools and
        apps <strong>around how your team really works</strong>.
      </>
    ),
    items: ['Internal tools', 'Customer portals', 'Connected tools'],
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
    body: (
      <>
        We find where AI actually helps, then put it to work: connecting tools, reading documents
        and moving daily tasks along. <strong>People stay in charge.</strong>
      </>
    ),
    items: ['Finding the right tasks', 'Workflow automation', 'Human review'],
    href: '/services/ai',
    link: 'Explore AI services',
    accent: 'var(--tw-violet)',
    demo: 'ai',
  },
] as const

export default function ServiceStories() {
  return (
    <>
      <section
        id="services"
        className={styles.servicesIntro}
        data-journey="services"
        aria-labelledby="services-title"
      >
        <div className={`tw-wrap ${styles.introGrid}`} data-home-reveal>
          <SectionLabel>What we build</SectionLabel>
          <div>
            <h2 id="services-title">
              Three ways forward.
              <br />
              <span>One team to build them.</span>
            </h2>
            <p>
              Tell us what’s in the way. We’ll pick the <strong>right tool</strong> to clear it.
            </p>
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
          data-journey={s.id}
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
