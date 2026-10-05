> **Historical (written for the Kinetic design, deleted — D-028).** Kept for reference only; do not build from it.
> Current: `docs/site-spec.md`, `docs/design-system.md`, `docs/DECISIONS.md`.

# Homepage Service Looping Visuals Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage Custom Software and AI Automation graphics with two distinct, clean, continuously looping service illustrations.

**Architecture:** Keep `ServiceVisuals.tsx` as the markup boundary, `HomeExperience.module.css` as the complete static and responsive presentation layer, and `HomeMotion.tsx` as progressive enhancement for GSAP entrance and viewport-aware loop timelines. Both graphics render complete without JavaScript; the motion controller only adds transforms, opacity, and color emphasis, pausing loops outside the viewport and disabling them for reduced motion.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS Modules, GSAP 3 with ScrollTrigger, Playwright.

---

## File Structure

- Modify `tests/e2e/home-experience.spec.ts` — define DOM, fallback, responsive, and loop-lifecycle contracts.
- Modify `src/components/HomeExperience/ServiceVisuals.tsx` — replace the two service-specific visual trees.
- Modify `src/components/HomeExperience/HomeExperience.module.css` — style the dashboard and orchestration graphics in their complete static states.
- Modify `src/components/HomeExperience/HomeMotion.tsx` — replace one-time abstract illustration entrances with viewport-aware repeating timelines.

No new production file or dependency is needed. Both illustrations are homepage-specific and stay within the existing component boundary.

### Task 1: Lock the new visual contract with failing tests

**Files:**
- Modify: `tests/e2e/home-experience.spec.ts`

- [ ] **Step 1: Add a failing test for the new visual structures and removed legacy structures**

Insert after the first homepage story test:

```ts
test('renders distinct software and AI service illustrations', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  const experience = page.getByTestId('home-experience')
  const software = experience.locator('[data-home-software-dashboard]')
  const automation = experience.locator('[data-home-ai-orchestration]')

  await expect(software).toBeVisible()
  await expect(software.locator('[data-home-software-status]')).toHaveCount(3)
  await expect(software.locator('[data-home-software-cursor]')).toHaveCount(1)

  await expect(automation).toBeVisible()
  await expect(automation.locator('[data-home-ai-input]')).toHaveCount(3)
  await expect(automation.locator('[data-home-ai-output]')).toHaveCount(3)
  await expect(automation.locator('[data-home-ai-core]')).toHaveCount(1)
  await expect(automation.locator('[data-home-ai-signal]')).toHaveCount(1)

  await expect(experience.locator('[data-home-system-node]')).toHaveCount(0)
  await expect(experience.locator('[data-home-system-core]')).toHaveCount(0)
  await expect(experience.locator('[data-home-ai-review]')).toHaveCount(0)
  await expect(experience.locator('[data-home-ai-result]')).toHaveCount(0)
})
```

- [ ] **Step 2: Add a failing no-JavaScript fallback test**

Append this test:

```ts
test('keeps service illustrations complete without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('/')

  await expect(page.locator('[data-home-software-dashboard]')).toBeVisible()
  await expect(page.locator('[data-home-ai-orchestration]')).toBeVisible()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true)

  await context.close()
})
```

- [ ] **Step 3: Add failing reduced-motion and loop-lifecycle assertions**

Append these tests:

```ts
test('keeps service illustrations static when reduced motion is requested', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  const softwareScene = page.locator('[data-home-service="software"]')
  const aiScene = page.locator('[data-home-service="ai"]')

  await expect(softwareScene).toHaveAttribute('data-loop-state', 'reduced')
  await expect(aiScene).toHaveAttribute('data-loop-state', 'reduced')

  for (const selector of [
    '[data-home-software-dashboard]',
    '[data-home-ai-orchestration]',
  ]) {
    const visual = page.locator(selector)
    await expect(visual).toBeVisible()
    await expect(visual).toHaveCSS('opacity', '1')
  }
})

test('runs only the service loop that is in the viewport', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')

  const softwareScene = page.locator('[data-home-service="software"]')
  const aiScene = page.locator('[data-home-service="ai"]')

  await softwareScene.scrollIntoViewIfNeeded()
  await expect(softwareScene).toHaveAttribute('data-loop-state', 'running')

  await aiScene.scrollIntoViewIfNeeded()
  await expect(aiScene).toHaveAttribute('data-loop-state', 'running')
  await expect(softwareScene).toHaveAttribute('data-loop-state', 'paused')
})
```

