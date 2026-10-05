> **Historical (redesign work log, 2026-09-05).** The Home structure has changed since; current: `docs/site-spec.md`.

# Homepage polish — 5 September 2026

Implemented the direction approved in the design review, including the requested placement of client evidence after services.

## Visitor journey

1. Hero: “Built for your next move.” A clear description of the three services, project enquiry and work links, and a dimensional interface composition.
2. Compact service introduction with native anchor links.
3. Websites: responsive site demonstration ending in a sample enquiry.
4. Custom software: request → review → checks → approval, including a manual approval action.
5. AI automation and advisory: enquiry → extraction → rules → CRM action and human checkpoint.
6. Existing real case studies, with more compact image framing and preserved case-study links.
7. Written scope, weekly demos, direct access and ownership.
8. Project enquiry and WhatsApp.

## Motion and accessibility

The demonstrations are explicitly illustrative. They run once when visible, pause offscreen or when the tab is hidden, and have replay/pause/manual-step controls. Automatic status changes do not generate repeated screen-reader announcements; manual steps have a polite status message. No scroll pinning. The full content and finished demos remain available without JavaScript.

The background now uses connected interface outlines that change composition per service, with a small number of travelling signals. Reduced motion stops the renderer and reveals content immediately, including when the preference changes during the session. Text-only routes retain the CSS atmosphere without loading Three.js.

## Verification

- Lint and production compilation.
- 33 browser checks across homepage, mobile-hero, scene/performance, accessibility and release QA suites: service order and destinations, usable controls at 320–1440px, replay/pause/manual completion, offscreen pause, live reduced motion, no-JavaScript fallback, renderer/DPR/mobile budgets, route changes, bounded layout shifts, keyboard focus, mobile menu trapping, reachable destinations and WebGL failure fallback.
- Visual review at 1440px desktop and 390px mobile, including hero, service demonstrations and selected work.

The initial browser test launch was blocked by the macOS filesystem sandbox; the suite ran successfully with the local browser launch permitted. Two existing test-only TypeScript annotations were corrected so the production type check could complete.

## Follow-up: more impact and continuous motion

Implemented the user's feedback to restore the centred dramatic hero and a clearly visible animated background. The hero entrance is coordinated with a once-per-tab “Think. Build. Move.” introduction. WebGL combines a woven core, orbit paths, dust and the existing service panels; mobile starts with lighter geometry.

Service demos now use repeating GSAP timelines with smooth construction sequences, cursor movement, record/check progression and travelling workflow signals. They pause offscreen, in hidden tabs, or on request. The footer is rebuilt around a large project invitation and oversized Techwise IQ wordmark, preserving real service/contact/legal destinations. The redundant homepage closing CTA is removed.

The production build and type check pass. The verification suite now includes intro/session behaviour, visible animation and pause, automatic looping, mobile footer layout and the existing homepage/scene/navigation checks. Visual review includes the intro itself, centred desktop/mobile hero, active service animations and desktop/mobile footer.
