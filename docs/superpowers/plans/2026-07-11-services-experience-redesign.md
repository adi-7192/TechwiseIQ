# Services Experience Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current Services overview and three repeated service-detail layouts with a problem-first, full-width, connected-scroll experience that remains accessible, responsive, honest, and crawlable.

**Architecture:** A typed `services.ts` source owns all service, problem, process, FAQ, and proof relationships. A client-enhanced `ProblemNavigator` provides progressive discovery on `/services`, while server-rendered overview acts and a shared `ServiceDetailPage` keep all buying content visible. One `ServiceMotion` client component uses IntersectionObserver for reveals and one GSAP ScrollTrigger for the orange current, so each route has a single scroll showpiece.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS Modules, GSAP/ScrollTrigger, Playwright.

---

## File Map

### Create

- `src/data/services.ts` — typed service content, problem-to-service mapping, and pricing-free JSON-LD builder.
- `src/components/ServicesOverview/index.tsx` — server-rendered overview composition.
- `src/components/ServicesOverview/ProblemNavigator.tsx` — client-enhanced problem selection.
- `src/components/ServicesOverview/ServicesOverview.module.css` — fluid overview layout and responsive states.
- `src/components/ServiceDetailPage/index.tsx` — shared detail-page composition.
- `src/components/ServiceDetailPage/ServiceMotif.tsx` — service-specific decorative motifs.
- `src/components/ServiceDetailPage/ServiceDetailPage.module.css` — shared detail-page visual system.
- `src/components/ServiceMotion/index.tsx` — one scroll current plus reveal observer.
- `src/components/ServiceMotion/ServiceMotion.module.css` — current, reveal, and reduced-motion styling.
- `tests/e2e/services-experience.spec.ts` — overview, detail, accessibility, no-pricing, and responsive coverage.

### Modify

- `src/app/services/page.tsx` — replace robot hero and service rows with `ServicesOverview`.
- `src/app/services/services.module.css` — remove obsolete page styling; delete file once no import remains.
- `src/app/services/web/page.tsx` — use shared content/template; remove price metadata and offers.
- `src/app/services/software/page.tsx` — use shared content/template; remove price metadata and offers.
- `src/app/services/ai/page.tsx` — use shared content/template; remove price metadata and offers.
- `src/components/FAQSection/index.tsx` — expose visible centered heading and stable test IDs.
- `src/components/FAQSection/FAQSection.module.css` — align FAQ with the fluid detail design.
- `docs/changelog.md` — record the redesign and verification.

## Task 1: Lock the Customer Journey with Failing E2E Tests

**Files:**

- Create: `tests/e2e/services-experience.spec.ts`

- [ ] **Step 1: Write the overview and navigator tests**

```ts
import { expect, test } from '@playwright/test'

const detailRoutes = [
  { path: '/services/web', heading: 'Web Development' },
  { path: '/services/software', heading: 'Custom Software' },
  { path: '/services/ai', heading: 'AI Automation' },
]

test.describe('Services overview', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/services')
  })

  test('starts with the bottleneck and keeps every service visible', async ({ page }) => {
    await expect(
      page.getByRole('heading', { level: 1, name: "What's slowing you down?" }),
    ).toHaveCount(1)
    await expect(page.getByTestId('problem-navigator')).toBeVisible()
    await expect(page.locator('#service-web')).toBeVisible()
    await expect(page.locator('#service-software')).toBeVisible()
    await expect(page.locator('#service-ai')).toBeVisible()
    await expect(page.getByText(/AED|starting from/i)).toHaveCount(0)
  })

  test('maps a selected problem to the matching service', async ({ page }) => {
    await page.getByRole('link', { name: /Manual work is eating the week/ }).click()
    const recommendation = page.getByTestId('service-recommendation')
    await expect(recommendation).toContainText('AI Automation')
    await expect(recommendation.getByRole('link', { name: /Explore AI Automation/ })).toHaveAttribute(
      'href',
      '/services/ai',
    )
  })
})

for (const route of detailRoutes) {
  test(`${route.path} presents the complete decision journey`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(route.path)

    await expect(page.getByRole('heading', { level: 1, name: route.heading })).toHaveCount(1)
    await expect(page.getByTestId('service-fit')).toBeVisible()
    await expect(page.getByTestId('outcome-flow')).toBeVisible()
    await expect(page.getByTestId('service-proof')).toBeVisible()
    await expect(page.getByTestId('capability-river')).toBeVisible()
    await expect(page.getByTestId('connected-process')).toBeVisible()
    await expect(page.getByTestId('service-faq')).toBeVisible()
    await expect(page.getByText(/AED|starting from/i)).toHaveCount(0)
  })
}

for (const path of ['/services', ...detailRoutes.map((route) => route.path)]) {
  test(`${path} stays inside a 375px viewport`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(path)

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow).toBeLessThanOrEqual(1)
  })
}
```

