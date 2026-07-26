# Techwise IQ Launch Readiness Report — 26 July 2026

## Executive status

**Classification: application code is release-candidate ready; public launch is
blocked by owner-controlled infrastructure and integration gates.**

All 12 public routes and the designed 404 pass the production build, semantic,
responsive, accessibility, metadata, and browser regression checks. Controlled
mobile Lighthouse scores are 91–95 for performance and 100 for accessibility,
best practices, and SEO on every public route.

There is no live Techwise IQ URL yet. Vercel has no authenticated credentials in
this environment and starts an interactive device-login flow. The canonical
`techwiseiq.com` domain remains the approved placeholder and does not currently
resolve in DNS. No preview or production deployment was attempted without the
required account access.

The following external gates are not verified: production dependency advisory
status, Resend delivery, Plausible analytics, final calendar booking, the
24-hour response promise, and physical-device sign-off. These items prevent a
claim that the site is fully live.

## Scope and methodology

The audit covered:

- Public routes: `/`, `/services`, `/services/web`, `/services/software`,
  `/services/ai`, `/work`, `/work/aaskra-realty`,
  `/work/express-trade-financing`, `/about`, `/contact`, `/privacy`, and
  `/terms`.
- Error and crawler endpoints: an unknown route, `/robots.txt`, and
  `/sitemap.xml`.
- Responsive widths: 320, 375, 390, 414, 768, 834, 1024, 1280, and 1440px.
- Full-page visual captures: all 12 routes plus 404 at 390 × 844, 834 × 1112,
  and 1440 × 1000 (39 captures under `/tmp/techwise-launch-final/`).
- Static verification: ESLint, TypeScript through `next build`, 13 Node unit
  tests, whitespace validation, and static route generation.
- Browser verification: 214 passed Playwright cases plus 26 intentionally
  skipped baseline-capture cases, including route invariants,
  responsive overflow, mobile hero, services, work, About, contact recovery,
  reduced motion, no-JavaScript fallbacks, accessibility, metadata, and
  crawler output. The 26 skipped cases are opt-in desktop baseline capture
  jobs, not disabled product assertions.
- Production verification: 45 focused Playwright checks against the optimized
  local production build.
- Performance verification: sequential, uncontended mobile Lighthouse runs
  against the optimized local production build; no best-run selection.
- Link and integration verification: internal route checks, external HTTP/DNS
  checks, environment inspection, contact failure-path testing, and Vercel
  authentication discovery.

## What was fixed

### UI, responsiveness, and alignment

- Removed the floating WhatsApp control from `/contact`, where it duplicated
  the page actions and could obstruct the form on small screens.
- Kept the contact error state aligned at phone width while preserving the
  direct-contact panel below the form.
- Replaced low-contrast orange headline fills with ink text and an orange
  marker treatment on Services and Work.
- Ensured critical Services, Work, and case-study content renders immediately
  instead of waiting for client animation.
- Removed a mobile-only decorative Work treatment that increased critical
  rendering cost without adding useful information.
- Confirmed no horizontal overflow across every route at all nine supported
  widths.

### Accessibility and keyboard UX

- Made the visual `404` the page's semantic `h1`.
- Corrected Work labels and headline accents to meet contrast requirements.
- Kept visible action copy inside Work-link accessible names while adding
  project and new-tab context.
- Added route-change focus management so keyboard and screen-reader users land
  on the destination heading.
- Named the case-study full-page screenshot region, made it keyboard focusable,
  and added a visible focus style.
- Focused the first invalid contact field, connected inline errors with
  `aria-describedby`, and preserved all entered values after errors.
- Kept the anti-spam honeypot out of the keyboard order.
- Existing automated keyboard coverage confirms the Services navigator, mobile
  navigation, route focus, contact error focus, Work links, and case-study
  screenshot region. A final physical keyboard/screen-reader pass remains an
  owner sign-off item.

### Performance and loading behavior

- Removed client-only visibility gates from largest-content candidates.
- Prioritized the first Work image and case-study cover with eager loading and
  high fetch priority.
- Preserved reduced-motion and no-JavaScript fallbacks.
- Declared the scroll behavior expected by Next.js navigation.
- Improved the priority-route local mobile baselines:
  `/services` LCP 3,617 → 3,041ms, `/services/web` 3,782 → 3,190ms, and
  `/work` 3,533 → 3,194ms.
- All routes have zero measured cumulative layout shift and zero total blocking
  time. The aspirational sub-3-second local LCP target is narrowly missed on
  several routes; deployed-preview performance still needs measurement.

### SEO, social sharing, and crawler readiness

- Added complete Open Graph and Twitter image metadata to every public route.
- Verified one non-empty title, description, `main`, and `h1` on every route.
- Verified all emitted JSON-LD parses successfully.
- Verified `robots.txt` and `sitemap.xml` include the complete public route set.
- Preserved `techwiseiq.com` as the requested canonical placeholder; it must not
  be described as live until the domain is registered/configured and resolves.

