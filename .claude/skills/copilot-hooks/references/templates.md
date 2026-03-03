# Hook Script Templates

Ready-to-use templates for common hook use cases.

---

## 1. Block Dangerous Terminal Commands

**.github/hooks/security.json**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "type": "command",
        "command": "./scripts/block-dangerous.sh",
        "timeout": 5
      }
    ]
  }
}
```

**scripts/block-dangerous.sh**

```bash
#!/bin/bash
INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name')

if [ "$TOOL_NAME" = "runTerminalCommand" ]; then
  COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

  if echo "$COMMAND" | grep -qE '(rm\s+-rf|DROP\s+TABLE|DELETE\s+FROM\s+\w+\s+WHERE\s+1|truncate\s+table)'; then
    echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"Destructive command blocked by security policy"}}'
    exit 0
  fi
fi

echo '{"continue":true}'
```

---

## 2. Auto-Format Code After Edits (Prettier)

**.github/hooks/formatting.json**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "type": "command",
        "command": "./scripts/format-changed-files.sh",
        "windows": "powershell -File scripts\\format-changed-files.ps1",
        "timeout": 30
      }
    ]
  }
}
```

**scripts/format-changed-files.sh**

```bash
#!/bin/bash
INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name')

if [ "$TOOL_NAME" = "editFiles" ] || [ "$TOOL_NAME" = "createFile" ]; then
  FILES=$(echo "$INPUT" | jq -r '.tool_input.files[]? // .tool_input.path // empty')

  for FILE in $FILES; do
    if [ -f "$FILE" ]; then
      npx prettier --write "$FILE" 2>/dev/null
    fi
  done
fi

echo '{"continue":true}'
```

**scripts/format-changed-files.ps1** (Windows)

```powershell
$input_data = $input | ConvertFrom-Json
$tool_name = $input_data.tool_name

if ($tool_name -eq "editFiles" -or $tool_name -eq "createFile") {
    $files = $input_data.tool_input.files
    if (-not $files) { $files = @($input_data.tool_input.path) }

    foreach ($file in $files) {
        if (Test-Path $file) {
            npx prettier --write $file 2>$null
        }
    }
}

Write-Output '{"continue":true}'
```

---

## 3. Log All Tool Usage (Audit Trail)

**.github/hooks/audit.json**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "type": "command",
        "command": "./scripts/log-tool-use.sh",
        "env": {
          "AUDIT_LOG": ".github/hooks/audit.log"
        }
      }
    ]
  }
}
```

**scripts/log-tool-use.sh**

```bash
#!/bin/bash
INPUT=$(cat)
TIMESTAMP=$(echo "$INPUT" | jq -r '.timestamp')
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name')
SESSION_ID=$(echo "$INPUT" | jq -r '.sessionId')
TOOL_INPUT=$(echo "$INPUT" | jq -c '.tool_input // {}')

LOG_FILE="${AUDIT_LOG:-audit.log}"
echo "[$TIMESTAMP] session=$SESSION_ID tool=$TOOL_NAME input=$TOOL_INPUT" >> "$LOG_FILE"

echo '{"continue":true}'
```

---

## 4. Require Approval for Sensitive Tools

**.github/hooks/approval.json**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "type": "command",
        "command": "./scripts/require-approval.sh"
      }
    ]
  }
}
```

**scripts/require-approval.sh**

```bash
#!/bin/bash
INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name')

# Tools that always require manual approval
SENSITIVE_TOOLS="runTerminalCommand|deleteFile|pushToGitHub"

if echo "$TOOL_NAME" | grep -qE "^($SENSITIVE_TOOLS)$"; then
  echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"ask","permissionDecisionReason":"This operation requires manual approval"}}'
else
  echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"allow"}}'
fi
```

---

## 5. Inject Project Context at Session Start

**.github/hooks/context.json**

```json
{
  "hooks": {
    "SessionStart": [
      {
        "type": "command",
        "command": "./scripts/inject-context.sh"
      }
    ]
  }
}
```

**scripts/inject-context.sh**

```bash
#!/bin/bash
PROJECT_INFO=$(cat package.json 2>/dev/null | jq -r '(.name // "unknown") + " v" + (.version // "0.0.0")' || echo "Unknown project")
BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
NODE_VERSION=$(node -v 2>/dev/null || echo "not installed")
NPM_VERSION=$(npm -v 2>/dev/null || echo "not installed")

cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "Project: $PROJECT_INFO | Branch: $BRANCH | Node: $NODE_VERSION | npm: $NPM_VERSION"
  }
}
EOF
```

---

## 6. Block Agent Stop Until Tests Pass

**.github/hooks/test-gate.json**

```json
{
  "hooks": {
    "Stop": [
      {
        "type": "command",
        "command": "./scripts/test-gate.sh",
        "timeout": 120
      }
    ]
  }
}
```

**scripts/test-gate.sh**

```bash
#!/bin/bash
INPUT=$(cat)
STOP_HOOK_ACTIVE=$(echo "$INPUT" | jq -r '.stop_hook_active // false')

# Prevent infinite loop — if already continuing from a stop hook, allow stop
if [ "$STOP_HOOK_ACTIVE" = "true" ]; then
  echo '{"continue":true}'
  exit 0
fi

# Run the test suite
if npm test --silent 2>&1 | grep -q "FAILED\|ERROR"; then
  echo '{"hookSpecificOutput":{"hookEventName":"Stop","decision":"block","reason":"Test suite has failures. Fix all failing tests before finishing."}}'
else
  echo '{"continue":true}'
fi
```

---

## 7. Run Linter After File Edits

**.github/hooks/lint.json**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "type": "command",
        "command": "./scripts/lint-changed.sh",
        "timeout": 60
      }
    ]
  }
}
```

**scripts/lint-changed.sh**

```bash
#!/bin/bash
INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name')

if [ "$TOOL_NAME" = "editFiles" ] || [ "$TOOL_NAME" = "createFile" ]; then
  FILES=$(echo "$INPUT" | jq -r '.tool_input.files[]? // .tool_input.path // empty')
  TS_FILES=""

  for FILE in $FILES; do
    if [[ "$FILE" == *.ts || "$FILE" == *.tsx || "$FILE" == *.js || "$FILE" == *.jsx ]]; then
      TS_FILES="$TS_FILES $FILE"
    fi
  done

  if [ -n "$TS_FILES" ]; then
    LINT_OUTPUT=$(npx eslint $TS_FILES 2>&1)
    if [ $? -ne 0 ]; then
      LINT_MSG=$(echo "$LINT_OUTPUT" | head -20)
      echo "{\"hookSpecificOutput\":{\"hookEventName\":\"PostToolUse\",\"additionalContext\":\"ESLint found issues:\\n$LINT_MSG\"}}"
      exit 0
    fi
  fi
fi

echo '{"continue":true}'
```

---

## Template: Minimal Hook Script

Use this as a starting point for any hook:

```bash
#!/bin/bash
INPUT=$(cat)

# Read common fields
HOOK_EVENT=$(echo "$INPUT" | jq -r '.hookEventName')
SESSION_ID=$(echo "$INPUT" | jq -r '.sessionId')
CWD=$(echo "$INPUT" | jq -r '.cwd')

# Read event-specific fields (for PreToolUse / PostToolUse)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
TOOL_INPUT=$(echo "$INPUT" | jq -c '.tool_input // {}')

# --- Your logic here ---

# Default: allow processing to continue
echo '{"continue":true}'
```