- [ ] **Step 4: Run the focused tests to verify they fail**

Run:

```bash
npx playwright test tests/e2e/home-experience.spec.ts
```

Expected: the new structure test fails because `[data-home-software-dashboard]` and `[data-home-ai-orchestration]` do not exist; lifecycle tests fail because `data-loop-state` is absent.

- [ ] **Step 5: Commit the failing contract**

```bash
git add tests/e2e/home-experience.spec.ts
git commit -m "test: define homepage service loop contract"
```

### Task 2: Build the complete static service illustrations

**Files:**
- Modify: `src/components/HomeExperience/ServiceVisuals.tsx`
- Modify: `src/components/HomeExperience/HomeExperience.module.css`
- Test: `tests/e2e/home-experience.spec.ts`

- [ ] **Step 1: Replace `SoftwareVisual` and `AIVisual` markup**

Replace the current two functions with:

```tsx
function SoftwareVisual() {
  const activities = [
    ['New request', 'Assigned'],
    ['Client approval', 'Ready'],
    ['Project handoff', 'Done'],
  ] as const

  return (
    <div
      className={styles.softwareDashboard}
      data-home-software-dashboard
      aria-hidden="true"
    >
      <div className={styles.softwareAppBar} />
      <div className={styles.softwareSidebar}>
        {[0, 1, 2, 3].map((item) => <i key={item} />)}
      </div>
      <div className={styles.softwareAppMain}>
        <strong>Operations overview</strong>
        <div className={styles.softwareMetrics}>
          <span>24</span>
          <span>08</span>
          <span>96%</span>
        </div>
        <div className={styles.softwareActivity}>
          {activities.map(([label, status]) => (
            <div key={label}>
              <span>{label}</span>
              <b data-home-software-status>{status}</b>
            </div>
          ))}
        </div>
      </div>
      <span
        className={styles.softwareCursor}
        data-home-software-cursor
      />
    </div>
  )
}

function AIVisual() {
  const inputs = ['Inbox', 'Forms', 'Documents'] as const
  const outputs = ['Update CRM', 'Draft reply', 'Build report'] as const

  return (
    <div
      className={styles.aiOrchestration}
      data-home-ai-orchestration
      aria-hidden="true"
    >
      <div className={styles.aiStack}>
        {inputs.map((input) => (
          <span key={input} data-home-ai-input>{input}</span>
        ))}
      </div>
      <i className={`${styles.aiRail} ${styles.aiRailIn}`} />
      <div className={styles.aiCore} data-home-ai-core>
        <span>✦</span>
        <strong>AI workflow</strong>
        <small>Understand · Decide · Route</small>
      </div>
      <i className={`${styles.aiRail} ${styles.aiRailOut}`} />
      <div className={`${styles.aiStack} ${styles.aiOutputStack}`}>
        {outputs.map((output) => (
          <span key={output} data-home-ai-output>{output}</span>
        ))}
      </div>
      <i className={styles.aiSignal} data-home-ai-signal />
    </div>
  )
}
```

- [ ] **Step 2: Replace the legacy Software and AI visual CSS**

Remove the rules from `.softwareVisual` through `.aiResult span`, then add:

