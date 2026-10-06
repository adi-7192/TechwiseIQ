# Techwise IQ Website — Agent Handoff

> **Every agent reads [`ROADMAP.md`](ROADMAP.md) (where to start + progress), this file, and [`DECISIONS.md`](DECISIONS.md) before doing anything.**
> When you finish a task: update §4, add a line to §6, log new decisions in `DECISIONS.md`.
> If this file disagrees with the code, the code wins — fix this file.

**Last updated:** 2026-10-06 · **Branch:** `main` (redesign merged in PR #1, D-028) ·
`main` is protected — work on a branch, open a PR, merge when CI is green (D-029).

---

## 1. Where the project is

The site is the **immersive redesign** (dark technical world, Manrope/Archivo/Space Mono, WebGL
scene, per-route accent). The old "Kinetic" design is **deleted** from the code; it is archived at
the local git tag `archive/old-design-2026-10-04` for reference only — never build on it.

The site is **still being built** (D-023) and **not deployed**. The redesign's own release
checklist (preview review → content parity → final Lighthouse → form test → merge to `main`) is
folded into ROADMAP stage 7. Design source: `docs/design-system.md` + the redesign handoff at
`../techwise-iq-build-handoff/` (outside this repo: `TASKS.md`, `docs/00–11`).

## 1a. CI / CD

- **CI** (`.github/workflows/ci.yml`, every PR + push to `main`, Node 24): "Lint, types, unit,
  build" and "E2E (Playwright, production build)". Both are required on `main`. Playwright retries
  twice on CI; traces uploaded on failure. GitGuardian also scans PRs.
- **CD:** Vercel is linked to the repo — every PR gets a preview, every merge to `main` deploys to
  production. Deployments are behind Vercel Deployment Protection (Vercel login) until launch.
  Domain, env vars and Resend are still owner launch gates.

## 2. Verified state (2026-10-05, production build, this checkout)

| Check | Result |
|---|---|
| `npm run lint` · `npx tsc --noEmit` · `npm run test:unit` | ✅ · ✅ · ✅ 13/13 |
| `npm run build` | ✅ all routes static/SSG |
| Full e2e (`PW_BASE_URL=… npx playwright test`) | ✅ 359 pass, 26 skipped by design (baseline capture), 2026-10-05. Known flakes fixed (ROADMAP 7.6). |
| Lighthouse mobile | 2026-10-05, 18 routes: a11y/BP/SEO 100 everywhere. Perf: Home 91, others 92–94, `/work` **89** locally (gzip; check on Vercel preview, ROADMAP 7.1). |
| Overflow / one h1 per route | ✅ 0 px at 390 and 1440; one h1 everywhere |

Run locally: `npm ci`, `npx playwright install chromium` (the config uses Playwright's pinned
Chromium, not system Chrome), `npm run dev`. E2E against a running server: `PW_BASE_URL=…`.

## 3. Audit of the redesign — 2026-10-04

Severity: **P0** broken/misleading · **P1** hurts conversion/trust · **P2** polish.

| ID | Sev | Where | Finding | Fix |
|---|---|---|---|---|
| R-1 ✅ | P1 | `/contact` (`src/app/contact/page.tsx`) | Intro + metadata promise "scope, timeline, and cost … within 24 hours", but scope needs a call first — the page contradicts itself. "Response guarantee" box; no "what happens next". | Same fix as the old design's 3.2 (PM-approved): "reply within 24 hours, then a written scope after a short call" + 3 steps, in redesign styling. 24 h approved (D-027). |
| R-2 ✅ | P1 | Home | Lighthouse mobile perf 84, LCP 4.4 s (bar ≥90). Other routes 91–95. | Profile LCP element (likely hero/WebGL/intro overlay); keep the 2026-09-05 entrance work intact. |
| R-3 ✅ | P2 | `/services/*` `ServiceWorkbench` | Mock "site" text in the workbench illustration fails contrast (1.37:1, #F3F3ED on #D1D1CC). a11y 96. | Darken the mock text or mark the purely decorative mock `aria-hidden` and keep real text out of it. |
| R-4 ✅ | P2 | Header logo, WhatsApp float | `label-content-name-mismatch`: "Techwise IQ — home" vs visible "TECHWISEIQ"; "Chat on WhatsApp" vs visible "WhatsApp ↗"/"WA". Tests pin these labels. | Labels that start with the visible text (e.g. "TechwiseIQ home", "WhatsApp — chat"); update the tests. Owner OK needed for label text (Q14). |
| R-5 | P1 | `/about` | "Trusted by businesses in Dubai and beyond" — honesty check pending (Q5). | Owner wording. |
| R-6 | P2 | Site-wide | CTA verbs: "Start a project", "Discuss your project", "Start the conversation", "Bring us the problem." (Q6). | One primary verb. |
| R-7 ✅ | P2 | `src/components/proof/*`, `immersive/home/Chapter*`, `FinalCta`, `immersive/index.ts` | Redesign components no route imports (parked?). | Owner: keep for later or delete (Q15). |
| R-8 ✅ | info | `/work` Concept Lab | Demos still hotlink third-party media/fonts (Q8). | Self-host if approved. |

Fixed during this re-audit: ETF cover was captured mid-animation (faded headline) → replaced;
AASKRA/ETF screenshots without cookie banners; `llms.txt` without prices.

## 4. Remaining work

Live list, order and progress: **[`ROADMAP.md`](ROADMAP.md)**.
Owner launch gates (unchanged): Vercel auth + preview, env vars (`RESEND_API_KEY`,
`CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`), Resend domain + test
inquiry, booking URL, domain/DNS, real-device sign-off, `npm audit` review, production promote.

## 5. Doc map

| Doc | Status |
|---|---|
| `docs/ROADMAP.md`, this file, `docs/DECISIONS.md` | **Current** (rebuilt for the redesign 2026-10-04). |
| `docs/design-system.md` | Current — "Immersive" system. |
| `docs/changelog.md` | Current history, newest first. |
| `docs/case-study-drafts-2026-10-04.md` | Drafts for 3 new case studies — waiting on owner facts (Q13). |
| `../techwise-iq-build-handoff/` | Redesign source docs + `TASKS.md` (outside repo). |
| `docs/site-spec.md` | **Current** — routes and required content (rewritten 2026-10-05). |
| `docs/specs/*` | Current specs (5.1, 5.2). |
| `docs/build-plan.md`, `docs/superpowers/*`, old reviews | Historical — banner at the top of each says so. |
| `docs/vercel-deployment-2026-08-04.md`, `docs/launch-readiness-report-2026-07-26.md` | Launch-gate steps still valid. |

## 6. Session log (newest first)

- **2026-10-06** — Home review → three hero prototypes (`proto/hero-variations`: A liquid shader,
  B three.js skyline, C kinetic type); owner chose B (D-038). Ported on `feat/skyline-hero` into the
  existing engine with the performance contract in `design-system.md` "Hero skyline". Gate green,
  full e2e on a production build, Lighthouse mobile Home perf 92/95/93, LCP 2.9–3.2 s (was 91 / 3.5 s).
  Earlier prototypes (`proto/living-field`, `proto/assembling-interface`) were declined/superseded.

- **2026-10-05** — Stage 7 on `stage-7/release`. 7.1: gate + full e2e green (359 pass, twice);
  Lighthouse mobile on 18 routes — a11y/BP/SEO 100, perf 91–94, `/work` 89 (HTML weight; brotli on
  Vercel should clear it — check in 7.2). Parity vs `src/data/*` clean. 7.6: last CI flake
  (TerraElix preview after reload) fixed with `scrollIntoViewHeld`. Run Lighthouse with system
  Chrome: Playwright's Chrome for Testing returns NO_FCP headless.

- **2026-10-05** — Stage 6 (Polish) on `stage-6/polish`. 6.2: deleted 20 unreachable files found by
  an import-graph scan from every route + test (exactly the R-7 list) and dead chapter copy. 6.1:
  Concept Lab media + fonts self-hosted (re-encoded, visually identical frame check); new no-third-
  party e2e. 6.3: `site-spec.md` rewritten from code; historical banners on old docs.

- **2026-10-04** — 5.2 Insights built (D-037) through the pipeline: PM → design → UI → UX PASS → QA
  PASS (Lighthouse a11y/BP/SEO 100 on `/insights` + an article; citations, JSON-LD, wording diff vs
  drafts all verified). Full e2e 358 pass on a prod build. Owner then confirmed both [OWNER] claims (shipped). Open for owner:
  body h2 same size as body text (design Q1); floating Chat pill covers text at 390 (site-wide).

- **2026-10-04** — 5.2: owner asked for researched articles. 6 drafts with cited sources in
  `docs/insights-drafts-2026-10-04.md` (sites, ownership, spreadsheets, build/buy, AI, AI search).
  Reddit is blocked to our research tools; community voices from Hacker News + UK Business Forums.
  Lines about us are marked [OWNER]. Nothing built yet.

- **2026-10-04** — Stage 5 (Growth) on `stage-5/growth`: 5.1 `/bottleneck-review` through the full
  pipeline (PM → design → UI → UX PASS → QA; QA failed once on a missing subject unit test, fixed).
  Owner answered the PM's questions → D-036. Spec: `docs/specs/5.1-bottleneck-review.md`. Full e2e
  332 pass on a prod build. UX nice-to-haves left for the owner: budget is required even for the free
  review; floating Chat pill covers text at 390 (site-wide); duplicate error announcement on forms.

- **2026-10-04** — Stage 4 (Trust) on `stage-4/trust`, branched off `stage-3/clarity` (PR #6 still
  open). 4.1/4.2/4.4 done, 4.3 CTA unified ("Bring us the problem" → `/contact`); voice rewrite is a
  draft in `docs/voice-draft.md` awaiting owner. Read of D-032 Q7: "WhatsApp only from the WhatsApp
  button" = no in-page WhatsApp CTA buttons; footer link and `/contact` method kept as contact
  details (owner to confirm). Gate green; full e2e on a prod build 320 pass, 1 known flake (7.6
  playback). Dev-server `networkidle` on `/work` times out — run e2e against `next start`.
  Owner approved voice rows 1–12, then asked for the same voice everywhere (plain words, witty,
  highlighted key words). Round 2 applied on the branch for review in the browser; full e2e green
  (319 pass) on a prod build.

- **2026-10-04** — Stage 3 (Clarity) on `stage-3/clarity`. "How we engage" replaces the generic
  delivery section on `/services` (same layout, D-032 model, no prices) + a short line and link on
  `/contact`; `llms.txt` aligned. Small reuse of an existing section, so built directly rather than
  through the full agent pipeline. Gate green; 180 services/contact/a11y/responsive e2e pass.
  Owner then gave the real process (D-033): requirements → several options/designs → client
  chooses → we build; copy reworked around "You decide. We deliver." on overview, service
  journeys and contact. Copy needs owner OK before merge.

- **2026-10-04** — Stage 2 (Proof) on `stage-2/proof`, one PR (D-030). Owner answered every open
  question → D-032. Three case studies added (facts verified on the live sites; RSiGHT gets no
  SEO/security claims — it has none). Agent pipeline (PM → design → UI → UX → QA PASS) built "More
  client work", preview links/status, case accents (Supreme acid, EP orange, RSiGHT blue) and the
  own-automation section on `/services/ai`. Owner copy calls: "Built. Not launched yet."; ETF
  "The client reports enquiries from 25+ countries." Open: Cal.com URL (Q7b).

- **2026-10-04** — Stage 1 complete on `perf/home-lcp` (PR #4, one PR per stage — D-030).
  1.3: `/services/*` a11y 100 — workbench dim floor 0.15 → 0.6, automation accent lightened via
  `color-mix` in `ImmersiveShell`, `/services/ai` fork dims by colour. 1.4 (D-031): logo "TechwiseIQ
  home", WhatsApp "WhatsApp — chat", phone text "Chat ↗". Lighthouse a11y/BP/SEO 100 on all 12
  routes (Home a11y once read 95 mid-entrance, 100 ×3 on re-run).

- **2026-10-04** — ROADMAP 1.2 / R-2 closed without a code change: Home Lighthouse mobile perf
  90/90/90 in three sequential uncontended runs (LCP 3.5 s, TBT ≤10 ms). LCP element is the intro
  overlay's "Think. Build. Move." text; real LCP = FCP under throttled network. Lighthouse on a busy
  machine reads far lower (54 and 84 seen) — run it alone, never alongside builds or e2e.

- **2026-10-04** — ROADMAP 1.1 / R-1 done: `/contact` intro + metadata now promise a reply within
  24 hours, then a written scope after a short call. "Response guarantee" box → "What happens next"
  (We reply · 20-minute call · Written scope), repeated under the success message, which takes
  focus. Ported from the approved old-design fix (`abefc9c`) in Immersive tokens. New e2e test;
  lint/tsc/unit/build green, 170 contact/a11y/responsive/smoke e2e pass.

- **2026-10-04** — PR #1 merged (`5e00dce`): redesign + carried fixes + CI on `main`. CI green on
  `main`; Vercel production deployment succeeded (protected URL). Branch protection on `main`
  requires both CI checks. Local `main`, `redesign/immersive-system` and this worktree synced.

- **2026-10-04** — Discovered the day's roadmap work had been done on the old Kinetic design (the
  worktree branched from `main`, which never got the redesign). Owner: redesign is primary (D-028).
  Committed the owner's uncommitted redesign WIP (`0481568`, `heroprompt` left untracked), archived
  the old-design commits at tag `archive/old-design-2026-10-04`, reset this branch onto the redesign,
  carried over content/data/test/doc fixes, deleted all unreachable Kinetic UI, fixed a stale
  `/services` accent test and the faded ETF cover, re-audited the redesign (§3) and rebuilt the
  roadmap. 277 e2e pass.
