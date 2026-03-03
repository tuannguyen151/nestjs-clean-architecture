---
name: copilot-hooks
description: "Create and configure GitHub Copilot Agent hooks — shell commands that execute at key lifecycle points during an agent session. Use this skill whenever the user asks to create or set up a Copilot/agent hook, block dangerous terminal commands automatically, auto-format code after file edits, log or audit agent tool usage, inject project context at session start, require approval for specific tools, configure PreToolUse, PostToolUse, SessionStart, Stop, SubagentStart, SubagentStop, UserPromptSubmit, or PreCompact hooks, set up .github/hooks/ directory or hook JSON files, or use /hooks command in chat. Even if the user says something like 'I want to automatically run prettier after edits' or 'prevent rm -rf' — trigger this skill."
---

# GitHub Copilot Agent Hooks

Hooks execute custom shell commands at specific lifecycle points during an agent session. They run deterministically and can block tool execution, modify inputs, or inject context into the conversation.

## Hook File Locations

VS Code searches for hooks in this priority order (workspace overrides user):

| Location                      | Scope                           |
| ----------------------------- | ------------------------------- |
| `.github/hooks/*.json`        | Workspace-shared (committed)    |
| `.claude/settings.json`       | Workspace-level                 |
| `.claude/settings.local.json` | Local workspace (not committed) |
| `~/.claude/settings.json`     | User-global                     |

## Hook Events

| Event              | When It Fires                            |
| ------------------ | ---------------------------------------- |
| `SessionStart`     | First prompt of a new session            |
| `UserPromptSubmit` | User submits any prompt                  |
| `PreToolUse`       | Before agent invokes a tool              |
| `PostToolUse`      | After tool completes successfully        |
| `PreCompact`       | Before conversation context is compacted |
| `SubagentStart`    | When a subagent is spawned               |
| `SubagentStop`     | When a subagent completes                |
| `Stop`             | When the agent session ends              |

## Configuration Format

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "type": "command",
        "command": "./scripts/validate-tool.sh",
        "timeout": 15
      }
    ],
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

### Command Properties

| Property  | Type   | Required | Description                               |
| --------- | ------ | -------- | ----------------------------------------- |
| `type`    | string | Yes      | Must be `"command"`                       |
| `command` | string | Yes      | Default/cross-platform command            |
| `windows` | string | No       | Windows-specific override                 |
| `linux`   | string | No       | Linux-specific override                   |
| `osx`     | string | No       | macOS-specific override                   |
| `cwd`     | string | No       | Working directory (relative to repo root) |
| `env`     | object | No       | Additional environment variables          |
| `timeout` | number | No       | Timeout in seconds (default: 30)          |

## Hook Input / Output Protocol

Every hook receives **JSON via stdin** with these common fields:

```json
{
  "timestamp": "2026-02-09T10:30:00.000Z",
  "cwd": "/path/to/workspace",
  "sessionId": "session-identifier",
  "hookEventName": "PreToolUse",
  "transcript_path": "/path/to/transcript.json"
}
```

Hooks **return JSON via stdout** to influence behavior:

```json
{
  "continue": true,
  "stopReason": "Reason shown to model",
  "systemMessage": "Message shown to user"
}
```

### Exit Codes

| Code  | Effect                                                |
| ----- | ----------------------------------------------------- |
| `0`   | Success — parse stdout as JSON                        |
| `2`   | Blocking error — stop processing, show error to model |
| Other | Non-blocking warning — show warning, continue         |

## Event-Specific Details

### PreToolUse

Extra input fields:

```json
{
  "tool_name": "editFiles",
  "tool_input": { "files": ["src/main.ts"] },
  "tool_use_id": "tool-123"
}
```

Output `hookSpecificOutput`:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Blocked by security policy",
    "updatedInput": {},
    "additionalContext": "Extra context for model"
  }
}
```

`permissionDecision` values (most restrictive wins when multiple hooks run):

1. `"deny"` — block tool execution
2. `"ask"` — require user confirmation
3. `"allow"` — auto-approve

### PostToolUse

Extra input fields:

```json
{
  "tool_name": "editFiles",
  "tool_input": { "files": ["src/main.ts"] },
  "tool_use_id": "tool-123",
  "tool_response": "File edited successfully"
}
```

Output:

```json
{
  "decision": "block",
  "reason": "Post-processing validation failed",
  "hookSpecificOutput": {
    "hookEventName": "PostToolUse",
    "additionalContext": "The file has lint errors"
  }
}
```

### SessionStart

Extra input:

```json
{ "source": "new" }
```

Output:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "Project: my-app | Branch: main"
  }
}
```

### Stop

Extra input:

```json
{ "stop_hook_active": false }
```

> **Important**: Always check `stop_hook_active` before blocking — if `true`, skip the block to prevent an infinite loop.

Output:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "Stop",
    "decision": "block",
    "reason": "Run tests before finishing"
  }
}
```

### SubagentStart / SubagentStop

Extra input:

```json
{
  "agent_id": "subagent-456",
  "agent_type": "Plan"
}
```

SubagentStop also includes `"stop_hook_active": false`.

SubagentStop output (to prevent subagent from stopping):

```json
{
  "decision": "block",
  "reason": "Verify subagent results before completing"
}
```

### UserPromptSubmit

Extra input: `"prompt"` field containing the user's text. Uses common output format only.

### PreCompact

Extra input: `"trigger": "auto"`. Uses common output format only.

---

## Implementation Guide

### Step 1: Create the hook config file

Create `.github/hooks/<purpose>.json` (for shared) or `.claude/settings.json` (for local).

### Step 2: Write the shell script

Save scripts to `scripts/` directory. Make them executable:

```bash
chmod +x scripts/your-hook.sh
```

### Step 3: Parse input and return output

Always parse JSON from stdin using `jq`:

```bash
INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name')
```

Always return valid JSON to stdout.

### Step 4: Test the hook

Run the hook manually:

```bash
echo '{"tool_name":"runTerminalCommand","tool_input":{"command":"ls"}}' | ./scripts/your-hook.sh
```

---

## Common Patterns (Reference)

See `references/templates.md` for ready-to-use script templates for:

- Block dangerous terminal commands
- Auto-format code after edits (Prettier)
- Log all tool usage for auditing
- Require approval for sensitive tools
- Inject project context at session start
- Block agent from stopping until tests pass

---

## Checklist for Every Hook

- [ ] Hook config JSON file in correct location
- [ ] `type: "command"` set correctly
- [ ] Shell script exists and is executable (`chmod +x`)
- [ ] Script parses stdin with `jq`
- [ ] Script always outputs valid JSON to stdout
- [ ] Script exits with code `0` (success), `2` (blocking error), or other (warning)
- [ ] `timeout` is appropriate for the task
- [ ] `stop_hook_active` checked in `Stop`/`SubagentStop` hooks to prevent infinite loops
