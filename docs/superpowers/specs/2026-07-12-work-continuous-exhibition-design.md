# Work Continuous Exhibition Redesign

**Date:** 2026-07-12  
**Status:** Approved design, pending written-spec review  
**Scope:** `/work` listing page and its presentation/data contracts. Existing `/work/[slug]` case-study routes remain unchanged.

## Summary

Recompose the Work page as one continuous cinematic exhibition while preserving all existing copy, project facts, links, Concept Lab entries, capabilities, process steps, principles, and CTA content.

The page must stop reading as a stack of bordered sections. Client project images, proof values, capability labels, Concept Lab frames, process markers, and CTA elements visually inherit from one another as the visitor scrolls. Semantic sections remain in the document for accessibility and crawlability, but visible boundaries disappear.

The experience uses two connected portfolios:

1. **Client Work** proves delivery, business decisions, and real outcomes.
2. **Concept Lab** proves design range, interaction craft, and the types of website experience Techwise IQ can create. It remains clearly labeled as self-initiated work.

## Goals

- Preserve every current piece of Work-page content without rewriting or deleting it.
- Replace the boxy grid system with a continuous, layered spatial composition.
- Keep visitor attention through purposeful animation and shared-object transitions.
- Give the two current client projects cinematic prominence without creating a system that breaks when more projects are added.
- Elevate Concept Lab to a second portfolio rather than treating it as a secondary card grid.
- Maintain cinematic intensity through capabilities, Concept Lab, process, principles, and CTA.
- Keep the experience accessible, responsive, reversible, performant, and readable without JavaScript or motion.
- Preserve the hard-honesty rule: no invented clients, outcomes, screenshots, statistics, or testimonials.

## Non-goals

- No changes to case-study detail pages.
- No new project copy, concept copy, client claims, proof values, testimonials, or pricing.
- No filtering UI, carousel, modal, route transition, account state, or network-fetched content.
- No video, WebGL, canvas field, decorative gradient, blur, glow, glass effect, rounded card, stock imagery, or additional animation dependency.
- No long pinned sequences on mobile.
- No visible persistent progress line or left-hand rail.
- No page-wide horizontal rules used as section separators.

## Approved Creative Direction

### Continuous exhibition canvas

The page is designed as one spatial composition rather than independent horizontal bands. Content moments overlap and exchange visual objects:

- The centered hero title opens into the first project image frame.
- Project 01 proof values detach from the project frame and help introduce Project 02.
- Project 02 metadata separates into the capability composition.
- Capability labels visually unfold into Concept Lab browser frames.
- Concept frames compress into four process markers.
- Process markers spread into the two opposing principles groups.
- The final motion resolves directly into the CTA.

The handoffs are visual continuity devices, not literal draggable objects or data transformations. The DOM remains stable and content remains in reading order.

### Alignment

- Center all major labels, H1/H2 titles, project identities, exhibition introductions, process introduction, and final CTA.
- Left-align project narratives, capability explanations, concept summaries, and principle lists where reading length requires it.
- Avoid a persistent left axis. Asymmetry comes from imagery, proof objects, and overlapping type around a centered editorial spine.

### Scene boundaries

- Do not use full-width borders or repeated rectangular section backgrounds to separate content.
- Connect moments with overlapping imagery, shallow static clip-path planes, oversized type, scale, rotation, and shared color fields.
- Borders remain available for controls, proof objects, browser frames, tags, and small internal structures.
- The global palette remains bone, ink, hot orange, and sparing sun yellow.

## Information Architecture

The content order remains unchanged:

1. Hero: `Our work / Our way` and `Proof, not promises.`
2. Delivery proof marquee.
3. Selected Client Work introduction.
4. Featured client project reel.
5. Aggregate delivery evidence.
6. Remaining-project visual index, rendered only when non-featured projects exist.
7. Capabilities demonstrated.
8. Concept Lab exhibition.
9. How we work.
10. Working principles.
11. Final CTA.

The marquee, selected-work introduction, and aggregate metrics remain present but become transition material inside the canvas rather than isolated strips or grids.

## Client Work System

### Featured project reel

