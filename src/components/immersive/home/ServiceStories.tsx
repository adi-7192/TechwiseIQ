import type { CSSProperties } from 'react'
import SectionLabel from '@/components/immersive/primitives/SectionLabel'
import PrimaryCTA from '@/components/ui/PrimaryCTA'
import { SERVICES } from '@/data/services'
import { FeatureSpace } from './Illustrations'
import styles from './home.module.css'

const services = [
  {
    id: 'websites',
    service: 'web',
    scene: 'web',
    label: '01 / Websites',
    word: 'Websites',
    title: 'Make your first impression count.',
    body: (
      <>
        Your business has grown; your website hasn’t. We turn what you do into a{' '}
        <strong>clear, good-looking site</strong> that makes getting in touch easy.
      </>
    ),
    href: '/services/web',
    link: 'Explore web development',
    accent: 'var(--tw-acid)',
  },
  {
    id: 'apps',
    service: 'software',
    scene: 'apps',
    label: '02 / Custom software',
    word: 'Software',
    title: 'Your workflow. Your software.',
    body: (
      <>
        Drowning in spreadsheets and tools that don’t talk? We build portals, internal tools and
        apps <strong>around how your team really works</strong>.
      </>
    ),
    href: '/services/software',
    link: 'Explore custom software',
    accent: 'var(--tw-orange)',
  },
  {
    id: 'automation',
    service: 'ai',
    scene: 'automation',
    label: '03 / AI automation & advisory',
    word: 'Automation',
    title: 'Less repetitive. More productive.',
    body: (
      <>
        We find where AI actually helps, then put it to work: connecting tools, reading documents
        and moving daily tasks along. <strong>People stay in charge.</strong>
      </>
    ),
    href: '/services/ai',
    link: 'Explore AI services',
    accent: 'var(--tw-violet)',
  },
] as const

export default function ServiceStories() {
  return (
    <>
      <section
        id="services"
        className={styles.intro}
        data-journey="services"
        aria-labelledby="services-title"
      >
        <div className={`tw-wrap ${styles.introGrid}`} data-home-reveal>
          <SectionLabel hideMark className={styles.introCount}>
            What we build
          </SectionLabel>
          <h2 id="services-title" className={styles.introTitle}>
            <span>Three ways forward.</span>{' '}
            <span className={styles.ghost}>One team to build them.</span>
          </h2>
          <p className={styles.introAside}>
            Tell us what’s in the way. We’ll pick the <strong>right tool</strong> to clear it.
          </p>
        </div>
      </section>
      {services.map((s) => (
        <section
          key={s.id}
          id={s.id}
          data-scene={s.scene}
          data-journey={s.id}
          data-service-story
          className={styles.chapter}
          style={{ '--tw-accent': s.accent } as CSSProperties}
          aria-labelledby={`${s.id}-title`}
        >
          <div className="tw-wrap">
            <div className={styles.chapterHead}>
              <div data-home-reveal="clip">
                <SectionLabel hideMark className={styles.count}>
                  {s.label}
                </SectionLabel>
                <h2 id={`${s.id}-title`} className={styles.word}>
                  {/* Clip mask for the word reveal (frontend-specialist, spec §9 D2). */}
                  <span className={styles.wordMask}>
                    <span data-chapter-word>
                      {s.word}
                      <span className={styles.dot} aria-hidden="true" />
                    </span>
                  </span>
                </h2>
              </div>
              <div className={styles.chapterThesis} data-home-reveal>
                <h3 className={styles.thesisHead}>{s.title}</h3>
                <p className={styles.thesisBody}>{s.body}</p>
                <PrimaryCTA href={s.href} variant="ghost" className={styles.chapterLink}>
                  {s.link}
                </PrimaryCTA>
              </div>
            </div>
            <FeatureSpace kind={s.service} />
            <ol className={styles.capGrid} data-home-reveal>
              {SERVICES[s.service].capabilities.map((capability, i) => (
                <li className={styles.cap} key={capability.title}>
                  <span className={styles.capIndex} aria-hidden="true">
                    <i />
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h4 className={styles.capHead}>{capability.title}</h4>
                  <p className={styles.capBody}>{capability.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ))}
    </>
  )
}
