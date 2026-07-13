# Homepage Below-Hero Compact Redesign

**Date:** 2026-07-13  
**Status:** Approved visual direction, pending written-spec review  
**Scope:** The `/` route below the existing Hero. The current Hero, global Nav, and global Footer remain visually and behaviorally unchanged.

## Summary

Redesign the homepage content below the existing Hero as a compact, continuous founder-focused story:

1. The business problem.
2. What Techwise IQ does.
3. Web Development, Custom Software, and AI Automation.
4. The delivery differentiator and process.
5. A conversion-focused CTA.
6. The existing Footer.

The new composition replaces the current sequence of isolated Manifesto, accordion, ticker, process grid, statement, case-study grid, and contact blocks. It keeps Techwise IQ's Kinetic identity but uses fewer visible section boundaries, shorter vertical spacing, stronger visual handoffs, and purposeful motion.

The current Hero remains the homepage showpiece. The redesign adds scroll-linked supporting motion below it without introducing another pinned sequence, video, or competing showpiece.

## Approved Decisions

- Keep the existing Hero exactly as implemented, including its copy, rows, claim card, CTAs, sticker, velocity skew, and responsive behavior.
- Speak primarily to founders and business owners.
- Use business problems and outcomes before technical categories.
- Make all three services explicit: Web Development, Custom Software, and AI Automation.
- Keep the page compact; avoid long empty transitions and near-viewport sections that exist only for spectacle.
- Remove the homepage Real Work / Proof section entirely.
- Keep Work accessible through the global navigation and service-relevant links elsewhere on the site.
- Merge the current process into the differentiator scene instead of keeping a separate large process section.
- Use Book a call as the primary CTA, with WhatsApp and Enquiry as subordinate alternatives.
- Add scroll, entrance, hover, focus, and press motion where it explains state or reinforces continuity.
- Do not add a homepage video, generated film, new animation dependency, or new visual identity.

## Goals

- Make the homepage below the Hero feel as fluid and intentional as the redesigned Services and Work pages.
- Help a founder recognize the business friction Techwise IQ solves before reading a service list.
- Explain the three services clearly without returning to an accordion or card grid.
- Preserve the strongest existing copy and delivery promises while removing repetition.
- Maintain attention through section-to-section visual handoffs and service-specific motion.
- Shorten the perceived and actual page length.
- Preserve accessibility, performance, semantic HTML, and full readability without JavaScript or motion.

## Non-Goals

- No Hero redesign.
- No Nav or Footer redesign.
- No homepage portfolio, selected-work, proof-stat, testimonial, client-logo, or case-study section.
- No new service, pricing, claim, statistic, testimonial, client, or outcome.
- No video, frame sequence, WebGL, Three.js, canvas particle system, or generative media.
- No scroll snapping, wheel interception, artificial scroll delay, carousel, modal, or horizontal page scroll.
- No new font, color, radius, blur, glow, glass effect, decorative gradient, or animation library.
- No long pinned section below the Hero.

## Information Architecture

The homepage order becomes:

1. Existing `Hero` — unchanged.
2. `ProblemScene` — founder-recognition scene.
3. `ServicesJourney` introduction — what Techwise IQ does.
4. `ServiceScene` — Web Development.
5. `ServiceScene` — Custom Software.
6. `ServiceScene` — AI Automation.
7. `DifferenceScene` — outcomes, delivery promises, and compact process route.
8. `HomeCTA` — Book a call, WhatsApp, and Enquiry.
9. Existing `Footer` — unchanged.

The following current homepage sections are removed from the route composition:

- `Manifesto`.
- `ServicesSection` accordion.
- `Ticker`.
- standalone `ProcessSection`.
- standalone `ShoutSection`.
- `CaseStudySection`.
- current `CTASection` composition.

Their strongest relevant messages are consolidated into the new scenes. Removing a component from the homepage does not require deleting its source file if another route or future use still depends on it.

## Scene Design

### 1. Existing Hero handoff

The Hero itself is untouched. The Problem scene begins immediately after it with a shallow overlap or static angled boundary so the transition does not read as another bordered block.

The transition must not:

- change Hero height or motion;
- obscure Hero CTAs;
- add a new object inside the Hero;
- create horizontal overflow;
- rely on animation to make the next section readable.

### 2. Problem scene

Purpose: make founders recognize operational friction before Techwise IQ names a service.

Content:

- Label: `01 / The problem we solve`.
- Heading: `Your business shouldn’t feel this manual.`
- Supporting copy: growth becomes expensive when the website undersells the business, daily work depends on copy-paste, and important answers live in disconnected tools.
- Four recognition signals:
  - `The website looks smaller than the business`.
  - `Busywork owns the calendar`.
  - `Your tools refuse to talk`.
  - `Good leads die in the handoff`.