```css
.softwareDashboard {
  position: relative;
  width: min(100%, 540px);
  min-height: 360px;
  margin-inline: auto;
  overflow: hidden;
  border: var(--bd);
  color: var(--ink);
  background: var(--bone);
  box-shadow: 12px 12px 0 var(--hot);
}

.softwareAppBar {
  height: 34px;
  border-bottom: var(--bd);
  background: var(--ink);
}

.softwareAppBar::before {
  display: block;
  width: 8px;
  height: 8px;
  margin: 10px 0 0 12px;
  border-radius: 50%;
  background: var(--hot);
  box-shadow: 15px 0 var(--sun), 30px 0 var(--bone);
  content: "";
}

.softwareSidebar {
  position: absolute;
  top: 34px;
  bottom: 0;
  left: 0;
  width: 86px;
  border-right: var(--bd);
  background: var(--paper);
}

.softwareSidebar i {
  display: block;
  width: 40px;
  height: 8px;
  margin: 28px auto;
  background: var(--ink);
  opacity: 0.32;
}

.softwareSidebar i:first-child {
  background: var(--hot);
  opacity: 1;
}

.softwareAppMain {
  margin-left: 86px;
  padding: 28px 24px 24px;
}

.softwareAppMain > strong {
  font-family: var(--font-mono), monospace;
  font-size: 0.78rem;
  text-transform: uppercase;
}

.softwareMetrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 9px;
  margin-top: 22px;
}

.softwareMetrics span {
  display: grid;
  min-height: 70px;
  place-items: center;
  border: var(--bd);
  background: var(--sun);
  font-family: var(--font-anton), sans-serif;
  font-size: 2rem;
}

.softwareMetrics span:nth-child(2) { background: var(--bone); }
.softwareMetrics span:nth-child(3) { color: var(--bone); background: var(--hot); }

.softwareActivity {
  margin-top: 18px;
  border: var(--bd);
}

.softwareActivity > div {
  display: grid;
  min-height: 51px;
  grid-template-columns: 1fr 84px;
  align-items: center;
  padding-inline: 13px;
  font-family: var(--font-mono), monospace;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
}

.softwareActivity > div + div { border-top: var(--bd); }

.softwareActivity b {
  padding: 7px 5px;
  color: var(--bone);
  background: var(--ink);
  text-align: center;
}

.softwareCursor {
  position: absolute;
  z-index: 4;
  right: 30px;
  bottom: 23px;
  width: 23px;
  height: 31px;
  background: var(--ink);
  clip-path: polygon(0 0, 100% 70%, 56% 72%, 76% 100%, 57% 100%, 40% 75%, 0 100%);
}

.aiOrchestration {
  position: relative;
  display: grid;
  width: min(100%, 620px);
  min-height: 350px;
  grid-template-columns: minmax(105px, 1fr) 48px minmax(150px, 1.15fr) 48px minmax(112px, 1fr);
  align-items: center;
  margin-inline: auto;
}

.aiStack {
  display: grid;
  gap: 13px;
}

.aiStack span {
  display: grid;
  min-height: 52px;
  place-items: center;
  border: var(--bd);
  background: var(--bone);
  font-family: var(--font-mono), monospace;
  font-size: 0.68rem;
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
}

.aiOutputStack span { background: var(--bone); }
.aiOutputStack span:nth-child(2) { background: var(--hot); }

.aiRail {
  position: relative;
  height: 3px;
  background: var(--ink);
}

.aiRail::after {
  position: absolute;
  top: 50%;
  right: 0;
  width: 10px;
  height: 10px;
  border-top: 3px solid var(--ink);
  border-right: 3px solid var(--ink);
  content: "";
  transform: translateY(-50%) rotate(45deg);
}

.aiCore {
  display: grid;
  min-height: 178px;
  place-content: center;
  border: var(--bd);
  color: var(--bone);
  background: var(--ink);
  box-shadow: 9px 9px 0 var(--hot);
  text-align: center;
}

.aiCore > span { color: var(--sun); font-size: 2rem; }
.aiCore strong { margin-top: 11px; font-family: var(--font-anton), sans-serif; font-size: 2.1rem; line-height: 1; text-transform: uppercase; }
.aiCore small { margin-top: 12px; color: var(--soft-dark); font-family: var(--font-mono), monospace; font-size: 0.58rem; font-weight: 700; text-transform: uppercase; }

.aiSignal {
  position: absolute;
  z-index: 5;
  top: calc(50% - 6px);
  left: 18%;
  width: 12px;
  height: 12px;
  border: 2px solid var(--ink);
  background: var(--hot);
}
```

