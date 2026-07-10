# Work Page Credibility Redesign + Concept Lab

**Date:** 2026-07-10  
**Scope:** `/work` listing page, reusable Work-page data/components, and the integration contract for standalone Concept Lab demos. Existing `/work/[slug]` case-study detail pages remain unchanged.  
**Primary goal:** Prove Techwise IQ's depth, delivery style, and credibility using two verified client projects, supported by transparent operating principles and a clearly labeled self-initiated Concept Lab.

## 1. Validated direction

The page uses the approved **Case Studies + Operating Proof** architecture and **Kinetic Rhythm** motion profile.

- The two real client projects remain the strongest evidence and appear first.
- Verified metrics and project decisions explain the substance behind the visuals.
- Capabilities are tied to shipped work rather than presented as generic service claims.
- The Concept Lab demonstrates range without being confused with commissioned work.
- Working principles and process explain what collaboration feels like.
- Major headings are centered; long-form evidence remains left-aligned.
- The page stays inside the existing Kinetic design system: bone, ink, hot orange, sparing sun yellow, Anton, Archivo, Space Mono, hard borders, square geometry, and hard shadows.

## 2. Content hierarchy

### 2.1 Centered hero

Content:

- Label: `OUR WORK / OUR WAY`
- H1: `PROOF, NOT PROMISES.`
- Intro: `Real launches, clear decisions and a delivery model clients can understand before the first call.`
- Short hot-orange marker rule below the intro.

The hero is centered within the standard 1200px container. It contains no photography. The H1 uses Anton and stays concise enough to preserve the display font's impact.

### 2.2 Proof marquee

One full-width ink marquee immediately below the hero:

`LIVE WORK → 5–6 WEEK LAUNCHES → WEEKLY DEMOS → DIRECT ACCESS →`

Use the existing `Marquee` component. Text uses Space Mono with bone text and hot-orange arrows. The marquee is decorative and `aria-hidden`. Under reduced motion it becomes a static, clipped line.

### 2.3 Selected-work introduction

Centered section introduction:

- Label: `SELECTED WORK`
- H2: `BUILT FOR REAL BUSINESS.`
- Body: `Two industries, two distinct challenges, one consistent approach: understand the business, make strong decisions and ship.`

### 2.4 AASKRA project chapter

Full-width two-column chapter:

- Left: existing AASKRA hero image.
- Right: project metadata, title, outcome summary, three verified proof values, and a three-part narrative.
- Proof values: `11 pages`, `6 location profiles`, `6 weeks`.
- Narrative labels: `Challenge`, `Decision`, `Outcome`.
- Primary link: `Read full case study →` to `/work/aaskra-realty`.
- Secondary link: `Visit live site ↗` when `liveUrl` exists.

The short narrative is derived from existing case-study data:

- Challenge: no digital presence in a trust-heavy market.
- Decision: build credibility through useful market data, location profiles, and a clear investor journey.
- Outcome: a live platform that carries the brand's authority while its track record grows.

### 2.5 Delivery evidence strip

Three centered metrics, separated by 3px rules:

- `21` — pages shipped across the two published projects.
- `5–6` — week launch windows.
- `2` — live published projects.

These numbers are derived only from existing case-study data. Do not claim conversion uplift, lead volume, revenue impact, satisfaction scores, or other unverified results.

### 2.6 Express Trade Financing project chapter

The second project alternates the layout so the image is on the right on desktop.

- Proof values: `10 pages`, `25+ countries represented in the client's operating footprint`, `5 weeks`.
- Narrative labels: `Challenge`, `Decision`, `Outcome`.
- Primary link: `Read full case study →` to `/work/express-trade-financing`.
- Secondary link: `Visit live site ↗` when `liveUrl` exists.

Narrative:

- Challenge: significant deal history but no credible digital presence.
- Decision: lead with real transaction stories, explain the process plainly, and balance institutional weight with accessibility.
- Outcome: a live site that presents a boutique firm with institutional credibility.

### 2.7 Capabilities demonstrated

Centered section introduction followed by a 3-by-2 hard-bordered grid:

