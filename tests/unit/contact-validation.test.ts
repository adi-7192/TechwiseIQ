import assert from 'node:assert/strict'
import test from 'node:test'
import {
  CONTACT_LIMITS,
  inquirySubject,
  isReviewRequest,
  validateContactSubmission,
// @ts-expect-error Node's built-in TypeScript runner requires the file extension.
} from '../../src/app/contact/contact-validation.ts'

const valid = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  company: 'Analytical Engines',
  message: 'We need a new client portal.',
  budget: 'AED 25,000 – 50,000',
  website: '',
}

test('normalizes and accepts a valid submission', () => {
  assert.deepEqual(validateContactSubmission(valid), {
    ok: true,
    data: valid,
  })
})

test('returns the first missing required field', () => {
  assert.deepEqual(validateContactSubmission({ ...valid, name: '   ' }), {
    ok: false,
    field: 'name',
    message: 'Please enter your name.',
  })
})

test('rejects malformed email addresses', () => {
  assert.deepEqual(validateContactSubmission({ ...valid, email: 'ada@' }), {
    ok: false,
    field: 'email',
    message: 'Please enter a valid email address.',
  })
})

test('rejects values over every server-side limit', () => {
  for (const field of ['name', 'email', 'company', 'message'] as const) {
    const result = validateContactSubmission({
      ...valid,
      [field]: 'x'.repeat(CONTACT_LIMITS[field] + 1),
    })
    assert.equal(result.ok, false)
    if (!result.ok) assert.equal(result.field, field)
  }
})

test('rejects an invented budget value', () => {
  const result = validateContactSubmission({
    ...valid,
    budget: 'AED 1',
  })
  assert.equal(result.ok, false)
  if (!result.ok) assert.equal(result.field, 'budget')
})

test('preserves a filled honeypot for the action to suppress', () => {
  const result = validateContactSubmission({
    ...valid,
    website: 'https://spam.example',
  })
  assert.equal(result.ok, true)
  if (result.ok) assert.equal(result.data.website, 'https://spam.example')
})

test('review requests get their own email subject; tampered values do not', () => {
  const subject = (inquiry: string) => {
    const data = new FormData()
    data.set('inquiry', inquiry)
    return inquirySubject(isReviewRequest(data), 'Ada', 'Not sure yet')
  }
  assert.equal(subject('review'), 'Free bottleneck review request — Ada (Not sure yet)')
  assert.equal(subject(''), 'New project inquiry — Ada (Not sure yet)')
  assert.equal(subject('admin'), 'New project inquiry — Ada (Not sure yet)')
  assert.equal(subject('Review '), 'New project inquiry — Ada (Not sure yet)')
})
