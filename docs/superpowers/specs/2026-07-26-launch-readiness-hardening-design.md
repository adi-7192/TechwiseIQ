# Techwise IQ Launch-Readiness Hardening Design

**Date:** 2026-07-26  
**Status:** Approved in conversation; awaiting written-spec review  
**Scope:** Full launch hardening without redesigning the approved Kinetic experience

## 1. Objective

Prepare every Phase 1 route for a public Vercel preview and document the remaining owner-controlled steps for a later production-domain launch.

The work preserves the existing Kinetic design system, page architecture, brand voice, and honest-content rules. It fixes verified usability, accessibility, responsive, performance, metadata, form, testing, and deployment-readiness gaps.

## 2. Launch routes

The audit and remediation cover:

- `/`
- `/services`
- `/services/web`
- `/services/software`
- `/services/ai`
- `/work`
- `/work/aaskra-realty`
- `/work/express-trade-financing`
- `/about`
- `/contact`
- `/privacy`
- `/terms`
- the branded 404 state
- `/robots.txt`
- `/sitemap.xml`
- `/opengraph-image`
- `/icon`
- `/apple-icon`

## 3. Baseline evidence

The pre-implementation audit established the following:

- The production build succeeds and generates all 19 static outputs.
- The isolated lint run succeeds.
- Seven unit tests pass.
- The active Playwright suite reports 175 passing tests and 26 intentionally skipped desktop-baseline captures.
- The responsive overflow matrix is clean at 320, 375, 390, 414, 768, 834, 1024, 1280, and 1440 pixels.
- Visual captures were inspected for all launch pages at 390, 834, and 1440 pixels.
- Sequential Lighthouse samples reached 95 performance on the homepage and AASKRA case study, but `/services`, `/services/web`, and `/work` remained around 89–90 because their largest above-the-fold elements paint late.
- Lighthouse found contrast failures on `/services` and `/work`, plus accessible-name mismatches on work-page project links.
- The floating WhatsApp control overlaps meaningful contact-page content at phone and desktop sizes.
- The 404 page has no semantic `h1`.
- Most child routes replace the inherited Open Graph object without supplying an image, leaving them without `og:image`.
- Next.js reports an above-the-fold case-study image loading warning and missing smooth-scroll navigation metadata.
- Running lint while Playwright removes its transient `test-results` directory can make lint fail with `ENOENT`; the quality gate is therefore nondeterministic under concurrency.
- The contact form cannot deliver without a valid Resend configuration.
- Booking currently routes to WhatsApp by deliberate fallback.
- Analytics loads only when `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set.
- The repository is not linked to a Vercel project, and the stored Vercel credential is invalid.
- `techwiseiq.com` is not currently registered or resolvable. It remains the documented future canonical domain at the owner's request.

## 4. Design principles

1. **Preserve the approved system.** Retain Anton, Archivo, Space Mono, bone/ink/hot/sun colors, hard borders and shadows, square geometry, and the established page compositions.
2. **Correct behavior before decoration.** Obstructed controls, semantic failures, contrast, keyboard access, and delivery errors take priority over polish.
3. **Render critical content first.** Above-the-fold copy must be complete and readable in server HTML. Motion may enhance it after paint but may not gate its visibility.
4. **Test behavior before changing it.** Every behavior fix starts with a failing regression test and follows red–green–refactor.
5. **Keep external dependencies honest.** Missing credentials, accounts, and purchased domains remain explicit owner actions. The site must not imply an integration is active when it is not.
6. **Avoid unrelated redesign.** No new page architecture, animation vocabulary, testimonials, client claims, statistics, pricing, or content sections enter this scope.

## 5. Remediation architecture

### 5.1 UI, responsive behavior, and interaction

- Hide the global floating WhatsApp control on `/contact`, where the page already provides prominent in-content WhatsApp access. Keep it on all other routes.
- Preserve the mobile and desktop contact layout while ensuring no fixed control covers form fields, response messaging, or the response-guarantee card.
- Replace failing hot-orange-on-bone headline fills with ink text plus a hot-orange marker underline. This keeps the visual emphasis while meeting contrast requirements.
- Darken the small capabilities label on the sun background on `/work`.
- Keep the 404 appearance unchanged while making `404` the page-level `h1`.
- Ensure visible link labels are included in their accessible names. Additional context such as project name and “opens in a new tab” may be provided through visually hidden text.
- Keep compact footer link density, but provide the documented mobile hit-area treatment and spacing.
- Make intentional nested scroll regions keyboard reachable, named, and discoverable. Do not add new nested scrolling.
- Preserve the canonical breakpoints: 480, 768, 880, and 1024 pixels.
- Validate short-phone, tall-phone, tablet portrait, tablet landscape, desktop, reduced-motion, keyboard, and coarse-pointer behavior.

### 5.2 Performance and rendering

- Keep primary headings, supporting copy, and critical decorative structure visible in the initial server-rendered state.
- Apply entrance animations as progressive enhancement without initial opacity or transform states that delay LCP.
- Identify the actual LCP element on `/services`, each service detail route, `/work`, and representative case studies after each change.
- Give genuine above-the-fold images the appropriate Next.js eager-loading or preload behavior; keep below-the-fold media lazy.
- Correct `sizes` values and responsive dimensions where Lighthouse or Next.js reports avoidable image delivery work.
- Add the Next.js-required smooth-scroll declaration to the root HTML element while preserving reduced-motion behavior.
- Avoid broad dependency or animation rewrites unless a measured route remains below the performance target after the focused fixes.

### 5.3 Accessibility

- Maintain one semantic `h1` per rendered page, including the 404.
- Keep heading order sequential, landmarks unique, IDs unique, form labels explicit, and image alternatives present.
- Fix the verified contrast failures on `/services` and `/work`.
- Fix accessible-name mismatches on work project actions.
- Preserve visible `:focus-visible` treatment for links, buttons, form controls, accordion controls, menu controls, and scroll regions.
- On client-side navigation, move focus to the main content or page heading without disrupting pointer users.
- Keep every primary mobile action at least 44 by 44 CSS pixels. Dense footer text links retain the documented approximately 24-pixel AA compromise with spacing.
- Keep all motion fallbacks complete, readable, and operable.

### 5.4 Contact form and external integrations

- Keep the existing server action and Resend delivery model.
- Add server-side maximum lengths for name, email, company, message, and budget inputs.
- Reject malformed or oversized submissions with a clear recovery message.
- Add a visually hidden honeypot field and reject populated honeypot submissions without sending email.
- Preserve user-entered data after correctable validation or delivery errors.
- Move focus to the first invalid field or error summary after a failed submission.
- Keep the submit button disabled with clear “Sending…” feedback while a request is pending.
- Keep the WhatsApp booking fallback until a real Cal.com or Calendly URL is supplied.
- Keep failure messaging explicit that the message was not delivered and provide email and WhatsApp recovery routes.
- Never commit Resend, Vercel, analytics, or other secrets.

Required deployment variables:

- `RESEND_API_KEY`
- `CONTACT_FROM_EMAIL`
- `CONTACT_TO_EMAIL`
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`

