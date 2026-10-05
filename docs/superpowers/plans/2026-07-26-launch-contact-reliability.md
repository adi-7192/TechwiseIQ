> **Historical (written for the Kinetic design, deleted — D-028).** Kept for reference only; do not build from it.
> Current: `docs/site-spec.md`, `docs/design-system.md`, `docs/DECISIONS.md`.

# Launch Contact and Tooling Reliability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the contact path safe, honest, recoverable, and testable while making local/CI verification deterministic.

**Architecture:** Extract validation into a side-effect-free TypeScript module tested with Node’s built-in test runner. The server action remains the only delivery boundary and calls Resend only after validation and honeypot screening. The client form consumes a small error-state contract for field focus and inline feedback. Tooling commands receive explicit scopes and generated-output ignores.

**Tech Stack:** Next.js 16 server actions, React 19 `useActionState`, Resend, Node test runner, Playwright, ESLint 9

---

### Task 1: Add failing contact-validation unit tests

**Files:**
- Create: `tests/unit/contact-validation.test.ts`
- Create: `src/app/contact/contact-validation.ts`

- [ ] **Step 1: Create the empty validation module**

```ts
export const BUDGETS = [
  'Under AED 10,000',
  'AED 10,000 – 25,000',
  'AED 25,000 – 50,000',
  'AED 50,000 – 100,000',
  'AED 100,000+',
  'Not sure yet',
] as const
```

- [ ] **Step 2: Write the failing tests**

```ts
import assert from 'node:assert/strict'
import test from 'node:test'
// @ts-expect-error Node's built-in TypeScript runner requires the file extension.
import {
  CONTACT_LIMITS,
  validateContactSubmission,
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
```

- [ ] **Step 3: Run the test and verify it fails**

```bash
node --test tests/unit/contact-validation.test.ts
```

Expected: failure because `CONTACT_LIMITS` and `validateContactSubmission` are not exported.

- [ ] **Step 4: Commit the red test**

```bash
git add src/app/contact/contact-validation.ts tests/unit/contact-validation.test.ts
git commit -m "test: define contact validation contract"
```

### Task 2: Implement pure, bounded validation

**Files:**
- Modify: `src/app/contact/contact-validation.ts`
- Test: `tests/unit/contact-validation.test.ts`

- [ ] **Step 1: Implement the validation contract**

```ts
export const BUDGETS = [
  'Under AED 10,000',
  'AED 10,000 – 25,000',
  'AED 25,000 – 50,000',
  'AED 50,000 – 100,000',
  'AED 100,000+',
  'Not sure yet',
] as const

export const CONTACT_LIMITS = {
  name: 100,
  email: 254,
  company: 160,
  message: 5000,
} as const

export type ContactField = 'name' | 'email' | 'company' | 'message' | 'budget'

export interface ContactSubmission {
  name: string
  email: string
  company: string
  message: string
  budget: string
  website: string
}

type ValidationResult =
  | { ok: true; data: ContactSubmission }
  | { ok: false; field: ContactField; message: string }

const requiredMessages: Record<'name' | 'email' | 'message' | 'budget', string> =
  {
    name: 'Please enter your name.',
    email: 'Please enter your email address.',
    message: 'Please tell us a little about your project.',
    budget: 'Please select a budget range.',
  }

export function readContactSubmission(formData: FormData): ContactSubmission {
  const read = (name: string) => {
    const value = formData.get(name)
    return typeof value === 'string' ? value : ''
  }

  return {
    name: read('name'),
    email: read('email'),
    company: read('company'),
    message: read('message'),
    budget: read('budget'),
    website: read('website'),
  }
}

export function validateContactSubmission(
  input: ContactSubmission,
): ValidationResult {
  const data = {
    name: input.name.trim(),
    email: input.email.trim(),
    company: input.company.trim(),
    message: input.message.trim(),
    budget: input.budget.trim(),
    website: input.website.trim(),
  }

  for (const field of ['name', 'email', 'message', 'budget'] as const) {
    if (!data[field]) {
      return { ok: false, field, message: requiredMessages[field] }
    }
  }

  for (const field of ['name', 'email', 'company', 'message'] as const) {
    if (data[field].length > CONTACT_LIMITS[field]) {
      return {
        ok: false,
        field,
        message: `${field === 'message' ? 'Message' : field[0].toUpperCase() + field.slice(1)} is too long.`,
      }
    }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return {
      ok: false,
      field: 'email',
      message: 'Please enter a valid email address.',
    }
  }

  if (!(BUDGETS as readonly string[]).includes(data.budget)) {
    return {
      ok: false,
      field: 'budget',
      message: 'Please select a valid budget range.',
    }
  }

  return { ok: true, data }
}
```

