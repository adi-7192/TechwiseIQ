import assert from 'node:assert/strict'
import test from 'node:test'
// @ts-expect-error Node's built-in TypeScript runner requires the file extension.
import { getDeliveryMetrics, getProjectStatus, partitionProjects } from '../../src/app/work/work-projects.ts'
// @ts-expect-error Node's built-in TypeScript runner requires the file extension.
import { CASE_STUDIES } from '../../src/data/case-studies.ts'

const projects = (flags: boolean[]) =>
  flags.map((featured, index) => ({
    slug: `project-${index + 1}`,
    featured,
  }))

test('caps the cinematic reel at three and preserves overflow order', () => {
  const result = partitionProjects(projects([true, true, true, true]))

  assert.deepEqual(
    result.featured.map((project) => project.slug),
    ['project-1', 'project-2', 'project-3'],
  )
  assert.deepEqual(
    result.remaining.map((project) => project.slug),
    ['project-4'],
  )
})

test('uses the first three projects when no featured flags exist', () => {
  const result = partitionProjects(projects([false, false, false, false]))

  assert.deepEqual(
    result.featured.map((project) => project.slug),
    ['project-1', 'project-2', 'project-3'],
  )
  assert.deepEqual(
    result.remaining.map((project) => project.slug),
    ['project-4'],
  )
})

test('omits aggregate metrics when there are no client projects', () => {
  assert.deepEqual(getDeliveryMetrics([]), [])
})

test('derives aggregate metrics from project proof and timelines', () => {
  const result = getDeliveryMetrics([
    {
      timeline: '6 weeks',
      liveUrl: 'https://example.com/one',
      workSummary: { proof: [{ value: '11', label: 'pages' }] },
    },
    {
      timeline: '5 weeks',
      liveUrl: 'https://example.com/two',
      workSummary: { proof: [{ value: '10', label: 'pages' }] },
    },
  ])

  assert.deepEqual(result, [
    { value: '2', label: 'Live client sites' },
    { value: '21', label: 'Pages shipped' },
    { value: '5–6', label: 'Weeks, brief to launch' },
  ])
})

test('labels project status: live wins, then awaiting launch, else preview', () => {
  assert.equal(
    getProjectStatus({ liveUrl: 'https://example.com', awaitingLaunch: true }),
    'Live',
  )
  assert.equal(getProjectStatus({ awaitingLaunch: true }), 'Awaiting launch')
  assert.equal(getProjectStatus({}), 'Preview build')
})

type Study = {
  slug: string
  featured: boolean
  liveUrl?: string
  result: string
  workSummary: { challenge: string; reported?: string }
}
const studies = CASE_STUDIES as Study[]

test('every featured case study is a live site', () => {
  for (const study of studies.filter((cs) => cs.featured)) {
    assert.ok(study.liveUrl, `${study.slug} is featured without a liveUrl`)
  }
})

test('client-reported results quote the approved result, live sites only', () => {
  for (const study of studies.filter((cs) => cs.workSummary.reported)) {
    assert.ok(study.liveUrl, `${study.slug} reports a result without a liveUrl`)
    assert.ok(
      study.result.includes(study.workSummary.reported!),
      `${study.slug} reported text is not in its approved result`,
    )
  }
})

test('featured cards never share a Before line', () => {
  const challenges = studies
    .filter((cs) => cs.featured)
    .map((cs) => cs.workSummary.challenge)
  assert.equal(new Set(challenges).size, challenges.length)
})

test('hero totals count live client sites only, never previews', () => {
  assert.deepEqual(getDeliveryMetrics(CASE_STUDIES), [
    { value: '3', label: 'Live client sites' },
    { value: '114', label: 'Pages shipped' },
    { value: '3–5', label: 'Weeks, brief to launch' },
  ])
})
