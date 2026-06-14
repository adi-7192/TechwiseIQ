import styles from './PlaceholderImage.module.css'

interface Props {
  label?: string
  className?: string
  aspectRatio?: string
}

export default function PlaceholderImage({
  label = 'Screenshot',
  className,
  aspectRatio = '16 / 9',
}: Props) {
  return (
    <div
      className={`${styles.placeholder}${className ? ` ${className}` : ''}`}
      style={{ aspectRatio }}
      aria-hidden="true"
    >
      <span className={styles.label}>{label}</span>
    </div>
  )
}