- [ ] **Step 2: Run the new spec and verify it fails for the missing experience**

Run: `npx playwright test tests/e2e/services-experience.spec.ts --project=chromium`

Expected: FAIL because the new heading, navigator, anchors, and test IDs do not exist.

- [ ] **Step 3: Commit the failing specification**

```bash
git add tests/e2e/services-experience.spec.ts
git commit -m "test: specify services experience redesign"
```

## Task 2: Centralize Typed Service Content

**Files:**

- Create: `src/data/services.ts`

- [ ] **Step 1: Define the content types and problem mapping**

Create exported types `ServiceId`, `ServiceContent`, `ServiceProblem`, `OutcomeStage`, `Capability`, and `ServiceProcessStep`. `ServiceContent` must include `id`, `number`, `slug`, `title`, `shortTitle`, `outcome`, `description`, `fitSignals`, `symptoms`, `outcomes`, `capabilities`, `process`, `faqs`, `proofSlugs`, and `motif`.

```ts
export type ServiceId = 'web' | 'software' | 'ai'
export type ServiceMotifId = ServiceId

export interface OutcomeStage {
  title: string
  body: string
}

export interface Capability {
  title: string
  body: string
}

export interface ServiceProcessStep {
  num: string
  title: string
  body: string
}

export interface ServiceContent {
  id: ServiceId
  number: '001' | '002' | '003'
  slug: `/services/${ServiceId}`
  title: string
  shortTitle: string
  outcome: string
  description: string
  fitSignals: string[]
  symptoms: string[]
  outcomes: OutcomeStage[]
  capabilities: Capability[]
  process: ServiceProcessStep[]
  faqs: { question: string; answer: string }[]
  proofSlugs: string[]
  motif: ServiceMotifId
}

export interface ServiceProblem {
  id: string
  label: string
  rationale: string
  examples: string[]
  primaryService: ServiceId
  secondaryServices: ServiceId[]
}
```

- [ ] **Step 2: Add the three complete service records**

Use the approved copy from the design spec. Preserve the existing service-specific process facts and non-price FAQ answers. Define six capabilities, four symptoms, three outcomes, four process steps, and four FAQs for each service. Set proof slugs to both real web case studies for `web` and empty arrays for `software` and `ai`.

