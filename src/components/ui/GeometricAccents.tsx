import styles from './GeometricAccents.module.css'

interface Props {
  variant: 'manifesto' | 'services' | 'cta'
  className?: string
}

export default function GeometricAccents({ variant, className }: Props) {
  return (
    <div
      className={`${styles.container} ${styles[variant]}${className ? ` ${className}` : ''}`}
      aria-hidden="true"
    >
      {variant === 'manifesto' && (
        <>
          <svg className={`${styles.shape} ${styles.circleL}`} viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="56" fill="none" stroke="var(--ink)" strokeWidth="3" />
          </svg>
          <svg className={`${styles.shape} ${styles.dotsR}`} viewBox="0 0 80 80">
            {[0, 1, 2, 3].map((row) =>
              [0, 1, 2, 3].map((col) => (
                <circle
                  key={`${row}-${col}`}
                  cx={10 + col * 20}
                  cy={10 + row * 20}
                  r="2.5"
                  fill="var(--soft)"
                />
              )),
            )}
          </svg>
          <svg className={`${styles.shape} ${styles.linesL}`} viewBox="0 0 60 100">
            <line x1="0" y1="0" x2="60" y2="40" stroke="var(--ink)" strokeWidth="2" />
            <line x1="0" y1="30" x2="60" y2="70" stroke="var(--ink)" strokeWidth="2" />
            <line x1="0" y1="60" x2="60" y2="100" stroke="var(--ink)" strokeWidth="2" />
          </svg>
          <svg className={`${styles.shape} ${styles.dotsCluster}`} viewBox="0 0 60 60">
            {[0, 1, 2].map((row) =>
              [0, 1, 2].map((col) => (
                <circle
                  key={`c-${row}-${col}`}
                  cx={10 + col * 20}
                  cy={10 + row * 20}
                  r="3"
                  fill="var(--hot)"
                  opacity="0.4"
                />
              )),
            )}
          </svg>
        </>
      )}
      {variant === 'services' && (
        <svg className={`${styles.shape} ${styles.serviceAccent}`} viewBox="0 0 40 40">
          <rect x="4" y="4" width="32" height="32" fill="none" stroke="var(--hot)" strokeWidth="2" transform="rotate(12 20 20)" />
        </svg>
      )}
      {variant === 'cta' && (
        <svg className={`${styles.shape} ${styles.ctaLines}`} viewBox="0 0 100 200">
          <line x1="10" y1="0" x2="90" y2="60" stroke="var(--ink)" strokeWidth="2" />
          <line x1="10" y1="50" x2="90" y2="110" stroke="var(--hot)" strokeWidth="2" />
          <line x1="10" y1="100" x2="90" y2="160" stroke="var(--ink)" strokeWidth="2" />
          <line x1="10" y1="150" x2="90" y2="200" stroke="var(--soft)" strokeWidth="2" />
        </svg>
      )}
    </div>
  )
}
