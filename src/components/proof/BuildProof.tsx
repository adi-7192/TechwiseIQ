import ProofFrame, { type ProofSurface } from './ProofFrame'
import styles from './BuildProof.module.css'

type BuildProofProps = {
  caption?: string
  className?: string
  surface?: ProofSurface
}

/**
 * BuildProof — the engineering chapter's proof. A tailored build/deploy
 * interface (SVG) framed as a bright product surface: tests, pipeline and the
 * ship step made visible. Static illustrative asset, honestly tagged; it varies
 * the silhouette from the four interactive demos above.
 */
export default function BuildProof({
  caption = 'Illustrative build & ship view — tests, pipeline and deploy in one place.',
  className,
  surface = 'light',
}: BuildProofProps) {
  return (
    <ProofFrame
      label="build / ship"
      caption={caption}
      surface={surface}
      className={className}
      aria-label="Illustrative engineering build and deployment interface"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- tailored fixed-size SVG proof surface; next/image can't optimise inline SVG */}
      <img
        src="/artifacts/dev-hero.svg"
        alt=""
        className={styles.image}
        width={1200}
        height={760}
        loading="lazy"
        decoding="async"
      />
    </ProofFrame>
  )
}