- Render no more than three featured projects as cinematic takeovers.
- Mark featured status explicitly in project presentation data rather than inferring it from array position.
- Both current case studies are featured.
- Each featured project retains all existing metadata, title, outcome, three proof values, challenge/decision/outcome narrative, case-study link, and optional live-site link.
- Each project remains an `<article>` with an H3 and real links.

### Featured project composition

Each project uses one near-viewport stage on desktop:

- A large, optimized project image sits on a rotated or offset plane.
- The centered project title crosses the image plane without obscuring essential image or text content.
- Metadata remains visible before animation begins.
- Proof values detach visually as bordered objects.
- Challenge, decision, and outcome assemble around the frame in a readable composition.
- Project 02 reverses image direction and motion so it is not a duplicated scene.

### Short cinematic hold

- Desktop viewports at 1024px and above use a short sticky hold per featured project. Tablet and mobile use normal flow.
- The hold covers only the time required for image, title, proof, and narrative to assemble.
- The visitor can reverse direction at any point and the scene responds immediately.
- No wheel/touch interception, scroll snapping, artificial delay, or input blocking.
- Mobile and reduced-motion modes use normal flow without sticky holds.

### Future-project index

- Projects not marked featured render automatically in a fluid visual index after the featured reel.
- The index is absent when there are no non-featured projects; it leaves no empty heading or spacer.
- Index entries include existing image, service, industry, timeline, title, outcome, case-study link, and optional live-site link.
- The index uses image-led staggered editorial placements, not equal cards.
- Adding project four requires only data changes. Promoting or demoting a featured project requires only changing featured presentation metadata.

## Capabilities as Demonstrated Evidence

Keep all six existing capabilities and descriptions:

- Strategy.
- UX / UI.
- Engineering.
- Content.
- Conversion.
- Launch.

Do not render them as a 3-by-2 bordered grid. Proof objects from the featured reel transition into an open capability cloud or rail. The active capability fills while adjacent capability titles remain outlined or lower-emphasis. Descriptions remain readable and are not hidden behind interaction.

Capabilities then reappear beside relevant Concept Lab entries through existing tags, making the relationship between evidence and range explicit without adding new claims.

## Concept Lab as a Second Portfolio

### Positioning

- Preserve the `Concept Lab / Self-initiated` label.
- Preserve the existing disclosure that concept work is not client commission work.
- Give the exhibition comparable visual weight to Client Work while keeping the distinction explicit.
- Present Concept Lab as proof of website-design range and interaction capability, not as future client evidence.

### Draft concepts

The three current draft entries remain honest and non-interactive:

- Hospitality concept.
- SaaS product concept.
- Commerce concept.

Each receives a large browser-frame stage with its existing title, category, summary, tags, and `Brief pending` state. Blueprint geometry animates into its final layout using transforms and opacity, but must not simulate a finished design or fake screenshot.

Draft entries have no hover treatment that implies activation and no link semantics.

### Published concepts

A concept becomes interactive only when all of the following are true:

- `status === 'published'`.
- `previewImage` is present.
- `demoPath` is present.

Published entries replace the blueprint in the same spatial stage with the real preview image and existing live-demo link. Hover/focus shifts the preview upward by no more than 12px within its frame and extends the link arrow. The accessible name continues to identify that the demo opens in a new tab.

### Concept growth

- The exhibition renders every concept entry.
- The first three form the primary spatial composition.
- Additional concepts continue in an alternating exhibition trail rather than a uniform grid.
- No concept is silently hidden or moved behind a carousel.

## Remaining Content Moments

### How we work

Keep Align, Prototype, Build, and Ship with their current descriptions. The four steps form one centered route. Concept browser frames visually compress into the step markers. The active step gains emphasis as it enters, but all four steps remain readable without interaction.

Desktop uses a horizontal or gently arcing composition. Mobile uses a vertical route in normal flow.

### Working principles

Keep both existing lists and headings. Introduce the moment with a centered composition, then resolve into two readable groups:

- `Visible progress.` / What clients get.
- `Delivery theatre.` / What we avoid.

The groups enter from opposing directions without becoming separate bordered cards. List rows use local underline sweeps on entrance, hover, and focus. The two groups stack in reading order on mobile.

### Final CTA

