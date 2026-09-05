#!/bin/bash
# design-guard.sh — blocks design-token violations at write time.
# Wired as a PostToolUse hook (Edit|Write). Exit 2 = blocking feedback to Claude.
# Rules match the Immersive system (docs/design-system.md) — see docs/anti-slop-checklist.md
# for the fuller (partly non-mechanical) list this hook only partially covers.

INPUT=$(cat)
FILE=$(echo "$INPUT" | python3 -c "import json,sys; print(json.load(sys.stdin).get('tool_input',{}).get('file_path',''))" 2>/dev/null)

# Only guard style-bearing source files inside src/
case "$FILE" in
  */src/*.css|*/src/*.tsx|*/src/*.jsx|*/src/*.ts) ;;
  *) exit 0 ;;
esac
[ -f "$FILE" ] || exit 0

VIOLATIONS=""

add() { VIOLATIONS="${VIOLATIONS}\n  - $1"; }

# Helper: true if a marker comment appears on the immediately preceding
# non-blank line (used for the two narrow, sanctioned exceptions below).
marker_precedes() {
  awk -v marker="$1" -v needle="$2" '
    { line=$0 }
    line ~ marker { armed=1; next }
    line ~ needle { if (!armed) print NR; armed=0; next }
    { armed=0 }
  ' "$FILE"
}

# 1. Radius: only the three approved stops (proof 22px, artifact 10px, control 999px/pill) or 0/none.
#    Flag any other hardcoded pixel radius as an invented stop. A `focus-ring-ok` marker on the
#    preceding line exempts outline-radius (not a content-radius stop).
APPROVED_RADIUS="0 22px 10px 999px"
UNMARKED_RADIUS_LINES=$(marker_precedes 'focus-ring-ok' 'border-radius:|borderRadius:')
if [ -n "$UNMARKED_RADIUS_LINES" ]; then
  RADII=$(grep -noE 'border-radius:\s*[0-9]+px|borderRadius:\s*['\''"][0-9]+px' "$FILE" 2>/dev/null | grep -oE '[0-9]+px')
  for r in $RADII; do
    echo "$APPROVED_RADIUS" | grep -qw "$r" || add "border-radius: $r — not one of the approved stops (0 / 10px artifact / 22px proof / 999px control). Use var(--tw-radius-*), mark a legit exception \`/* focus-ring-ok */\` on the preceding line, or add a stop to docs/design-system.md §3 with sign-off"
  done
fi
if grep -nE "rounded-(sm|md|lg|xl|2xl|3xl)\b" "$FILE" >/dev/null 2>&1; then
  add "Tailwind rounded-* utility other than rounded-full found — use the token radius scale, not an arbitrary Tailwind stop"
fi

# 2. Decorative gradients (banned outright, except the one CSS atmosphere fallback marked
#    `/* scene-glow-ok */` on the preceding line — see docs/design-system.md §7)
UNMARKED_GRADIENT_LINES=$(marker_precedes 'scene-glow-ok' '(linear|radial|conic)-gradient\\(')
if [ -n "$UNMARKED_GRADIENT_LINES" ]; then
  add "gradient found — decorative gradients are banned (this is the #1 AI-slop tell); the scene-glow atmosphere in .tw-world is the only sanctioned radial effect, already marked in globals.css"
fi

# 3. Blur / glassmorphism
if grep -nE 'backdrop-filter|filter:\s*[^;]*blur|drop-shadow\(' "$FILE" >/dev/null 2>&1; then
  add "blur/backdrop-filter/drop-shadow found — no glassmorphism in this system"
fi

# 4. Off-token raw hex colors (immersive tokens + legacy Kinetic tokens still present in globals.css until Phase 9 cleanup)
APPROVED="060706 101310 f2f4ef 8a918c 252925 c8ff54 695cff ff6540 70a8ff f3f3ed 101110 f2f0e9 101010 ff4d00 ffd02f ffffff 66635b 9a9a92 3a3933 ece9e0 fff 000"
HEXES=$(grep -oE '#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?([0-9a-fA-F]{2})?' "$FILE" 2>/dev/null | tr 'A-F' 'a-f' | sed 's/#//' | sort -u)
for h in $HEXES; do
  base="${h:0:6}"; [ ${#h} -eq 3 ] && base="$h"
  echo "$APPROVED" | grep -qw "$base" || add "off-token hex #$h — use design tokens (var(--tw-*) or var(--color-*))"
done

# 5. Foreign display fonts (generic AI-slop defaults)
if grep -nE "font-family[^;]*(Inter|Roboto|Poppins|Montserrat|Open Sans|Lato|Helvetica Neue)" "$FILE" >/dev/null 2>&1; then
  add "non-brand font-family — only Manrope (display) / Archivo (body) / Space Mono (labels)"
fi

# 6. Layout-property animation (CLS / perf) — transform/opacity only
if grep -nE 'transition:[^;]*\b(width|height|top|left|margin|padding)\b' "$FILE" | grep -v 'max-height' >/dev/null 2>&1; then
  add "transition on layout property — animate transform/opacity only (max-height allowed for accordion-style expand)"
fi

# 7. Duplicate animation/scroll libraries — GSAP + Lenis are the only sanctioned libs
if grep -nE "from ['\"]framer-motion['\"]|from ['\"]motion(/react)?['\"]" "$FILE" >/dev/null 2>&1; then
  add "Framer Motion / motion import found — GSAP is the sole DOM animation library in this system, Lenis the sole scroll library. A second library is a vocabulary expansion (needs sign-off + doc update)"
fi
if grep -nE "new THREE\.WebGLRenderer" "$FILE" >/dev/null 2>&1 && [[ "$FILE" != *"lib/scene/engine.ts" ]]; then
  add "new THREE.WebGLRenderer outside lib/scene/engine.ts — the scene renderer is a session singleton; a second renderer breaks the one-canvas guarantee"
fi

if [ -n "$VIOLATIONS" ]; then
  printf "DESIGN-GUARD BLOCKED %s:%b\nFix these against docs/design-system.md / docs/anti-slop-checklist.md before proceeding. If this is a genuine exception, it needs Adi's approval AND a design-system doc update first.\n" "$FILE" "$VIOLATIONS" >&2
  exit 2
fi
exit 0