```ts
export const SERVICES: Record<ServiceId, ServiceContent> = {
  web: {
    id: 'web',
    number: '001',
    slug: '/services/web',
    title: 'Web Development',
    shortTitle: 'Web Development',
    outcome: 'Attention into action.',
    description: 'Custom websites engineered to earn attention, answer the right questions, and turn interest into action.',
    fitSignals: ['Launch', 'Reposition', 'Convert', 'Rank'],
    symptoms: [
      'Your website no longer reflects the business.',
      'Visitors arrive but do not take the next step.',
      'Your team cannot update content without help.',
      'Performance, search, or mobile experience is slipping.',
    ],
    outcomes: [
      { title: 'Hard to explain', body: 'A generic site that makes visitors work for the answer.' },
      { title: 'Easy to choose', body: 'A clear story, confident proof, and an obvious next action.' },
      { title: 'Built to evolve', body: 'Fast foundations and content your team can manage.' },
    ],
    capabilities: [
      { title: 'Strategy + structure', body: 'Audience, positioning, journeys, and information architecture before decoration.' },
      { title: 'Custom art direction', body: 'A distinct interface shaped around your brand. No reskinned templates.' },
      { title: 'Production development', body: 'Responsive, accessible code engineered for speed and maintainability.' },
      { title: 'CMS + integrations', body: 'Content editing, analytics, CRM, forms, and the systems behind the site.' },
      { title: 'SEO + GEO foundations', body: 'Semantic structure and crawlable answers for search and AI discovery.' },
      { title: 'Launch + support', body: 'Quality assurance, analytics validation, handover, and post-launch care.' },
    ],
    process: [
      { num: '01', title: 'Discover', body: 'Goals, audience, competitors, and the decisions the site needs to support.' },
      { num: '02', title: 'Design in context', body: 'Shape the visual system in-browser so motion, content, and responsiveness work together.' },
      { num: '03', title: 'Build + demonstrate', body: 'Production code from day one, with working progress shown every week.' },
      { num: '04', title: 'Launch + learn', body: 'Performance, accessibility, SEO, analytics, and a clean handover.' },
    ],
    faqs: [
      { question: 'How long does a website take?', answer: 'Marketing sites typically take 3–4 weeks, CMS builds 5–7 weeks, and e-commerce projects 7–10 weeks. You see working progress every Friday.' },
      { question: 'Do I get a custom design or a template?', answer: 'Custom design every time. The interface is designed around your brand, audience, content, and goals.' },
      { question: 'Can my team update the website?', answer: 'Yes. When content editing is part of the brief, we provide a CMS and a clear handover so your team can make routine updates.' },
      { question: 'What happens after launch?', answer: 'Launch includes a stabilization period, documentation, and a clean handover. Ongoing support is available when you need it.' },
    ],
    proofSlugs: ['aaskra-realty', 'express-trade-financing'],
    motif: 'web',
  },
  software: {
    id: 'software', number: '002', slug: '/services/software', title: 'Custom Software', shortTitle: 'Custom Software',
    outcome: 'Friction into flow.',
    description: 'Software shaped around the way your operation actually works—not the other way around.',
    fitSignals: ['Portals', 'Dashboards', 'Integrations', 'MVPs'],
    symptoms: ['Teams re-enter the same data in multiple places.', 'Important work depends on spreadsheets and workarounds.', 'Generic tools force your process into the wrong shape.', 'A product idea needs a focused, testable first release.'],
    outcomes: [{ title: 'Disconnected', body: 'People, data, and tools work around each other.' }, { title: 'One usable flow', body: 'The right information reaches the right person at the right time.' }, { title: 'Ready to evolve', body: 'A documented product foundation that can grow with the operation.' }],
    capabilities: [{ title: 'Web applications', body: 'Purpose-built products for customers, partners, and teams.' }, { title: 'Internal dashboards', body: 'Decision-ready views of the work that matters.' }, { title: 'APIs + integrations', body: 'Reliable connections between existing systems.' }, { title: 'Legacy rebuilds', body: 'Modern, maintainable replacements for fragile software.' }, { title: 'Mobile MVPs', body: 'Focused first releases for iOS and Android.' }, { title: 'Ongoing iteration', body: 'Measured improvements after the first release.' }],
    process: [{ num: '01', title: 'Diagnose', body: 'Map workflows, pain points, users, and existing systems.' }, { num: '02', title: 'Architect', body: 'Document stack decisions, data model, and integration boundaries.' }, { num: '03', title: 'Sprint', body: 'Demonstrate working software every week.' }, { num: '04', title: 'Ship', body: 'Deploy, document, hand over, and plan the next measured iteration.' }],
    faqs: [{ question: 'How long does custom software take?', answer: 'Focused internal tools often take 6–9 weeks, mobile MVPs 10–14 weeks, and larger builds are scoped after diagnosis.' }, { question: 'Can you rebuild our existing system?', answer: 'Yes. We diagnose the current state, define migration boundaries, and plan a staged replacement that protects critical operations.' }, { question: 'How do we stay involved?', answer: 'You see and use working software every week. Decisions are documented and demos are built into the delivery rhythm.' }, { question: 'Do you support the software after launch?', answer: 'Yes. We can continue with maintenance and iteration, or hand over the code and documentation cleanly to your team.' }],
    proofSlugs: [], motif: 'software',
  },
  ai: {
    id: 'ai', number: '003', slug: '/services/ai', title: 'AI Automation', shortTitle: 'AI Automation',
    outcome: 'Busywork into leverage.',
    description: 'Controlled automations that remove repetitive work while keeping human judgment visible.',
    fitSignals: ['Documents', 'Email', 'Reporting', 'Assistants'],
    symptoms: ['Skilled people spend hours copying and classifying information.', 'Documents and inboxes create avoidable queues.', 'Reports are rebuilt manually from the same sources.', 'The team wants to use AI but lacks a safe starting point.'],
    outcomes: [{ title: 'Manual input', body: 'Repetitive work consumes attention and creates delays.' }, { title: 'Controlled automation', body: 'Machines handle the repeatable steps while people own exceptions.' }, { title: 'Useful action', body: 'Information arrives ready for a decision, response, or next step.' }],
    capabilities: [{ title: 'Workflow automation', body: 'Repeatable processes connected from trigger to result.' }, { title: 'AI assistants', body: 'Grounded assistance using approved business knowledge.' }, { title: 'Document extraction', body: 'Structured data from forms, invoices, and operational documents.' }, { title: 'Email triage', body: 'Classification, routing, drafting, and escalation.' }, { title: 'Report generation', body: 'Consistent summaries assembled from trusted sources.' }, { title: 'AI audit + roadmap', body: 'Ranked opportunities, risks, and an evidence-based starting point.' }],
    process: [{ num: '01', title: 'Audit', body: 'Map workflows and rank opportunities by value, risk, and feasibility.' }, { num: '02', title: 'Pilot', body: 'Automate one workflow end to end and prove the control model.' }, { num: '03', title: 'Scale', body: 'Integrate with existing tools and extend to adjacent workflows.' }, { num: '04', title: 'Monitor', body: 'Track errors, exceptions, performance, and ongoing reliability.' }],
    faqs: [{ question: 'Where do I start with AI?', answer: 'Start with a workflow audit. We map repeatable work, identify useful opportunities, and document the risks and control points.' }, { question: 'What kind of automations do you build?', answer: 'Document processing, email triage, report generation, WhatsApp flows, and assistants grounded in approved business data.' }, { question: 'Will AI replace our team?', answer: 'The goal is to remove repetitive steps, not human judgment. People remain responsible for exceptions and important decisions.' }, { question: 'Do you work with our existing tools?', answer: 'Yes. We design around the systems already running your operation and add clear fallbacks where integrations fail.' }],
    proofSlugs: [], motif: 'ai',
  },
}
```

