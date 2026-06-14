# PM Review — Home Page (`/`)
**Date:** 2026-06-13
**Reviewer:** Product Manager agent
**Scope:** Current build vs. approved site-spec and copy rules. No invented content check. No code review.

---

## Section-by-Section Verdict

| Section | Status | Notes |
|---|---|---|
| Hero (kinetic rows + claim card) | WARNING | Copy concern — see below |
| Manifesto | APPROVED | Voice clean, no banned words |
| ServicesSection (accordion) | WARNING | No path to service detail pages |
| Ticker | WARNING | Trust claims are `aria-hidden` |
| ProcessSection | APPROVED | Copy clean |
| ShoutSection | APPROVED | Strike-through reveal correct |
| CaseStudySection | MISSING | Not imported in page.tsx; spec requires it between Shout and CTA |
| CTASection | BLOCKER | WhatsApp + booking links are `href="#"` |
| Footer | Not reviewed | — |

---

## 1. Launch Blockers

### CTASection — dead links
`WhatsApp` and `Book a 20-min call` both link to `#`. These are the two highest-intent CTAs on the page. A visitor who wants to act cannot. Wire real links before any page goes live.

### No WhatsApp floating button
The site-spec calls this out explicitly: *"WhatsApp floating contact (UAE buyers expect it)"* as a site-wide Phase 1 requirement. It does not exist anywhere on the page. This is the single highest-priority missing piece for the UAE market.

### Missing OG image
`metadata.openGraph` has no `images` field. Every social share generates a blank preview. An OG image in brand style (Anton on bone/ink) needs to be designed and built before launch.

---

## 2. Spec Divergence

### CaseStudySection absent from `page.tsx`
The approved flow in `site-spec.md`: ShoutSection → featured case study → CTASection. The current `page.tsx` skips directly from ShoutSection to CTASection. `CaseStudySection` is listed as BUILT in `CLAUDE.md` ("placeholder until real case studies added") but is not imported or rendered.

**Verdict: BUILD LATER** — blocked on real case study content from Adi. Once Adi provides at least one real case study, insert `CaseStudySection` between ShoutSection and CTASection.

### ServicesSection — no path to detail pages
Each accordion row shows description and deliverables but has no link to `/services/web`, `/services/software`, `/services/ai`. An IT buyer evaluating thoroughly has no way to go deeper from the homepage. Every accordion row needs a "Learn more" link pointing to its respective detail page.

---

## 3. Copy Concerns

### Hero h1 — second sentence is design commentary, not a value prop

Current:
```
"Techwise IQ — the AI-first engineering agency.
The type does the talking. The work does the proving."
```

The first clause sets who we are. The second clause is a meta-comment on the visual design — it explains the aesthetic choice, not what the visitor gains. It alienates the SMB founder who reads h1s for "can you solve my problem?" and tells the IT leader nothing about reliability or process.

**Recommendation (requires Adi approval before implementation):** Replace the second sentence with a concrete positioning claim. Options to consider:
- "Fixed scope, weekly demos, delivered on time."
- "We build it. We ship it. You own the outcome."
- "Three disciplines, one team, no handoff chaos."

Copy must be approved by Adi before any code change.

### Ticker is `aria-hidden`
The trust claims ("Fixed scope / Demos every Friday / No surprise invoices") are the most concrete differentiators on the page. They are invisible to screen readers and may be deprioritised by crawlers. These claims should appear as accessible text somewhere — either reinforced in ProcessSection copy or as a visually hidden but readable list adjacent to the Ticker.

---

## 4. SEO / GEO Gaps

### JSON-LD `ProfessionalService` missing `priceRange`
Even a `"priceRange": "Starting from AED X,XXX"` helps AI search engines and Google's Knowledge Panel understand the business. Add once confirmed with Adi.

### JSON-LD `contactPoint` missing telephone / WhatsApp
No phone or WhatsApp number in structured data. Once the real WhatsApp number is wired, add it to `contactPoint` as `telephone`.

---

## 5. Phase 1 Requirements Not Yet Built

In scope for Phase 1 per site-spec, but not present:
- `sitemap.xml`
- `robots.txt`
- Favicon + Apple touch icon
- 404 page ("use the design system's attitude — make it memorable")
- Privacy and Terms pages (required for analytics compliance)
- Privacy-friendly analytics script (Plausible or Umami)

---

## Priority Order

| Priority | Item | Status |
|---|---|---|
| P0 | Wire real WhatsApp + booking links in CTASection | Blocked on Adi (numbers/link needed) |
| P0 | Add WhatsApp floating button (site-wide) | Unblocked once link is known |
| P0 | OG image — design and implement | Unblocked (design task first) |
| P1 | Add "Learn more" links to ServicesSection rows | Unblocked |
| P1 | Insert CaseStudySection between ShoutSection and CTASection | Blocked on Adi (real content needed) |
| P1 | Make Ticker trust claims accessible | Unblocked |
| P2 | Reconsider hero h1 second sentence | Blocked on Adi copy approval |
| P2 | Add `priceRange` + `telephone` to JSON-LD | Blocked on Adi confirming numbers |
| P3 | sitemap.xml, robots.txt, favicon, 404, legal pages | Unblocked |

---

## Overall Verdict

The homepage is structurally sound and copy is clean — no banned vocabulary found, no invented claims. It is **not launch-ready**. P0 blockers must close first. CaseStudySection is deliberately deferred pending real content. All P1 and P3 items are buildable now without Adi input except where noted.
