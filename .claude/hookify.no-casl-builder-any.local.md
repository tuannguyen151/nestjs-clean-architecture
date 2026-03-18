---
name: no-casl-builder-any
enabled: true
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.ts$
  - field: new_text
    operator: contains
    pattern: AbilityBuilder<any>
---

**`AbilityBuilder<any>` is a code smell — avoid using `any` here.**

The usual cause: adding conditions `{ userId: user.id }` to rules causes a TypeScript error (`MongoQuery<never>`) with string subjects.

**Correct approach:**

- If rules have **no conditions** → use `AbilityBuilder<TAppAbility>` directly; `build()` returns the correct type with no cast needed.
- If rules **need conditions on string subjects** → reconsider the architecture: ownership enforcement belongs in the use-case/repository layer, not in the CASL guard.

**Standard pattern (no conditions):**

```typescript
const { can, build } = new AbilityBuilder<TAppAbility>(createMongoAbility)
can('read', 'Task')
return build() // no `as TAppAbility` cast needed
```
