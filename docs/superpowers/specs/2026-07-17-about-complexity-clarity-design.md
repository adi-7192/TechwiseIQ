> **Historical (written for the Kinetic design, deleted — D-028).** Kept for reference only; do not build from it.
> Current: `docs/site-spec.md`, `docs/design-system.md`, `docs/DECISIONS.md`.

# About Page — Complexity to Clarity Design

**Date:** 2026-07-17
**Status:** Approved for specification review
**Route:** `/about`

## Objective

Redesign the About page as a short, centered, kinetic story that makes Techwise IQ feel like the expert partner a non-technical business owner can trust to get important work done.

The page must communicate technical authority through judgment, clarity, ownership, and useful outcomes rather than jargon, team profiles, or individual biographies. It must explain what Techwise IQ does, how the company works, what its culture values, and where it is based without becoming a long corporate profile.

## Audience and Intended Impression

The primary audience is a business owner or operational leader who has a commercial problem but does not want to manage technical complexity.

The intended takeaway is:

> They understand the technology, so I do not have to. They will understand the business problem, recommend the path, and take responsibility for getting it built.

Technical expertise is the dominant impression. Dubai presence, ownership, clarity, and momentum reinforce it.

## Constraints

- Keep the page to four compact scenes, approximately four to five viewport heights on desktop.
- Follow the centered, oversized, kinetic composition of the Home page.
- Use the existing Kinetic design system: bone, ink, hot orange, sun yellow, Anton, Archivo, Space Mono, square edges, three-pixel borders, and hard shadows.
- Do not use team profiles, founder notes, individual names, portraits, client names, logos, testimonials, invented numbers, or unverifiable outcomes.
- Client proof remains qualitative: `Trusted by businesses in Dubai and beyond.`
- Mention Dubai clearly without making location the entire story.
- Use no stock photography, decorative gradients, blur, glass effects, or generic technical imagery.
- Keep one primary CTA.
- Respect the site's hard-honesty, performance, accessibility, and reduced-motion rules.

## Narrative and Page Structure

### Scene 1 — Complexity to Clarity

The page opens with a centered, near-viewport-height transformation hero.

**Label**

`About Techwise IQ / Dubai`

**Heading**

> We make complex feel clear.

**Supporting copy**

> Techwise IQ turns business bottlenecks into websites, software and AI systems that move the work forward. You bring the goal. We own the technical path.

Meaningful problem fragments sit around the central statement:

- Underperforming website
- Manual daily work
- Disconnected systems
- Technical uncertainty
- Growth bottlenecks

The fragments begin scattered at the edges of the composition and converge toward the central promise as the visitor scrolls. The motion represents the company organizing complexity into a clear path. The fragments remain readable HTML, not canvas graphics or inaccessible decoration.

### Scene 2 — Expertise as Useful Outcomes

This scene explains the three service fields through business problems and useful outcomes rather than a technical capability list.

**Heading**

> Technology should make the business simpler—not give it more to manage.

**Transformation paths**

1. `A website that undersells you` → `A digital presence built to earn attention and action.`
2. `Work trapped in spreadsheets` → `Software shaped around how your operation actually runs.`
3. `Repetitive work slowing people down` → `AI automation with clear human control.`

The three paths appear as full-width centered rows. They reveal in sequence as the scene enters the viewport. They are not boxed cards and do not become an accordion.

### Scene 3 — Operating Culture

The culture section is one immersive ink-background sequence rather than a grid of value cards.

**Introductory label**

`How we behave when the work gets real`

The following words take over the scene one at a time:

**Ownership**

> We recommend the path and take responsibility for delivery.

**Clarity**

> Plain language, written scope, and progress you can see.

**Momentum**

> Fewer hand-offs. Working progress. Decisions turned into useful outcomes.

On desktop, the scene may remain briefly sticky while the words crossfade and shift with scroll progress. On mobile, the three principles render sequentially in normal document flow to avoid a prolonged or trapped scroll.

### Scene 4 — Dubai, Trust, and Action

The final scene combines geographic confidence, qualitative trust, and the CTA.

**Label**

`Dubai / Working beyond borders`

**Heading**

> Built in Dubai. Working beyond borders.

**Trust statement**

> Trusted by businesses in Dubai and beyond to turn important ideas into working digital products.

**Primary CTA**

`Bring us the business problem →`

The CTA should use the established booking destination and remain the only primary action in the scene. A restrained static target or coordinate motif may connect the closing composition to the idea of locating the bottleneck. It reveals with the scene but does not become a second continuous showpiece animation.

## Visual Direction

The page uses centered composition throughout, matching the visual hierarchy of the redesigned Home page.

- Primary headings use uppercase Anton at display scale.
- Supporting copy stays within a readable 50–60 character measure.
- Bone and ink alternate to create four distinct movements without adding unnecessary sections.
- Hot orange marks transformation, direction, and the CTA.
- Sun yellow appears only as a brief underline or selection mark in the hero.
- Borders remain three pixels and shadows remain hard-edged.
- Floating problem fragments use small mono labels with square borders and hard shadows.
- Expertise paths span the content width and rely on typography, rules, and motion rather than cards.
- The culture scene uses ink, bone, and hot orange for the strongest contrast on the page.
- The closing scene returns to a light surface and resolves the visual tension into one action.

## Motion System

Motion must communicate the narrative rather than decorate it.

### Primary showpiece

The hero convergence is the single complex page showpiece. Scroll progress moves the problem fragments from scattered positions toward an organized central state while the hero underline resolves beneath the promise.

- Animate only `transform` and `opacity`.
- Keep movement interruptible and tied to scroll progress.
- Avoid pointer-dependent interaction.
- Do not animate layout properties.
- Keep the centered heading readable throughout the sequence.

