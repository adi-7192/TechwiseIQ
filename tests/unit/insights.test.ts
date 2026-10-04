import assert from 'node:assert/strict'
import test from 'node:test'
// @ts-expect-error Node's built-in TypeScript runner requires the file extension.
import { INSIGHTS } from '../../src/data/insights.ts'

type Insight = (typeof INSIGHTS)[number]

const BANNED =
  /empowering|unlock|elevate|synergy|cutting-edge|seamless|revolutioni[sz]e|digital transformation|passionate about/i

const allText = (i: Insight) =>
  [
    i.title,
    i.dek,
    i.closing ?? '',
    ...i.body.flatMap((b) =>
      b.type === 'table' ? [...b.head, ...b.rows.flat()] : 'items' in b ? b.items : [b.text],
    ),
  ].join('\n')

test('slugs are unique kebab-case', () => {
  const slugs = INSIGHTS.map((i) => i.slug)
  assert.equal(new Set(slugs).size, slugs.length)
  for (const s of slugs) assert.match(s, /^[a-z0-9]+(-[a-z0-9]+)*$/)
})

test('every article cites https sources, and every source is cited', () => {
  for (const i of INSIGHTS) {
    assert.ok(i.sources.length > 0, i.slug)
    for (const s of i.sources) assert.match(s.url, /^https:\/\//, i.slug)
    // [n] not followed by "(" is a citation; [text](/path) is a link.
    const cited = new Set(
      [...allText(i).matchAll(/\[(\d+)\](?!\()/g)].map((m) => Number(m[1])),
    )
    const expected = new Set(i.sources.map((_, n) => n + 1))
    assert.deepEqual(cited, expected, i.slug)
  }
})

test('inline links are internal, copy has no banned words or review notes', () => {
  for (const i of INSIGHTS) {
    const text = allText(i)
    for (const m of text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) assert.match(m[1], /^\//, i.slug)
    assert.doesNotMatch(text, BANNED, i.slug)
    assert.doesNotMatch(text, /\[OWNER\]|wording approved|you get the logins|search foundations into every site/, i.slug)
    assert.ok(!Number.isNaN(Date.parse(i.published)), i.slug)
  }
})
