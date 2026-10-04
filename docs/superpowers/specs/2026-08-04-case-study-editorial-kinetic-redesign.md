# Case Study Editorial Kinetic Redesign

**Date:** 2026-08-04

**Status:** Approved design

**Routes:** `/work/aaskra-realty`, `/work/express-trade-financing`

## Objective

Bring the two individual case-study pages up to the visual and experiential standard of the newer Work, About, and Service pages. The redesign must make the pages feel unmistakably part of Techwise IQ's Kinetic system while letting the shipped client work remain the evidence.

Success means both pages have a strong editorial hierarchy, deliberate pacing, prominent project imagery, credible business storytelling, and responsive behavior that feels designed rather than merely collapsed.

## Approved Direction

The selected direction is **Editorial Kinetic**. It balances three needs:

- Techwise IQ's type-led visual identity remains dominant.
- The client project is presented as proof through large, framed screenshots.
- Business readers can scan the challenge, decisions, delivered system, and result without navigating a decorative or overly cinematic experience.

The redesign will not introduce a separate visual system, project-specific color palette, carousel, or new page-level motion showpiece.

## Shared Architecture

Both routes continue to render through the shared dynamic page at `src/app/work/[slug]/page.tsx`, driven by `src/data/case-studies.ts`. The implementation must not duplicate page components for the two projects.

Project-specific data controls:

- Title and outcome
- Client, industry, service, and timeline
- Proof statistics
- Challenge and constraint copy
- Strategic decisions
- Deliverables
- Result narrative
- Technology stack
- Cover and full-page imagery
- Optional live URL
- Next-project destination

The existing metadata generation, breadcrumb structured data, unknown-slug `notFound()` handling, and optional live-link behavior remain intact.

## Page Storyboard

### 1. Editorial hero

Use a full-height hero with a centered breadcrumb/kicker, oversized Anton project title, short outcome statement, and a low-contrast outlined background word. Declare both `min-height: 100vh` and `min-height: 100svh` for the repository's viewport fallback convention. The background word is decorative and hidden from assistive technology.

The hero uses the existing bone, ink, and hot-orange palette. It must feel related to the Work page hero without copying that page's exact `PROOF, NOT PROMISES` composition.

### 2. Proof strip

Place three verified project facts directly beneath the hero:

- AASKRA: 11 pages, 6 location profiles, 6 weeks
- Express Trade Finance: 10 pages, 25+ countries, 5 weeks

Use semantic description-list markup. Values use Anton and hot orange; labels use Space Mono and ink. Desktop shows three columns. Mobile stacks the items with clear borders.

### 3. Primary project visual

Show the existing cover image early and at a materially larger scale. Apply the Kinetic image treatment: 3px ink border, hard orange offset shadow, square corners, and a very slight static rotation that cannot cause horizontal overflow.

Add a short mono caption that identifies the visual and explains its role. The image remains real project evidence rather than decorative photography.

### 4. Challenge chapter

Combine the current Problem and Constraints sections into one dark editorial chapter. Use an angled section boundary, one large outcome-oriented heading, and two clearly labeled narrative blocks:

- The problem
- The constraint

The copy may be tightened for clarity, but no facts, figures, or claims may be invented or materially changed.

Proposed project headings:

- AASKRA: "Trust before track record."
- Express Trade Finance: "Institutional weight, without the institution."

### 5. Strategic decisions

Transform the current `approach` bullets into numbered decision rows. Each row contains:

- Two-digit sequence number
- Short decision heading
- One concise explanation grounded in the existing content

The goal is to show judgment rather than present a generic feature list. The underlying case-study data should support a structured decision shape instead of requiring brittle string parsing in the page component.

### 6. Shipped system

Use one sun-yellow emphasis section for the delivered system. Pair a scannable deliverable cloud/list with the existing full-page screenshot inside a browser-like hard-bordered frame.

The screenshot frame remains keyboard focusable and vertically scrollable when the entire build is displayed. Its instruction and accessible name must explain that it is an independently scrollable full-page website screenshot.

If a project has a live URL, show a clear external-site action. If it does not, omit that action without leaving an empty layout cell.

### 7. Result chapter

Pair a large result heading with the existing result narrative and the three verified statistics. Do not create new performance, conversion, revenue, or client-success claims.

The result should conclude the business story, not repeat the hero outcome verbatim. Copy may be tightened to remove duplication while retaining the original meaning.

### 8. Stack and next-project handoff

Keep the technology stack as small bordered mono tags. After it, add a prominent next-case-study handoff:

- AASKRA links to Express Trade Financing.
- Express Trade Financing links to AASKRA.

The handoff is a dark Kinetic section with a low-contrast outlined `NEXT` background word, the next project title, and a visible link. The existing global CTA and footer remain after the handoff.

## Visual System

