---
name: require-seeder-update
enabled: true
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: src/infrastructure/databases/postgresql/entities/.*\.entity\.ts$|database/migrations/.*\.ts$
---

**Database entity or migration modified — check if seeders need updating.**

When you add/remove/rename columns or change enum values, the seeders must stay in sync.

**Check these files:**

- `database/seeds/factories/*.factory.ts` — update faker data for new/changed fields
- `database/seeds/seeders/*.seeder.ts` — update fixed seed accounts if required fields changed

**Common cases that require seeder update:**

| Change                              | Action needed                                     |
| ----------------------------------- | ------------------------------------------------- |
| Add NOT NULL column without default | Add field to factory + seeder upsert              |
| Add new enum                        | Set a default value in factory                    |
| Add verified/status field           | Seed accounts must have valid values to be usable |
| Rename column                       | Update factory/seeder property name               |
| Remove column                       | Remove from factory/seeder                        |

**Example — new `phone` field added:**

```typescript
// factory.ts — add faker value
user.phone = '09' + faker.string.numeric(8)

// seeder.ts — add to upsert
await userRepository.upsert({
  username: 'admin',
  phone: '0900000001',   // ← add this
  ...
}, ['username'])
```
