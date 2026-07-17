# Homepage Service Looping Visuals

**Date:** 2026-07-17  
**Status:** Approved visual direction, pending written-spec review  
**Scope:** Replace the Custom Software and AI Automation illustrations within the homepage `HomeExperience` service scenes. Web Development and all other homepage scenes remain unchanged.

## Summary

Replace the two abstract, entrance-only service graphics with distinct, continuously looping illustrations built from native HTML/CSS and coordinated by the existing GSAP motion layer.

- **Custom Software:** a living operations dashboard that demonstrates a tangible product in use.
- **AI Automation:** an orchestration diagram that shows multiple business inputs passing through an AI workflow and becoming useful actions.

The two illustrations must not reuse the same visual grammar. AI Automation explains movement between systems; Custom Software presents one coherent application surface.

## Approved Decisions

- Reuse the existing React, CSS Modules, GSAP, and ScrollTrigger stack.
- Do not add Lottie, Rive, video, canvas, or another animation runtime.
- Keep the current service copy, links, scene colors, layout, ghost numbers, and responsive order.
- Use the existing Techwise IQ ink, bone, hot-orange, and sun-yellow palette.
- Run a restrained continuous loop only while the service scene is relevant.
- Preserve a complete static illustration for reduced-motion users and without JavaScript.
- Keep both illustrations `aria-hidden`; the adjacent service copy remains the accessible explanation.

## Goals

- Make both service scenes feel alive after their entrance animation finishes.
- Explain each service in one glance without relying on generic code, robot, brain, or sparkle imagery.
- Make Custom Software and AI Automation visually distinct from each other.
- Preserve homepage performance, responsiveness, readability, and Kinetic visual identity.

## Non-Goals

- No changes to Web Development, homepage copy, scene order, CTAs, navigation, or footer.
- No interactive demo, real customer data, live API, form control, or clickable dashboard.
- No animation marketplace asset or external CDN dependency.
- No new product claim, metric, client architecture, or autonomous-AI implication.
- No scroll pinning, wheel interception, horizontal page scroll, or motion that controls page navigation.

## Custom Software Visual

### Concept

Show a single custom operations application rather than a system diagram. The visual should resemble a purpose-built internal tool with:

- a compact browser/app bar;
- a persistent sidebar;
- an `Operations overview` heading;
- three summary metrics;
- a short activity table;
- visible statuses such as `Assigned`, `Ready`, and `Done`;
- a cursor that occasionally moves to a status and produces a brief state change.

The interface is illustrative, not a screenshot of a real client system. Values and labels are generic interface copy and must not be presented as Techwise IQ performance claims.

### Loop

The loop lasts 4.8 seconds and includes a pause so the interface remains readable:

1. The dashboard rests in its normal state.
2. A cursor moves toward one activity status.
3. The cursor gives a small press response.
4. The selected status briefly changes color or label state.
5. The cursor returns and the dashboard settles before repeating.

Only transforms, opacity, and color changes animate. The loop must not shift layout.

### Visual Treatment

- Bone application surface on the existing ink service scene.
- Ink borders, square corners, and hard hot-orange shadow.
- Sun-yellow and hot-orange accents for metrics and states.
- No gradients, glow, glass treatment, rounded SaaS cards, or decorative particles.

## AI Automation Visual

### Concept

Show automation as orchestration across real business sources and destinations:

- input stack: `Inbox`, `Forms`, and `Documents`;
- central processor: `AI workflow` with the supporting verbs `Understand · Decide · Route`;
- output stack: `Update CRM`, `Draft reply`, and `Build report`.

The graphic must communicate that AI connects existing work and produces useful actions. The adjacent service copy retains the human-review promise; the illustration must not imply unsupervised autonomous decisions.

### Loop

The loop lasts 4.8 seconds:

