import assert from 'node:assert/strict'
import test from 'node:test'
// @ts-expect-error Node's built-in TypeScript runner requires the file extension.
import { resolveSceneName } from '../../src/lib/scene/presets.ts'

test('resolves shell scene names to persistent-scene presets', () => {
  assert.equal(resolveSceneName('intro'), 'intro')
  assert.equal(resolveSceneName('automation'), 'automation')
  assert.equal(resolveSceneName('apps'), 'apps')
  assert.equal(resolveSceneName('build'), 'developer')
})

test('falls back safely for absent or unknown scene names', () => {
  assert.equal(resolveSceneName(undefined), 'intro')
  assert.equal(resolveSceneName('unknown'), 'intro')
})
