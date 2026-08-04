# Vercel Deployment — Runbook & Pending Items (2026-08-04)

Purpose: get a live Vercel URL to show the client, and track the owner-controlled
items that make the site fully production-complete.

## Verification evidence (run 2026-08-04)

| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` | ✅ 0 errors |
| Production build | `npm run build` | ✅ exit 0 — 19 routes, all Static/SSG |
| Type check | via `next build` | ✅ passed |
| Unit tests | `npm run test:unit` | ✅ 13/13 pass |
| E2E tests | `npm run test:e2e` | ✅ 229 passed, 26 skipped |
| E2E flake note | see below | ⚠️ 1 transient dev-server 500 on `/`, **not reproducible** |

**E2E flake:** during the full 255-case parallel run, the dev server (Turbopack)
returned a one-off HTTP 500 on `/` under worker contention (accompanied by a
"worker did not exit within 300000ms, force-killed" teardown error). Re-running
`launch-smoke.spec.ts` with `--workers=1` passes 14/14. Production prerenders `/`
as static HTML (served from CDN), so this cannot occur in the deployed site. Not
a defect; no code change required.

## Deploy readiness — green

- No `vercel.json` needed; Next.js 16 auto-detected. `next.config.ts` is clean.
- All marketing pages are Static/SSG → CDN-served, fast, cheap.
- `metadataBase`, `sitemap.ts`, `robots.ts` all correctly use `https://techwiseiq.com`.
- Analytics (Plausible) and the Resend contact form both degrade gracefully when
  their env vars are unset — no crashes, no dead links.
- `.env*` is gitignored (only `.env.example` tracked); no secrets in the repo.

## Pending items (owner-controlled — do not block a client-preview deploy)

| Item | Effect if skipped | How to resolve |
|---|---|---|
| `RESEND_API_KEY` env var | Contact form shows a visible error; WhatsApp/email fallbacks still work | Set in Vercel → Settings → Environment Variables |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` env var | No analytics load | Set to `techwiseiq.com` in Vercel env |
| `CONTACT_FROM_EMAIL` / `CONTACT_TO_EMAIL` (optional) | Uses safe defaults | Optional overrides in Vercel env |
| Booking link | Routes to WhatsApp (no dead link) — see `TODO(Adi)` in `src/lib/site.ts` | Swap `BOOKING_URL` for real Cal.com/Calendly URL |
| Custom domain `techwiseiq.com` | Preview runs on `*.vercel.app` | Add domain + DNS in Vercel (needed before a *public* launch, not for a client preview) |
| `git push` | Vercel Git integration won't auto-deploy | Push branch (currently 118 commits ahead of `origin/main`) |
| Pin Node `engines` (optional) | Vercel uses current default Node | Add `"engines": { "node": "22.x" }` if reproducibility matters |

## Deploy runbook (Vercel CLI — fastest to a client-preview URL)

The CLI is installed (v58.5.1) but not authenticated in this environment, and
login is interactive. Run from `website/`:

```bash
# 1. Authenticate (interactive — run this yourself)
npx vercel login

# 2. Link the project (first time; creates .vercel/)
npx vercel link

# 3. Preview deploy → returns a shareable *.vercel.app URL for the client
npx vercel

# 4. (Optional) set env vars so the contact form + analytics work
npx vercel env add RESEND_API_KEY
npx vercel env add NEXT_PUBLIC_PLAUSIBLE_DOMAIN     # value: techwiseiq.com

# 5. Production deploy when ready
npx vercel --prod
```

Alternative: connect `github.com/adi-7192/TechwiseIQ` in the Vercel dashboard,
set the root directory to `website/`, add the env vars, then `git push` to
auto-deploy.

> Note: the git repo root is `website/`. Point Vercel's project root at this
> folder (the CLI does this automatically when run from here).