Composition:

- Ink background with bone text and hot-orange emphasis.
- Heading and supporting copy occupy one readable column.
- Recognition signals appear as overlapping editorial strips, not cards or controls.
- Strips remain static content with no click semantics.
- The scene uses compact padding and must not become a full-screen pinned sequence.

### 3. Services Journey introduction

Purpose: explicitly answer “what do you do?” before presenting individual services.

Content:

- Label: `02 / What we do`.
- Heading: `Find the bottleneck. Build the way through.`
- Supporting copy: the three services can be used separately or together; the client brings the business problem and Techwise IQ chooses and ships the technical path.
- Visible index:
  - `001 Web Development`.
  - `002 Custom Software`.
  - `003 AI Automation`.

Composition:

- Bone background.
- Centered introduction with a controlled text measure.
- The service index is text navigation or a semantic list, not decorative inaccessible text.
- If the index links to in-page service anchors, focus and scroll behavior must respect the fixed Nav offset and reduced-motion preference.

### 4. Web Development scene

Purpose: explain the Web service through the outcome “make choosing easy.”

Content:

- Number: `001`.
- Outcome label: `Make choosing easy`.
- Service title: `Web Development`.
- Summary: strategy, design, and development in one continuous build; websites engineered to explain the business clearly and earn the next click.
- Deliverables: Marketing sites, E-commerce, CMS builds, SEO + GEO.
- Link: `/services/web`.

Composition:

- Bone background.
- Copy on one side and one real, optimized AASKRA project image on the other.
- The image is service illustration, not a new Work or proof section.
- Use the existing project cover crop rather than loading the full-page screenshot.
- A large outlined `01` sits behind the composition as decorative type.

### 5. Custom Software scene

Purpose: explain the Software service through the outcome “make operations lighter.”

Content:

- Number: `002`.
- Outcome label: `Make operations lighter`.
- Service title: `Custom Software`.
- Summary: portals, dashboards, internal tools, and products shaped around how the business actually runs.
- Deliverables: Web apps, Portals, APIs, Integrations, Legacy rebuilds.
- Link: `/services/software`.

Composition:

- Ink background with bone text.
- A service-specific system map shows People, Data, Tools, and Decisions joining one system.
- The map is illustrative and `aria-hidden`; it must not imply a real client architecture.
- Copy and system map reverse the Web scene's spatial emphasis without changing DOM reading order.
- A large outlined `02` sits behind the composition.

### 6. AI Automation scene

Purpose: explain AI through the outcome “make repetition optional” while communicating human control.

Content:

- Number: `003`.
- Outcome label: `Make repetition optional`.
- Service title: `AI Automation`.
- Summary: documents processed, emails triaged, and reports assembled, with human review wherever judgment matters.
- Deliverables: Workflow automation, AI on your data, Document processing, AI audits.
- Link: `/services/ai`.

Composition:

- Sun-yellow background with ink text.
- An illustrative flow moves from document/input to a clearly labeled human-review checkpoint and then to a useful action.
- The illustration is `aria-hidden`; adjacent text communicates the same meaning.
- Do not present autonomous AI, magic effects, robots, or invented technical architecture.

### 7. Difference scene with compact process

Purpose: explain how buying and delivery differ from a typical agency engagement.

Primary statement:

- Label: `03 / Why Techwise IQ`.
- Heading: `Agencies sell hours. We sell outcomes.`
- Supporting copy retains the existing idea: the product is a website that sells, software that fits, or automation that hands the team its week back.

Delivery promises:

- Fixed scope — written before the build.
- Weekly demos — working progress the client can click.
- Direct access — talk to the people doing the work.
- Clean ownership — the client's product, code, and handover.

Compact process route:

1. Diagnose — map the bottleneck.
2. Scope — fix timeline and cost.
3. Build — demonstrate working progress every week.
4. Run — launch and hand over, with optional support.

Composition:

- Ink background with bone text.
- The `hours` word receives the established orange strike treatment; `outcomes` receives sun-yellow emphasis.
- Delivery promises sit along one rule/current, not in bordered cards.
- The four process steps share the same scene and current instead of receiving a separate large section.
- All promises and steps are readable simultaneously without interaction.

### 8. CTA

Purpose: provide three clear conversion paths without equal visual competition.

Content:

- Label: `04 / Your move`.
- Heading: `Bring us the bottleneck. We’ll bring the plan.`
- Supporting copy: a focused 20-minute conversation where the visitor explains what is slowing the business and Techwise IQ explains how it would approach it.
- Primary: Book a call using the existing `BOOKING_URL`.
- Secondary: WhatsApp using the existing production WhatsApp URL.
- Secondary: Enquiry linking to `/contact`.

Composition:

