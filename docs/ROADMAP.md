# Techwise IQ Website — Build Roadmap & Progress Tracker

> **New session? Start here.** Read this file → `docs/HANDOFF.md` → `docs/DECISIONS.md`.
> The site is the **immersive redesign** (D-028) and still being built (D-023).
> Work on the task in **▶ NEXT**. One task = one branch off `main` → PR → both CI checks green → merge (D-029).

---

## ▶ NEXT

**Stage 5 PR #8 open (`stage-5/growth`) — owner checks `/bottleneck-review` and `/insights` in the preview, then merges.**
Then: Stage 6.3 docs (6.1 Concept Lab self-hosting and 6.2 parked-component deletion are answered in D-032).

## Progress

**13 / 22 tasks done** · rebuilt for the redesign 2026-10-04

| Stage | Goal | Done | Status |
|---|---|---|---|
| 1. Fixes | Audit findings on the redesign (HANDOFF §3) | 4/4 | ✅ |
| 2. Proof | More real work where buyers decide | 2/2 | ✅ |
| 3. Clarity | How working with us works | 1/1 | ✅ (PR #6 merged) |
| 4. Trust | Honest claims, people, consistent CTAs, booking | 3/4 | 🟡 (voice draft awaiting owner; Cal.com later) |
| 5. Growth | First-step offer, insights | 2/2 | ✅ (PR #8 open) |
| 6. Polish | Concept Lab self-hosting, parked components, docs | 0/3 | ⬜ |
| 7. Release | Redesign release checklist → merge to `main` | 1/6 | 🟡 (7.3+ 🔒 owner) |

Legend: ⬜ to do · 🟡 in progress · ✅ done · 🔒 blocked on owner · ⏸ held.

### How to update this file
Starting → 🟡. Done → ✅ + date + short hash. Update counts and ▶ NEXT. Add a line to
`HANDOFF.md` §6 and `changelog.md`; new decisions → `DECISIONS.md`.

---

## Waiting on Adi

| Q | Question | Unblocks |
|---|---|---|
| Q7b | Cal.com booking URL (until then "Book a call" → `/contact`, D-032) | 4.4 final |

All other questions answered 2026-10-04 → D-032.

## Standard gate (every task)

`npm run lint` · `npx tsc --noEmit` · `npm run build` · `npm run test:unit` · relevant e2e (full
suite before release) · screenshots at 390 + 1440 · no overflow 320–1440 · reduced-motion + no-JS
show all content · `AGENTS.md` patterns · `/ponytail-review` on the diff (D-024) · docs updated.
New section/page → full agent pipeline (D-020). Visual work follows `docs/design-system.md`
(Immersive) — never Kinetic (D-028).

---

## Stage 1 — Fixes

- ✅ **1.1 `/contact` honest promise + next steps** (R-1, D-027) — 2026-10-04, branch `fix/contact-honest-promise` — `src/app/contact/page.tsx`,
  `ContactForm.tsx`: intro/metadata → "reply within 24 hours, then a written scope after a short
  call"; replace "Response guarantee" with "What happens next" (We reply · 20-minute call · Written
  scope), repeated under the success message with focus on it. Redesign styling only.
- ✅ **1.2 Home LCP** (R-2) — 2026-10-04, verified, no code change. Three sequential uncontended
  Lighthouse mobile runs: perf 90/90/90, LCP 3.5 s, TBT 0–10 ms (matches the 91 after the
  2026-09-05 entrance work). The 84 was measured on a loaded machine. Headroom is thin: the LCP
  element is the intro overlay text; any further gain must keep the entrance work intact.
- ✅ **1.3 Service workbench contrast** (R-3) — 2026-10-04. `/services/*` a11y 96 → 100. Three causes:
  workbench loop dimmed pieces to opacity 0.15 (floor now 0.6 = 4.78:1); automation-scene accent
  is now violet mixed 12% toward fg (4.9:1 on surface); `/services/ai` fork dims the inactive
  branch by colour, not opacity.
- ✅ **1.4 Accessible names match visible text** (R-4, D-031) — 2026-10-04. "TechwiseIQ home",
  "WhatsApp — chat", phone text "WA" → "Chat"; tests updated.

## Stage 2 — Proof

- ✅ **2.1 Three new case studies** (D-032) — 2026-10-04, `stage-2/proof`. Supreme Universal, Express
  Petroleum (featured with ETF), RSiGHT (awaiting launch) + AASKRA under "More client work" with
  labelled Vercel previews (`previewUrl`). /work totals count live sites only. Sitemap derives from
  data; `llms.txt`, Home, `/services/web` proof updated. Facts checked against the live sites.
- ✅ **2.2 Automation proof** (D-032) — 2026-10-04. "What we automate for ourselves" on
  `/services/ai` (own use, not client work; owner confirmed the human-review lines).

## Stage 3 — Clarity

- ✅ **3.1 "How we engage"** (D-032, D-033) — 2026-10-04, `stage-3/clarity`. `/services` section 03
  (was "How it comes together") → `#engage` "You decide. We deliver.": requirements → options
  with our recommendation → you choose (scope + price in writing) → we build your choice. Same
  pattern in each service's 4-step journey (web: design options; software: solution options; AI:
  workflow/tool options) and the `/contact` steps. `/contact` "What happens next" gains
  a no-packages line linking to it. `llms.txt` process → the same model (dropped "discovery
  sprint"/"retainer" products). No prices (D-003).

## Stage 4 — Trust

- ✅ **4.1 About claim** (Q5, R-5) — 2026-10-04, `stage-4/trust`. "Trusted by…" → "Building for
  businesses in Dubai and beyond, turning important ideas into working digital products."
- ✅ **4.2 People on About** (Q2) — 2026-10-04. Hero: "Techwise IQ is a team of experts…". No names (D-005).
- 🟡 **4.3 CTA vocabulary + voice** (rows 1–12 approved + shipped; round 2 site-wide rewrite on branch, owner review) (Q6, R-6) — CTA done 2026-10-04: every primary CTA (header, mobile
  nav, Home, /services, service pages, /work, case studies, About) reads "Bring us the problem" →
  `/contact`. Voice rewrite drafted in `docs/voice-draft.md` — 🔒 owner approval before shipping.
- ✅ **4.4 Booking** (Q7) — 2026-10-04. `BOOKING_URL` (a WhatsApp link) removed; no in-page WhatsApp
  or "Book a call" buttons — WhatsApp is the floating button (+ footer and `/contact` contact
  details). Cal.com later (Q7b): add a `BOOKING_URL` in `src/lib/site.ts`.

## Stage 5 — Growth

- ✅ **5.1 First-step offer page** (Q4, D-036) — 2026-10-04, `stage-5/growth`. `/bottleneck-review`:
  free 20-minute review (same call as `/contact` step 2), no written deliverable. Reuses
  `ContactForm` (`review` prop → hidden `inquiry=review`, own email subject). Linked from the
  `/contact` intro and `/services` #engage only. Full agent pipeline; QA Lighthouse a11y/BP/SEO 100.
- ✅ **5.2 Insights** (D-037) — 2026-10-04, `stage-5/growth`. Six researched, sourced articles
  (drafts: `docs/insights-drafts-2026-10-04.md`, spec: `docs/specs/5.2-insights.md`). `/insights` +
  `/insights/[slug]` from `src/data/insights.ts`; Article JSON-LD, byline "Techwise IQ team";
  footer link + "Worth a read" on each service page. Both [OWNER] claims confirmed and shipped.

## Stage 6 — Polish

- 🔒 **6.1 Concept Lab self-hosting** (Q8, R-8).
- 🔒 **6.2 Parked components** (Q15, R-7).
- ⬜ **6.3 Docs** — mark `site-spec.md` / old specs historical in place; update `site-spec.md`
  Home/Work/About/Contact sections to the redesign.

## Stage 7 — Release (from the redesign's `TASKS.md`)

- ⬜ **7.1 Full verification** — full e2e, Lighthouse mobile per route (≥90 perf, 100 a11y/BP/SEO),
  content parity review (facts vs `src/data/*`).
- 🔒 **7.2 Preview review** — owner reviews the Vercel deployment (protected: sign in to Vercel).
- 🔒 **7.3 Production form test** — Resend env + test inquiry.
- ✅ **7.4 Merge to `main`** — 2026-10-04, PR #1 (`5e00dce`). CI added (`.github/workflows/ci.yml`),
  `main` protected (both checks required). Vercel deploys `main` to production automatically.
- ⬜ **7.6 De-flake e2e tests** — `home-experience` "playback pauses on demand…" passes only on
  retry in CI; `performance-mobile` long-task budget (<200 ms) depends on host load. Fixed
  2026-10-04: `performance-mobile` canvas test used a native `scrollTo` that Lenis overrode on CI
  (trace showed the page never left #selected-work) — now retries the jump until it holds.
  Same cause fixed 2026-10-04 in `work-page` "TerraElix live preview … reduced motion": 400 ms after
  `scrollTo(0,0)` the page was still 77–477 px down mid-Lenis-scroll; now waits for scrollY 0.
- 🔒 **7.5 Production smoke + launch gates** — domain/DNS, real devices, promote.

## Later / rejected

- Later: industry pages (2+ projects per industry), Arabic `/ar/*`.
- Rejected: public `/pricing` (D-003); stats/logo strips/testimonials without verifiable data (D-002).
