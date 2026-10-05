> **Historical (written for the Kinetic design, deleted — D-028).** Kept for reference only; do not build from it.
> The demo in `public/concepts/` still ships (media self-hosted since ROADMAP 6.1); its Work-page integration was rebuilt.
> Current: `docs/site-spec.md`, `docs/design-system.md`, `docs/DECISIONS.md`.

# Lumora Live Concept Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the fullscreen Lumora mindfulness sample and publish it as the third automated live preview on `/work`.

**Architecture:** Add a dependency-free HTML/CSS/JavaScript page at `public/concepts/lumora/`. Treat the React/Tailwind/Lucide wording in the source prompt as a visual and behavioral specification, consistent with the approved static-sample architecture. Reuse the verified `LiveConceptPreview` component unchanged and promote the final manifest entry.

**Tech Stack:** Semantic HTML, CSS, vanilla JavaScript, existing Next.js Concept Lab manifest/client preview, Playwright.

**Working directory:** `/Users/adi7192/Documents/TechwiseIQ/website/.worktrees/concept-lab-samples`

---

### Task 1: Build the standalone Lumora page

**Files:**
- Create: `tests/e2e/lumora.spec.ts`
- Create: `public/concepts/lumora/index.html`
- Create: `public/concepts/lumora/styles.css`
- Create: `public/concepts/lumora/script.js`

- [ ] **Step 1: Write failing standalone tests**

Cover:

- document title, Lumora logo, badge, exact two-line heading, body copy, email control, and bottom stats;
- four videos in the supplied order with the exact labels;
- exact transparent overlay URL;
- default `Golden Hour` active state;
- switching to `Deep Woods`, the `#182C41` hero-content transition, and the 1000ms click cooldown;
- accessible mobile hamburger and dialog;
- one-viewport geometry, no page scrolling, and no horizontal overflow;
- reduced-motion fallback for the train-bob overlay and transitions.

- [ ] **Step 2: Verify RED**

Run:

```bash
npx playwright test tests/e2e/lumora.spec.ts
```

Expected: all tests fail because `/concepts/lumora/index.html` is absent.

- [ ] **Step 3: Implement semantic HTML**

Create a single fullscreen section with:

- Instrument Serif preconnect and stylesheet links exactly as supplied;
- four absolutely stacked autoplaying, looping, muted, inline videos;
- the exact remote PNG overlay above the video layer;
- fixed-height content layer containing the navigation, centered hero, switcher, and bottom statistics;
- white italic `Lumora` logo;
- desktop liquid-glass navigation with `How It Works`, `Features`, `Pricing`, `Community`, and `Get Started`;
- accessible animated hamburger and `role="dialog"` mobile menu;
- badge text `Over 10,000 minds already finding their clarity`;
- heading `Clarity in an Endlessly` / `Noisy Universe`;
- exact body copy;
- labeled email input with placeholder `Your Best Email` and `Get Early Access`;
- four switch buttons using `aria-pressed`;
- all four exact stat labels with decorative dividers hidden from assistive technology.

- [ ] **Step 4: Implement exact cinematic CSS**

Required details:

- `html`, `body`, and the section have `height: 100vh` plus the `100svh` enhancement and no scrolling;
- black fallback background;
- Instrument Serif for the logo and display heading, with `system-ui, sans-serif` for all body UI;
- videos fill the viewport using `object-fit: cover`, crossfading over 1000ms ease-in-out;
- overlay fills the viewport at z-index 1 and runs the specified 3-second translateY `0 → -6px` animation at constant `scale(1.03)`;
- copy the supplied `.liquid-glass` and `::before` declarations exactly;
- content layer sits at z-index 2, with responsive padding and flex-column distribution;
- heading scales through 36/48/72/88px with 1.1 line height and an 896px max width;
- dark content mode uses `#182c41` and 700ms transitions while navigation and statistics remain white;
- desktop navigation begins at 768px; mobile uses the hamburger below 768px;
- hover-only enhancement is guarded by `(hover: hover) and (pointer: fine)`;
- tap targets are at least 44px;
- reduced motion disables train-bob, crossfade animation, and menu motion.

- [ ] **Step 5: Implement switching and menu behavior**

`script.js` must:

- track the active video, defaulting to index 0;
- ignore the active option and all clicks during a 1000ms crossfade cooldown;
- update video active classes, `aria-pressed`, and root dark-content state;
- toggle the mobile dialog, button name, body lock, and animated link state;
- move focus into the menu and return it on Escape;
- close the menu on link activation;
- prevent the demo email form from navigating.

- [ ] **Step 6: Verify GREEN and commit**

Run:

```bash
npx playwright test tests/e2e/lumora.spec.ts
```

Expected: standalone tests pass.

Commit:

```bash
git add public/concepts/lumora tests/e2e/lumora.spec.ts
git commit -m "feat: build Lumora concept demo"
```

### Task 2: Publish the final Concept Lab entry

**Files:**
- Modify: `src/data/concept-sites.ts`
- Modify: `tests/e2e/work-page.spec.ts`

- [ ] **Step 1: Write failing all-published coverage**

Require:

- all three `[data-concept-stage]` nodes have `data-concept-status="published"`;
- there are zero `Brief pending` labels;
- the third live action links to `/concepts/lumora/index.html`;
- the third iframe lazy-loads and reaches `data-preview-state="ready"`;
- TerraElix and mėntality remain published.

- [ ] **Step 2: Verify RED**

Run:

```bash
npx playwright test tests/e2e/work-page.spec.ts -g "Lumora|all three"
```

Expected: FAIL because the third manifest entry remains draft.

- [ ] **Step 3: Publish Lumora**

Use:

```ts
{
  slug: 'lumora',
  title: 'Lumora',
  category: 'Mindfulness / focus',
  summary:
    'A cinematic focus experience that turns ambient worlds into a calm invitation to work with intention.',
  tags: ['Cinematic UI', 'Ambient video', 'Interaction'],
  demoPath: '/concepts/lumora/index.html',
  previewMode: 'live-auto-scroll',
  status: 'published',
}
```

- [ ] **Step 4: Verify GREEN and commit**

Run:

```bash
npx playwright test tests/e2e/work-page.spec.ts tests/e2e/lumora.spec.ts
npm run lint
```

Commit:

```bash
git add src/data/concept-sites.ts tests/e2e/work-page.spec.ts
git commit -m "feat: publish Lumora live concept"
```

### Task 3: Full visual and production verification

- [ ] **Step 1: Run deterministic verification**

```bash
npm run test:unit
npm run lint
npx playwright test
npm run build
```

- [ ] **Step 2: Capture and inspect screenshots**

Capture settled screenshots at 1440×1000, 768×1024, and 375×812, plus the third Work-page concept stage. Confirm:

- supplied video and overlay fill the viewport with no black flash or uncovered edge;
- liquid-glass controls remain legible;
- hero hierarchy fits at every breakpoint without scroll;
- mobile menu fills the viewport and animates accessibly;
- Deep Woods dark-content mode remains readable;
- the Work page now contains three live browser-frame previews and no draft card.

- [ ] **Step 3: Final branch review**

```bash
git diff --check
git status --short
git log --oneline --decorate -12
```

Review the aggregate diff from the branch point before branch integration.
