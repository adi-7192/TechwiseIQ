#!/bin/bash
# design-guard.sh — blocks design-token violations at write time.
# Wired as a PostToolUse hook (Edit|Write). Exit 2 = blocking feedback to Claude.

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

# 1. Rounded corners (radius 0 is the system; 0/none/inherit allowed)
if grep -nE 'border-radius:\s*[1-9]|rounded-(sm|md|lg|xl|2xl|3xl|full)' "$FILE" >/dev/null 2>&1; then
  add "border-radius / rounded-* utility found — Kinetic is radius 0 everywhere"
fi

# 2. Decorative gradients (nav fade must carry the marker comment)
if grep -nE '(linear|radial|conic)-gradient\(' "$FILE" | grep -v 'nav-fade-ok' >/dev/null 2>&1; then
  add "gradient without /* nav-fade-ok */ marker — decorative gradients are banned"
fi

# 3. Blur effects
if grep -nE 'backdrop-filter|filter:\s*[^;]*blur|drop-shadow\(' "$FILE" >/dev/null 2>&1; then
  add "blur/backdrop-filter/drop-shadow found — hard offset shadows only"
fi
# box-shadow with a blur radius (3rd length before color)
if grep -nE 'box-shadow:\s*-?[0-9.]+px\s+-?[0-9.]+px\s+[1-9][0-9.]*px' "$FILE" >/dev/null 2>&1; then
  add "box-shadow with blur radius — use hard offsets (e.g. 5px 5px 0 var(--ink))"
fi

# 4. Off-palette raw hex colors
APPROVED="f2f0e9 101010 ff4d00 ffd02f ffffff 7a776e 9a9a92 ece9e0 fff 000"
HEXES=$(grep -oE '#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?([0-9a-fA-F]{2})?' "$FILE" 2>/dev/null | tr 'A-F' 'a-f' | sed 's/#//' | sort -u)
for h in $HEXES; do
  base="${h:0:6}"; [ ${#h} -eq 3 ] && base="$h"
  echo "$APPROVED" | grep -qw "$base" || add "off-palette hex #$h — use design tokens (var(--bone/--ink/--hot/--sun/...))"
done

# 4b. JS inline-style objects (React style={{...}})
if grep -nE "borderRadius:\s*['\"]?[1-9]" "$FILE" >/dev/null 2>&1; then
  add "inline borderRadius — Kinetic is radius 0 everywhere"
fi
if grep -nE "boxShadow:\s*['\"](-?[0-9.]+(px)?)\s+(-?[0-9.]+(px)?)\s+[1-9][0-9.]*px" "$FILE" >/dev/null 2>&1; then
  add "inline boxShadow with blur radius — hard offsets only"
fi

# 5. Foreign fonts
if grep -nE "font-family[^;]*(Inter|Roboto|Poppins|Montserrat|Open Sans|Lato|Helvetica Neue)" "$FILE" >/dev/null 2>&1; then
  add "non-brand font-family — only Anton / Archivo / Space Mono"
fi

# 6. Layout-property animation (CLS / perf)
if grep -nE 'transition:[^;]*(width|height|top|left|margin|padding)[^;]*;|@keyframes' "$FILE" >/dev/null 2>&1; then
  if grep -nE 'transition:[^;]*\b(width|height|top|left|margin|padding)\b' "$FILE" | grep -v 'max-height' >/dev/null 2>&1; then
    add "transition on layout property — animate transform/opacity only (max-height allowed for accordion)"
  fi
fi

if [ -n "$VIOLATIONS" ]; then
  printf "DESIGN-GUARD BLOCKED %s:%b\nFix these against docs/design-system.md before proceeding. If this is a genuine exception, it needs Adi's approval AND a design-system doc update first.\n" "$FILE" "$VIOLATIONS" >&2
  exit 2
fi
exit 0