- [ ] **Step 3: Add responsive static states**

Inside the existing tablet/mobile media queries, replace legacy visual overrides with:

```css
@media (max-width: 767px) {
  .softwareDashboard { min-height: 300px; }
  .softwareSidebar { width: 62px; }
  .softwareAppMain { margin-left: 62px; padding: 22px 16px 17px; }
  .softwareMetrics span { min-height: 54px; font-size: 1.55rem; }
  .softwareActivity > div { min-height: 43px; grid-template-columns: 1fr 70px; font-size: 0.56rem; }
  .softwareCursor { right: 20px; bottom: 17px; }

  .aiOrchestration {
    min-height: 300px;
    grid-template-columns: minmax(78px, 1fr) 24px minmax(104px, 1.15fr) 24px minmax(82px, 1fr);
  }
  .aiStack { gap: 9px; }
  .aiStack span { min-height: 45px; padding: 5px; font-size: 0.54rem; }
  .aiCore { min-height: 145px; box-shadow: 6px 6px 0 var(--hot); }
  .aiCore strong { font-size: 1.45rem; }
  .aiCore small { padding-inline: 6px; font-size: 0.46rem; }
  .aiRail::after { width: 7px; height: 7px; }
}

@media (max-width: 390px) {
  .softwareAppMain > strong { font-size: 0.66rem; }
  .softwareActivity > div { grid-template-columns: 1fr 62px; padding-inline: 8px; }
  .aiOrchestration { grid-template-columns: minmax(70px, 1fr) 17px minmax(98px, 1.1fr) 17px minmax(72px, 1fr); }
  .aiCore strong { font-size: 1.25rem; }
}
```

- [ ] **Step 4: Run the focused structure and viewport tests**

Run:

```bash
npx playwright test tests/e2e/home-experience.spec.ts --grep "distinct software|compact experience"
```

Expected: the structure test and all three viewport cases pass. Lifecycle tests remain red because `data-loop-state` is not implemented yet.

- [ ] **Step 5: Commit the static illustrations**

```bash
git add src/components/HomeExperience/ServiceVisuals.tsx src/components/HomeExperience/HomeExperience.module.css
git commit -m "feat: build homepage service illustrations"
```

### Task 3: Add viewport-aware looping motion

**Files:**
- Modify: `src/components/HomeExperience/HomeMotion.tsx`
- Test: `tests/e2e/home-experience.spec.ts`

- [ ] **Step 1: Replace legacy animation selectors**

Update `ANIMATED_SELECTOR` so it contains the new targets and removes the legacy targets:

```ts
const ANIMATED_SELECTOR = [
  '[data-home-signal]',
  '[data-home-web-frame]',
  '[data-home-web-image]',
  '[data-home-software-dashboard]',
  '[data-home-software-status]',
  '[data-home-software-cursor]',
  '[data-home-ai-input]',
  '[data-home-ai-output]',
  '[data-home-ai-core]',
  '[data-home-ai-signal]',
  '[data-home-strike]',
  '[data-home-outcomes]',
  '[data-home-promise]',
  '[data-home-process-current]',
  '[data-home-process-marker]',
].join(',')
```

- [ ] **Step 2: Add a helper that connects a paused loop to a service scene**

First make the existing reveal observer progressive enhancement rather than a hard dependency:

```ts
const observer =
  typeof IntersectionObserver === 'undefined'
    ? null
    : new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            ;(entry.target as HTMLElement).dataset.visible = 'true'
            observer?.unobserve(entry.target)
          })
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.1 },
      )

reveals.forEach((element) => {
  if (observer) observer.observe(element)
  else element.dataset.visible = 'true'
})
```

Change the active-mode cleanup from `observer.disconnect()` to:

```ts
observer?.disconnect()
```

