# Project Overview

## Purpose

NestJS Clean Architecture - A backend API application built with NestJS following Clean Architecture principles.

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: NestJS
- **Database**: PostgreSQL with TypeORM
- **Auth**: JWT + bcrypt
- **Authorization**: CASL (attribute-based access control)
- **Deployment**: Docker, Serverless (AWS Lambda)
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
