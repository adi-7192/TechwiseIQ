# Techwise IQ Website — Decisions Log

> **Every agent reads [`ROADMAP.md`](ROADMAP.md), [`HANDOFF.md`](HANDOFF.md) and this file before doing anything.**
> Since D-028 the site is the **immersive redesign**; decisions marked superseded applied to the deleted Kinetic design.
> Decisions here are binding. They override older docs (`design-system.md`, `site-spec.md`,
> `build-plan.md`) where they conflict. To change one: get the owner's (Adi's) explicit approval,
> then mark the old entry **Superseded by D-xxx** and add a new entry — never edit history silently.
> Agents may *propose* decisions under "Open decisions"; only the owner ratifies them.

Format: **ID — Decision** · date · source · *how to apply*.

---

## Ratified decisions

### Brand, content, honesty

**D-001 — Kinetic design system is the visual language.** **Superseded by D-028 (immersive redesign).** 2026-06-12 · `design-system.md`
Tokens `--bone #F2F0E9`, `--ink #101010`, `--hot #FF4D00`, `--sun #FFD02F`, `--soft #66635B`, plus
`--ink-soft`, `--surface-open`. Fonts: Anton (display, uppercase), Archivo 500–700 (body), Space Mono
(labels) — no other families. 3px ink borders, hard unblurred shadows, **radius 0**, no decorative
gradients (nav fade exempt), no emoji in UI, no carousels on the main site.
*Apply:* use tokens from `globals.css`, never hardcode colours. The `design-guard.sh` hook checks this.

**D-002 — Honesty is absolute.** 2026-06-12 · `site-spec.md`, `product-manager.md`
No invented stats, clients, logos, testimonials, team sizes or case studies. Numbers shown must come
from `src/data/case-studies.ts`. Voice: direct, confident, short sentences. Banned words: empowering,
unlock, elevate, synergy, cutting-edge, seamless, revolutionize, "digital transformation", passionate about.
*Apply:* any claim like "live", "trusted by", "guarantee" needs a verifiable source or owner sign-off.

**D-003 — No public pricing on the site.** 2026-07-11 · changelog "Services experience redesign"
Removed from visible copy, FAQs, metadata and JSON-LD (`Offer`/`PriceSpecification`). Supersedes the
older "starting from ranges" direction in `site-spec.md`/`build-plan.md`.
*Apply:* do not add prices or `priceRange`. ⚠️ `public/llms.txt` still lists AED prices — see OD-1.

**D-004 — Contact details.** 2026-06-13 · changelog
Email `Info@techwiseiqtechnologies.ae`, WhatsApp `+971567760667`. Single source: `src/lib/site.ts`.
*Apply:* import from `site.ts`; render the email with the breakable pattern (`Info@<wbr />…`).

**D-005 — About page carries no person/founder/team claims.** 2026-07-17 · About spec
Supersedes the "founder note, signed" in `site-spec.md`. Trust claims stay qualitative.

**D-006 — Concept Lab is clearly labelled self-initiated work.** 2026-07-10 / 2026-07-28 · Work + Concept Lab specs
Concepts are never presented as client work. Standalone dependency-free HTML/CSS/JS in
`public/concepts/<slug>/`; Work-page preview is a decorative, non-focusable, `pointer-events:none`
iframe; the card link opens the demo in a new tab. Publish one concept at a time, only after its
spec + e2e pass (`status: 'published'` in `src/data/concept-sites.ts`).

**D-007 — Case studies are data-driven.** 2026-07-09 · changelog Phase 1
`src/data/case-studies.ts` is the only source for Work, case-study pages and proof links. Featured
cap of 3 cinematic projects on `/work`. Outbound "live site" links only when the URL resolves (AASKRA
link removed 2026-07-26).

### Interaction, motion, accessibility

**D-008 — One animation system: GSAP.** 2026-07-09 · changelog Phase 3
Reveals via `ScrollAnimator` (`data-animate`, `data-stagger`) or a page-scoped motion component
(`HomeMotion`, `WorkMotion`, `AboutMotion`, `ServiceMotion`). Animate transform/opacity only.
Every motion has a reduced-motion final state and a no-JS fallback (content server-rendered and
visible). Never write two systems to one element's `transform` — use wrapper elements.

**D-009 — One showpiece per page.** **Superseded by D-028 (immersive redesign): the WebGL scene + per-route ImmersiveShell scenes replace the per-page showpiece list.** 2026-06-12, updated 2026-07-11/17
Home: velocity skew on hero rows. About: the convergence sequence. Services: **none** (robot video
retired 2026-07-11). Work: cinematic project reel. New showpieces need owner sign-off and a
`design-system.md` update first.

**D-010 — Contrast rules.** 2026-07-09/10 · changelog
Small text on hot is always ink. Never hot-on-bone or sun-on-bone for body/small text. Accent words
in headings use ink + hot marker underline where hot fill fails 3:1. Logotypes are AT-hidden with
sr-only text.

