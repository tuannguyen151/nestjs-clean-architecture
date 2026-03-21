---
name: no-put-for-partial-update
enabled: true
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: src/adapters/controllers/.*\.controller\.ts$
  - field: new_text
    operator: regex_match
    pattern: "@Put\\(['\"]"
---

**`@Put` detected in a controller — verify the semantics are correct.**

REST method rules:

- `@Put` → **full replacement** (client must send ALL fields; missing fields are cleared)
- `@Patch` → **partial update** (client sends only fields to change)

**If the use case or DTO uses `Partial<>` or has all-optional fields → use `@Patch` instead.**

Examples:

```typescript
// ❌ Wrong — DTO has optional fields but uses PUT
@Put('me')
async updateProfile(@Body() dto: UpdateProfileDto) { ... }

// ✅ Correct — partial update uses PATCH
@Patch('me')
async updateProfile(@Body() dto: UpdateProfileDto) { ... }

// ✅ Correct — PUT only when replacing the full resource
@Put(':id')
async replaceTask(@Body() dto: CreateTaskDto) { ... }  // all fields required
```
