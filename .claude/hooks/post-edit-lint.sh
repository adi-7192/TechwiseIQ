#!/bin/bash
# Hook: run Next.js lint on the edited file after every Edit/Write tool call.
# Only fires for TS/TSX/JS/JSX files inside src/.
# Portable — auto-detects the repo root relative to this script's location.

# Repo root is two levels up from .claude/hooks/
BASE="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Extract file_path from CLAUDE_TOOL_INPUT env var (JSON)
FILE=$(node -e "
  try {
    const d = JSON.parse(process.env.CLAUDE_TOOL_INPUT || '{}');
    process.stdout.write(d.file_path || '');
  } catch(e) {}
" 2>/dev/null)

# Bail if no file or file not in this repo's src/
[[ -z "$FILE" ]] && exit 0
[[ "$FILE" != "$BASE/src/"* ]] && exit 0
[[ "$FILE" =~ \.(ts|tsx|js|jsx)$ ]] || exit 0

# Convert to relative path for next lint
REL="${FILE#$BASE/}"

cd "$BASE" || exit 0

# Run Next.js lint on this file only; quiet = errors only (no warnings)
OUTPUT=$(npx next lint --file "$REL" --quiet 2>&1 | grep -v "^$" | grep -v "^info" | head -15)

if [[ -n "$OUTPUT" ]]; then
  echo "--- Lint: $REL ---"
  echo "$OUTPUT"
else
  echo "✓ $REL"
fi
