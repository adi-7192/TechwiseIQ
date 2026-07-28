import assert from 'node:assert/strict'
import test from 'node:test'
// @ts-expect-error Node's built-in TypeScript runner requires the file extension.
import { getConceptPresentationStatus } from '../../src/app/work/concept-presentation.ts'

test('keeps incomplete published concepts honest and noninteractive', () => {
  assert.equal(
    getConceptPresentationStatus({
      status: 'published',
      demoPath: '/concepts/terra-elix/index.html',
    }),
    'unavailable',
  )
  assert.equal(
    getConceptPresentationStatus({
      status: 'published',
      previewMode: 'live-auto-scroll',
    }),
    'unavailable',
  )
})

test('publishes a concept only with a demo and live preview mode', () => {
  assert.equal(
    getConceptPresentationStatus({
      status: 'published',
      demoPath: '/concepts/terra-elix/index.html',
      previewMode: 'live-auto-scroll',
    }),
    'published',
  )
})

test('preserves the draft state', () => {
  assert.equal(getConceptPresentationStatus({ status: 'draft' }), 'draft')
})
