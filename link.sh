#!/usr/bin/env bash
# Connects this kit to the AI tools installed on THIS machine (Claude Code, Cursor, Codex).
# Run it once per person. It only creates symlinks in your home folder; nothing is copied
# into any project, and nothing is installed or downloaded.
#
# Usage: ./link.sh [--uninstall]
set -euo pipefail

KIT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL="$KIT/skills/wp-plugin-maintenance"
CLAUDE_DIR="${CLAUDE_HOME:-$HOME/.claude}"
CURSOR_DIR="${CURSOR_HOME:-$HOME/.cursor}"
CODEX_DIR="${CODEX_HOME:-$HOME/.codex}"
uninstall=0; [ "${1:-}" = "--uninstall" ] && uninstall=1

# link <target> <link-path>
link() {
  local target="$1" dest="$2"
  if [ "$uninstall" = 1 ]; then
    if [ -L "$dest" ] && [ "$(readlink "$dest")" = "$target" ]; then rm "$dest"; echo "  removed $dest"; fi
    return
  fi
  if [ -e "$dest" ] && [ ! -L "$dest" ]; then echo "  SKIPPED $dest (already exists and is not a link; move it away first)" >&2; return; fi
  mkdir -p "$(dirname "$dest")"
  ln -sfn "$target" "$dest"
  echo "  linked  $dest"
}

for tool in "Claude Code:$CLAUDE_DIR:agents" "Cursor:$CURSOR_DIR:agents" "Codex:$CODEX_DIR:"; do
  name="${tool%%:*}"; rest="${tool#*:}"; dir="${rest%%:*}"; agents="${rest#*:}"
  if [ ! -d "$dir" ]; then echo "$name: not found ($dir), skipped"; continue; fi
  echo "$name:"
  link "$SKILL" "$dir/skills/wp-plugin-maintenance"
  if [ -n "$agents" ]; then
    for a in wp-plugin-updater wp-plugin-tester; do link "$KIT/claude-agents/$a.md" "$dir/agents/$a.md"; done
  fi
done

echo
if [ "$uninstall" = 1 ]; then echo "Kit unlinked. The kit folder itself ($KIT) was not touched."; else
  echo "Done. To update the kit later: git -C \"$KIT\" pull   (the skill also does this by itself at the start of each run)"
  echo "First Playwright run needs: cd \"$SKILL/playwright\" && npm install && npx playwright install chromium"
fi