Then, inside the GSAP context before building the service timelines, add:

```ts
const attachServiceLoop = (
  scene: HTMLElement | null,
  timeline: gsap.core.Timeline,
) => {
  if (!scene) return

  scene.dataset.loopState = 'paused'
  ScrollTrigger.create({
    trigger: scene,
    start: 'top bottom',
    end: 'bottom top',
    onEnter: () => {
      scene.dataset.loopState = 'running'
      timeline.play()
    },
    onEnterBack: () => {
      scene.dataset.loopState = 'running'
      timeline.play()
    },
    onLeave: () => {
      scene.dataset.loopState = 'paused'
      timeline.pause()
    },
    onLeaveBack: () => {
      scene.dataset.loopState = 'paused'
      timeline.pause()
    },
  })
}
```

- [ ] **Step 3: Replace the legacy Software entrance timeline with the living-dashboard loop**

Use this complete loop in place of the `systemTimeline` block:

```ts
const softwareScene = root.querySelector<HTMLElement>(
  '[data-home-service="software"]',
)
const softwareDashboard = root.querySelector<HTMLElement>(
  '[data-home-software-dashboard]',
)
const softwareCursor = root.querySelector<HTMLElement>(
  '[data-home-software-cursor]',
)
const softwareStatuses = gsap.utils.toArray<HTMLElement>(
  '[data-home-software-status]',
)

if (softwareScene && softwareDashboard && softwareCursor) {
  gsap.fromTo(
    softwareDashboard,
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.58,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: softwareScene,
        start: 'top 72%',
        toggleActions: 'play none none reverse',
      },
    },
  )

  const softwareLoop = gsap.timeline({
    paused: true,
    repeat: -1,
    repeatDelay: 0.65,
  })
  softwareLoop
    .to(softwareCursor, { x: -78, y: -48, duration: 0.72, ease: 'power2.inOut' })
    .to(softwareCursor, { scale: 0.8, duration: 0.12 })
    .to(softwareStatuses[1], { backgroundColor: '#ff4d00', duration: 0.18 }, '<')
    .to(softwareCursor, { scale: 1, duration: 0.12 })
    .to({}, { duration: 0.55 })
    .to(softwareStatuses[1], { backgroundColor: '#101010', duration: 0.22 })
    .to(softwareCursor, { x: 0, y: 0, duration: 0.68, ease: 'power2.inOut' }, '<')
    .to({}, { duration: 1.9 })

  attachServiceLoop(softwareScene, softwareLoop)
}
```

- [ ] **Step 4: Replace the legacy AI entrance timeline with the alternating orchestration loop**

Use this complete block in place of the current `aiTimeline`:

```ts
const aiScene = root.querySelector<HTMLElement>('[data-home-service="ai"]')
const aiVisual = root.querySelector<HTMLElement>('[data-home-ai-orchestration]')
const aiCore = root.querySelector<HTMLElement>('[data-home-ai-core]')
const aiSignal = root.querySelector<HTMLElement>('[data-home-ai-signal]')
const aiInputs = gsap.utils.toArray<HTMLElement>('[data-home-ai-input]')
const aiOutputs = gsap.utils.toArray<HTMLElement>('[data-home-ai-output]')

if (aiScene && aiVisual && aiCore && aiSignal) {
  gsap.fromTo(
    aiVisual,
    { y: 28, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.58,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: aiScene,
        start: 'top 72%',
        toggleActions: 'play none none reverse',
      },
    },
  )

  const aiLoop = gsap.timeline({
    paused: true,
    repeat: -1,
    repeatRefresh: true,
  })
  const route = (index: number) => {
    const yOffset = () => (index - 1) * (aiVisual.clientHeight * 0.22)
    aiLoop
      .set(aiSignal, { x: 0, y: yOffset, opacity: 0 })
      .to(aiInputs[index], { backgroundColor: '#ffd02f', duration: 0.1 })
      .to(aiSignal, { opacity: 1, duration: 0.08 }, '<')
      .to(aiSignal, { x: () => aiVisual.clientWidth * 0.32, duration: 0.28, ease: 'power2.inOut' })
      .to(aiCore, { scale: 1.04, duration: 0.12 })
      .to(aiCore, { scale: 1, duration: 0.12 })
      .to(aiSignal, { x: () => aiVisual.clientWidth * 0.64, duration: 0.28, ease: 'power2.inOut' })
      .to(aiOutputs[index], { backgroundColor: '#ff4d00', duration: 0.1 }, '-=0.08')
      .to({}, { duration: 0.12 })
      .to([aiInputs[index], aiOutputs[index]], { clearProps: 'backgroundColor', duration: 0.08 })
      .to(aiSignal, { opacity: 0, duration: 0.08 }, '<')
  }

  route(0)
  route(1)
  route(2)
  aiLoop.to({}, { duration: 1.44 })
  attachServiceLoop(aiScene, aiLoop)
}
```

