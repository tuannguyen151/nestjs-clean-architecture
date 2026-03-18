# CASL Authorization Pattern

## Separation of Concerns

| Layer                    | Responsibility                                                                        |
| ------------------------ | ------------------------------------------------------------------------------------- |
| **CASL / PoliciesGuard** | Role-based coarse check: _"is this role allowed to perform this action?"_             |
| **UseCase / Repository** | Ownership enforcement: _"only access your own resources"_ — filter `WHERE userId = ?` |

CASL does not enforce ownership — that is the responsibility of the use-case/repository layer.

## Files Involved

```
src/domain/services/ability.interface.ts          ← TAction, TSubject types (single source of truth)
src/infrastructure/services/casl/
  casl-ability.factory.ts                         ← creates ability per user
  casl.module.ts                                  ← DI wiring
src/adapters/controllers/common/
  decorators/check-policies.decorator.ts          ← @CheckPolicies
  guards/policies.guard.ts                        ← coarse-grained authorization guard
```

## Implementation

### 1. Domain — `ability.interface.ts`

Export `TAction` and `TSubject` so the factory can import them (never re-define):

```typescript
export type TAction = 'manage' | 'create' | 'read' | 'update' | 'delete'
export type TSubject = 'all' | 'Task' // add new subjects here

export interface IPolicyHandler {
  action: TAction
  subject: TSubject
  field?: string
}

export const IAbilityFactory = Symbol('IAbilityFactory')
export interface IAbilityFactory<TAbility = unknown> {
  createForUser(user: UserEntity): TAbility
  can(ability: TAbility, policyHandler: IPolicyHandler): boolean
}
```

### 2. Infrastructure — `casl-ability.factory.ts`

```typescript
import { TAction, TSubject } from '@domain/services/ability.interface'

export type TAppAbility = MongoAbility<[TAction, TSubject]>

@Injectable()
export class CaslAbilityFactory implements IAbilityFactory<TAppAbility> {
  createForUser(user: UserEntity): TAppAbility {
    const { can, build } = new AbilityBuilder<TAppAbility>(createMongoAbility)

    if (user.role === RoleEnum.Admin) {
      can('manage', 'all')
    } else {
      // Coarse-grained only — NO conditions { userId }
      // Ownership is enforced at the use-case/repository layer via WHERE userId = ?
      can('read', 'Task')
      can(['create', 'update'], 'Task')
    }

    return build() // no `as TAppAbility` cast needed
  }

  can(
    ability: TAppAbility,
    { action, subject, field }: IPolicyHandler,
  ): boolean {
    return ability.can(action, subject, field)
  }
}
```

### 3. Controller — `@CheckPolicies`

```typescript
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class TasksController {
  @Get()
  @CheckPolicies({ action: 'read', subject: 'Task' })
  findAll(@User('id') userId: number) { ... }

  @Post()
  @CheckPolicies({ action: 'create', subject: 'Task' })
  create(@User('id') userId: number) { ... }
}
```

## Adding a New Subject (e.g. `Comment`)

1. Add `'Comment'` to `TSubject` in `ability.interface.ts`
2. Add rules in `casl-ability.factory.ts`:
   ```typescript
   can('read', 'Comment')
   can(['create', 'update'], 'Comment')
   ```
3. Use `@CheckPolicies({ action: '...', subject: 'Comment' })` in the controller
4. Add `CaslModule` to the new feature module's `imports`

## Anti-Patterns

| Anti-pattern                              | Correct approach                                 |
| ----------------------------------------- | ------------------------------------------------ |
| `AbilityBuilder<any>`                     | `AbilityBuilder<TAppAbility>`                    |
| `build() as TAppAbility`                  | No cast needed with correct generic              |
| Conditions `{ userId: user.id }` in rules | Remove — ownership belongs in use-case           |
| Re-define `TAction`/`TSubject` in factory | Import from `@domain/services/ability.interface` |
