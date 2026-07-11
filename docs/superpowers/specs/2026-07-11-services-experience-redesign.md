# Services Experience Redesign

Date: 2026-07-11  
Status: Approved design direction, pending written-spec review

## Summary

Redesign `/services` and the three service detail pages as one connected, problem-first experience. The overview helps founders and operations/IT leaders identify the business friction they recognize, then maps that friction to Web Development, Custom Software, AI Automation, or a combination. The detail pages retain a consistent buying journey while giving each service its own visual and motion language.

The design stays within Techwise IQ's Kinetic identity: Anton display type, Archivo body copy, Space Mono labels, bone/ink/hot/sun palette, hard shadows, square geometry, direct language, and honest proof. It uses the viewport for visual scenes while keeping body copy within readable measures. It does not publish pricing.

## Why the Current Pages Need to Change

The current implementation is structurally correct but feels like a sequence of generic blocks:

- The overview hero is visually strong, but the service rows provide only a title and one sentence.
- Visitors must already understand agency categories instead of starting from their business problem.
- The three detail pages use the same visual template and do not express the character of each discipline.
- Deliverables, process, proof, and FAQs are presented as isolated rectangles rather than one narrative.
- Proof appears, but it is not consistently placed beside the claim it supports.
- Hover and scroll behavior is restrained to individual components; the whole page does not feel connected.

## Goals

- Help both SMB founders and operations/IT leaders find the right starting point.
- Explain what each service solves, who it fits, what changes, and what Techwise IQ can build.
- Use the full viewport without stretching long-form copy beyond readable line lengths.
- Make scrolling feel like one connected story rather than stacked sections.
- Give Web, Software, and AI distinct personalities inside one recognizable system.
- Add purposeful scroll, hover, focus, and press motion without compromising performance or accessibility.
- Keep all important service content server-rendered, visible, crawlable, and usable without animation.
- Use only real project proof. Never invent clients, results, logos, statistics, or testimonials.

## Non-Goals

- No pricing, starting-price ranges, or `Offer` pricing data on the redesigned service pages.
- No service configurator, quote calculator, account flow, or lead-scoring logic.
- No new photography library, stock imagery, decorative gradients, glow, blur, glass effects, rounded cards, or additional accent colors.
- No change to the three service pillars or their canonical URLs.
- No more than one scroll showpiece per page.

## External Inspiration

The direction borrows information-architecture principles, not visual styling:

- [Clay](https://clay.global/) explains capabilities through plain-language promises and visual examples.
- [ustwo](https://ustwo.com/) connects capability breadth to a distinct working philosophy.
- [DEPT](https://www.deptagency.com/) organizes services around customer outcomes before exposing deeper capability detail.
- [MetaLab](https://www.metalab.com/work) keeps relevant proof and capability labels close to the work.

Techwise IQ's implementation remains visually original and consistent with its approved Kinetic system.

## Shared Experience Principles

### Problem before category

Visitors first recognize a situation such as “manual work is eating the week” or “our tools do not talk.” The interface then recommends a service. Agency terminology appears after the visitor has context.

### Full-bleed scenes, readable content

Background planes, oversized typography, service numerals, and diagrams may span the viewport. Paragraphs, lists, and controls retain readable line lengths and responsive gutters. “Use the whole width” means visual composition, not edge-to-edge body copy.

### One continuous current

An orange current connects the key moments of each page. It starts with the visitor's problem, passes through the recommended service, outcomes, proof, process, and ends at the CTA. Static diagonal section edges and overlapping typography create continuity without card grids.

### Proof near the claim

Relevant real projects appear before or beside capability detail. Web can show Aaskra Realty and Express Trade Financing. Software and AI must use an honest Work-page fallback until matching real case studies exist.

### Progressive enhancement

All services and buying information exist in the server-rendered document. The problem navigator enhances discovery but never hides the only route to important content.

## `/services` Information Architecture

### 1. Centered problem-led hero

- Eyebrow: Services / Start with the problem.
- Center-aligned `h1`: “What's slowing you down?”
- Short explanation that Techwise IQ solves bottlenecks with websites, custom software, AI automation, or a combination.
- Replace the current robot-video hero on this page. The new connected current is the page's single showpiece; keeping both would create competing focal points and unnecessary media cost.
- Provide a visible scroll cue. It is decorative support, not the only navigation mechanism.

### 2. Problem-first navigator

Present five plain-language problems:

1. Our website is underperforming.
2. Manual work is eating the week.
3. Our tools do not talk to each other.
4. We need to launch a product.
5. We are not sure where to begin.

Selecting a problem updates an adjacent or spatially connected recommendation with:

- Primary service match.
- One-sentence rationale.
- Three or four concrete examples.
- Link to the corresponding service detail page.
- Optional secondary match when the problem reasonably spans disciplines.

On small screens, problems become a vertical list. The recommendation appears immediately below the selected problem. Without JavaScript, each problem remains an anchor link to the most relevant service chapter.

### 3. Service bridge

A centered transition explains that one problem can require more than one discipline. This prevents the navigator from implying a rigid one-to-one diagnosis and introduces the complete service set.

### 4. Three full-width service acts

Each service receives a large, visually distinct scene rather than a card:

- Service number and title.
- Outcome-led promise.
- “Good fit” signals.
- Four to six representative capabilities.
- Primary link to the detail page.
- Related-work link when relevant proof exists.

The service acts use asymmetry, oversized ghost numerals, overlapping diagrams, and alternating bone/ink/sun planes. Static diagonal boundaries join the scenes. They do not use separate boxed containers.

### 5. Delivery continuity

A connected four-step line communicates the shared delivery spine:

1. Diagnose — find the real constraint.
2. Scope — define boundaries in writing.
3. Build — show working progress weekly.
4. Run — launch, document, support, and improve.

This replaces a grid of guarantees with a single visual sequence. Supporting promises include written scope, working demos, one cross-disciplinary team, and clean handover.

### 6. Relevant proof

Show real work in full-width editorial rows, not cards. Each row includes service label, project title, concise outcome, and case-study link. Do not show invented proof for Software or AI.

### 7. Final CTA

Centered statement: visitors do not need to diagnose the solution; they can bring the bottleneck. Provide one primary “Start the conversation” action and keep WhatsApp as the site-wide secondary contact path.

## Individual Service Page System

All three pages share the same decision journey and component boundaries. Content and visual motifs vary by service.

### 1. Centered service hero

- Breadcrumb back to Services.
- Service number.
- One centered `h1`.
- Outcome-led summary rather than a deliverable list.
- Large service-specific motif assembling behind the title.
- One primary CTA may appear after the summary; “All services” remains a text link rather than a competing button.

### 2. “This is for you when” recognition scene

Use four concrete symptoms buyers recognize. The section validates fit before describing capabilities. It is a continuous editorial list with hover/focus response, not a card grid.

### 3. “What changes” outcome flow

Show a three-stage before-to-after journey. Example for Web:

- Hard to explain.
- Easy to choose.
- Built to evolve.

Software focuses on disconnected operations becoming one usable system. AI focuses on repetitive input becoming controlled, reviewable action.

### 4. Relevant proof

Place a real service-relevant case study before the detailed capability section. Use large project imagery and an editorial text block. If no relevant case study exists, use a concise honest statement and link to all shipped work; do not show an empty or “coming soon” card.

### 5. Capability river

Present six capability groups as an open, flowing composition connected by the service motif. Each group has a concrete title and one short explanatory sentence. Avoid two-column boxed deliverables.

### 6. Connected delivery process

Retain the service-specific four-step processes already defined in the codebase. Present them on one continuous track rather than isolated columns. The active step may highlight as it enters the viewport, but all steps remain readable at once.

### 7. Buyer-focused FAQ

Keep four or five genuine objections per service. Remove price questions and pricing answers. Retain time, fit, ownership, integration, support, and post-launch questions. The accordion remains keyboard accessible and can use a subtle horizontal shift and icon rotation/fill on hover, focus, and open state.

### 8. Final service-specific CTA

Restate the service outcome and invite the visitor to describe the current constraint. Use one primary CTA. Cross-links to the other services appear after the CTA or in the footer, not as competing hero actions.

## Distinct Visual Motifs

### Web Development: responsive canvas

Layered browser frames resize, align, and separate as the visitor scrolls. The motif demonstrates responsiveness, hierarchy, and craft without relying on screenshots in the hero.

### Custom Software: system map

Disconnected people, data, and tool nodes join into one operational flow. Lines and nodes move using transforms, showing consolidation without presenting a literal technical architecture diagram.

### AI Automation: human-controlled current

Inputs travel through processing stages, visibly pause at a human-review checkpoint, and continue to a useful action. The motif must communicate control and reliability, not autonomous magic.

## Motion and Interaction Specification

### Page showpiece

Each page has one scroll-linked current implemented with one restrained GSAP/ScrollTrigger timeline or equivalent existing motion infrastructure. The current moves using transforms and opacity. It does not animate document layout.

### Scroll behavior

- Centered headlines reveal through overflow masks using translated child spans.
- Service motifs use subtle transform-based parallax, limited to approximately 4–6% travel.
- Scene backgrounds use static diagonal `clip-path` boundaries; the boundaries themselves do not animate.
- The active process step and navigator recommendation crossfade and translate a short distance.
- Motion must remain interruptible and must not block scrolling or input.

### Hover, focus, and press behavior

- Problem links: orange underline grows from the text origin; text shifts no more than 8px.
- Service links and project rows: arrows extend and spacing opens without moving surrounding layout.
- Service diagrams: only the local node, frame, or current responds.
- Outline display words may fill on hover where contrast remains compliant.
- Primary buttons retain the established pressed hard-shadow behavior.
- Every hover affordance has an equivalent visible focus state and a touch-safe non-hover presentation.

### Timing

- Micro-interactions: 150–250ms.
- Content entrances: 250–400ms.
- Stagger: 30–50ms between closely related items.
- No decorative animation exceeds 500ms except ambient motif loops, which must be subtle and optional.

### Reduced motion

Under `prefers-reduced-motion: reduce`:

- Disable parallax, ambient loops, and current travel.
- Render motifs in their meaningful final state.
- Keep content visible without relying on reveal classes.
- Use no more than a simple opacity change for interactive state feedback.

## Responsive Behavior

- Design and verify at 375px, 768px, 1024px, and 1440px.
- Maintain at least 20px mobile gutters and the existing 24px desktop content gutter where appropriate.
- No horizontal scrolling.
- Centered display headings may wrap, but body copy remains 35–60 characters per line on mobile and 60–75 on desktop.
- Full-width service acts become single-column scenes on mobile; visual motif follows the outcome copy.
- Navigator problems stack vertically; the selected recommendation follows its trigger.
- Process track becomes vertical on mobile.
- Touch targets are at least 44×44px with at least 8px separation.
- Decorative overlaps must not obscure copy at 200% zoom.

## Accessibility and Semantics

- One `h1` per route and sequential heading order.
- Navigator uses semantic links or buttons with `aria-expanded` and `aria-controls` when enhanced.
- Selected navigator state is communicated through text and `aria-current` or `aria-pressed`, not color alone.
- Decorative motifs are `aria-hidden`; meaningful project images have descriptive alt text.
- Keyboard order follows visual reading order.
- Preserve the global skip link and focus-visible treatment.
- Normal body text meets WCAG AA contrast. Hot orange is not used for small body text on bone.
- FAQ regions retain button semantics and accessible relationships.
- All content remains understandable when CSS animation and JavaScript are unavailable.

## Content and Data Architecture

Create one typed service-content source used by the overview and all detail pages. Each service record contains:

- `id`, `number`, `slug`, `title`, and short outcome.
- Problem IDs and fit signals.
- Symptoms.
- Outcome stages.
- Capability groups.
- Existing service-specific process steps.
- FAQ content without pricing.
- Related case-study slugs.
- Motif identifier: `web`, `software`, or `ai`.

Create a separate problem-to-service mapping with one primary service and optional secondary services. The navigator owns only the currently selected problem. It reads recommendation content from the shared data and links to server-rendered service chapters.

Structured data continues to provide `Service` and `FAQPage` entities. Remove pricing `Offer` and `PriceSpecification` data from the service routes. Update metadata descriptions to remove price references.

## Component Boundaries

- `ServicesHero`: centered problem-led introduction.
- `ProblemNavigator`: client-enhanced selection and recommendation; anchor fallback.
- `ServiceAct`: full-width overview chapter driven by shared service data.
- `DeliveryCurrent`: decorative scroll connector and process continuity.
- `ServiceDetailHero`: shared detail hero with a motif slot.
- `ServiceFitSection`: symptom recognition list.
- `OutcomeFlow`: before-to-after sequence.
- `ServiceProof`: real case-study feature or honest Work fallback.
- `CapabilityRiver`: open capability composition.
- `ConnectedProcess`: shared visual track using service-specific steps.
- `ServiceMotif`: dispatches to `WebCanvasMotif`, `SoftwareMapMotif`, or `AIWorkflowMotif`.
- Existing `FAQSection`, `CTASection`, `Nav`, and `Footer` remain reusable with scoped visual updates where required.

Components stay focused: content data does not live inside visual components, and motion orchestration does not duplicate service copy.

## State, Failure, and Fallback Behavior

No network request is required for page content or navigator selection.

- Default navigator state selects no problem and shows a neutral instruction, or selects the first problem only when the recommendation is visibly labeled as an example.
- If client hydration fails, problem choices are anchors to the relevant full service acts.
- If a related case-study slug is invalid, omit that proof item and show the honest Work-page fallback.
- If animation initialization fails, CSS final states keep every section visible.
- Project imagery reserves its aspect ratio to prevent layout shift.

## Performance Constraints

- Remove `RobotVideo` from `/services`; do not add another hero video.
- Prefer CSS and lightweight SVG/CSS geometry for service motifs.
- Use no new animation dependency.
- Use one scroll timeline per page and avoid per-item scroll listeners.
- Animate only transform and opacity.
- Lazy-load below-fold project imagery with explicit dimensions.
- Preserve the project budgets: Lighthouse performance at least 95, accessibility/SEO/best practices 100, LCP below 1.8s, CLS below 0.05, and INP below 200ms.

## Verification

### Automated

- Unit-test problem-to-service mappings and service-content completeness.
- Test that all service URLs and overview anchors render.
- Test navigator keyboard selection and ARIA state changes.
- Test FAQ keyboard behavior after visual changes.
- Test that FAQ and Service JSON-LD contain no pricing data.
- Add Playwright coverage for desktop and 375px mobile layouts.
- Assert there is no horizontal overflow on all four service routes.
- Assert one `h1`, logical heading order, and visible primary CTA per route.
- Run lint, relevant tests, and production build.

### Visual and manual

- Review the full scroll journey at 375px, 768px, 1024px, and 1440px.
- Verify hover, keyboard focus, press, and touch states.
- Verify reduced-motion rendering and 200% browser zoom.
- Confirm the orange current never crosses or obscures body copy.
- Confirm no fake proof, price language, banned vocabulary, gradients, blur, rounded cards, or additional accent colors appear.
- Confirm all animations remain smooth during rapid scroll and can be interrupted.

## Success Criteria

- A visitor can identify a relevant problem and service path within the first two content scenes.
- All three services remain visible and understandable without using the navigator.
- Every detail page answers fit, outcome, capability, proof, process, and common objections in that order.
- The pages feel connected and fluid without sacrificing readability or brand discipline.
- Web, Software, and AI are recognizably related but visually distinguishable.
- The complete experience works with keyboard navigation, reduced motion, JavaScript failure, and mobile touch.