### Contact form safety and recovery

- Added server-side normalization and validation for required fields, email,
  field lengths, and approved budget values.
- Added a honeypot that suppresses delivery without revealing the anti-spam
  behavior.
- Added explicit limits: name 100 characters, email 254, company 160, and
  message 5,000.
- Preserved name, email, company, message, and budget after validation or
  delivery errors.
- Prevented false success: missing or failed Resend delivery produces a visible
  message stating that the inquiry was not sent and provides direct fallbacks.
- Added unit and browser regression coverage for validation, recovery,
  honeypot behavior, and missing delivery configuration.

### Verification-tool reliability

- Scoped linting to source, tests, and configuration so generated reports do
  not affect results.
- Added a deterministic `test:unit` command.
- Added launch-smoke coverage for status, headings, metadata, JSON-LD, overflow,
  console errors, 404 semantics, robots, and sitemap.
- Added route-level performance/metadata and accessibility suites.
- Removed the AASKRA external “live site” action after its domain failed DNS
  resolution; the internal case study remains. The Express Trade Financing
  live link remains and returned HTTP 200.

## Route-by-route results

All rows passed HTTP 200, exactly one `main`, exactly one `h1`, responsive
overflow checks at nine widths, parsed structured data, complete social
metadata, and no console/page errors.

| Route | Responsive/UI | Lighthouse P/A/BP/SEO | LCP | Notes |
|---|---|---:|---:|---|
| `/` | Pass | 94/100/100/100 | 3,042ms | Hero and CTAs remain visible with reduced motion and no JavaScript. |
| `/services` | Pass | 94/100/100/100 | 3,041ms | Problem navigator is keyboard operable; contrast fixed. |
| `/services/web` | Pass | 93/100/100/100 | 3,190ms | Complete decision journey and real proof links. |
| `/services/software` | Pass | 94/100/100/100 | 3,040ms | Complete decision journey; no public pricing schema. |
| `/services/ai` | Pass | 94/100/100/100 | 3,040ms | Complete decision journey; human-review framing retained. |
| `/work` | Pass | 93/100/100/100 | 3,194ms | Link names and contrast fixed; dead AASKRA outbound link removed. |
| `/work/aaskra-realty` | Pass | 94/100/100/100 | 3,119ms | Internal case study and keyboard screenshot scroller pass. |
| `/work/express-trade-financing` | Pass | 94/100/100/100 | 3,041ms | External live-site target returned HTTP 200. |
| `/about` | Pass | 94/100/100/100 | 3,040ms | All four scenes pass phone, desktop, reduced-motion, and no-JS checks. |
| `/contact` | Pass | 95/100/100/100 | 2,891ms | Mobile error state, value recovery, and honest delivery failure pass. |
| `/privacy` | Pass | 91/100/100/100 | 3,456ms | Lowest performance score, still above the 90 release gate. |
| `/terms` | Pass | 94/100/100/100 | 3,041ms | Legal layout and long-link wrapping pass. |

The designed 404 returns HTTP 404, contains a semantic `h1` named `404`, and
passes the same responsive overflow checks. Lighthouse was not used for the
intentional error response.

## Responsive visual matrix

| Band | Evidence | Result |
|---|---|---|
| Phone | Automated checks at 320, 375, 390, and 414px; full-page captures at 390 × 844 | Pass. Navigation, hero copy, CTAs, form errors, long email text, case-study scroller, and footer stay within the viewport. |
| Tablet | Automated checks at 768 and 834px; full-page captures at 834 × 1112 | Pass. Project sequencing, service modules, grids, dividers, and section spacing remain aligned. |
| Desktop | Automated checks at 1024, 1280, and 1440px; full-page captures at 1440 × 1000 | Pass. Editorial overlaps, sticky scenes, project stages, contact columns, and footers retain their intended composition. |

No P0 or P1 visual defect remains in the reviewed matrix. Accepted P2 items:
the controlled local LCP target is narrowly missed on several text-led routes,
and final typography/rasterization should still be checked on real iOS Safari
and Android Chrome hardware.

## Lighthouse results

Method: Lighthouse mobile defaults, optimized local production build,
sequential route execution, no concurrent tests. Values below are the observed
single controlled runs; priority routes were also repeated during hardening and
showed the same score band.

| Route | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
|---|---:|---:|---:|---:|---:|---:|---:|
| `/` | 94 | 100 | 100 | 100 | 3,042ms | 0 | 0ms |
| `/services` | 94 | 100 | 100 | 100 | 3,041ms | 0 | 0ms |
| `/services/web` | 93 | 100 | 100 | 100 | 3,190ms | 0 | 0ms |
| `/services/software` | 94 | 100 | 100 | 100 | 3,040ms | 0 | 0ms |
| `/services/ai` | 94 | 100 | 100 | 100 | 3,040ms | 0 | 0ms |
| `/work` | 93 | 100 | 100 | 100 | 3,194ms | 0 | 0ms |
| `/work/aaskra-realty` | 94 | 100 | 100 | 100 | 3,119ms | 0 | 0ms |
| `/work/express-trade-financing` | 94 | 100 | 100 | 100 | 3,041ms | 0 | 0ms |
| `/about` | 94 | 100 | 100 | 100 | 3,040ms | 0 | 0ms |
| `/contact` | 95 | 100 | 100 | 100 | 2,891ms | 0 | 0ms |
| `/privacy` | 91 | 100 | 100 | 100 | 3,456ms | 0 | 0ms |
| `/terms` | 94 | 100 | 100 | 100 | 3,041ms | 0 | 0ms |