Keep the current label, heading, body, booking link, external-link behavior, and accessible name. Use a near-viewport centered title takeover. The final shared motion resolves into the CTA button, which retains the existing hard-shadow press response.

## Motion Specification

### Page-level orchestration

Use one `WorkMotion` client component for the `/work` route. It does not own copy or portfolio state. It finds stable data attributes within the server-rendered Work experience and applies progressive enhancement.

Use existing GSAP/ScrollTrigger and browser observers only. Do not add a dependency. Keep the project reel as the page's single scroll showpiece; later cinematic moments use IntersectionObserver, CSS sticky positioning, and CSS transitions/animations rather than independent pinned timelines.

### Featured project sequence

- Image plane: scale from approximately `0.92` to `1`, rotate toward its resting angle, and translate no more than 8% of its dimension.
- Project title: masked translate reveal crossing the image plane.
- Proof values: stagger by 30–50ms using opacity and translate.
- Narrative: short stagger after proof becomes readable.
- Exit/handoff: proof objects translate toward the next scene while the current project remains readable.

Implementation may reduce these travel values when overlap testing requires it, but must not exceed them. Motion uses transform and opacity only and avoids layout reflow.

### Other moments

- Hero: masked vertical title reveal and restrained outline-word drift.
- Capabilities: outline-to-fill text response and local horizontal movement.
- Draft concepts: blueprint blocks and lines assemble without implying interactivity.
- Published concepts: preview drift within an overflow-hidden frame on hover/focus.
- Process: active marker emphasis and route-fill transform.
- Principles: opposing short entrances and underline sweeps.
- CTA: giant title mask followed by button impact.

### Interaction timing

- Micro-interactions: 150–250ms.
- Content entrances: 250–400ms.
- Related-item stagger: 30–50ms.
- Ambient loops, if used, remain subtle, transform-only, optional, and limited to one or two decorative elements in a viewport.
- No animation blocks input or delays navigation.

### Reduced motion

Under `prefers-reduced-motion: reduce`:

- Disable sticky project holds, parallax, rotation changes, ambient loops, shared-object travel, and staged entrances.
- Render all content immediately in meaningful final positions.
- Keep only non-moving color, underline, and outline changes for hover/focus.
- Preserve all project links, live-demo links, proof, concept disclosures, and CTA access.

## Responsive Behavior

Verify at 375px, 768px, 1024px, and 1440px.

### Desktop, 1024px and above

- Use short sticky featured-project holds.
- Allow image/type overlap around the centered spine.
- Preserve readable narrative measures despite the full-width composition.
- Render process horizontally and principles in two opposing groups.

### Tablet, 768–1023px

- Use sticky holds only when viewport height and input mode allow a complete readable stage.
- Reduce rotations, overlap distance, and oversized ghost typography.
- Keep all links and proof objects clear of overlaps.

### Mobile, below 768px

- Disable project pinning and shared-object travel.
- Render the same content in normal flow with short entrance transitions.
- Image precedes project narrative.
- Center major headings; left-align body copy and lists.
- Stack proof values, concept stages, process steps, and principle groups when needed.
- Maintain at least 20px gutters, 16px body text, 44px interaction targets, and no horizontal overflow.

### Zoom and orientation

- At 200% zoom, overlaps must not obscure text or controls.
- In mobile landscape, use normal flow rather than forcing a viewport-height scene.
- Avoid fixed heights for narrative containers.

## Accessibility and Semantics

- Preserve one H1 and sequential heading order.
- Keep Client Work and Concept Lab as explicitly labeled semantic sections.
- Featured and indexed projects remain `<article>` elements.
- Use real anchors for all case-study, live-site, and published-demo navigation.
- Draft concepts remain non-interactive.
- Keep meaningful image alt text and hide decorative frames/type from assistive technology.
- Preserve global skip-link and focus-visible behavior.
- Ensure keyboard order follows DOM reading order rather than visual overlap.
- Provide focus states equivalent to hover effects.
- Do not rely on color, motion, or outline fill alone to communicate status.
- Keep small text contrast WCAG AA compliant; hot orange is not body text on bone.
- Ensure transformed elements do not create focus clipping.

## Component and Data Architecture

### Components

