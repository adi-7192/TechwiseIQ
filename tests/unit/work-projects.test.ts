import assert from 'node:assert/strict'
import test from 'node:test'
import { partitionProjects } from '../../src/app/work/work-projects.ts'

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
