#!/bin/bash
# Auto-format files after create_file, replace_string_in_file, or multi_replace_string_in_file

# Load nvm and ensure Node.js/npx is available
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" # This loads nvm bash_completion

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name')

FILES=()
case "$TOOL_NAME" in
  "create_file"|"replace_string_in_file")
    FILE=$(echo "$INPUT" | jq -r '.tool_input.filePath // empty')
    [ -n "$FILE" ] && FILES+=("$FILE")
    ;;

  "multi_replace_string_in_file")
    while IFS= read -r FILE; do
      [ -n "$FILE" ] && FILES+=("$FILE")
    done < <(echo "$INPUT" | jq -r '.tool_input.replacements[]?.filePath // empty' | sort -u)
    ;;
esac

if [ ${#FILES[@]} -eq 0 ]; then
  echo '{"continue":true}'
  exit 0
fi

# Run Prettier if there are files that can be formatted
FORMAT_FILES=()
for FILE in "${FILES[@]}"; do
  if [ -f "$FILE" ] && echo "$FILE" | grep -qE '\.(ts|tsx|js|jsx|json|css|scss|html|md)$'; then
    FORMAT_FILES+=("$FILE")
  fi
done
if [ ${#FORMAT_FILES[@]} -gt 0 ]; then
  npx prettier --write "${FORMAT_FILES[@]}" 2>/dev/null
fi

# Run ESLint if there are files that can be linted
LINT_FILES=()
for FILE in "${FILES[@]}"; do
  if echo "$FILE" | grep -qE '\.(ts|tsx|js|jsx)$'; then
    LINT_FILES+=("$FILE")
  fi
done
if [ ${#LINT_FILES[@]} -gt 0 ]; then
  LINT_OUTPUT=$(npx eslint --fix "${LINT_FILES[@]}" 2>&1)
  if [ $? -ne 0 ]; then
    LINT_MSG=$(echo "$LINT_OUTPUT" | head -20)
    echo "{\"hookSpecificOutput\":{\"hookEventName\":\"PostToolUse\",\"additionalContext\":\"ESLint found issues:\\n$LINT_MSG\"}}"
    exit 0
  fi
fi

echo '{"continue":true}'