1. One input receives a short emphasis.
2. A small square signal travels from the input area to the AI workflow.
3. The AI workflow receives a restrained pulse.
4. The signal continues to one output.
5. The destination briefly confirms completion.
6. The composition rests before cycling to the next input/output pair.

The loop alternates among the three routes so repeated viewing reveals breadth without animating every element simultaneously.

### Visual Treatment

- Clean three-zone composition with no floating cards or oversized decorative symbols.
- Ink central workflow with bone type.
- Bone input labels and sun-yellow output labels, using ink borders.
- Hot-orange signal and completion emphasis.
- Straight connectors and restrained movement; no magic sparkles, neural networks, robot, or brain icon.

## Architecture and Component Boundaries

`ServiceVisuals.tsx` remains the visual component boundary.

- `SoftwareVisual` owns semantic-free dashboard markup and stable data attributes for animation targets.
- `AIVisual` owns the input, processor, output, connector, and signal markup.
- Small readonly arrays may define repeated labels inside the visual component file.
- `HomeExperience.module.css` owns layout, visual appearance, responsive rules, and complete static states.
- `HomeMotion.tsx` owns entrance and continuous GSAP timelines, visibility control, reduced-motion cleanup, and teardown.

No new global component or dependency is required because both visuals are specific to these homepage scenes.

## Motion Lifecycle

- Existing scene entrance animations remain but are simplified where they overlap with the new loops.
- Continuous timelines start after the service entrance completes.
- Timelines pause when their service scene is outside the viewport and resume from a stable point when visible.
- `prefers-reduced-motion: reduce` disables entrance and looping motion and leaves all information visible.
- GSAP contexts and observers are disposed on component unmount and when motion preference changes.
- CSS provides the final static composition before JavaScript initializes, preventing blank states or flashes.

## Responsive Behavior

- Desktop preserves the current two-column service layout and visual placement.
- Tablet scales both visuals within the existing visual column without changing scene order.
- Mobile keeps copy before illustration and reduces labels, spacing, and dashboard detail as needed.
- The graphics must fit at 375px without horizontal scrolling or clipped meaningful content.
- Each illustration reserves stable space to prevent layout shift.

## Accessibility

- Both illustrations remain `aria-hidden="true"` because the adjacent headings, summaries, and deliverables provide the meaningful content.
- Motion is not required to understand either service.
- Reduced-motion mode shows stable final states and removes cursor travel, signals, pulses, and status cycling.
- Decorative text inside `aria-hidden` visuals does not enter the accessibility tree.
- The service links and all existing focus behavior remain unchanged.

## Failure and Fallback Behavior

- Without JavaScript or if GSAP fails, both illustrations render as complete static diagrams.
- If `IntersectionObserver` is unavailable, the static visual remains usable; looping motion is enhancement only.
- No remote assets are loaded, so there is no network loading or broken-asset state.
- Motion cleanup must not leave inline transforms or opacity that hide content.

## Testing

Extend the homepage Playwright coverage to verify:

- the new Software dashboard and AI orchestration markers exist;
- the old Software system-map and AI input/review/result markers no longer exist;
- reduced-motion mode leaves both illustrations fully visible with no active loop state;
- the visual containers remain within the viewport at 375px, 768px, and 1440px;
- normal-motion mode starts the relevant loop when its scene enters the viewport;
- leaving the scene pauses or deactivates its loop;
- existing service links, homepage scene count, color treatments, and copy remain unchanged.

Run focused homepage tests, lint, and the production build before completion.

## Acceptance Criteria

- Custom Software visibly presents a living operations dashboard and does not look like a flow diagram.
- AI Automation clearly reads as multiple inputs passing through an AI workflow into useful actions.
- Both loops repeat cleanly without a visible jump, layout shift, or simultaneous visual noise.
- The service visuals are distinct from one another and consistent with the existing Kinetic brand.
- Reduced-motion and no-JavaScript states are complete and readable.
- No new animation dependency or external runtime is added.
- Existing homepage functionality and responsive behavior continue to pass their tests.
