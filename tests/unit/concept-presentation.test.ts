import assert from 'node:assert/strict'
import test from 'node:test'
// @ts-expect-error Node's built-in TypeScript runner requires the file extension.
import { getConceptPresentationStatus } from '../../src/app/work/concept-presentation.ts'

test('keeps incomplete published concepts honest and noninteractive', () => {
  assert.equal(
    getConceptPresentationStatus({
      status: 'published',
      previewImage: '/preview.webp',
    }),
    'unavailable',
  )
})

test('publishes a concept only when both required assets exist', () => {
  assert.equal(
    getConceptPresentationStatus({
      status: 'published',
      previewImage: '/preview.webp',
      demoPath: '/concepts/demo/index.html',
    }),
    'published',
  )
})

test('preserves the draft state', () => {
  assert.equal(getConceptPresentationStatus({ status: 'draft' }), 'draft')
})