- [ ] **Step 3: Add and export the five problem records**

```ts
export const SERVICE_PROBLEMS: ServiceProblem[] = [
  { id: 'website', label: 'Our website is underperforming', rationale: 'The story, experience, or technical foundation is stopping visitors from acting.', examples: ['Positioning', 'Conversion', 'CMS', 'Search visibility'], primaryService: 'web', secondaryServices: [] },
  { id: 'manual-work', label: 'Manual work is eating the week', rationale: 'Repeatable work can move faster while people keep control of exceptions.', examples: ['Document processing', 'Email triage', 'Reporting', 'AI assistants'], primaryService: 'ai', secondaryServices: ['software'] },
  { id: 'disconnected-tools', label: "Our tools don't talk to each other", rationale: 'A shared workflow or custom integration can remove duplicate work and broken handoffs.', examples: ['APIs', 'Portals', 'Dashboards', 'Integrations'], primaryService: 'software', secondaryServices: ['ai'] },
  { id: 'launch-product', label: 'We need to launch a product', rationale: 'A focused product sprint can turn the idea into something users can test.', examples: ['Product scope', 'Web app', 'Mobile MVP', 'Launch system'], primaryService: 'software', secondaryServices: ['web'] },
  { id: 'unsure', label: "We're not sure where to begin", rationale: 'Start with diagnosis: map the constraint before choosing a tool.', examples: ['Workflow map', 'Opportunity ranking', 'Technical direction', 'Written scope'], primaryService: 'software', secondaryServices: ['web', 'ai'] },
]

export const SERVICE_LIST = Object.values(SERVICES)

export function createServiceJsonLd(service: ServiceContent) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FAQPage',
        mainEntity: service.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
      {
        '@type': 'Service',
        '@id': `https://techwiseiq.com${service.slug}#service`,
        name: service.title,
        serviceType: service.title,
        url: `https://techwiseiq.com${service.slug}`,
        provider: { '@id': 'https://techwiseiq.com/#organization' },
        areaServed: ['Dubai', 'United Arab Emirates', 'Worldwide'],
        description: service.description,
      },
    ],
  }
}
```

- [ ] **Step 4: Run TypeScript through lint**

Run: `npm run lint -- src/data/services.ts`

Expected: PASS with zero errors.

- [ ] **Step 5: Commit the shared content model**

```bash
git add src/data/services.ts
git commit -m "feat: centralize service experience content"
```

## Task 3: Build the Problem-First Services Overview

**Files:**

- Create: `src/components/ServicesOverview/ProblemNavigator.tsx`
- Create: `src/components/ServicesOverview/index.tsx`
- Create: `src/components/ServicesOverview/ServicesOverview.module.css`
- Modify: `src/app/services/page.tsx`
- Delete: `src/app/services/services.module.css`

- [ ] **Step 1: Build the progressively enhanced navigator**

`ProblemNavigator` uses `useState(SERVICE_PROBLEMS[0].id)`. Render each choice as an anchor with `href="#service-${problem.primaryService}"`; prevent default only after JavaScript is active, update selection, and preserve the link as a no-JavaScript fallback. Apply `aria-current={selected ? 'true' : undefined}`. Render the selected service title, rationale, examples, and detail link inside `data-testid="service-recommendation"`.

```tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { SERVICE_PROBLEMS, SERVICES } from '@/data/services'
import styles from './ServicesOverview.module.css'