The local regression gate is met: no performance score is below 90 and the
other three categories are 100. The separate approved deployed-preview target
of LCP below 1.8 seconds is **not verified**, because no preview could be
deployed without Vercel access.

## Functional and integration status

| Item | Status | Evidence / remaining work |
|---|---|---|
| Internal navigation | Pass | All public routes return 200; route focus, headings, and console errors are covered. |
| 404 | Pass | Intentional 404 status, semantic heading, responsive layout. |
| Express project link | Pass | `https://www.expresstradefinancing.ae` returned HTTP 200. |
| AASKRA project link | Safely removed | `www.aaskrarealestate.ae` did not resolve in DNS; no dead outbound action is published. Restore only after the owner confirms a reachable URL. |
| WhatsApp | Reachable | `wa.me/971567760667` returned the expected 302 redirect to WhatsApp. End-to-end messaging was not sent. |
| Booking | Temporary fallback | “Book a call” opens a prefilled WhatsApp conversation. Replace with the final Cal.com/Calendly URL. |
| Contact delivery | Not live | `RESEND_API_KEY` is absent. The UI truthfully reports non-delivery; no email was sent. Configure and verify sender/recipient in Preview and Production. |
| Analytics | Not live | `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is absent, so the analytics script is not rendered. |
| Robots and sitemap | Pass for placeholder | Both parse and list all routes, using the requested `https://techwiseiq.com` placeholder. |
| Open Graph/Twitter | Pass in code | All public routes emit image, title, description, and URL metadata. Validate share-card fetches again on the deployed origin. |
| Structured metadata | Pass in code | All emitted JSON-LD parses; service schema does not publish unapproved pricing. |
| Dependency advisories | Not closed | `npm install` reported 5 high-severity advisories. A production-only registry audit was not run because it would transmit the dependency/version manifest to npm without explicit owner approval. |

## Deployment status

- Preview URL: **not created**.
- Production URL: **not created**.
- Custom domain: `techwiseiq.com` is a non-resolving placeholder.
- Vercel state: CLI 57.0.0 found no credentials and requested interactive
  device authentication.
- Verified code commit before this report: `0bbed79`.
- Local production smoke: 45/45 focused checks passed on 26 July 2026.
- Deployment smoke/Lighthouse: not applicable until a preview exists.

No Vercel project was linked and no environment variable or external service
was modified.

## Remaining owner actions

Complete these in order:

1. Explicitly approve the production-only `npm audit --omit=dev` registry check,
   review the 5 reported high-severity advisories, and resolve any production
   exposure before publishing.
2. Authenticate the intended Vercel account/team, then confirm the Techwise IQ
   project before linking it.
3. Configure Preview and Production environment variables:
   `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`, and
   `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`.
4. Verify the Resend sending domain and authorize one labeled test inquiry;
   confirm delivery, reply-to, recipient, and no duplicate mail.
5. Supply the final Cal.com/Calendly booking URL or explicitly approve the
   WhatsApp fallback for launch.
6. Register/configure the final domain and DNS. If the final domain differs,
   update canonical, Open Graph, JSON-LD, robots, sitemap, Resend, and Plausible
   settings together.
7. Confirm that the public “reply within 24 hours” promise is operationally
   approved.
8. Complete physical-device sign-off on at least one current iPhone/Safari and
   one Android/Chrome device, including menu, form keyboard, WhatsApp handoff,
   screenshot scroller, and footer.
9. Deploy a public preview, rerun smoke tests, verify share-card fetches and
   Plausible, and measure the deployed priority-route LCP target.
10. Approve production only after the previous gates are recorded as passed.

## Go-live decision

**What is live now:** the two referenced third-party destinations that were
verified are Express Trade Financing and the WhatsApp redirect. The Techwise IQ
site itself is not publicly deployed.

**What is launch-ready in code:** all public page templates, the responsive
system, semantic structure, accessibility remediations, crawler/social
metadata, contact validation/recovery, and the deterministic verification
suite.

**What prevents completion:** no Vercel authentication or deployment, a
non-resolving placeholder domain, unverified production dependency advisories,
no Resend credentials/delivery proof, no Plausible configuration, no final
calendar URL, no owner confirmation of the 24-hour promise, and no
physical-device sign-off.

Decision: **do not call the site live yet.** Once the ordered owner actions are
completed, publish a Vercel preview, verify it, then promote that exact verified
build to production.
