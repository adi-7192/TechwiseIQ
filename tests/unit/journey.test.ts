import assert from 'node:assert/strict'
import test from 'node:test'
// @ts-expect-error Node's built-in TypeScript runner requires the file extension.
import { HOLD, PARAM_COUNT, STOPS, STOP_NAMES, flatten, portraitStop, sampleJourney } from '../../src/lib/scene/journey.ts'

const centres = [[5, -6], [-5, -1], [-3.5, -7.5]] as const
const stops = STOP_NAMES.map((name: (typeof STOP_NAMES)[number]) => flatten(STOPS[name], centres))
const anchors = stops.map((_: unknown, i: number) => i * 1000)
const at = (y: number) => sampleJourney(stops, anchors, y, new Float32Array(PARAM_COUNT))

test('every section lands exactly on its stop, and the camera rests there while reading', () => {
  anchors.forEach((a: number, i: number) => {
    assert.deepEqual(at(a), stops[i])
    if (i < stops.length - 1) assert.deepEqual(at(a + 1000 * HOLD * 0.9), stops[i])
  })
})

test('clamps before the first and after the last stop', () => {
  assert.deepEqual(at(-500), stops[0])
  assert.deepEqual(at(99999), stops[stops.length - 1])
})

test('moves between stops without jumps', () => {
  let prev = at(0)
  for (let y = 10; y <= anchors[anchors.length - 1]; y += 10) {
    const next = at(y)
    for (let k = 0; k < PARAM_COUNT; k++) assert.ok(Math.abs(next[k] - prev[k]) < 1.2, `param ${k} jumps at ${y}`)
    prev = next
  }
})

test('district stops are resolved relative to their district', () => {
  const web = flatten(STOPS.websites, centres)
  assert.equal(web[0], STOPS.websites.pos[0] + centres[0][0])
  assert.equal(web[2], STOPS.websites.pos[2] + centres[0][1])
})

test('on phones, every section after the hero runs dimmer than its desktop stop', () => {
  for (const name of STOP_NAMES.slice(1, -1)) {
    assert.ok(portraitStop(name).exposure <= 0.42, name)
    assert.equal(portraitStop(name).wellStrength, 0)
  }
})