- Hot-orange background.
- Book a call is visually dominant with ink fill and hard sun-yellow shadow.
- WhatsApp and Enquiry remain bordered secondary actions.
- Do not add a fourth CTA or duplicate email as an equal action.

## Motion and Interaction System

### Motion principles

- The existing Hero velocity-skew interaction remains the homepage's single showpiece.
- Below-Hero motion supports reading order and scene continuity; it does not compete with the Hero.
- Use the existing GSAP and ScrollTrigger dependencies only.
- Animate `transform` and `opacity` only. Do not animate width, height, top, left, blur, filter, or layout.
- No scroll interception, scroll snapping, input blocking, or long pinned timelines.
- Animations remain interruptible and respond naturally when the user reverses scroll direction.

### Page orchestration

Use one route-level client component named `HomeMotion` to enhance stable data attributes in the server-rendered below-Hero experience. It owns no copy, navigation, or business state.

The component uses:

- `gsap.context` for cleanup;
- `ScrollTrigger.matchMedia` for responsive behavior;
- small local timelines for each scene;
- the existing global reveal utilities where they already match the approved behavior.

Do not create competing inline effects across multiple content components.

### Problem scene motion

- Heading enters through an overflow mask with approximately 24–40px vertical travel.
- Recognition strips enter sequentially with 30–50ms stagger, approximately 30–60px horizontal travel, and small resting rotations no greater than 2 degrees.
- As the scene leaves, strips may tighten toward their resting stack by no more than 4% of their width.
- Hover is not required because strips are not interactive.

### Services introduction motion

- Heading lines reveal sequentially through a short vertical mask.
- Service index items enter with 30–40ms stagger.
- In-page index links receive an orange underline sweep on hover and focus and a subtle 4px text shift.

### Web scene motion

- Project image frame enters from the right with no more than 6% horizontal travel, a scale from approximately `0.96` to `1`, and rotation settling by no more than 2 degrees.
- The image uses subtle scroll parallax capped at 4% inside an overflow-hidden frame.
- Hover or link focus scales the image to at most `1.03` and extends the service-link arrow without moving surrounding layout.
- The outlined `01` drifts no more than 3% and remains decorative.

### Software scene motion

- Nodes begin slightly separated and settle toward the system core using short transform-only travel.
- Connecting lines use nested elements that animate `scaleX` from 0 to 1; do not animate layout dimensions.
- Nodes activate in sequence with hot or sun fill while all labels remain readable.
- Hover or focus on the service link activates the core and extends the arrow; the diagram itself is not interactive.

### AI scene motion

- The document/input translates toward the human-review checkpoint.
- The review checkpoint receives one restrained scale emphasis.
- The result object enters only after the checkpoint is visible, reinforcing controlled automation.
- Total travel stays within approximately 8% of the illustration width.
- Do not loop the flow continuously; it plays once per forward entrance and reverses naturally when scroll direction reverses if scrubbed.

### Difference and process motion

- The orange strike crosses `hours` once when the statement enters.
- `outcomes` receives a short scale/opacity emphasis after the strike.
- Delivery promises enter with 30–50ms stagger.
- The process current reveals with `scaleX`; markers activate sequentially as the route enters.
- Marker activation uses fill, scale up to `1.05`, and no layout shift.

### CTA motion

- CTA heading reveals through a short mask.
- Book a call lands with the established hard-shadow impact.
- WhatsApp and Enquiry follow with a short stagger.
- Hover and press use the existing pressed-shadow vocabulary.
- Keyboard focus must be at least as visible as hover and must not depend on movement alone.

### Timing

- Micro-interactions: 150–250ms.
- Content entrances: 300–450ms.
- Related-item stagger: 30–50ms.
- Scroll-linked local transformations must remain smooth and tied to the viewport rather than running as long autonomous animations.
- No below-Hero entrance should exceed 500ms unless it is directly scrubbed by scroll.

### Reduced motion

Under `prefers-reduced-motion: reduce`:

- Disable masked travel, parallax, node convergence, line travel, document flow, marker scaling, and decorative drift.
- Render all copy, service visuals, promises, process steps, and CTAs immediately in their meaningful final state.
- Preserve static color, border, and underline focus/hover changes.
- Do not hide content behind initial opacity before JavaScript executes.

## Responsive Behavior

Verify at 375px, 768px, 1024px, and 1440px.

### Desktop: 1024px and above

- Use asymmetric copy/visual compositions for the service scenes.
- Keep each service scene compact; target approximately 520–650px of content height where the viewport permits.
- Avoid extra spacer scenes between services.
- Keep body copy within 60–75 characters per line.

### Tablet: 768–1023px