1. Strategy — positioning and information architecture.
2. UX/UI — custom responsive interfaces.
3. Engineering — production-ready web builds.
4. Content — service narratives and case studies.
5. Conversion — WhatsApp and consultation flows.
6. Launch — SEO, analytics, and structured-data foundations.

Each item must remain phrased as a capability demonstrated by the published work, not a claim that every project receives every deliverable.

### 2.8 Concept Lab

Placement: after `Capabilities demonstrated` and before `How we work`.

Centered introduction:

- Label: `CONCEPT LAB / SELF-INITIATED`
- H2: `WHAT ELSE COULD WE BUILD?`
- Body: `Coded website explorations designed to demonstrate range across industries, visual languages and interaction patterns.`
- Disclosure badge: `CONCEPT WORK — NOT CLIENT COMMISSIONS`.

Initial target is three polished concepts representing distinct categories:

1. Luxury hospitality or restaurant.
2. B2B SaaS or product platform.
3. E-commerce or lifestyle brand.

The three concept designs shown during brainstorming (`Noir House`, `Signal OS`, and `Form Objects`) are working creative directions, not fabricated client projects.

#### Concept publishing contract

Each concept is represented by a manifest entry:

```ts
type ConceptSite = {
  slug: string
  title: string
  category: string
  summary: string
  tags: string[]
  previewImage?: string
  demoPath?: string
  status: 'draft' | 'published'
}
```

- Standalone demos live at `public/concepts/<slug>/index.html` with any supporting assets inside the same folder.
- Preview screenshots live at `public/work/concepts/<slug>.webp`.
- `demoPath` is `/concepts/<slug>/index.html`.
- Draft and published entries render differently.
- A draft entry is a non-interactive reserved slot with a blueprint-style preview, category, and explicit `BRIEF PENDING / DEMO COMING LATER` status. It has no anchor, fake screenshot, or implied client association.
- A published entry requires both a preview image and a working HTML demo path.
- The Work page uses static preview images; it does not embed live iframes.
- Opening a demo uses a new tab with `target="_blank"` and `rel="noopener noreferrer"`.
- The accessible link name includes that a new tab opens.
- Missing manifest entries do not produce cards. Draft entries produce intentional reserved slots and never broken links.

The gallery is a three-column grid on desktop and a single-column stack on mobile. Published cards use browser-window framing, a category label, concept title, one-sentence summary, up to three capability tags, and `Open live HTML demo ↗`. Draft cards use the same footprint but display a hard-edged blueprint pattern, `DEMO SLOT 01–03`, the planned category, and `BRIEF PENDING`.

The initial manifest contains exactly three draft slots:

1. `DEMO SLOT 01` — luxury hospitality or restaurant.
2. `DEMO SLOT 02` — B2B SaaS or product platform.
3. `DEMO SLOT 03` — e-commerce or lifestyle brand.

Creating the three complete standalone concept websites is a separate creative content stream. The user will provide a dedicated prompt for each later. This Work-page implementation establishes the publishing system, shows the planned breadth honestly, and converts each slot into a live card only after its demo and preview are complete.

### 2.9 How we work

Dark, centered section introduction followed by a four-column process:

1. `Align` — goals, audience, scope, and success measures.
2. `Prototype` — structure and direction before full production.
3. `Build` — implementation with visible weekly working demos.
4. `Ship` — QA, launch, and a clean handover.

Weekly working demos are presented as a concrete delivery standard, consistent with the existing Kinetic design-system proof language.

### 2.10 Working principles

Two equal bordered columns:

**What clients get**

- Clear scope and ownership.
- Direct access to the people building.
- Regular working demonstrations.
- Decisions explained in plain language.

**What we avoid**

- Black-box project management.
- Weeks without a working build.
- Template-driven design presented as custom work.
- Vague handover responsibilities.

### 2.11 Final CTA

Centered ink section:

- Label: `YOUR PROJECT COULD BE NEXT`
- H2: `BRING US THE PROBLEM.`
- Body: `Start with a focused 20-minute call. You explain the challenge; we explain how we would approach it.`
- Primary CTA: `Discuss your project →` using the existing contact route or booking destination.

Reuse the existing CTA/contact behavior where practical rather than adding a second competing contact flow.