- `WorkExperience` — server-rendered page composition and semantic section order.
- `WorkHero` — centered hero and marquee handoff.
- `FeaturedProjectRail` — up to three featured project takeovers.
- `FeaturedProject` — reusable project article composition.
- `ProjectIndex` — conditional non-featured project trail.
- `WorkCapabilityCloud` — open six-capability composition.
- `ConceptExhibition` — all draft and published concept stages.
- `WorkProcess` — connected four-step route.
- `WorkingPrinciples` — opposing expectation groups.
- `WorkFinalCta` — centered closing takeover.
- `WorkMotion` — client-only enhancement and cleanup.

Keep components focused. Do not move project or concept copy into the motion component.

### Project presentation data

Add an explicit presentation field to the existing case-study type:

```ts
featured: boolean
```

Set both current projects to `featured: true`. Runtime rendering must cap cinematic takeovers at three even if more records are accidentally flagged. Any additional flagged records fall back to the Project Index so no project disappears.

Do not duplicate case-study content into a second Work-page array.

### Concept data

Keep the existing `ConceptSite` contract. Published rendering validates the combination of status, preview, and demo path. Do not infer published state from asset existence alone.

## State, Failure, and Fallback Behavior

- No network data or loading state is required.
- If no case studies exist, omit the project reel and show the existing Work-page content beginning with capabilities and Concept Lab; do not invent an empty project.
- If one to three featured projects exist, render all of them in the featured reel.
- If more than three are flagged featured, render the first three in data order and place the rest in the Project Index.
- If no project is flagged featured, render the first up to three projects as featured for backwards compatibility and place the rest in the index.
- If a project lacks an optional live URL, omit only the live-site link.
- If a project image is unavailable, reserve the visual stage and show a branded bone/ink fallback without broken-image UI.
- If a draft concept lacks assets, render its blueprint normally.
- If a published concept lacks either required asset path, render it as a non-interactive draft-style stage with an honest unavailable state; never render a broken link.
- If JavaScript or motion setup fails, CSS final states keep all content visible in normal flow.

## Performance Constraints

- Keep Lighthouse performance at least 95 and accessibility/SEO/best practices at 100.
- Preserve LCP below 1.8s, CLS below 0.05, and INP below 200ms.
- Use existing optimized WebP project imagery through `next/image` with responsive sizes and reserved aspect ratios.
- Eager-load only the first above-fold project image when it materially affects the initial scene; lazy-load later imagery.
- Use no canvas, video, iframe, or new animation package.
- Animate transform and opacity only.
- Avoid per-frame DOM measurement. Measure stage geometry at setup/refresh boundaries only.
- Clean up observers, media-query listeners, timelines, and ScrollTriggers on unmount.

## Verification

### Automated coverage

- Existing Work-page content remains present and headings remain unique and sequential.
- Both current projects render as featured articles and link to their stable case-study routes.
- Aggregate values remain `21 pages`, `5–6 week launches`, and `2 live projects` from existing data.
- A fixture with four projects renders three featured takeovers and one Project Index entry.
- A fixture with more than three featured flags does not hide projects.
- Draft concepts remain non-interactive and preserve the self-initiated disclosure.
- Published concepts require both preview and demo paths before rendering a link.
- Reduced-motion mode exposes all content without transformed hidden states.
- The page has no horizontal overflow at 375px.
- Focusable controls are keyboard reachable in DOM reading order.

### Manual checks

- Desktop short holds feel brief, reversible, and do not trap scrolling.
- Project title/image overlaps remain legible at supported breakpoints and 200% zoom.
- Shared-object handoffs feel connected rather than like separate section entrances.
- Mobile normal-flow experience preserves content order and visual energy.
- Hover effects have equivalent focus states.
- Draft concepts do not appear clickable.
- Published concept previews do not cause layout shift.

### Completion commands

- Run the focused Work-page Playwright specification.
- Run the full lint command.
- Run the production build.

## Approved Visual Reference

The accepted visual-companion direction is the continuous exhibition canvas produced during brainstorming. It establishes spatial logic rather than pixel-perfect styling: project frames overlap, proof fragments migrate into capabilities, capabilities unfold into Concept Lab frames, and the page closes by resolving the same visual energy into the CTA.
