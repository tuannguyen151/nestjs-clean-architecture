# Project Overview

## Purpose

NestJS Clean Architecture - A backend API application built with NestJS following Clean Architecture principles.

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: NestJS
- **Database**: PostgreSQL with TypeORM
- **Auth**: JWT + bcrypt
- **Authorization**: CASL (attribute-based access control)
- **Deployment**: Docker
- **Testing**: Jest
- **Linting**: ESLint + Prettier
- **Git hooks**: Husky + lint-staged + commitlint (Conventional Commits)

## Architecture

Clean Architecture with dependency inversion: `infrastructure` → `domain` ← `use-cases`

### Layers

- `src/domain/` — Pure business logic (no NestJS/TypeORM imports)
- `src/use-cases/` — Application business rules (1 file = 1 class = 1 `execute()` method)
- `src/adapters/` — Controllers, DTOs, presenters (HTTP layer)
- `src/infrastructure/` — Implements domain interfaces (TypeORM repos, services, config)
- `src/modules/` — NestJS DI wiring only (no logic)

### Path Aliases

- `@domain/*` → `src/domain/*`
- `@use-cases/*` → `src/use-cases/*`
- `@adapters/*` → `src/adapters/*`
- `@infrastructure/*` → `src/infrastructure/*`
- `@modules/*` → `src/modules/*`

## Key Rules

- Domain layer: no NestJS/TypeORM imports
- Use cases: inject repos via `@Inject(ITaskRepository)` Symbol
- Controllers: thin, delegate to use cases
- Presenters: always wrap domain entities before returning
- Repository implementations: private `toEntity()` method, never expose TypeORM entities
- Tests: placed in `test/` directory (mirrors `src/` structure)

## Testing

### Unit Tests

- Files: `test/**/*.spec.ts`
- Structure mirrors `src/`: `src/use-cases/tasks/` → `test/use-cases/tasks/`
- Mocks: `test/mocks/`, Stubs: `test/stubs/`

### E2E Tests

- Files: `test/e2e/<feature>/*.e2e-spec.ts` — organized by **feature**, NOT by layer
- Require separate `db-test` container: `docker compose --profile e2e up db-test -d`
- Run: `docker exec -it app-api npm run test:e2e`
- Config: `jest-e2e.json`
- Env: `.env.e2e` (loaded via `test/e2e/setup/env.setup.ts` as Jest `setupFiles`)
- Shared helpers: `test/e2e/setup/app.factory.ts`, `test/e2e/setup/db.helper.ts`
- Key gotchas:
  - Get DI tokens via Symbol: `app.get<IBcryptService>(IBcryptService)` — not the class
  - `@Post()` returns `201` by default — not `200`
  - `set-cookie` header: cast via `as unknown as string[]`
  - `db-test` connects on port `5432` internally (not host-mapped `5433`)