**D-011 — Responsive conventions.** 2026-07-18 · `AGENTS.md`
Breakpoints 480 / 768 / 880 / 1024. Mandatory: breakable email/URL, hover-reveal behind
`(hover:hover) and (pointer:fine)`, 44px coarse-pointer targets (24px + spacing for dense mono link
lists — owner-approved), `100vh` + `100svh` fallback, root-cause every overflow (`clip` is a net).

**D-012 — Accessibility baseline.** 2026-07-26
WCAG 2.1 AA minimum; Lighthouse a11y 100 per route is the bar. One `h1` per route; route-change focus
to the heading (`RouteFocusManager`); visible 3px hot focus ring; decorative motion `aria-hidden`.

### Platform and integrations

**D-013 — Next.js 16 App Router, all routes static.** 2026-07-10
`cacheComponents`/instant navigation evaluated and **deferred** (breaks file-based metadata routes).
No `loading.tsx` (never renders on static routes). Read `node_modules/next/dist/docs/` before Next code.

**D-014 — Contact form never fakes success.** 2026-07-09 / 2026-07-26
Resend server action; missing key or failed send shows a visible error with email/WhatsApp fallbacks.
Server-side validation limits: name 100, email 254, company 160, message 5,000; approved budget
values only; honeypot suppresses silently; values preserved on error.

**D-015 — Booking falls back to WhatsApp** until a real calendar URL exists. 2026-07-09
`BOOKING_URL` in `src/lib/site.ts` (`TODO(Adi)`). No `href="#"` anywhere.

**D-016 — Analytics: Plausible only, gated on `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`.** 2026-07-10
No cookies, no PII — matches the privacy policy.

**D-017 — Canonical domain placeholder `https://techwiseiq.com`.** 2026-07-09
Do not describe it as live until DNS resolves. If the final domain differs, change canonical, OG,
JSON-LD, robots, sitemap, Resend, Plausible and `llms.txt` together.

**D-018 — Home composition is Hero + HomeExperience.** **Superseded by D-028 (immersive redesign): Home is ImmersiveHome.** 2026-07-13 / 2026-07-17 · Home specs
Replaces Manifesto, ServiceRows accordion, Ticker, Process and Shout sections (deleted). The shipped
Home uses more sun and ink than `design-system.md` §1 allows — approved by the 2026-07-13 spec;
the doc needs ratifying (OD-4).

### Process

**D-019 — Docs are kept current.** 2026-10-04
Every change: append to `docs/changelog.md`; update `HANDOFF.md` §4 + §6; new decisions here.

**D-020 — Agent pipeline.** 2026-06-12 · `.claude/agents/`
New page/section/feature: **product-manager** (spec + acceptance criteria) → **web-designer**
(layout/visual, before code) → **ui-specialist** (implementation) → **ux-specialist** (usability,
a11y, mobile) → **qa-engineer** (final gate, may fail work). External components only via
`/adapt-component`. Small tasks, one section at a time, frequent conventional commits.
Gate per task: `npm run lint`, `npm run build`, `npm run test:unit`, relevant e2e specs.

**D-021 — Home gets its own contact section; hero "Book a call" scrolls to it.** **Superseded by D-028 (immersive redesign): old Home deleted; redesign Home ends on its own CTA chapter.** 2026-10-04 · owner
The "04 / Your move" block becomes `id="contact"` with Book a call, WhatsApp, email and Enquiry.
Resolves OD-2.

**D-022 — `llms.txt` carries no prices.** 2026-10-04 · owner · confirms D-003, resolves OD-1.

**D-023 — The site is still being built.** 2026-10-04 · owner
The existing routes are the first version only. Agents propose where new things belong; the owner
decides scope. Never call the site complete or launch-ready.

**D-024 — Ponytail plugin governs how code is written.** 2026-10-04 · owner
`ponytail@ponytail` (github.com/DietrichGebert/ponytail, MIT, v4.10.3) is installed at **project
scope**: marketplace + `enabledPlugins` in `.claude/settings.json`, so every session and subagent in
this repo loads it. Reviewed before install: its hooks only inject rules and write small flag files
under `~/.claude`; no network or shell execution.
*Apply:* default mode `full`. Write the least code that works, reuse what exists (tokens, `site.ts`,
data modules, existing components) before adding anything. Run `/ponytail-review` on every diff before
committing; use `/ponytail-audit` for ROADMAP 6.4 hygiene; `/ponytail-debt` collects any
`ponytail:` shortcut comments. **Precedence:** D-001…D-023 win over ponytail: never cut accessibility,
reduced-motion/no-JS fallbacks, validation, honesty rules, tests, the agent pipeline or the Kinetic
design language in the name of brevity. A native control replaces a custom one only if it can meet
the design system.

**D-025 — No proof band on Home.** **Superseded by D-028 (immersive redesign): the owner-built redesign Home has a "Real projects, shipped" section — the redesign wins.** 2026-10-04 · owner · resolves OD-9.
Home does not get the 2-case-study proof band (H-3). Proof stays on `/work` and the case-study pages.
*Apply:* ROADMAP 2.1 is dropped; don't re-propose without new real case studies.

