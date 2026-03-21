---
name: nestjs-clean-architecture
description: Guide for implementing new features following Clean Architecture with NestJS. Use this skill whenever the user asks to add a new feature, create a new resource/entity/module, write a use case, implement a repository, build a controller, set up dependency injection in a module, write tests, or asks anything about how code should be structured in this project — even if they don't mention "clean architecture" explicitly.
---

# NestJS Clean Architecture

A complete guide for implementing new features following the project's architecture, covering all layers: Domain, Use Cases, Adapters (Controllers), Infrastructure, and Modules.

> For full TypeScript code examples for each layer, read **`references/layer-examples.md`** when implementing or explaining a specific layer.

## When to Use This Skill

- Adding new features (new resources such as `Post`, `Comment`, etc.)
- Refactoring code placed in the wrong layer
- Reviewing code against the architecture
- Onboarding new developers
- Writing tests in the correct format

## Directory Structure

```
src/
├── domain/                        # Pure business layer, no framework dependencies
│   ├── entities/                  # Domain entities (business objects)
│   │   └── task.entity.ts
│   ├── utils/                     # Pure functions and helpers shared across use cases
│   │   └── string.utils.ts
│   ├── repositories/              # Interfaces for the data access layer
│   │   └── task.repository.interface.ts
│   ├── services/                  # Interfaces for infrastructure services
│   ├── config/                    # Config interfaces
│   ├── exceptions/                # Custom exceptions
│   └── logger/                    # Logger interface
│
├── use-cases/                     # Application business rules
│   └── tasks/
│       ├── create-task.use-case.ts
│       ├── get-list-tasks.use-case.ts
│       └── update-task.use-case.ts
│
├── adapters/
│   ├── controllers/               # HTTP layer
│   │   ├── common/
│   │   │   ├── guards/
│   │   │   ├── decorators/
│   │   │   └── middlewares/
│   │   └── [feature]/
│   │       ├── dto/               # Input validation
│   │       ├── presenters/        # Output transformation
│   │       └── [feature].controller.ts
│   └── gateways/                  # Real-time communication (WebSockets)
│       └── [feature]/
│           ├── dto/
│           ├── presenters/
│           └── [feature].gateway.ts
│
├── infrastructure/
│   ├── databases/postgresql/
│   │   ├── entities/              # TypeORM entities
│   │   ├── repositories/         # Repository implementations
│   │   ├── typeorm.config.ts
│   │   └── typeorm.module.ts
│   ├── services/                  # bcrypt, casl, health, jwt
│   ├── common/                    # filter, guards, interceptors, middlewares, pipes, strategies
│   ├── config/environment/
│   ├── exceptions/
│   └── logger/
│
└── modules/                       # NestJS modules (DI wiring)
    └── task.module.ts

database/
├── migrations/                    # TypeORM migration files
└── seeds/                         # Database seed files
    ├── main.ts
    ├── factories/
    └── seeders/

test/
├── adapters/controllers/
├── e2e/                           # E2E tests — organized by feature (NOT by layer)
│   ├── setup/                     # Shared: app.factory.ts, db.helper.ts, env.setup.ts
│   ├── auth/                      # auth.e2e-spec.ts
│   └── tasks/                     # tasks.e2e-spec.ts
├── infrastructure/                # filter, interceptors, pipes, strategies, config, databases, exceptions, logger, services
├── mocks/                         # Reusable mock objects for dependency injection
├── stubs/                         # Reusable stub data
└── use-cases/
```

## Core Layers

> Read **`references/layer-examples.md`** for full TypeScript code examples when implementing any layer.

### 1. Domain Layer — `src/domain/`

The core layer. **No imports from NestJS or TypeORM**. Pure TypeScript only.

- **Entities**: Business objects with `readonly` id/timestamps. Use `private _field` + getter for fields with business rules. Add methods for state transitions (e.g., `complete()`).
- **Repository interfaces**: Export both a `Symbol` constant and an `interface` with the same name. Only accept/return domain entities — never TypeORM entities.
- **Utils**: Pure helper functions shared across use cases.

### 2. Use Cases Layer — `src/use-cases/`

Contains application logic. **Only depends on the domain layer** (interfaces + entities).

- One file = one class = one `execute()` method
- File naming: `[action]-[resource].use-case.ts` / Class: `[Action][Resource]UseCase`
- Inject repository via `@Inject(ITaskRepository)` using the Symbol token

### 3. Adapters Layer — `src/adapters/controllers/`

The HTTP layer — DTOs for input validation, Presenters for output transformation, Controllers for routing.

- **DTO**: Use `class-validator` decorators + `@ApiProperty` for Swagger. Never put business logic here.
- **Presenter**: Map domain entity → response shape in the constructor.
- **Controller**: Receive request → call use case → return presenter. No `if/else` business logic. Use `@User('id')` to extract userId from JWT. Use `@CheckPolicies({ action, subject })` for authorization.

### 4. Infrastructure Layer — `src/infrastructure/`

Implements the interfaces defined in domain.

- **TypeORM entity**: Maps to a database table. Imports enums from domain entities.
- **Repository**: `implements ITaskRepository`. Always has `private toEntity()` to convert TypeORM entity → domain entity. Never exposes TypeORM entities outside.

### 5. Module — `src/modules/`

