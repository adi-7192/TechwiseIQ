import Image from 'next/image'
import Link from 'next/link'
import { CASE_STUDIES, SERVICE_LABELS } from '@/data/case-studies'
import styles from './work.module.css'

export default function WorkGrid() {
  return (
    <div className={styles.tiles}>
      {CASE_STUDIES.map((cs) => (
        <Link key={cs.slug} href={`/work/${cs.slug}`} className={styles.tile}>
          {cs.coverImage && (
            <div className={styles.tileImgWrap}>
              <Image
                src={cs.coverImage}
                alt={`${cs.title} website screenshot`}
                fill
                sizes="(max-width: 600px) 100vw, 50vw"
                className={styles.tileImg}
              />
            </div>
          )}
          <div className={styles.tileBody}>
            <span className={styles.tileService}>
              {SERVICE_LABELS[cs.service]}
            </span>
            <h2 className={styles.tileTitle}>{cs.title}</h2>
            <span className={styles.tileTagline}>{cs.outcome}</span>
            <span className={styles.tileCta}>
              View case study{' '}
              <span aria-hidden="true">&rarr;</span>
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