- Reduce rotations, decorative numerals, and horizontal travel.
- Stack copy above or beside service visuals based on available width.
- Preserve the service order and readable label hierarchy.
- Process uses a two-by-two route throughout the 768–1023px tablet range.

### Mobile: below 768px

- Use normal document flow with no pinning.
- Stack copy before its related visual for every service.
- Keep at least 20px horizontal gutters.
- Keep body copy within approximately 35–60 characters per line.
- Delivery promises use two columns; process steps use one vertical route.
- Stack CTA actions with Book a call first.
- Maintain touch targets of at least 44×44px and at least 8px separation.
- Do not create horizontal scrolling from rotated strips, diagrams, shadows, or oversized numerals.
- At 200% zoom, decorative overlaps must not obscure copy or controls.

## Accessibility and Semantics

- Preserve the homepage's single existing `h1` in the Hero.
- Use sequential heading levels for Problem, Services, each service, Difference, and CTA.
- Render the service index as a semantic list of links if it is interactive.
- Render service deliverables as semantic lists rather than decorative spans in production.
- Treat project imagery as meaningful and provide concise alt text.
- Mark service diagrams, outlined numerals, and decorative transition planes `aria-hidden="true"`.
- Keep DOM order aligned with reading order even when desktop visuals alternate sides.
- Preserve the global skip link and route focus behavior.
- Provide visible focus states with at least a 3px hot-orange or bone outline as appropriate to the background.
- Do not convey service state, process progress, or link affordance through color alone.
- Keep every service link and CTA available without animation or pointer hover.

## Performance

- Use the existing image pipeline and `next/image` for the Web service image.
- Load a responsive cover crop, not the AASKRA full-page screenshot.
- Declare image dimensions or aspect ratio to prevent layout shift.
- Lazy-load below-the-fold imagery.
- Do not add a new animation or media dependency.
- Register and clean up every ScrollTrigger instance on unmount.
- Batch DOM reads and writes; do not query geometry on every unthrottled scroll event.
- Keep animation work within the frame budget and use compositor-friendly properties.
- Keep all primary copy server-rendered and visible before client enhancement.

## Component Boundaries

Recommended production boundaries:

- `HomeExperience` — server-rendered composition below the existing Hero.
- `ProblemScene` — problem copy and recognition signals.
- `ServicesJourney` — introduction and the three service scenes.
- `ServiceScene` — shared semantic structure for number, outcome, title, summary, deliverables, and link.
- `WebServiceVisual` — optimized project image composition.
- `SoftwareServiceVisual` — decorative system map.
- `AIServiceVisual` — decorative controlled-automation flow.
- `DifferenceScene` — statement, promises, and compact process route.
- `HomeCTA` — the three conversion actions.
- `HomeMotion` — route-level progressive enhancement only.

These component boundaries and responsibilities are required. Copy and navigation must not be owned by the motion component.

## Data and Content

- Reuse existing service URLs and canonical service names.
- Reuse the production booking and WhatsApp constants already present in the codebase.
- Link Enquiry to `/contact`.
- Prefer existing service data modules where they support the approved copy; avoid duplicating service metadata in multiple components.
- Preserve the current homepage metadata and JSON-LD unless implementation reveals a direct mismatch with visible content.
- Do not add structured-data claims for removed homepage proof content.

## Testing and Verification

### Automated behavior

- The existing Hero contract and mobile Hero tests continue to pass unchanged.
- Homepage contains one `h1`.
- All three canonical service names and links are present.
- Book a call, WhatsApp, and Enquiry links point to the correct destinations.
- No homepage selected-work or proof section is rendered.
- Reduced-motion mode leaves all content visible and disables travel/parallax behavior.
- Motion initialization and cleanup do not produce console errors.
- Service and CTA links are keyboard reachable with visible focus.

### Responsive and visual

- Verify 375px, 768px, 1024px, and 1440px layouts.
- No horizontal overflow at any target viewport.
- The total below-Hero page is materially shorter than the current implementation.
- Section boundaries read as continuous handoffs rather than repeated bordered blocks.
- Service scenes remain distinct without becoming three large cards.
- Body text remains readable at 200% zoom.

### Performance

- No unexpected layout shift from the Web image or decorative diagrams.
- Scroll remains responsive on desktop and mobile.
- Below-Hero animations use transforms and opacity only.
- No new large media payload is introduced.

## Acceptance Criteria

The redesign is complete when:

- the existing Hero is unchanged;
- the below-Hero order matches this specification;
- the page explicitly presents all three services;
- the standalone Work / Proof section is absent;
- process and differentiators share one compact scene;
- the page is visibly shorter than the current homepage;
- scroll and hover motion follow this motion system and respect reduced motion;
- all content remains usable without JavaScript animation;
- responsive, accessibility, build, lint, and relevant end-to-end checks pass.