- [ ] **Step 2: Run all unit tests**

```bash
node --test tests/unit/*.test.ts
```

Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/app/contact/contact-validation.ts tests/unit/contact-validation.test.ts
git commit -m "feat: validate contact submissions safely"
```

### Task 3: Enforce validation and spam suppression in the server action

**Files:**
- Modify: `src/app/contact/actions.ts`
- Test: `tests/unit/contact-validation.test.ts`

- [ ] **Step 1: Extend the action state**

```ts
import {
  readContactSubmission,
  validateContactSubmission,
  type ContactField,
} from './contact-validation'

export interface ContactFormState {
  success: boolean
  message: string
  field?: ContactField
}
```

- [ ] **Step 2: Replace unsafe form casts and inline validation**

At the start of `submitContact`, use:

```ts
const result = validateContactSubmission(readContactSubmission(formData))

if (!result.ok) {
  return {
    success: false,
    message: result.message,
    field: result.field,
  }
}

const { name, email, company, message, budget, website } = result.data

if (website) {
  return {
    success: true,
    message: 'Message sent. We’ll reply within 24 hours.',
  }
}
```

Use the normalized values directly in `replyTo`, subject, and body. Keep the existing explicit `RESEND_API_KEY` failure path and `try/catch`; never report success after a real delivery error.

- [ ] **Step 3: Run unit tests and type-check through build**

```bash
node --test tests/unit/*.test.ts
npm run build
```

Expected: both exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/app/contact/actions.ts
git commit -m "feat: guard contact delivery at the server boundary"
```

### Task 4: Add failing contact recovery browser tests

**Files:**
- Create: `tests/e2e/contact-form.spec.ts`

- [ ] **Step 1: Write the failing browser tests**

```ts
import { expect, test } from '@playwright/test'

async function fillRequiredFields(page: import('@playwright/test').Page) {
  await page.getByLabel(/^Name/).fill('Ada Lovelace')
  await page.getByLabel(/^Email/).fill('ada@example.com')
  await page.getByLabel(/What.*slowing you down/i).fill(
    'We need a client portal with reporting.',
  )
  await page.getByLabel(/Budget range/i).selectOption('AED 25,000 – 50,000')
}

test('focuses the invalid field and preserves the submission', async ({
  page,
}) => {
  await page.goto('/contact')
  await fillRequiredFields(page)
  await page.getByLabel(/^Email/).fill('ada@')
  await page.getByRole('button', { name: 'Send message' }).click()

  await expect(page.getByRole('alert')).toContainText(
    'Please enter a valid email address.',
  )
  await expect(page.getByLabel(/^Email/)).toBeFocused()
  await expect(page.getByLabel(/^Name/)).toHaveValue('Ada Lovelace')
  await expect(page.getByLabel(/What.*slowing you down/i)).toHaveValue(
    'We need a client portal with reporting.',
  )
})

test('honestly reports missing delivery configuration', async ({ page }) => {
  await page.goto('/contact')
  await fillRequiredFields(page)
  await page.getByRole('button', { name: 'Send message' }).click()

  await expect(page.getByRole('alert')).toContainText('was NOT sent')
  await expect(page.getByLabel(/^Name/)).toHaveValue('Ada Lovelace')
})

test('honeypot is not keyboard reachable', async ({ page }) => {
  await page.goto('/contact')
  await expect(page.locator('input[name="website"]')).toHaveAttribute(
    'tabindex',
    '-1',
  )
})
```

- [ ] **Step 2: Run and verify expected failures**

```bash
npx playwright test tests/e2e/contact-form.spec.ts
```

Expected: failures because the form uses native validation, has no returned field focus, and has no honeypot.

- [ ] **Step 3: Commit the red browser tests**

```bash
git add tests/e2e/contact-form.spec.ts
git commit -m "test: capture contact form recovery behavior"
```

### Task 5: Make contact errors recoverable and accessible

**Files:**
- Modify: `src/app/contact/ContactForm.tsx`
- Modify: `src/app/contact/contact.module.css`
- Test: `tests/e2e/contact-form.spec.ts`

- [ ] **Step 1: Share budget values and focus returned errors**

Replace the local `BUDGETS`, import it from `contact-validation`, import `useEffect`, and add:

```tsx
useEffect(() => {
  if (!state.field) return
  document.getElementById(state.field)?.focus()
}, [state])

const errorFor = (field: string) =>
  state.field === field ? `${field}-error` : undefined
```

- [ ] **Step 2: Disable native validation and expose the form-level error**

```tsx
<form action={formAction} className={styles.form} noValidate>
  <div role="alert" aria-live="assertive">
    {state.message && !state.success && (
      <p id="form-error" className={styles.error}>
        {state.message}
      </p>
    )}
  </div>
```

- [ ] **Step 3: Add limits and field error relationships**

For `name`, `email`, `company`, and `message`, add the matching `maxLength` from `CONTACT_LIMITS`.

For every validated control, add:

```tsx
aria-invalid={state.field === 'name' || undefined}
aria-describedby={errorFor('name')}
```

Immediately after each control, render the active inline error:

```tsx
{state.field === 'name' && (
  <p id="name-error" className={styles.fieldError}>
    {state.message}
  </p>
)}
```

Repeat with the correct field name for email, company, message, and budget.

- [ ] **Step 4: Add the honeypot**

Place this as the first form control:

```tsx
<div className={styles.honeypot} aria-hidden="true">
  <label htmlFor="website">Website</label>
  <input
    id="website"
    name="website"
    type="text"
    tabIndex={-1}
    autoComplete="off"
  />
</div>
```

Add:

```css
.honeypot {
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.fieldError {
  margin-top: 8px;
  color: #9d2500;
  font-size: 14px;
  font-weight: 700;
}
```

- [ ] **Step 5: Run the contact suite**

```bash
npx playwright test tests/e2e/contact-form.spec.ts
```

Expected: 3 passed when the test environment has no `RESEND_API_KEY`.

- [ ] **Step 6: Commit**

```bash
git add src/app/contact/ContactForm.tsx src/app/contact/contact.module.css
git commit -m "a11y: make contact errors recoverable"
```

### Task 6: Make lint and unit verification deterministic

**Files:**
- Modify: `package.json`
- Modify: `eslint.config.mjs`

- [ ] **Step 1: Add the unit script and scope lint**

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint src tests eslint.config.mjs next.config.ts playwright.config.ts",
  "test:unit": "node --test tests/unit/*.test.ts",
  "test:e2e": "playwright test"
}
```

- [ ] **Step 2: Ignore generated test outputs**

Add to `globalIgnores`:

```ts
"test-results/**",
"playwright-report/**",
"blob-report/**",
"coverage/**",
```

- [ ] **Step 3: Reproduce the former concurrency condition**

```bash
npm run lint
npm run test:e2e
```

Run the commands concurrently in separate shells once, then run `npm run lint` again.

Expected: lint never attempts to scan transient Playwright outputs; all commands exit 0.

- [ ] **Step 4: Run the full local verification commands**

```bash
npm run test:unit
npm run lint
npm run build
```

Expected: every command exits 0. Node may still emit the existing typeless-package warning; do not change package module semantics solely to silence it.

- [ ] **Step 5: Commit**

```bash
git add package.json eslint.config.mjs
git commit -m "chore: make launch checks deterministic"
```

### Task 7: Verify the contact/reliability workstream

**Files:**
- Review: all files changed in Tasks 1–6

- [ ] **Step 1: Run focused unit and browser suites**

```bash
npm run test:unit
npx playwright test tests/e2e/contact-form.spec.ts
```

Expected: all tests pass.

- [ ] **Step 2: Run lint and build**

```bash
npm run lint
npm run build
```

Expected: both exit 0.

- [ ] **Step 3: Inspect the diff**

```bash
git diff HEAD~6 --check
git status --short
```

Expected: no whitespace errors and no uncommitted production changes.

- [ ] **Step 4: Record the external delivery gate**

Do not claim contact delivery is live until a real `RESEND_API_KEY`, verified `CONTACT_FROM_EMAIL`, and recipient have been configured in Vercel and a real end-to-end message has arrived. The visible failure path is the launch-safe fallback until then.
