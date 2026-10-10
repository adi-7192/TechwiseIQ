import Section from '@/components/immersive/primitives/Section'
import SectionLabel from '@/components/immersive/primitives/SectionLabel'
import DisplayHeading from '@/components/immersive/primitives/DisplayHeading'
import { OPERATING_MODEL } from './home-content'
import styles from './home.module.css'

/** Section 8 — why the studio model works: written scope, weekly demos, direct access, ownership. */
export default function OperatingModel() {
  return (
    <Section ruled density="dense" data-journey="model" aria-labelledby="operating-title">
      <div className={styles.operatingHead} data-home-reveal>
        <SectionLabel hideMark>05 / {OPERATING_MODEL.index}</SectionLabel>
        <DisplayHeading as="h2" size="statement" id="operating-title" className={styles.sectionTitle}>
          {OPERATING_MODEL.title[0]}{' '}
          <span className={styles.ghost}>{OPERATING_MODEL.title[1]}</span>
        </DisplayHeading>
      </div>
      <p className={styles.operatingBody} data-home-reveal>
        {OPERATING_MODEL.body}
      </p>

      <dl className={styles.promiseList} data-home-reveal>
        {OPERATING_MODEL.promises.map(([title, body], i) => (
          <div className={styles.promise} key={title}>
            <span className={styles.capIndex} aria-hidden="true">
              <i />
              {String(i + 1).padStart(2, '0')}
            </span>
            <dt className={styles.promiseTitle}>{title}</dt>
            <dd className={styles.promiseBody}>{body}</dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}