**D-026 — Case-study page structure + shared contact section.** **Superseded by D-028 (immersive redesign): the redesign has its own editorial case-study page; ContactSection was old-design only. AASKRA honesty wording still applies.** 2026-10-04 · owner (6.2 questions)
`/work/[slug]` has 5 parts: hero with facts row → one visual (full-page scroller if present, else
cover — never both) → The brief → What we did (numbered) + stack → The result + stats → shared
`ContactSection`. "What we delivered" is not shown (data field kept). AASKRA copy no longer implies
a live site ("built to carry…"). AASKRA screenshots stay until the owner supplies a Vercel link to
recapture from.
*Apply:* final contact block on any page = `src/components/ContactSection` (one `#contact` per page).

**D-027 — "Reply within 24 hours" is approved.** 2026-10-04 · owner · resolves OD-7.
The public promise on `/contact` (intro, metadata, "What happens next", success message) stands.
*Apply:* keep the wording consistent wherever it appears; it is a launch-gate item no longer.

**D-028 — The immersive redesign is the site.** 2026-10-04 · owner
`redesign/immersive-system` is the primary work; all changes land on it. The old Kinetic UI is
deleted (archived at git tag `archive/old-design-2026-10-04`, never pushed). Visual rules:
`docs/design-system.md` ("Immersive") and the redesign handoff in
`../techwise-iq-build-handoff/` (outside the repo). Content/data/honesty decisions above
(D-002–D-007, D-010–D-017, D-019–D-024, D-027) still apply.
*Apply:* never reintroduce Anton, bone/ink/hot, or any deleted Kinetic component.

**D-029 — `main` is protected; every change goes through a PR with green CI.** 2026-10-04 · owner
(asked for CI/CD and the merge) · Required checks: "Lint, types, unit, build" and "E2E
(Playwright, production build)". No required reviews (solo developer); admins can override in an
emergency; force-push and deletion of `main` are blocked. Merges to `main` deploy via Vercel.
*Apply:* one task = one branch off `main` → PR → merge after both checks pass.

---

## Open decisions (need owner — do not resolve on your own)

| ID | Question | Recommended default | Blocks |
|---|---|---|---|
| ~~OD-1~~ | **Resolved → D-022.** `public/llms.txt` publishes AED starting prices, contradicting D-003. Remove, or reverse D-003? | Remove prices; keep llms.txt factual otherwise. | HANDOFF §4 item 3 |
| ~~OD-2~~ | **Resolved → D-021.** Home hero "Book a call": go straight to booking (`BOOKING_URL`) or scroll to the "04 / Your move" section? | Scroll to the Home contact section (chosen). | H-1 |
| OD-3 | About: "Trusted by businesses in Dubai and beyond" — acceptable with two published clients? | Soften to a verifiable line (e.g. "Building for businesses in Dubai and beyond"). | — |
| ~~OD-4~~ | **Obsolete (Kinetic only, D-028).** Ratify Home's colour use (sun 5+×, 3 ink sections) into `design-system.md`, or pull Home back to the written budget? | Ratify — it is shipped and spec-approved. | design-system.md refresh |
| OD-5 | Delete dead components, robot video/poster, `src/check-hero.mjs`? | Delete (all verified unimported except check-hero, a one-off script). | Hygiene |
| OD-6 | "Book a call" opening WhatsApp: supply a calendar URL, or relabel? | Supply Cal.com URL; otherwise relabel "Book via WhatsApp". | H-4 |
| ~~OD-7~~ | **Resolved → D-027 (approved).** Approve the public "reply within 24 hours" / "Response guarantee" promise. | Owner confirms operationally. | Launch |
| OD-8 | One primary-CTA verb site-wide (currently 4 variants). | "Book a call" primary, "Start a project" for the form route. | H-5 |
| ~~OD-9~~ | **Resolved → D-025 (no).** Add a proof band (2 case studies) to Home, per `site-spec.md`? | Yes — compact, data-driven. | H-3 |
| OD-10 | Concept demos load media from `figma.site`, CloudFront, `images.higgs.ai` and Google Fonts. Self-host, or accept the dependency? | Self-host media + fonts (availability, privacy-policy consistency, licence clarity). | Work reliability |
| OD-11 | Is there a real internal automation or client software/AI project to write up as a case study? | Yes if one exists — biggest proof gap. | ROADMAP 2.2 |
| OD-12 | Show a founder name, photo and signed note on About (reverses D-005)? | Yes — strongest trust signal for a new agency. | ROADMAP 4.1 |
| OD-13 | Which engagement models do we sell (e.g. discovery sprint → fixed-scope build → retainer)? | Those three, no prices. | ROADMAP 3.1 |
| ~~OD-15~~ | **Obsolete (Kinetic only, D-028).** Services pages ship circular number markers (`border-radius: 50%`, ~8 files) against D-001 "radius 0". Log an exception for process-number circles, or square them? Case-study markers are square for now. | Square them (D-001 is explicit; circles were never ratified). | Consistency |
| OD-14 | Which first-step offer (free 20-min bottleneck review / website + automation audit)? | Free 20-min bottleneck review. | ROADMAP 5.1 |