## 3. Typography and alignment

The existing three-font system is retained and clarified.

### Anton

- H1, centered section H2s, project titles, process names, and large metrics.
- Uppercase only.
- Short display statements only; never use for narrative paragraphs.
- H1: `clamp(48px, 8vw, 110px)` with line-height `0.9–0.95`.
- Section H2: `clamp(34px, 5.2vw, 68px)` with line-height `0.95`.
- Project titles: `clamp(32px, 4.2vw, 58px)`.

### Archivo

- Intros, case-study summaries, challenge/decision/outcome text, concept summaries, and process explanations.
- Production body size `16–17px`, line-height `1.55–1.65`.
- Paragraph measure `55–65ch`; project copy may be narrower.

### Space Mono

- Labels, metadata, proof chips, process numbers, tags, disclosures, and CTAs.
- Do not use for long descriptions.
- Minimum rendered size 11.5px, with sufficient contrast.

### Alignment rule

- Center: hero, every major section introduction, metrics, and final CTA.
- Left: project narratives, capability descriptions, concept summaries, process explanations, and working-principle lists.
- Centering is used for hierarchy; left alignment is used for reading.

## 4. Motion and interaction

The page uses a controlled Kinetic Rhythm rather than a full cinematic scroll takeover.

### Entrance motion

- Hero label fades in.
- H1 lines rise from overflow-hidden wrappers with a 100–140ms stagger.
- Hot marker rule scales from left to right.
- Section labels, headings, and intros use the existing `data-animate="slide-up"` system with restrained sibling stagger.

### Project chapters

- Text and image columns reveal from opposite directions using existing slide-left/slide-right tokens.
- The image begins at approximately `scale(1.04)` and settles to `scale(1)` as it enters.
- Hover: image scales to `1.02–1.03`, title becomes outline, and link arrow moves 4px.
- Links remain obvious without hover; hover is enhancement only.

### Metrics and process

- Metrics rise as a staggered group.
- Large values may roll from a short vertical offset into place; they do not count from zero because animated counting can imply measurement precision that is not meaningful.
- Process steps illuminate sequentially on section entrance using hot-orange numbers and opacity/transform only.

### Concept Lab

- Card groups reveal with a short 60–80ms stagger.
- Published-card hover shifts the static preview image upward by at most 18px inside an overflow-hidden frame.
- Published-card title outline and arrow movement match project-card interaction; draft slots have no hover treatment that suggests interactivity.
- The full HTML demo loads only after activation.

### Reduced motion

With `prefers-reduced-motion: reduce`:

- All scroll entrance transforms are disabled and content is immediately visible.
- Marquee is static.
- Image drift, stagger, and metric movement are disabled.
- Hover color and underline changes remain, but movement is removed.

No animation may block interaction, change document layout, or hide essential content.

## 5. Component and data architecture

Keep the server-rendered page shell and isolate only reusable data-driven display pieces.

Proposed components:

- `WorkHero` — centered hero and marker.
- `WorkProofMarquee` — existing `Marquee` composition.
- `ProjectChapter` — reusable alternating project presentation.
- `WorkMetrics` — derives aggregate display values from case-study data.
- `CapabilityGrid` — static evidence-linked capabilities.
- `ConceptLab` — renders safe draft slots and validates published concept cards.
- `WorkProcess` — four delivery stages.
- `WorkingPrinciples` — paired expectation lists.

Avoid one giant client component. The page needs no filtering state, modal state, or carousel state. Next.js `Link` is used for internal case studies; standard anchors are used for live sites and concept demos.

Extend project data only with presentation fields that cannot be derived cleanly:

```ts
type WorkSummary = {
  challenge: string
  decision: string
  outcome: string
  proof: Array<{ value: string; label: string }>
}
```

Attach `workSummary` to each existing `CaseStudy`. Do not duplicate the complete case-study record in the Work page.

Concept metadata lives in `src/data/concept-sites.ts`. Draft entries render reserved slots; published entries render external demo links.

## 6. Responsive behavior

### Desktop, 1024px and above

- Project chapters use two equal or near-equal columns.
- Chapters alternate image placement.
- Metrics use three columns.
- Capabilities use a 3-by-2 grid.
- Concept Lab uses three columns.
- Process uses four columns.
- Working principles use two columns.

