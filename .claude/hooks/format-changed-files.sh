#!/bin/bash
# Auto-format files after Claude Code Write or Edit tool use

# Load nvm and ensure Node.js/npx is available
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

INPUT=$(cat)
FILE=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [ -z "$FILE" ]; then
  echo '{"continue":true}'
  exit 0
fi

# Run Prettier if applicable
if [ -f "$FILE" ] && echo "$FILE" | grep -qE '\.(ts|js|json|md)$'; then
  npx prettier --write "$FILE" 2>/dev/null
fi

# Run ESLint if applicable
if echo "$FILE" | grep -qE '\.(ts|js)$'; then
  LINT_OUTPUT=$(npx eslint --fix "$FILE" 2>&1)
  if [ $? -ne 0 ]; then
    LINT_MSG=$(echo "$LINT_OUTPUT" | head -20)
    echo "{\"hookSpecificOutput\":{\"hookEventName\":\"PostToolUse\",\"additionalContext\":\"ESLint found issues:\\n$LINT_MSG\"}}"
    exit 0
  fi
fi

echo '{"continue":true}'