Wires dependency injection. **No logic**. Binds `ITaskRepository` Symbol → `TaskRepository` class in `providers`.

---

## Testing Conventions

> See **`references/layer-examples.md`** (section 10) for a full test example.

### Unit Tests

- Pattern: **Arrange → Act → Assert**
- Tests mirror `src/` structure under `test/` (e.g. `src/use-cases/tasks/` → `test/use-cases/tasks/`)
- Variable naming: `inputX`, `mockX`, `actualX`, `expectedX`
- Mock repositories with `jest.fn()` in `providers`
- Use stubs from `test/stubs/` for reusable data; put reusable mock provider objects in `test/mocks/`

### E2E Tests

- Live in `test/e2e/<feature>/*.e2e-spec.ts` — organized by **feature**, not by architectural layer
- Use `createE2EApp()` from `test/e2e/setup/app.factory.ts` to bootstrap the full NestJS app
- Use `runMigrations()`, `clearDatabase()`, `seedUser()` from `test/e2e/setup/db.helper.ts`
- Require `db-test` container running: `docker compose --profile e2e up db-test -d`
- Run with: `docker exec -it app-api npm run test:e2e`
- **Key gotchas:**
  - Get DI tokens via Symbol: `app.get<IBcryptService>(IBcryptService)` — not the class
  - `@Post()` returns `201` by default — not `200`
  - `set-cookie` header: cast via `as unknown as string[]`

---

## Naming Conventions

| Type         | Convention                      | Example                                                    |
| ------------ | ------------------------------- | ---------------------------------------------------------- |
| File         | kebab-case                      | `create-task.use-case.ts`                                  |
| Class        | PascalCase                      | `CreateTaskUseCase`                                        |
| Method       | camelCase + verb                | `execute()`, `findTasks()`                                 |
| Interface    | PascalCase, prefix `I`          | `ITaskRepository`                                          |
| Enum         | PascalCase + suffix `Enum`      | `TaskStatusEnum`                                           |
| DTO          | PascalCase + suffix `Dto`       | `CreateTaskDto`                                            |
| Presenter    | PascalCase + suffix `Presenter` | `CreateTaskPresenter`                                      |
| Symbol token | Same name as interface          | `export const ITaskRepository = Symbol('ITaskRepository')` |
| Boolean var  | `is`, `has`, `can` prefix       | `isUpdated`, `hasError`                                    |
| Env variable | UPPER_SNAKE_CASE                | `DATABASE_HOST`                                            |

---

## Checklist for Implementing a New Feature

When adding a new resource (e.g., `Comment`), create files in this order:

1. **Domain entity** → `src/domain/entities/comment.entity.ts`
2. **Repository interface** → `src/domain/repositories/comment.repository.interface.ts`
3. **Use cases** → `src/use-cases/comments/create-comment.use-case.ts`, etc.
4. **TypeORM entity** → `src/infrastructure/databases/postgresql/entities/comment.entity.ts`
5. **Repository implementation** → `src/infrastructure/databases/postgresql/repositories/comment.repository.ts`
6. **DTOs** → `src/adapters/controllers/comments/dto/`
7. **Presenters** → `src/adapters/controllers/comments/presenters/`
8. **Controller** → `src/adapters/controllers/comments/comments.controller.ts`
9. **Module** → `src/modules/comment.module.ts`
10. **Database migration** → `database/migrations/`
11. **Database seeds** (optional) → `database/seeds/factories/`, `database/seeds/seeders/`
12. **Tests** → `test/use-cases/comments/`, `test/adapters/controllers/comments/`, `test/infrastructure/` (if repo impl)
13. **E2E tests** → `test/e2e/comments/comments.e2e-spec.ts`

---

## Best Practices

1. **Dependency rule**: Dependencies always point inward — `infrastructure` → `domain`, `use-cases` → `domain`, never in reverse
2. **Symbol token**: Always use `Symbol` instead of string tokens for repository injection
3. **toEntity()**: Every repository implementation must have `private toEntity()` to convert TypeORM entities to domain entities
4. **Thin controller**: Controllers have no `if/else` business logic — only delegate to use cases
5. **Single use case per file**: 1 file = 1 class = 1 `execute()` method
6. **Presenter for output**: Never return domain entities directly from controllers — always wrap with a presenter
7. **@CheckPolicies**: Every endpoint requiring authorization must use this decorator

---

## CASL Authorization Pattern

> For full implementation details, code examples, and anti-patterns, read **`references/casl-authorization.md`**.

| Layer                    | Responsibility                                                                        |
| ------------------------ | ------------------------------------------------------------------------------------- |
| **CASL / PoliciesGuard** | Role-based coarse check: _"is this role allowed to perform this action?"_             |
| **UseCase / Repository** | Ownership enforcement: _"only access your own resources"_ — filter `WHERE userId = ?` |

**CASL does not enforce ownership** — that is the responsibility of the use-case/repository layer.

---

## Common Pitfalls

- **Injecting TypeORM repository directly into use case** → wrong architecture; must go through repository interface
- **Business logic in controller** → move to use case
- **Returning domain entity directly** → must wrap with presenter
- **Importing infrastructure from domain** → violates dependency rule
- **Using `any` type** → use `unknown` or declare a proper type
- **Functions over 20 lines** → extract to helper/private methods
- **Stubs defined inline in spec files** → always place in `test/stubs/*.stub.ts` and import