### Tablet, 768–1023px

- Project chapters may remain two-column while copy padding reduces.
- Capabilities and process use two columns.
- Concept Lab may use two columns with the third card spanning or use a single column if preview legibility suffers; prefer the single-column option for consistent card widths.

### Mobile, below 768px

- All major structures become one column.
- Project image always precedes project copy, regardless of desktop alternation.
- Section padding reduces to 64–72px.
- Body text remains at least 16px.
- Touch targets are at least 44px high.
- No horizontal scrolling is introduced by marquees, tags, proof rows, or browser frames.
- Major headings remain centered.

## 7. Accessibility and semantics

- One H1 only.
- Every major section uses a logical H2.
- Project chapters are `<article>` elements with H3 project titles.
- Concept cards are articles containing a real link, not clickable generic containers.
- Images use descriptive alt text; decorative browser chrome is hidden from assistive technology.
- External links identify new-tab behavior in accessible text.
- Focus states use the existing 3px hot-orange outline with offset.
- Text contrast follows `docs/design-system.md`; small hot-on-bone text is prohibited.
- Motion respects reduced-motion preferences.
- The marquee is decorative; equivalent claims remain visible in the page content.

## 8. Performance and failure behavior

- Use existing optimized WebP case-study images with explicit responsive sizing.
- Concept preview images are WebP or AVIF and lazy-loaded below the fold.
- No iframes load on `/work`.
- Image containers reserve aspect ratio to prevent layout shift.
- Draft concept entries render without links. Published entries render links only when both required asset paths exist, preventing broken demo links.
- Missing optional `liveUrl` removes the secondary project link without leaving empty space.
- The page remains fully readable if JavaScript or animation initialization fails.

## 9. Testing and verification

### Unit/component coverage

- Aggregate metrics produce `21 pages`, `5–6 weeks`, and `2 live projects` from the current data.
- `ConceptLab` renders draft entries as non-interactive reserved slots.
- `ConceptLab` renders published entries as external demo links only when both paths exist.
- An empty concept manifest omits the entire Concept Lab section.
- Projects without `liveUrl` omit the external link.
- Project chapters render the correct challenge, decision, outcome, and proof values.

### End-to-end coverage

- `/work` renders one H1 and all required section headings.
- Both case-study links navigate to the correct detail pages.
- Draft concept slots contain no anchors and clearly announce `BRIEF PENDING`.
- Published concept links open the correct HTML demo paths.
- Keyboard focus reaches all project, live-site, concept, and CTA links in logical order.
- At 375px there is no horizontal overflow and project images precede copy.
- At desktop width project chapters alternate correctly.
- Reduced-motion mode disables marquee and entrance transforms while preserving all content.

### Visual verification

- Capture desktop and 375px screenshots.
- Check centered major headings and left-aligned narrative text.
- Verify the Concept Lab disclosure is visible without hover.
- Check the page uses no rounded cards, blurred shadows, decorative gradients, or extra accent colors.
- Confirm all image and text transitions use only the approved motion vocabulary.

## 10. Explicit non-goals

- No filters until at least two service categories have real published work.
- No modal project overlay; project chapters link to stable case-study URLs.
- No carousel or horizontal swipe gallery.
- No fabricated testimonials, logos, awards, performance uplift, business outcomes, demo screenshots, or completed-demo claims.
- No embedded live concept iframes on the Work page.
- No redesign of `/work/[slug]` detail pages in this scope.
- No claim that Concept Lab work was commissioned or launched for a client.

## 11. Implementation boundary for Concept Lab content

The `/work` redesign and the Concept Lab publishing system form one implementation plan. The three complete standalone concept websites are independent creative deliverables because each needs its own audience, visual direction, content, responsive design, and QA.

The Work page initially ships with three non-interactive reserved demo slots. As the user supplies a separate prompt and approves each standalone demo, its entry changes from `draft` to `published` and receives real `previewImage` and `demoPath` values.

Reserved slots must look intentional and remain explicit about their status. The page must not ship with broken links, fabricated screenshots, or draft demos labeled as polished work.
