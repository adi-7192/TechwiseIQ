> **Historical (written for the Kinetic design, deleted — D-028).** Kept for reference only; do not build from it.
> Current: `docs/site-spec.md`, `docs/design-system.md`, `docs/DECISIONS.md`.

# Launch Verification, Report, and Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prove the hardened site works across routes and breakpoints, publish an evidence-backed launch-readiness report, and deploy a verified Vercel production URL when authentication is available.

**Architecture:** Add one launch-smoke Playwright suite for cross-route invariants, then run the existing unit, E2E, responsive, production-build, and Lighthouse checks in a fixed order. Store durable findings in Markdown while keeping generated screenshots/reports outside Git. Deployment is preview-first, then production; missing Vercel or third-party credentials remain explicit owner gates rather than false success states.

**Tech Stack:** Next.js 16, Playwright, Lighthouse, Vercel CLI, Markdown

---

### Task 1: Add failing cross-route launch smoke tests

**Files:**
- Create: `tests/e2e/launch-smoke.spec.ts`

- [ ] **Step 1: Write the route and crawler tests**

```ts
import { expect, test } from '@playwright/test'

const routes = [
  '/',
  '/services',
  '/services/web',
  '/services/software',
  '/services/ai',
  '/work',
  '/work/aaskra-realty',
  '/work/express-trade-financing',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
]

for (const route of routes) {
  test(`${route} meets launch invariants`, async ({ page }) => {
    const errors: string[] = []
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text())
    })
    page.on('pageerror', (error) => errors.push(error.message))

    const response = await page.goto(route, { waitUntil: 'networkidle' })

    expect(response?.status()).toBe(200)
    await expect(page.locator('main')).toHaveCount(1)
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    await expect(page.locator('title')).not.toHaveText('')
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /.+/,
    )

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    )
    expect(overflow).toBeLessThanOrEqual(1)
    expect(errors).toEqual([])
  })
}

test('returns the designed semantic 404', async ({ page }) => {
  const response = await page.goto('/launch-audit-missing-route')

  expect(response?.status()).toBe(404)
  await expect(
    page.getByRole('heading', { level: 1, name: '404' }),
  ).toBeVisible()
})

test('serves parseable crawler files', async ({ request }) => {
  const robots = await request.get('/robots.txt')
  expect(robots.status()).toBe(200)
  expect(await robots.text()).toContain(
    'Sitemap: https://techwiseiq.com/sitemap.xml',
  )

  const sitemap = await request.get('/sitemap.xml')
  expect(sitemap.status()).toBe(200)
  const xml = await sitemap.text()
  for (const route of routes) {
    const expected =
      route === '/'
        ? '<loc>https://techwiseiq.com</loc>'
        : `<loc>https://techwiseiq.com${route}</loc>`
    expect(xml).toContain(expected)
  }
})
```

- [ ] **Step 2: Run the suite before implementation work is complete**

```bash
npx playwright test tests/e2e/launch-smoke.spec.ts
```

Expected: the 404 semantic assertion and any browser warning assertions identified by the earlier plans fail before their fixes; crawler route coverage should pass.

- [ ] **Step 3: Commit the red launch suite**

```bash
git add tests/e2e/launch-smoke.spec.ts
git commit -m "test: define public launch invariants"
```

### Task 2: Run the complete automated verification stack

**Files:**
- Test: `tests/unit/*.test.ts`
- Test: `tests/e2e/*.spec.ts`

- [ ] **Step 1: Run deterministic static checks**

```bash
npm run lint
npm run test:unit
npm run build
```

Expected: all commands exit 0.

- [ ] **Step 2: Run all browser tests**

```bash
npm run test:e2e
```

Expected: every active test passes. Desktop visual-baseline capture cases may remain intentionally skipped when the capture flag is not set; record the exact passed/skipped totals.

- [ ] **Step 3: Run the dedicated launch suite against the production build**

Start the production server:

```bash
npm run start -- --hostname 127.0.0.1 --port 3100
```

In another shell:

```bash
PW_BASE_URL=http://127.0.0.1:3100 npx playwright test tests/e2e/launch-smoke.spec.ts tests/e2e/launch-accessibility.spec.ts tests/e2e/launch-performance-metadata.spec.ts tests/e2e/contact-form.spec.ts
```

Expected: all tests pass against the production build, not only the development server.

- [ ] **Step 4: Inspect repository state**

```bash
git diff --check
git status --short
```

Expected: no whitespace errors; only intentional documentation/report changes remain.

### Task 3: Re-run the visual responsive matrix

**Files:**
- Test: `tests/e2e/responsive.spec.ts`
- Generated evidence: `/tmp/techwise-launch-final/`

- [ ] **Step 1: Run the existing responsive assertions**

```bash
npx playwright test tests/e2e/responsive.spec.ts
```

Expected: every route/viewport combination passes without horizontal overflow, clipped critical content, or unusable navigation.

- [ ] **Step 2: Capture all launch routes at representative breakpoints**

Capture each route at:

- Phone: `390 × 844`
- Tablet: `834 × 1112`
- Desktop: `1440 × 1000`

Write generated screenshots under `/tmp/techwise-launch-final/`, not the repository.

- [ ] **Step 3: Inspect the complete matrix**

For all 36 captures, check:

- nav open/closed behavior and content clearance;
- hero alignment, line breaks, and CTA visibility;
- section spacing, borders, and card/grid alignment;
- tap-target clearance and floating-control obstruction;
- form field width, error wrapping, and keyboard focus;
- case-study screenshot scroller affordance;
- footer alignment and long email wrapping;
- absence of blank animation-gated content.

Expected: no P0 or P1 visual issue remains. Record any intentional P2 polish item in the report rather than hiding it.

- [ ] **Step 4: Complete a keyboard-only template audit**

Using one representative of each template—home, services overview, service
detail, work, case study, about, contact, legal, and 404—Tab and Shift+Tab
through every interactive control. Verify visible focus, logical order, menu
operation, route-change focus, form error focus, external-link clarity, and
case-study scroll-region access. Record the result by template in the report.

### Task 4: Run sequential Lighthouse verification

**Files:**
- Generated evidence: `/tmp/techwise-lighthouse-final/`

- [ ] **Step 1: Audit every 200 route sequentially**

Run Lighthouse one route at a time against the production server with:

```bash
npx --yes lighthouse http://127.0.0.1:3100/services --only-categories=performance,accessibility,seo,best-practices --output=json --output-path=/tmp/techwise-lighthouse-final/services.json --chrome-flags="--headless --no-sandbox"
```

Repeat with route-specific filenames for all 12 launch routes. Do not run reports in parallel because CPU contention invalidated the earlier sweep.

- [ ] **Step 2: Extract and review the route scores**

For every JSON report, record:

- performance;
- accessibility;
- best practices;
- SEO;
- LCP;
- CLS;
- total blocking time;
- any failed or manual audit.

Expected launch gates:

- accessibility: `100`;
- best practices: `100`;
- SEO: `100`;
- CLS: at most `0.10`;
- no route below `90` performance in the controlled local run;
- priority-route LCP materially improved from the audited 3.5–3.8 second baseline, with a target under 3.0 seconds.

If a performance score misses because of reproducible application work, return to the relevant implementation plan. If it is measurement variance, run the route three times and report the median rather than selecting the best run.

The approved production-preview target remains LCP below 1.8 seconds on the
documented simulated-mobile profile. Local Lighthouse is a regression gate, not
a substitute for measuring the deployed preview.

- [ ] **Step 3: Verify the 404 separately**

Use Playwright semantic/visual checks for the 404 because Lighthouse treats its intentional HTTP 404 response as a navigation failure.

### Task 5: Write the detailed launch-readiness report

**Files:**
- Create: `docs/launch-readiness-report-2026-07-26.md`
- Modify: `CHANGELOG.md`

- [ ] **Step 1: Create the evidence-backed report**

Use this exact structure and populate every section with the final observed result:

```md
# Techwise IQ Launch Readiness Report — 26 July 2026

## Executive status

Launch classification, production URL status, domain status, and the remaining
owner-controlled gates.

## Scope and methodology

Routes, viewports, automated suites, production build, visual review,
Lighthouse method, link checks, and external-service checks.

## What was fixed

### UI, responsiveness, and alignment
### Accessibility and keyboard UX
### Performance and loading behavior
### SEO, social sharing, and crawler readiness
### Contact form safety and recovery
### Verification-tool reliability

## Route-by-route results

One row per route covering HTTP status, h1/main, responsive review,
accessibility, performance, SEO, and notes.

## Responsive visual matrix

Phone, tablet, and desktop findings with any accepted P2 exceptions.

## Lighthouse results

Final route metrics plus the original baseline for the affected priority routes.

## Functional and integration status

Internal links, external project links, WhatsApp, booking, contact delivery,
analytics, robots, sitemap, and structured metadata.

## Deployment status

Preview and production URLs, deployment timestamp, commit, and smoke result.

## Remaining owner actions

Domain registration/DNS, Vercel access if still blocked, Resend verification,
Plausible setup, final calendar URL, 24-hour response-promise approval, and
physical-device sign-off.

## Go-live decision

State exactly what is live now, what is launch-ready in code, and what cannot
be called complete until an owner-controlled gate is supplied.
```

Do not use “all good,” “fully live,” or similar blanket language unless every external gate has been verified.

- [ ] **Step 2: Update the changelog**

Add a dated launch-hardening entry summarizing UI/accessibility, performance/metadata, contact reliability, test coverage, and deployment status. Link to the report.

- [ ] **Step 3: Commit the report**

```bash
git add docs/launch-readiness-report-2026-07-26.md CHANGELOG.md
git commit -m "docs: publish launch readiness report"
```

### Task 6: Deploy preview and production on Vercel

**Files:**
- External state: Vercel project and deployment
- Review: `.vercel/project.json` if Vercel creates it

- [ ] **Step 1: Verify authentication**

```bash
npx vercel whoami
```

Expected current state from discovery: the stored token is invalid. If it remains invalid, stop this task, record the exact authentication blocker, and ask the owner to authenticate. Do not invent or expose credentials.

- [ ] **Step 2: Link the intended Vercel project**

After authentication:

```bash
npx vercel link
```

Confirm the account/team and project name are Techwise IQ before accepting. Inspect `.vercel/project.json`; `.vercel` should remain ignored by Git.

- [ ] **Step 3: Configure environment variables**

Configure these in Vercel for Preview and Production:

```text
RESEND_API_KEY
CONTACT_FROM_EMAIL
CONTACT_TO_EMAIL
NEXT_PUBLIC_PLAUSIBLE_DOMAIN
```

The last two integrations may remain unset only if the report explicitly marks contact delivery and analytics as not live. Never place secret values in Git or the report.

- [ ] **Step 4: Deploy a preview**

```bash
TECHWISE_PREVIEW_URL="$(npx vercel deploy --yes)"
PW_BASE_URL="$TECHWISE_PREVIEW_URL" npx playwright test tests/e2e/launch-smoke.spec.ts
```

Open the exact returned HTTPS URL and run Lighthouse on the priority routes
against that deployed origin. Expected: all preview smoke tests pass, and the
deployed measurements are recorded without selecting only the best run.

- [ ] **Step 5: Verify the contact integration if credentials are present**

Submit one clearly labeled launch-test inquiry. Confirm it arrives at `Info@techwiseiqtechnologies.ae`, that reply-to is the submitted address, and that no duplicate mail is sent. This is the only authorized test message; do not submit if delivery credentials are absent.

- [ ] **Step 6: Deploy production**

The approved scope is a public Vercel preview. A production deployment is
authorized only after every production owner gate in the design is satisfied:
final domain decision, DNS plan, Vercel access, verified Resend sender and
delivery, Plausible configuration, final booking URL, 24-hour response-promise
approval, and physical-device sign-off.

When those gates are all verified:

```bash
TECHWISE_PRODUCTION_URL="$(npx vercel deploy --prod --yes)"
PW_BASE_URL="$TECHWISE_PRODUCTION_URL" npx playwright test tests/e2e/launch-smoke.spec.ts
```

If any gate is missing, do not run this command. Record the public preview URL
as the current reviewable deployment and production as blocked by the named
owner actions.

- [ ] **Step 7: Record the deployment**

Add the preview URL, deployment time, deployed commit SHA, and smoke result to
the launch report. Add a production URL only if Step 6 actually ran. Because
`techwiseiq.com` is currently an unregistered placeholder, do not describe the
custom-domain production launch as live.

- [ ] **Step 8: Commit deployment documentation**

```bash
git add docs/launch-readiness-report-2026-07-26.md
git commit -m "docs: record verified Vercel deployment"
```

### Task 7: Final verification and handoff

**Files:**
- Review: all launch-hardening changes and report

- [ ] **Step 1: Apply the verification-before-completion skill**

Run fresh, final commands:

```bash
npm run lint
npm run test:unit
npm run build
npm run test:e2e
git diff --check
git status --short
```

Expected: all checks exit 0 and the worktree is clean.

- [ ] **Step 2: Verify the deployed target**

Run `launch-smoke.spec.ts` once more against the recorded production URL. Expected: all tests pass with no console/page errors.

- [ ] **Step 3: Hand off only real remaining actions**

Report:

- the exact live URL;
- test totals and Lighthouse route summary;
- the report path;
- whether contact mail and analytics were truly verified;
- the custom-domain placeholder status;
- the shortest ordered owner-action list.

Do not state that the custom domain, email delivery, analytics, or calendar booking is live unless each was directly verified.