### Supporting motion

- Expertise rows receive short staggered enter reveals.
- Culture principles crossfade with a small transform on desktop.
- The closing content receives one simple entrance reveal.
- The coordinate or target motif does not rotate continuously.
- Pressed-shadow behavior may be used on the CTA according to the existing button vocabulary.

### Reduced motion and failure behavior

With `prefers-reduced-motion: reduce`, all content renders immediately in its final organized state. The culture principles appear together in document flow. If client-side JavaScript fails, the server-rendered page remains complete, ordered, and usable without hidden content.

## React and Component Architecture

The page will be built in React within the existing Next.js App Router project. There is no separate static backup page.

Next.js renders the React route to semantic HTML during the server/static rendering step. A small client-side React controller adds scroll behavior after hydration. The semantic HTML is the real page and remains usable without JavaScript.

Recommended component boundary:

- `src/app/about/page.tsx`
  - Server route component.
  - Owns metadata, AboutPage JSON-LD, `Nav`, `Footer`, and the About experience composition.
- `src/components/AboutExperience/index.tsx`
  - Owns the four semantic sections and approved static content.
  - Exposes stable data attributes for animation and testing.
- `src/components/AboutExperience/AboutMotion.tsx`
  - Small client component.
  - Detects reduced motion, observes scene visibility, calculates bounded hero and culture progress, writes CSS variables or data attributes, and removes listeners on cleanup.
- `src/components/AboutExperience/AboutExperience.module.css`
  - Owns layout, responsive rules, visual states, and motion driven by CSS variables.

The existing route-level `about.module.css` can be removed once all About-specific styling moves into the component folder. Shared navigation, footer, button behavior, URLs, and global design tokens must be reused.

## Data and State Flow

All About content is local, static, and rendered on the server. The page performs no fetches and has no asynchronous content states.

1. Static content renders into semantic sections.
2. `AboutMotion` reads the root element and the reduced-motion media query after hydration.
3. When motion is allowed, observers and a request-animation-frame loop derive bounded progress values for the hero and culture scenes.
4. Progress is exposed through CSS custom properties or discrete data attributes.
5. CSS performs all visual transforms and opacity transitions.
6. Cleanup removes observers, listeners, and animation-frame work when the component unmounts.

No business content depends on animation state.

## Responsive Behavior

### Desktop

- Centered near-viewport hero with the full set of problem fragments.
- Hero uses a short sticky scroll span for the convergence showpiece.
- Expertise paths remain full-width horizontal transformations.
- Culture may use a short sticky sequence for the three principles.

### Tablet

- Preserve centered hierarchy with smaller display type.
- Reduce fragment travel distance and prevent labels from entering the heading safe area.
- Expertise paths may retain two-sided problem/outcome alignment while space permits.

### Mobile

- Use at least 20-pixel gutters and minimum 16-pixel body text.
- Limit floating fragments to the labels that fit without overlap; keep the complete accessible list in the DOM.
- Remove extended sticky or pinned behavior.
- Stack problem and outcome text within each expertise path while preserving the directional relationship.
- Render all three culture principles sequentially.
- Maintain minimum 44-pixel interactive targets and prevent horizontal overflow.

## Accessibility, SEO, and Performance

- Keep one page `h1` and a sequential heading hierarchy.
- Keep all meaningful copy in the DOM and in logical reading order.
- Decorative geometry is `aria-hidden`.
- Do not make hover or motion necessary to reveal content.
- Preserve visible keyboard focus on the CTA and navigation.
- Maintain WCAG AA contrast for body text and controls.
- Respect reduced-motion preferences before installing scroll listeners.
- Use no images, video, canvas, new font families, or additional network requests.
- Keep animation work off the layout path and batch scroll updates through requestAnimationFrame.
- Retain the canonical `/about` URL and `AboutPage` JSON-LD.
- Update metadata to match the new business-first positioning and remove references to individual team composition or founder language.

## Verification

Implementation verification must include:

- Automated assertions for the approved hero, expertise, culture, trust, and CTA copy.
- Confirmation that no founder note, individual name, team profile, client logo, statistic, or testimonial remains.
- Desktop visual check at approximately 1440 pixels wide.
- Mobile visual check at 375 pixels wide.
- No horizontal overflow at supported widths.
- Keyboard navigation and visible focus verification.
- Reduced-motion verification showing complete static content.
- JavaScript-disabled or pre-hydration inspection confirming meaningful server-rendered HTML.
- Motion cleanup and scroll behavior verification.
- `npm run lint`.
- Relevant automated tests.
- `npm run build`.

## Out of Scope

- Team biographies, founder stories, portraits, or organizational charts.
- Named clients, logos, testimonials, numerical claims, or fabricated social proof.
- New service detail content or case-study changes.
- Photography, video backgrounds, canvas effects, or 3D assets.
- Contact form changes.
- New site-wide design tokens or navigation changes.
- Dark mode.

## Acceptance Criteria

The redesign is ready for implementation when:

1. The page contains the four approved scenes in the approved order.
2. The primary impression is business-focused technical authority.
3. The layout is centered and visually consistent with the Home page.
4. The page remains concise and avoids team or individual content.
5. The hero convergence is the only complex motion showpiece.
6. Expertise is expressed through business problem-to-outcome transformations.
7. Ownership, clarity, and momentum form the complete culture story.
8. Dubai presence and qualitative client trust are explicit and honest.
9. The page is fully readable without motion or client-side JavaScript.
10. Desktop, mobile, accessibility, performance, lint, tests, and build checks pass.
