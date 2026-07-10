# Mobile Hero Full-Height Marquee Design

**Date:** 2026-07-10

## Goal

Make the home-page hero feel intentional and clean on mobile while preserving the Kinetic design system. The three marquee rows must occupy the full hero field instead of collapsing into a shallow band above the claim card.

## Scope

This change is limited to the home-page `Hero` component at mobile widths. Desktop and tablet composition, copy, marquee direction and timing, navigation, and subsequent page sections remain unchanged.

## Layout

At viewport widths up to 600px, the hero remains a single full-screen composition using `100svh` with the existing `100vh` fallback. The three marquee rows stay in the hero's background layer and are distributed vertically from below the fixed navigation to near the bottom of the hero. Each row uses oversized display type that intentionally clips beyond the left and right edges.

The semantic claim card remains an overlay above the marquee field rather than entering normal document flow. It sits near the visual center of the hero, followed by two clear call-to-action buttons. The badge remains in the lower-right region and the scroll cue remains in the lower-left region. These elements must not collide with each other or the fixed WhatsApp control.

Short mobile viewports tighten gaps and type size within defined bounds, while taller devices add breathing room. The marquee must never collapse back into a narrow top band.

## Responsive Type and Spacing

- Mobile marquee type uses `clamp(72px, 18vw, 108px)` as the initial responsive range, adjusted only if viewport verification exposes a collision.
- The three rows are vertically distributed across the available hero height, not stacked by their natural line height at the top.
- Horizontal overflow remains clipped by the hero and root page; the composition must not create user-scrollable horizontal overflow.
- The claim card keeps readable mono type, centered text, and the existing ink, bone, sun, and hot-orange palette.
- CTA targets remain at least 44px high. They remain side by side from 340px upward and stack below 340px if required to prevent cramped labels.
- The sticker and scroll cue retain clear separation from the CTAs and fixed WhatsApp control.

## Layering and Motion

The marquee rows remain decorative and `aria-hidden`. The claim card continues to carry the single semantic `h1`. Existing marquee motion, entrance motion, and reduced-motion behavior remain intact.

Layer order is explicit:

1. Hero background and particle field
2. Full-height marquee rows
3. Claim card and CTAs
4. Badge and scroll cue
5. Fixed navigation and site-wide floating controls

No new animation vocabulary is introduced. Only responsive positioning, sizing, and spacing change.

## Accessibility and Performance

- Preserve the existing semantic heading and decorative marquee treatment.
- Preserve visible keyboard focus states and accessible CTA labels.
- Maintain 44px minimum touch targets and adequate separation between actions.
- Preserve `prefers-reduced-motion` behavior.
- Use CSS only for the responsive composition; add no client JavaScript or new runtime dependencies. Development-only regression tooling is allowed.
- Avoid layout shift by keeping the hero dimensions stable at first paint.

## Verification

The implementation will be checked at representative mobile sizes: 320×568, 375×667, 390×844, 430×932, and 600×900. Verification will confirm:

- marquee coverage extends across the hero field rather than a shallow band;
- claim card, CTAs, badge, scroll cue, navigation, and WhatsApp control do not overlap;
- no user-scrollable horizontal overflow exists;
- the next section begins after the hero without unintended whitespace;
- desktop and tablet layouts remain unchanged;
- reduced-motion mode remains readable;
- lint and production build pass.

## Non-Goals

- Changing hero copy or marquee phrases
- Changing desktop or tablet styling
- Replacing the marquee with a static headline
- Adding new animation, imagery, colors, fonts, or dependencies
- Refactoring unrelated sections or shared components
