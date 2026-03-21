---
name: require-api-operation-description
enabled: true
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: src/adapters/controllers/.*\.controller\.ts$
  - field: new_text
    operator: regex_match
    pattern: "@ApiOperation\\("
  - field: new_text
    operator: not_contains
    pattern: 'description:'
---

**`@ApiOperation` detected without `description` field.**

Per OpenAPI best practices, every endpoint must have a **detailed `description`** — not just a `summary`.

**Rules:**

- `summary` → one short line (≤ 50 chars), shown in endpoint list
- `description` → full explanation shown when user expands the endpoint

**`description` must include:**

- What the endpoint does (business logic, not just HTTP action)
- Required inputs and their constraints
- What is returned on success
- Key error cases (4xx/5xx) and when they occur
- Side effects (e.g., sends SMS, moves files, invalidates token)

**Example — too thin:**

```typescript
@ApiOperation({
  summary: 'Send OTP',
})
```

**Example — correct:**

```typescript
@ApiOperation({
  summary: 'Send OTP to phone number',
  description:
    'Sends a 6-digit SMS verification code to the given Vietnamese phone number via Firebase Identity Toolkit. ' +
    'The phone must be registered. Returns a `sessionInfo` token required for the verify-otp endpoint. ' +
    'Rate limited to 5 requests per hour per IP. ' +
    'Errors: 404 if phone not found, 429 if rate limit exceeded.',
})
```
