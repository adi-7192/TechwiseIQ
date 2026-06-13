---
description: Adapt an external component (from a free component site, CodePen, library, etc.) into the Kinetic design system. Never pastes foreign code — translates the idea, rebuilds in our tokens and conventions.
argument-hint: [link or pasted component code] [where it should go on the site]
---

Adapt the following external component into the Techwise IQ website: $ARGUMENTS

Run this pipeline strictly in order. Do not skip steps. Do not paste the original code into the codebase at any point.

## Step 1 — License check (gate)
Identify the source. Permissive (MIT/ISC/Apache, CodePen with stated license, component libraries built for reuse) → proceed. Unknown, proprietary, or scraped from a live commercial/portfolio site → STOP for code reuse; only the abstract interaction idea may be reimplemented from scratch, and say so explicitly.

## Step 2 — Product check (product-manager agent)
Use the product-manager subagent: does this component serve a visitor task on the target page, or is it decoration? If REJECT, stop and report why — do not build rejected components "just to see."

## Step 3 — Idea extraction (web-designer agent)
Use the web-designer subagent to produce the translation spec:
- What is the underlying idea (structure, rhythm, interaction concept) stripped of all styling?
- Re-expression in Kinetic: tokens only (bone/ink/hot/sun), Anton/Archivo/Space Mono, 3px borders, hard shadows, radius 0.
- Motion mapping: every animation mapped to our closed vocabulary (marquee, reveal, pressed-shadow, outline-hollow, accordion, wobble/bob). Anything unmappable = vocabulary expansion → STOP and ask Adi for approval before proceeding. Remember: one showpiece per page, Home's is taken.
- If the idea dies without its original styling (gradient-dependent, glassmorphism-dependent, 3D-asset-dependent): report "incompatible" with a Kinetic-native alternative proposal. Stop.

## Step 4 — Interaction spec (ux-specialist agent)
Use the ux-specialist subagent: keyboard behavior, ARIA pattern, reduced-motion fallback, mobile behavior, failure states.

## Step 5 — Build (ui-specialist agent)
Use the ui-specialist subagent to implement from the specs of steps 3–4 only — fresh code, our conventions (component folder, shared hooks, server-component default). The original snippet may be consulted for algorithmic insight only if Step 1 passed.

## Step 6 — Gate (qa-engineer agent)
Use the qa-engineer subagent for the full gate sequence. FAIL → back to Step 5. Only a PASS verdict completes this command.

## Output
Summarize: source + license status, the extracted idea, what changed in translation, vocabulary mapping table (original effect → Kinetic effect), and the QA verdict.