export default function ProblemNavigator() {
  const [selectedId, setSelectedId] = useState(SERVICE_PROBLEMS[0].id)
  const problem = SERVICE_PROBLEMS.find((item) => item.id === selectedId) ?? SERVICE_PROBLEMS[0]
  const service = SERVICES[problem.primaryService]

  return (
    <div className={styles.navigator} data-testid="problem-navigator">
      <div className={styles.problemList} aria-label="Choose the closest problem">
        {SERVICE_PROBLEMS.map((item, index) => (
          <a
            key={item.id}
            href={`#service-${item.primaryService}`}
            className={styles.problemLink}
            aria-current={item.id === selectedId ? 'true' : undefined}
            onClick={(event) => {
              event.preventDefault()
              setSelectedId(item.id)
            }}
          >
            <span>{item.label}</span><span aria-hidden="true">0{index + 1}</span>
          </a>
        ))}
      </div>
      <div className={styles.recommendation} data-testid="service-recommendation" aria-live="polite">
        <span className={styles.eyebrow}>Best match / {service.number}</span>
        <h3>{service.title}</h3>
        <p>{problem.rationale}</p>
        <ul>{problem.examples.map((example) => <li key={example}>{example}</li>)}</ul>
        <Link href={service.slug}>Explore {service.title} <span aria-hidden="true">→</span></Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Build the server-rendered overview composition**

Render the centered hero, problem scene, bridge, `SERVICE_LIST` acts with IDs, connected delivery steps, real proof rows from `CASE_STUDIES`, and final CTA. Add `data-service-experience`, `data-current-track`, `data-current-fill`, and `data-service-reveal` hooks. Every service act includes outcome, fit signals, capability titles, detail link, and a related-work link only when proof exists.

- [ ] **Step 3: Implement the fluid full-width CSS**

Use CSS Modules with these non-negotiable rules:

```css
.hero { min-height: 100svh; display: grid; place-items: center; text-align: center; overflow: hidden; }
.problemScene { background: var(--ink); color: var(--bone); clip-path: polygon(0 6%,100% 0,100% 94%,0 100%); }
.serviceAct { min-height: 680px; display: grid; align-items: center; overflow: hidden; position: relative; }
.serviceActInner { width: min(100%, 1440px); margin: 0 auto; padding: 112px clamp(24px,7vw,112px); display: grid; grid-template-columns: minmax(0,1fr) minmax(280px,.75fr); gap: clamp(40px,8vw,120px); }
.serviceAct:nth-of-type(even) { background: var(--ink); color: var(--bone); }
.serviceAct:last-of-type { background: var(--sun); color: var(--ink); }
@media (max-width: 760px) { .serviceActInner { grid-template-columns: 1fr; } .problemScene { clip-path: none; } }
```

Do not add rounded cards, gradients, blurred shadows, or edge-to-edge body copy. Provide hover/focus styles for problem links, arrows, and CTA; all transitions stay in the 150–250ms range.

- [ ] **Step 4: Replace the page implementation**

Keep metadata but remove `RobotVideo`, page-local service arrays, and obsolete CSS. Render `Nav`, `ServicesOverview`, `Footer`, and the motion component added in Task 5. Temporarily omit `ServiceMotion` until Task 5 so the page compiles.

- [ ] **Step 5: Run the overview tests**

Run: `npx playwright test tests/e2e/services-experience.spec.ts --project=chromium --grep "Services overview|/services stays"`

Expected: overview content tests PASS; detail tests remain failing.

- [ ] **Step 6: Commit the overview**

```bash
git add src/app/services/page.tsx src/app/services/services.module.css src/components/ServicesOverview src/data/services.ts
git commit -m "feat: redesign services around customer problems"
```

## Task 4: Build the Shared Detail Page and Motifs

**Files:**

- Create: `src/components/ServiceDetailPage/index.tsx`
- Create: `src/components/ServiceDetailPage/ServiceMotif.tsx`
- Create: `src/components/ServiceDetailPage/ServiceDetailPage.module.css`
- Modify: `src/components/FAQSection/index.tsx`
- Modify: `src/components/FAQSection/FAQSection.module.css`

- [ ] **Step 1: Implement decorative service motifs**

`ServiceMotif` accepts `{ motif: ServiceMotifId }`, returns an `aria-hidden="true"` container, and renders only CSS geometry:

```tsx
import type { ServiceMotifId } from '@/data/services'
import styles from './ServiceDetailPage.module.css'

export default function ServiceMotif({ motif }: { motif: ServiceMotifId }) {
  if (motif === 'web') return <div className={`${styles.motif} ${styles.webMotif}`} aria-hidden="true"><i /><i /><i /></div>
  if (motif === 'software') return <div className={`${styles.motif} ${styles.softwareMotif}`} aria-hidden="true"><i /><i /><i /><b /><b /></div>
  return <div className={`${styles.motif} ${styles.aiMotif}`} aria-hidden="true"><i /><i /><i /></div>
}
```

Use square browser frames for Web, square nodes and transform-based connector bars for Software, and circles plus a visible human-check label for AI. Decorative content stays hidden from assistive technology.

- [ ] **Step 2: Build the shared detail composition**

`ServiceDetailPage` accepts `service: ServiceContent`. Render:

1. Centered hero with breadcrumb, number, `h1`, description, primary CTA, and motif.
2. Symptom scene with `data-testid="service-fit"`.
3. Three-stage outcome flow with `data-testid="outcome-flow"`.
4. `ServiceProof` using filtered `CASE_STUDIES`, or honest Work fallback, with `data-testid="service-proof"`.
5. Capability river with `data-testid="capability-river"`.
6. Connected process with `data-testid="connected-process"`.
7. `FAQSection` with visible heading and `data-testid="service-faq"`.
8. Centered service-specific CTA.

- [ ] **Step 3: Implement shared detail CSS**

Use the same connected-scroll grammar as the overview but different motif classes. Hero minimum height is `min(900px, 100svh)`. Symptoms use an open editorial list. Outcome stages use a horizontal current on desktop and vertical current on mobile. Proof is a full-width sun scene for real projects and an ink editorial fallback otherwise. Capabilities use open two-column text with no enclosing cards. Process uses a continuous vertical track on all breakpoints.

- [ ] **Step 4: Update FAQ markup and styling**

Add `heading?: string` and `testId?: string` props with defaults. Render a visible centered `h2` using `heading ?? 'Clear answers. No sales fog.'`; retain button semantics, `aria-expanded`, `aria-controls`, and the existing hook. Replace the visually hidden heading and left label with centered eyebrow + heading. Keep open answers within 64ch.

- [ ] **Step 5: Run lint on the components**

Run: `npm run lint -- src/components/ServiceDetailPage src/components/FAQSection`

Expected: PASS with zero errors.

- [ ] **Step 6: Commit the shared detail system**

```bash
git add src/components/ServiceDetailPage src/components/FAQSection
git commit -m "feat: add fluid service detail system"
```

## Task 5: Add One Motion Controller Per Service Route

**Files:**

- Create: `src/components/ServiceMotion/index.tsx`
- Create: `src/components/ServiceMotion/ServiceMotion.module.css`
- Modify: `src/components/ServicesOverview/index.tsx`
- Modify: `src/components/ServiceDetailPage/index.tsx`

- [ ] **Step 1: Implement reveal and current behavior**

```tsx
'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './ServiceMotion.module.css'

gsap.registerPlugin(ScrollTrigger)

export default function ServiceMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-service-experience]')
    if (!root) return
    const reveals = Array.from(root.querySelectorAll<HTMLElement>('[data-service-reveal]'))
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      reveals.forEach((element) => { element.dataset.visible = 'true' })
      root.dataset.motion = 'reduced'
      return
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          ;(entry.target as HTMLElement).dataset.visible = 'true'
          observer.unobserve(entry.target)
        }
      })
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 })
    reveals.forEach((element) => observer.observe(element))

    const fill = root.querySelector<HTMLElement>('[data-current-fill]')
    const tween = fill ? gsap.fromTo(fill, { scaleY: 0 }, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
    }) : null

    root.dataset.motion = 'active'
    return () => { observer.disconnect(); tween?.revert() }
  }, [])
  return null
}

export function ServiceCurrent() {
  return <div className={styles.track} aria-hidden="true"><span data-current-fill /></div>
}
```

- [ ] **Step 2: Add transform-only motion CSS**

```css
.track { position: absolute; left: clamp(12px,2.2vw,34px); top: 100svh; bottom: 8%; width: 3px; background: color-mix(in srgb,var(--ink) 18%,transparent); pointer-events: none; z-index: 3; }
.track span { display: block; width: 100%; height: 100%; background: var(--hot); transform: scaleY(0); transform-origin: top; }
:global([data-service-reveal]) { opacity: 0; transform: translateY(32px); transition: opacity .38s ease, transform .38s ease; }
:global([data-service-reveal][data-visible='true']) { opacity: 1; transform: none; }
@media (max-width: 760px) { .track { left: 8px; } }
@media (prefers-reduced-motion: reduce) { .track { display: none; } :global([data-service-reveal]) { opacity: 1; transform: none; transition: none; } }
```

- [ ] **Step 3: Mount one controller and one current in each experience root**

Add `<ServiceMotion />` and `<ServiceCurrent />` once to `ServicesOverview` and once to `ServiceDetailPage`. Remove `ScrollAnimator` from all four service routes so the services pages do not create competing per-element ScrollTriggers.

- [ ] **Step 4: Verify reduced motion**

Add this test to `services-experience.spec.ts`:

```ts
test('renders the services experience in its final state with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/services')
  await expect(page.locator('[data-service-experience]')).toHaveAttribute('data-motion', 'reduced')
  await expect(page.locator('[data-service-reveal]').first()).toHaveAttribute('data-visible', 'true')
})
```

Run: `npx playwright test tests/e2e/services-experience.spec.ts --project=chromium --grep "reduced motion"`

Expected: PASS.

- [ ] **Step 5: Commit motion behavior**

```bash
git add src/components/ServiceMotion src/components/ServicesOverview src/components/ServiceDetailPage tests/e2e/services-experience.spec.ts
git commit -m "feat: connect service scenes with restrained motion"
```

## Task 6: Migrate the Three Detail Routes and Structured Data

**Files:**

- Modify: `src/app/services/web/page.tsx`
- Modify: `src/app/services/software/page.tsx`
- Modify: `src/app/services/ai/page.tsx`

- [ ] **Step 1: Replace each repeated component stack**

For each route, import `SERVICES`, `ServiceDetailPage`, `Nav`, and `Footer`. Render the route-specific `ServiceDetailPage` between navigation and footer. Remove local deliverable, process, FAQ, and price arrays plus `ScrollAnimator`, `ServiceHero`, `DeliverablesSection`, `MiniProcess`, `ProofStrip`, and `CTASection` imports.

```tsx
export default function WebServicePage() {
  const service = SERVICES.web
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(createServiceJsonLd(service)) }} />
      <Nav />
      <main><ServiceDetailPage service={service} /></main>
      <Footer />
    </>
  )
}
```

Import and call the `createServiceJsonLd` helper exported from `src/data/services.ts`. It returns `FAQPage` and `Service` nodes without `Offer`, `PriceSpecification`, `priceCurrency`, or `minPrice`.

- [ ] **Step 2: Remove pricing from metadata and visible content**

Use these descriptions:

```ts
web: 'Custom websites engineered to load fast, rank well, and turn visitor attention into action. Based in Dubai, serving clients worldwide.'
software: 'Portals, dashboards, internal tools, integrations, and products shaped around how your business runs. Dubai-based, worldwide delivery.'
ai: 'Workflow automation, AI assistants, document processing, and practical AI audits with visible human control. Based in Dubai.'
```

- [ ] **Step 3: Add a structured-data no-pricing test**

```ts
test('service structured data does not publish pricing', async ({ page }) => {
  await page.goto('/services/web')
  const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents()
  expect(jsonLd.join(' ')).not.toMatch(/Offer|PriceSpecification|minPrice|priceCurrency/)
})
```

- [ ] **Step 4: Run all service experience tests**

Run: `npx playwright test tests/e2e/services-experience.spec.ts --project=chromium`

Expected: PASS for overview, navigator, all detail journeys, no-pricing assertions, reduced motion, and mobile overflow.

- [ ] **Step 5: Commit route migration**

```bash
git add src/app/services tests/e2e/services-experience.spec.ts
git commit -m "feat: migrate service routes to shared experience"
```

## Task 7: Accessibility, Responsive, and Interaction Audit

**Files:**

- Modify: `tests/e2e/services-experience.spec.ts`
- Modify: overview/detail/motion CSS Modules only where failures require it.

- [ ] **Step 1: Add heading, focus, touch-target, and zoom assertions**

Add tests that verify one `h1` per route, navigator links are keyboard reachable, primary CTAs are at least 44px high at 375px, and no overflow at 200% zoom-equivalent viewport sizing.

```ts
test('navigator is keyboard operable and exposes the selected state', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/services')
  const first = page.getByRole('link', { name: /Our website is underperforming/ })
  await first.focus()
  await expect(first).toBeFocused()
  await page.keyboard.press('Tab')
  await page.keyboard.press('Enter')
  await expect(page.getByRole('link', { name: /Manual work is eating the week/ })).toHaveAttribute('aria-current', 'true')
})

test('mobile primary actions meet the 44px target', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/services/web')
  const box = await page.getByRole('link', { name: /Start the conversation/ }).last().boundingBox()
  expect(box).not.toBeNull()
  expect(box!.height).toBeGreaterThanOrEqual(44)
})
```

- [ ] **Step 2: Run the full new spec and fix only evidence-backed failures**

Run: `npx playwright test tests/e2e/services-experience.spec.ts --project=chromium`

Expected: PASS.

- [ ] **Step 3: Capture desktop and mobile screenshots for visual review**

Run:

```bash
npx playwright screenshot --device="Desktop Chrome" --full-page http://127.0.0.1:3000/services test-results/services-desktop.png
npx playwright screenshot --device="iPhone 13" --full-page http://127.0.0.1:3000/services test-results/services-mobile.png
npx playwright screenshot --device="Desktop Chrome" --full-page http://127.0.0.1:3000/services/web test-results/service-web-desktop.png
```

Expected: no clipped headings, obscured copy, horizontal overflow, or box-grid regression.

- [ ] **Step 4: Commit responsive and accessibility polish**

```bash
git add src/components/ServicesOverview src/components/ServiceDetailPage src/components/ServiceMotion tests/e2e/services-experience.spec.ts
git commit -m "fix: polish service accessibility and responsive flow"
```

## Task 8: Documentation and Final Verification

**Files:**

- Modify: `docs/changelog.md`

- [ ] **Step 1: Record the shipped behavior**

Add a dated changelog entry covering the problem navigator, connected full-width overview, shared detail system, three motifs, removal of public service pricing, honest proof fallback, motion/reduced-motion behavior, and the new Playwright spec.

- [ ] **Step 2: Run lint**

Run: `npm run lint`

Expected: exit code 0 with zero errors.

- [ ] **Step 3: Run all E2E tests**

Run: `npm run test:e2e`

Expected: all tests pass.

- [ ] **Step 4: Run the production build**

Run: `npm run build`

Expected: successful Next.js production build; `/services`, `/services/web`, `/services/software`, and `/services/ai` are generated without errors.

- [ ] **Step 5: Confirm the worktree contains only intentional changes**

Run: `git status --short && git diff --check`

Expected: only the changelog remains uncommitted; no whitespace errors.

- [ ] **Step 6: Commit documentation**

```bash
git add docs/changelog.md
git commit -m "docs: record services experience redesign"
```

- [ ] **Step 7: Confirm clean completion**

Run: `git status --short && git log -8 --oneline`

Expected: clean worktree and a readable sequence of test, data, overview, detail, motion, route, polish, and documentation commits.