`CONTACT_FROM_EMAIL` must use a sender verified by the selected Resend account before the production form is considered operational.

### 5.5 Metadata, SEO, and machine-readable content

- Keep `https://techwiseiq.com` as the future `metadataBase`, canonical origin, sitemap origin, and robots sitemap origin until the owner selects a different production domain.
- Supply an explicit branded Open Graph and Twitter image for every page-level metadata object so child metadata does not remove inherited images.
- Preserve unique titles, descriptions, and canonical paths for every launch route.
- Validate Organization and ProfessionalService structured data on the homepage, service structured data on detail pages, work collection data, case-study CreativeWork data, and About data.
- Keep structured data factual and omit unverified people, pricing, aggregate ratings, or client claims.
- Validate `sitemap.xml`, `robots.txt`, `llms.txt`, favicon, Apple icon, and generated Open Graph image responses.
- Do not add a production analytics script until `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is deliberately configured.

### 5.6 Engineering reliability

- Scope the lint command or ignores so transient Playwright output cannot cause `ENOENT` when lint and browser tests run concurrently.
- Add an explicit unit-test script for the existing Node test suite.
- Preserve the existing Playwright web-server configuration and route matrix.
- Add focused regression tests for each changed behavior rather than relying only on screenshots.
- Treat console warnings from application code and Next.js as launch findings. Tool-level `NO_COLOR` notices are recorded but do not block the site.
- Keep the repository on the current branch unless the user requests a separate branch.

### 5.7 Implementation boundaries

The approved scope contains four related but independently testable subsystems. Planning and execution will keep them as explicit workstreams:

1. UI, responsive interaction, and accessibility.
2. Performance, images, metadata, and crawler output.
3. Contact form safety, error recovery, and quality-gate reliability.
4. Final cross-route verification, launch report, and preview deployment.

Shared layout and test files may appear in more than one workstream, but each task must leave the repository buildable and testable before the next begins.

## 6. Test design

### 6.1 Test-first regressions

The implementation plan must define a failing test before each behavior change, including:

- no floating WhatsApp control on `/contact`;
- one `h1` on the 404;
- contrast-safe computed colors for the affected `/services` and `/work` elements;
- visible work-action text included in accessible names;
- explicit Open Graph and Twitter images on every launch page;
- immediate visibility of above-the-fold LCP candidates before client animation starts;
- correct eager/lazy behavior for audited images;
- smooth-scroll metadata on the root HTML element;
- deterministic concurrent lint and Playwright artifact handling;
- contact maximum-length validation;
- honeypot rejection;
- focus and error recovery for invalid contact submissions;
- keyboard access and naming for intentional scroll regions.

### 6.2 Responsive matrix

Automated and visual checks cover:

- 320 × 568
- 375 × 667
- 390 × 844
- 414 × 896
- 430 × 932
- 768 × 1024
- 834 × 1112
- 1024 × 768
- 1280 × 900
- 1440 × 1000

Every launch route must have no unexplained horizontal overflow, clipped critical copy, obstructed action, or unreadable state.

### 6.3 Quality gates

Before completion:

1. `npm run lint`
2. `npm run test:unit`
3. `npm run build`
4. `npm run test:e2e`
5. Sequential Lighthouse mobile audits for every 200-status launch page
6. A separate semantic and visual audit of the expected 404 response
7. Keyboard-only navigation on home, services, work, case study, about, contact, legal, and 404 templates
8. Reduced-motion checks on animation-rich templates
9. Contact-form delivery test after valid Resend credentials are supplied
10. Vercel preview smoke test after valid Vercel authentication is supplied

Target results:

- Lighthouse performance: at least 95 per 200-status route
- Lighthouse accessibility: 100
- Lighthouse SEO: 100
- Lighthouse best practices: 100
- LCP: below 1.8 seconds on the production preview using the documented simulated-mobile profile
- CLS: below 0.05
- INP: below 200 milliseconds
- zero failing automated tests
- zero unexpected application console errors or warnings

## 7. Documentation deliverables

Create `docs/launch-readiness-report-2026-07-26.md` with:

- executive launch verdict;
- route-by-route UI/UX findings;
- mobile, tablet, desktop, and landscape results;
- accessibility findings and fixes;
- performance and Core Web Vitals results;
- metadata, SEO, structured-data, and crawler checks;
- forms, links, contact-channel, and legal checks;
- deployment configuration status;
- completed fixes;
- remaining owner actions;
- commands and evidence used for final verification.

Update `docs/changelog.md` with a concise record of the implemented hardening work.

## 8. Deployment and owner actions

### Agent-owned deployment work

- Keep the project deployable on Vercel.
- Link or create a Vercel project after the owner reconnects authentication.
- Configure non-secret project settings.
- Add owner-supplied environment variables through Vercel rather than source control.
- Create a preview deployment.
- Run preview smoke tests.
- Record the preview URL and deployment status in the launch report.

### Owner-controlled actions

The following remain outside code completion:

1. Register the final production domain.
2. Confirm whether `techwiseiq.com` remains the chosen domain.
3. Connect the domain to Vercel and configure DNS.
4. Reauthenticate the Vercel CLI or provide an approved deployment connection.
5. Create or select the Resend account, verify the sending domain, and supply credentials.
6. Confirm the final `CONTACT_FROM_EMAIL` and `CONTACT_TO_EMAIL`.
7. Create or select the Plausible account and supply the production domain.
8. Supply the final Cal.com or Calendly URL.
9. Confirm that the 24-hour response promise can be operationally maintained.
10. Perform a final real-device review before production DNS cutover.

The absence of these owner-controlled items blocks production go-live but does not block code hardening or a local verification report. Vercel authentication blocks creation of the requested preview deployment.

## 9. Failure handling

- If a focused performance fix does not improve the measured LCP candidate, collect a fresh trace before attempting another change.
- If three focused fixes fail on the same performance or interaction issue, stop and revisit the page architecture rather than stacking patches.
- If external credentials are absent, display and document a safe degraded state; do not simulate successful delivery or analytics.
- If a change would require a new animation vocabulary or a material visual redesign, stop and request separate approval.
- If a production deployment cannot proceed because owner-controlled state is missing, finish all local verification, document the exact blocker, and avoid claiming the site is live.

## 10. Acceptance criteria

The hardening work is complete when:

- every agent-owned issue documented in the final report is fixed or explicitly rejected with rationale;
- all quality gates pass with fresh evidence;
- every launch route is visually reviewed at the agreed device classes;
- the approved Kinetic system remains recognizably unchanged;
- the contact page has no fixed-control obstruction;
- verified accessibility failures are resolved;
- route metadata includes social images;
- the contact form is safe and honest when configured or unconfigured;
- the final report cleanly separates completed work from owner actions;
- a Vercel preview is deployed and smoke-tested if valid authentication is available.

Production launch is a later milestone that additionally requires the owner-controlled domain, DNS, credentials, analytics, booking, operational response, and real-device actions in Section 8.
