# Techwise IQ Website — Agent Handoff

> **Every agent reads [`ROADMAP.md`](ROADMAP.md) (where to start + progress), this file, and [`DECISIONS.md`](DECISIONS.md) before doing anything.**
> When you finish a task: update §4, add a line to §6, log new decisions in `DECISIONS.md`.
> If this file disagrees with the code, the code wins — fix this file.

**Last updated:** 2026-10-04 · **Branch:** `main` (redesign merged in PR #1, D-028) ·
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

## 2. Verified state (2026-10-04, production build, this checkout)

| Check | Result |
|---|---|
| `npm run lint` · `npx tsc --noEmit` · `npm run test:unit` | ✅ · ✅ · ✅ 13/13 |
| `npm run build` | ✅ all routes static/SSG |
| Full e2e (`PW_BASE_URL=… npx playwright test`) | ✅ 277 pass, 26 skipped by design (baseline capture). Two timing-sensitive tests (`home-experience` playback, `performance-mobile` CLS) can flake under full parallel load and pass alone. |
| Lighthouse mobile | a11y/BP/SEO 100 on every route (R-3 fixed 2026-10-04). Perf: Home **90** (3 sequential uncontended runs, LCP 3.5 s — the earlier 84 was a loaded-machine reading, R-2), others 91–95. |
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
| R-7 | P2 | `src/components/proof/*`, `immersive/home/Chapter*`, `FinalCta`, `immersive/index.ts` | Redesign components no route imports (parked?). | Owner: keep for later or delete (Q15). |
| R-8 | info | `/work` Concept Lab | Demos still hotlink third-party media/fonts (Q8). | Self-host if approved. |

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
| `docs/site-spec.md`, `docs/build-plan.md`, `docs/superpowers/specs/2026-06…08-*` | Written for the Kinetic design — historical. Honesty rules and sitemap still valid. |
| `docs/vercel-deployment-2026-08-04.md`, `docs/launch-readiness-report-2026-07-26.md` | Launch-gate steps still valid. |

## 6. Session log (newest first)

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
