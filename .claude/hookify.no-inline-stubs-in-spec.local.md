---
name: no-inline-stubs-in-spec
enabled: true
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.spec\.ts$
  - field: new_text
    operator: regex_match
    pattern: new (UserEntity|TaskEntity|User|Task)\(
---

**Entity instantiated inline inside a spec file.**

This project has a strict convention:

- Stubs → `test/stubs/*.stub.ts`
- Mocks → `test/mocks/**/*.mock.ts`
- Import in spec: `import { createXxxStub } from 'test/stubs/xxx.stub'`

**Required actions:**

1. If the stub does not exist → create `test/stubs/{entity}.stub.ts` with a factory function that supports `overrides`
2. Import it in the spec instead of instantiating inline

**Standard stub file pattern:**

```typescript
export const createTaskStub = (
  overrides: Partial<{ userId: number; status: TaskStatusEnum }> = {},
): TaskEntity => {
  const now = new Date()
  return new TaskEntity(1, overrides.userId ?? 1, ...)
}
```
