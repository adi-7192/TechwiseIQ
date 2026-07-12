import assert from 'node:assert/strict'
import test from 'node:test'
// @ts-expect-error Node's built-in TypeScript runner requires the file extension.
import { getDeliveryMetrics, partitionProjects } from '../../src/app/work/work-projects.ts'

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
    { value: '21', label: 'Pages shipped' },
    { value: '5–6', label: 'Week launches' },
    { value: '2', label: 'Live projects' },
  ])
})
