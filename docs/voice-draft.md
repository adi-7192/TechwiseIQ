# Voice draft — before / after (ROADMAP 4.3, D-032 Q6)

**Status: rows 1–12 approved by owner 2026-10-04 and shipped on `stage-4/trust`.**
Voice: young, sharp, professional, a little quirky. No new claims: every "after" says what the
"before" said (or less). Approve, edit or reject each row; approved rows ship on `stage-4/trust`.

Already shipped (decided in D-032, not part of this draft): every primary CTA reads
**"Bring us the problem"** and goes to `/contact`.

| # | Where | Before | After (proposed) |
|---|---|---|---|
| 1 | Home hero H1 | Technology that *moves the work.* | Technology that *moves the work.* (keep — already on-voice) |
| 2 | Home hero support | Websites that make an impression. Software that fits. AI that puts your business in motion. | Websites people remember. Software that fits like it was measured. AI that does the boring bits. |
| 3 | `/services` H1 | Your next move. *Built right.* | Your next move. *Built right.* (keep — "the first time" would be a new promise) |
| 4 | `/services` lede | Websites that bring people in. Software that moves work forward. Automation that gives your team time back. | Websites that bring people in. Software that stops the spreadsheet juggling. Automation that hands your team their afternoons back. |
| 5 | `/work` CTA H2 (now echoes the button) | Bring us the problem. | Got a knot? *We like knots.* |
| 6 | `/work` CTA body | Start with a focused 20-minute call. You explain the challenge; we explain how we would approach it. | Twenty minutes. You explain the mess; we explain how we'd untangle it. |
| 7 | Case-study CTA H2 (now echoes the button) | Bring us the problem. | Want one like this? *Yours will be different.* |
| 8 | `/about` hero promise | You bring the goal. We own the technical path. | You bring the goal. We sweat the technical path. |
| 9 | `/about` model note | One clear working relationship. No account-management relay. | One team, one conversation. No game of telephone. |
| 10 | `/about` closing body | Building for businesses in Dubai and beyond, turning important ideas into working digital products. | Building for businesses in Dubai and beyond, turning big ideas into things that actually work. |
| 11 | `/contact` H1 | Let's *talk.* | Let's *talk shop.* |
| 12 | `/contact` intro | Tell us what's slowing you down. We'll reply within 24 hours, then send a written scope after a short call. | Tell us what's slowing you down. We reply within 24 hours (yes, really), then a written scope after a short call. |

Not proposed: legal pages, case-study facts, metadata/SEO titles, error states.

## Round 2 — site-wide (owner brief 2026-10-04, on `stage-4/trust`, review before merge)

Owner brief: simple words, no jargon, witty and young, says plainly what we do, key words
highlighted, good typography. Applied directly on the branch so it can be judged rendered; the
before/after is the branch diff (`git diff main -- src`). Rules used:

- Plain words over trade terms: "settling-in period" not "stabilization", "connecting your tools"
  not "APIs + integrations", "inbox sorting" not "email triage", "first app versions" not "MVPs",
  "plain rules" not "deterministic rules", "search foundations" not "SEO + GEO".
- Same facts, same promises: every timeline, number and guarantee is unchanged; nothing new is claimed.
- Key words: `<strong>` inside body paragraphs renders bright on the grey body text
  (`globals.css`, no extra accent colour). Used once or twice per lede, never per sentence.
- `/work` process now follows D-033 (Requirements → Options → Build → Ship).

Covered: Home (hero, services, operating model), `/services` overview + all three service pages
(capabilities, examples, approach, process, handover, FAQs, problem picker), `/work`, case-study
CTA, About, `/contact` intro, footer. Not changed: case-study facts, legal pages, metadata/SEO
titles, interactive demo labels (already plain).
