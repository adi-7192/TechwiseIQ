import Link from 'next/link'

// Flat (non-nested) inline markup from src/data/insights.ts.
const TOKEN = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\(\/[^)]*\)|\[\d+\](?!\())/g

export function Inline({ text }: { text: string }) {
  return text.split(TOKEN).map((part, i) => {
    if (i % 2 === 0) return part
    if (part.startsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>
    if (part.startsWith('*')) return <em key={i}>{part.slice(1, -1)}</em>
    if (part.startsWith('`')) return <code key={i}>{part.slice(1, -1)}</code>
    const link = part.match(/^\[(.+)\]\((.+)\)$/)
    if (link) return <Link key={i} href={link[2]}>{link[1]}</Link>
    const n = part.slice(1, -1)
    return (
      <sup key={i}>
        <a href={`#source-${n}`} aria-label={`Source ${n}`}>
          [{n}]
        </a>
      </sup>
    )
  })
}

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })

/** Markup stripped, for meta descriptions and JSON-LD. */
export const plain = (text: string) => text.replace(/[*`]/g, '')
