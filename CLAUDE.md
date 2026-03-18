# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start

```bash
cp .env.example .env
docker compose build
docker compose up
npx husky  # initialize git hooks (first time only)
```

## Commands (chạy trong container app-api)

```bash
# Shell vào container
docker exec -it app-api bash

# Build
docker exec -it app-api npm run build

# Development (hot-reload)
docker exec -it app-api npm run start:dev

# Test
docker exec -it app-api npm run test:cov
docker exec -it app-api npm run test
docker exec -it app-api npm run test:watch <test-file>
docker exec -it app-api npm run test:e2e

# Lint & Format
docker exec -it app-api npm run lint
docker exec -it app-api npm run format

# Database migration
docker exec -it app-api npm run migration:run
docker exec -it app-api npm run migration:revert
docker exec -it app-api npm run migration:generate --name=<kebab-case-name>
docker exec -it app-api npm run migration:create --name=<kebab-case-name>

# Seed data
docker exec -it app-api npm run seed:run

# Install package
docker exec -it app-api npm install <package-name>
```

## Architecture (Clean Architecture)

Dependencies always point **inward**: `infrastructure` → `domain` ← `use-cases`, never reverse.

```text
src/
  domain/              # Pure business logic — no NestJS/TypeORM imports
    entities/          # Domain entities
    repositories/      # Repository interfaces (contracts)
    services/          # Domain services
    exceptions/        # Domain exceptions
    utils/             # Domain utilities
  use-cases/           # Application business rules — only depends on domain
  adapters/            # Controllers, DTOs, presenters (HTTP layer)
  infrastructure/      # Implements domain interfaces
    databases/         # TypeORM entities, repositories, config
    services/          # Infrastructure services (JWT, bcrypt, etc.)
    config/            # App configuration
  modules/             # NestJS DI wiring only — no logic
```

**Path aliases:** `@domain/*`, `@use-cases/*`, `@adapters/*`, `@infrastructure/*`, `@modules/*`

### Key Architectural Rules

- **Domain layer**: no NestJS/TypeORM imports — pure TypeScript only
- **Use cases**: 1 file = 1 class = 1 `execute()` method; inject repos via `@Inject(ITaskRepository)` Symbol
- **Controllers**: thin — no `if/else` business logic, only delegate to use cases; use `@User('id')` for JWT userId, `@CheckPolicies({ action, subject })` for authorization
- **Presenters**: always wrap domain entities before returning from controllers
- **Repository implementations**: must have private `toEntity()` to convert TypeORM entity → domain entity; never expose TypeORM entities outside
- **Modules**: bind `IRepository` Symbol → concrete class in `providers`

## Tests

- Test files: `test/**/*.spec.ts` (not inside `src/`)
- Structure mirrors `src/`: `src/use-cases/tasks/` → `test/use-cases/tasks/`
- Mocks: `test/mocks/`, Stubs: `test/stubs/`
- Pattern: **Arrange → Act → Assert**; variable naming: `inputX`, `mockX`, `actualX`, `expectedX`
- Run tests inside the Docker container

## Naming Conventions

| Type         | Convention                      | Example                                                    |
| ------------ | ------------------------------- | ---------------------------------------------------------- |
| File         | kebab-case                      | `create-task.use-case.ts`                                  |
| Class        | PascalCase                      | `CreateTaskUseCase`                                        |
| Interface    | PascalCase, prefix `I`          | `ITaskRepository`                                          |
| Symbol token | Same name as interface          | `export const ITaskRepository = Symbol('ITaskRepository')` |
| Enum         | PascalCase + suffix `Enum`      | `TaskStatusEnum`                                           |
| DTO          | PascalCase + suffix `Dto`       | `CreateTaskDto`                                            |
| Presenter    | PascalCase + suffix `Presenter` | `CreateTaskPresenter`                                      |

## Checklist for New Feature (e.g., `Comment`)

1. Domain entity → `src/domain/entities/comment.entity.ts`
2. Repository interface → `src/domain/repositories/comment.repository.interface.ts`
3. Use cases → `src/use-cases/comments/`
4. TypeORM entity → `src/infrastructure/databases/postgresql/entities/`
5. Repository impl → `src/infrastructure/databases/postgresql/repositories/`
6. DTOs + Presenters → `src/adapters/controllers/comments/`
7. Controller → `src/adapters/controllers/comments/comments.controller.ts`
8. Module → `src/modules/comment.module.ts`
9. Migration → `database/migrations/` (run `migration:generate`)
10. Tests → `test/use-cases/comments/`, `test/adapters/controllers/comments/`, `test/infrastructure/` (nếu có repo impl)

## Key Gotchas

- **All npm commands run in container:** `docker exec -it app-api <cmd>`
- **Migration files:** placed at `database/migrations/`, named kebab-case
- **After creating migration:** update TypeORM entity at `src/infrastructure/databases/postgresql/entities/`
- **Commit message:** follow Conventional Commits (commitlint enforced)
- **Pre-commit hook:** auto-runs prettier, eslint, tsc — fix errors before committing