- [ ] **Step 5: Set explicit reduced-motion states and clean them up**

At the start of `applyMode`, query the scenes:

```ts
const loopScenes = Array.from(
  root.querySelectorAll<HTMLElement>(
    '[data-home-service="software"], [data-home-service="ai"]',
  ),
)
```

In the reduced branch, before returning:

```ts
loopScenes.forEach((scene) => {
  scene.dataset.loopState = 'reduced'
})
```

Before creating active timelines:

```ts
loopScenes.forEach((scene) => {
  scene.dataset.loopState = 'paused'
})
```

In both `disposeMode` and the effect cleanup, remove loop-state attributes after GSAP is reverted:

```ts
loopScenes.forEach((scene) => delete scene.dataset.loopState)
```

- [ ] **Step 6: Run the focused test file**

Run:

```bash
npx playwright test tests/e2e/home-experience.spec.ts
```

Expected: all homepage tests pass, including structure, reduced-motion, viewport, and active-loop lifecycle coverage.

- [ ] **Step 7: Commit the motion lifecycle**

```bash
git add src/components/HomeExperience/HomeMotion.tsx tests/e2e/home-experience.spec.ts
git commit -m "feat: loop homepage service visuals"
```

### Task 4: Verify quality and production safety

**Files:**
- Modify only if verification reveals a scoped issue: `src/components/HomeExperience/ServiceVisuals.tsx`, `src/components/HomeExperience/HomeExperience.module.css`, `src/components/HomeExperience/HomeMotion.tsx`, `tests/e2e/home-experience.spec.ts`

- [ ] **Step 1: Run lint**

```bash
npm run lint
```

Expected: exit code 0 with no ESLint errors.

- [ ] **Step 2: Run the complete Playwright suite**

```bash
npm run test:e2e
```

Expected: all 35 tests pass: the original 31 plus four new service-visual cases, with zero failures.

- [ ] **Step 3: Run the production build**

```bash
npm run build
```

Expected: Next.js production build completes successfully with all routes generated.

- [ ] **Step 4: Check the patch for whitespace and scope**

```bash
git diff --check HEAD~2
git status --short
```

Expected: no whitespace errors; only intentional service-visual files are modified or committed.

- [ ] **Step 5: Perform visual checks at desktop and mobile sizes**

Run the site and capture the Software and AI scenes at 1440×1000 and 375×667. Confirm:

- Custom Software is a single readable product surface, not a workflow diagram.
- AI Automation is a three-zone orchestration diagram with no overlap or clipping.
- The cursor and signal loops are subtle and do not run when their scenes are offscreen.
- Both static reduced-motion states remain complete.
- Neither viewport has horizontal overflow.

- [ ] **Step 6: Commit any verification-only corrections**

If visual or verification corrections were required:

```bash
git add src/components/HomeExperience/ServiceVisuals.tsx src/components/HomeExperience/HomeExperience.module.css src/components/HomeExperience/HomeMotion.tsx tests/e2e/home-experience.spec.ts
git commit -m "fix: polish homepage service loops"
```

If no corrections were required, do not create an empty commit.