Follow `docs/design-system.md`:

- Anton for uppercase display headings
- Archivo for body copy
- Space Mono for labels, metadata, and tags
- Bone page background, ink text/dark sections, hot orange primary accent, and one sun-yellow emphasis section
- 3px ink borders and hard offset shadows
- Square corners throughout
- No decorative gradients, glows, blurred shadows, or additional accent colors
- At most two dark emphasis moments on the page

Project identity comes from its real imagery, content, and title—not a project-specific visual theme that fragments the Techwise IQ experience.

## Motion

Reuse the established motion vocabulary and existing animation infrastructure:

- Scroll-triggered slide-up reveals for chapter headings and content groups
- Small stagger for repeated decision rows and statistics
- Transform/opacity animation only
- Optional subtle image movement within the existing vocabulary
- No new marquee, parallax showpiece, pinned sequence, or page-specific animation system

With `prefers-reduced-motion: reduce`, all content must be visible immediately and all nonessential movement disabled.

## Responsive Behavior

Use the canonical breakpoints from `AGENTS.md`: 480px, 768px, 880px, and 1024px where each layout transition is needed.

### Desktop

- Full-height centered hero
- Three-column proof strip
- Broad two-column challenge, shipped-system, and result compositions
- Numbered decision rows with separate title and explanation columns
- Large project imagery with visible hard shadow

### Tablet

- Preserve editorial splits where they remain readable
- Collapse crowded two-column sections before text or proof statistics become compressed
- Reduce image rotation and offset shadow if required to prevent overflow

### Mobile

- Single-column story flow
- Stacked proof statistics
- Decision rows retain their number, title, and explanation hierarchy
- Dark and yellow sections lose aggressive clipping if it compromises width or readability
- Screenshot frame remains usable by touch and keyboard
- Touch targets are at least 44px for primary controls
- No interaction or content disclosure depends on hover

All target widths must satisfy `scrollWidth <= innerWidth`; global overflow clipping is not considered a fix for an overflowing component.

## Accessibility

- Preserve a logical heading hierarchy with one page `h1`.
- Use semantic lists and description lists for decisions, deliverables, and statistics where appropriate.
- Mark decorative background words and shapes `aria-hidden`.
- Keep image alt text specific to the project screenshot shown.
- Provide visible focus states for breadcrumb links, external links, the screenshot scroller, and the next-project link.
- Maintain WCAG AA text contrast. Hot orange is not used for small body text on bone.
- Retain the skip-link and route focus behavior supplied by the application shell.
- Keep independently scrollable content keyboard accessible and clearly labeled.
- Do not remove focus outlines or disable page zoom.

## Content Rules

Existing copy may be shortened, retitled, or split to improve impact and scanning. The redesign must preserve factual integrity:

- No invented analytics, conversion results, revenue, testimonials, or delivery details
- No implication that AASKRA has a live public URL when none is provided
- Existing verified project facts remain consistent everywhere on the page
- Decision language must be traceable to the current approach content
- Delivered-system language must be traceable to the current deliverables

## Failure and Optional States

- Unknown slugs continue to render the application 404 through `notFound()`.
- A missing optional live URL removes the external action cleanly.
- A missing cover image removes the primary visual section without broken image chrome.
- A missing full-page image removes the scrollable build frame while preserving the deliverables section.
- Empty statistics must not leave an empty proof strip; the component should render only when verified proof data exists.

The two current case studies contain the expected imagery and statistics, so the primary production experience includes every storyboard section.

## Testing and Verification

Implementation follows test-driven development. Add a failing test before changing production code for each new structural behavior.

Automated verification must cover:

- Both case-study slugs render the Editorial Kinetic section structure.
- Each page displays its correct title, proof facts, decisions, deliverables, images, and result.
- Express Trade Finance renders its live-site action; AASKRA does not.
- Each page links to the other case study.
- Unknown slugs preserve 404 behavior where practical to test.
- The screenshot region has an accessible name and keyboard focus.
- Reduced-motion mode leaves all content visible.
- Representative desktop, tablet, and mobile widths have no horizontal overflow.
- Primary interactive targets meet the repository's accessibility conventions.

Before completion, run the focused tests, the relevant responsive/accessibility Playwright coverage, lint, and a production build. Inspect both pages visually at desktop and mobile sizes.

## Scope Boundaries

In scope:

- Shared case-study template JSX and CSS
- Case-study data restructuring needed for editorial decision headings and related presentation fields
- Focused tests for the new page structure and behaviors
- Tightening existing case-study copy without changing factual claims

Out of scope:

- Redesigning the Work index page, global navigation, CTA, or footer
- Adding new case studies
- Producing new client imagery or project-specific illustration assets
- Changing service-page layouts
- Adding analytics claims, testimonials, or CMS functionality
- Creating a new animation framework
