# Techwise IQ Website — Build Roadmap & Progress Tracker

> **New session? Start here.** Read this file → `docs/HANDOFF.md` → `docs/DECISIONS.md`.
> The site is the **immersive redesign** (D-028) and still being built (D-023).
> Work on the task in **▶ NEXT**. One task = one branch off `main` → PR → both CI checks green → merge (D-029).

---

## ▶ NEXT

**Stage 1 is done** (one PR for the stage, D-030). Stages 2–5 are blocked on owner answers;
the unblocked work left is Stage 6.3 (docs) and Stage 7.1 / 7.6 (verification, de-flake).

## Progress

**5 / 22 tasks done** · rebuilt for the redesign 2026-10-04

| Stage | Goal | Done | Status |
|---|---|---|---|
| 1. Fixes | Audit findings on the redesign (HANDOFF §3) | 4/4 | ✅ |
| 2. Proof | More real work where buyers decide | 0/2 | 🔒 Q13, Q1 |
| 3. Clarity | How working with us works | 0/1 | 🔒 Q3 |
| 4. Trust | Honest claims, people, consistent CTAs, booking | 0/4 | 🔒 owner input |
| 5. Growth | First-step offer, insights | 0/2 | 🔒 Q4 / held |
| 6. Polish | Concept Lab self-hosting, parked components, docs | 0/3 | ⬜ (6.1, 6.2 🔒) |
| 7. Release | Redesign release checklist → merge to `main` | 1/6 | 🟡 (7.3+ 🔒 owner) |

Legend: ⬜ to do · 🟡 in progress · ✅ done · 🔒 blocked on owner · ⏸ held.

### How to update this file
Starting → 🟡. Done → ✅ + date + short hash. Update counts and ▶ NEXT. Add a line to
`HANDOFF.md` §6 and `changelog.md`; new decisions → `DECISIONS.md`.

---

## Waiting on Adi

| Q | Question | Unblocks |
|---|---|---|
| Q1 | A real automation / software / AI project to write up? | 2.2 |
| Q2 | Founder name, photo and signed note on About? (reverses D-005) | 4.2 |
| Q3 | Which engagement models do we sell? | 3.1 |
| Q4 | Which first-step offer? | 5.1 |
| Q5 | About: replacement for "Trusted by businesses in Dubai and beyond" | 4.1 |
| Q6 | One primary CTA verb site-wide | 4.3 |
| Q7 | Real Cal.com/Calendly URL, or relabel "Book via WhatsApp"? | 4.4 |
| Q8 | Self-host Concept Lab media/fonts? | 6.1 |
| Q13 | Facts for the 3 new case studies (`docs/case-study-drafts-2026-10-04.md`), which 3 are featured, AASKRA Vercel link yes/no | 2.1 |
| Q15 | Parked redesign components (`proof/*`, `immersive/home/Chapter*`, `FinalCta`): keep for later or delete? | 6.2 |

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

- 🔒 **2.1 Three new case studies** (Q13) — Express Petroleum, Supreme Universal (live), RSiGHT
  (client work, "Awaiting launch", no public link). Clients consented; Express Petroleum ↔ ETF
  linked. Drafts + screenshots ready. Build in the redesign's editorial case-study format; update
  `/work`, Home proof, sitemap, `llms.txt`, JSON-LD, tests. Full pipeline.
- 🔒 **2.2 Automation / software case study** (Q1).

## Stage 3 — Clarity

- 🔒 **3.1 "How we engage"** (Q3) — `/services` + short version on `/contact`. No prices (D-003).

## Stage 4 — Trust

- 🔒 **4.1 About claim** (Q5, R-5) · 🔒 **4.2 People on About** (Q2) ·
  🔒 **4.3 CTA vocabulary** (Q6, R-6) · 🔒 **4.4 Booking** (Q7).

## Stage 5 — Growth

- 🔒 **5.1 First-step offer page** (Q4).
- ⏸ **5.2 Insights** — held until 2–3 real articles exist.

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
