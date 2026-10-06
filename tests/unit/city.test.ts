import assert from 'node:assert/strict'
import test from 'node:test'
// @ts-expect-error Node's built-in TypeScript runner requires the file extension.
import { DISTRICT_RADIUS, NEEDLE_HEIGHT, RISE_SPREAD, TOWERS_DESKTOP, TOWERS_MOBILE, createCity, districtCentres } from '../../src/lib/scene/city.ts'

test('the skyline keeps its budgets: phones get under half the desktop city', () => {
  assert.equal(createCity(false, false).count, TOWERS_DESKTOP)
  assert.equal(createCity(true, true).count, TOWERS_MOBILE)
  assert.ok(TOWERS_MOBILE < TOWERS_DESKTOP / 2)
})

test('the city is deterministic, with exactly one needle and a sparse set of beacons', () => {
  const a = createCity(false, false)
  const b = createCity(false, false)
  assert.deepEqual(a.height, b.height)
  assert.equal(a.height.filter((h: number) => h === NEEDLE_HEIGHT).length, 1)
  const beacons = a.beacon.filter((v: number) => v === 1).length
  assert.ok(beacons > 0 && beacons < a.count * 0.15)
})

test('the rise sweeps out from the centre within the spread', () => {
  const city = createCity(false, false)
  const centre = Math.floor(city.rows / 2) * city.cols + Math.floor(city.cols / 2)
  assert.ok(city.delay[centre] < 0.05)
  assert.ok(Math.max(...city.delay) <= RISE_SPREAD + 1e-6) // float32 storage
})

test('downtown frames the copy: right of centre on landscape, nearer the middle on portrait', () => {
  const tallestX = (city: ReturnType<typeof createCity>) => city.x[city.height.indexOf(NEEDLE_HEIGHT)]
  assert.ok(tallestX(createCity(false, false)) > 3)
  assert.ok(Math.abs(tallestX(createCity(true, true))) < 2.5)
})

test('three service districts exist on every layout and never overlap', () => {
  for (const [mobile, portrait] of [[false, false], [true, true], [true, false]]) {
    const city = createCity(mobile, portrait)
    for (const id of [1, 2, 3]) assert.ok(city.district.includes(id), `district ${id} on ${mobile}/${portrait}`)
    const centres = districtCentres(portrait)
    for (let a = 0; a < centres.length; a++) for (let b = a + 1; b < centres.length; b++) {
      assert.ok(Math.hypot(centres[a][0] - centres[b][0], centres[a][1] - centres[b][1]) > DISTRICT_RADIUS * 2)
    }
  }
})
