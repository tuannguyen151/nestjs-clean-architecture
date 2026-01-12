# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NestJS-based serverless application implementing Clean Architecture principles with TypeScript. The project uses PostgreSQL with TypeORM, supports JWT authentication, and can be deployed using the Serverless Framework.

**Node.js version:** 24.12.0 (see .nvmrc)

## Key Commands

### Docker-based Development

```bash
# Build the application
docker compose build

# Start all services
docker compose up

# Execute commands in container
docker exec -it app-api bash

# Install new package
docker exec -it app-api npm install <package-name>
```

### Testing

```bash
# Run all tests
docker exec -it app-api npm run test

# Run tests with coverage
docker exec -it app-api npm run test:cov

# Watch mode for specific test file
docker exec -it app-api npm run test:watch <test-file>

# E2E tests
docker exec -it app-api npm run test:e2e
```

### Database Migrations

```bash
# Run migrations
docker exec -it app-api npm run migration:run

# Revert last migration
docker exec -it app-api npm run migration:revert

# Generate migration from entities (--name flag is required)
docker exec -it app-api npm run migration:generate --name=<migration-name>

# Create empty migration file
docker exec -it app-api npm run migration:create --name=<migration-name>
```

### Code Quality

```bash
# Run linter with auto-fix
docker exec -it app-api npm run lint

# Format code
docker exec -it app-api npm run format
```

### Serverless

```bash
# Create deployment package
docker exec -it app-api sh serverless_zip.sh

# Run serverless offline (uses port 4000)
npm run start:dev
```

### Local Development (without Docker)

```bash
# Install dependencies (first time)
npm install

# Initialize Husky hooks
npx husky

# Start in watch mode
npm run start:dev

# Build for production
npm run build

# Start production build
npm run start:prod
```

## Clean Architecture Structure

This project follows Clean Architecture with four distinct layers:

### 1. Domain Layer (`src/domain`)

- **Purpose:** Contains business logic and rules, completely independent of frameworks
- **entities:** Business objects (e.g., UserEntity, TaskEntity)
- **repositories:** Repository interfaces (e.g., IUserRepository)
- **services:** Service interfaces for infrastructure concerns (e.g., IBcryptService)
- **config:** Configuration interfaces (e.g., IDatabaseConfig, IJwtConfig)
- **exceptions:** Domain exception interfaces (IException)
- **logger:** Logger interface (ILogger)
- **utils:** Pure utility functions (e.g., StringUtils)

**Key rule:** Domain layer defines interfaces only, never implementations. No external dependencies allowed.

### 2. Use Cases Layer (`src/use-cases`)

- **Purpose:** Application-specific business rules
- Contains use case classes that orchestrate domain entities and repositories
- Examples: `LoginUseCase`, `CreateTaskUseCase`, `RefreshUseCase`
- Use cases inject repository interfaces from domain layer

### 3. Adapters Layer (`src/adapters`)

- **Purpose:** Converts data between use cases and external world

**Controllers** (`src/adapters/controllers/[feature]`):

- Handle HTTP requests
- Structure: `dto/`, `presenters/`, `[feature].controller.ts`
- DTOs validate incoming data using class-validator
- Presenters transform domain entities to API responses

**Gateways** (`src/adapters/gateways/[feature]`):

- Handle WebSocket communication
- Structure: `dto/`, `presenters/`, `[feature].gateway.ts`

**Common utilities:**

- `guards/`: Route protection (authentication/authorization)
- `decorators/`: Custom parameter/method decorators
- `middlewares/`: Request preprocessing (controller-specific)

### 4. Infrastructure Layer (`src/infrastructure`)

- **Purpose:** Implements domain interfaces with concrete technologies

**databases/postgresql:**

- `entities/`: TypeORM entities (database schema)
- `repositories/`: Repository implementations using TypeORM
- `typeorm.config.ts`: Database connection configuration
- `typeorm.module.ts`: TypeORM module setup

**common:**

- `guards/`: Security guards (JWT, roles, policies)
- `interceptors/`: Request/response transformation
- `pipes/`: Validation and data transformation
- `middlewares/`: Global middleware (e.g., maintenance mode)
- `strategies/`: Passport authentication strategies
- `filter/`: Exception filters for HTTP responses

**config:** Configuration service implementations
**services:** External service implementations (email, APIs)
**logger:** Logger implementation
**exceptions:** Exception handling implementation

### 5. Modules Layer (`src/modules`)

Organizes features into NestJS modules (e.g., AuthModule, TasksModule) by wiring together adapters, use cases, and infrastructure.

## Path Aliases

Configure in both `tsconfig.json` and `jest` config:

```typescript
@domain/*       → src/domain/*
@use-cases/*    → src/use-cases/*
@adapters/*     → src/adapters/*
@infrastructure/* → src/infrastructure/*
@modules/*      → src/modules/*
test/*          → test/*
```

## Security Guidelines

### Domain Layer Security

- Keep entities simple with readonly IDs
- Use enums for controlled values (roles, status)
- Repository interfaces must include user context for data isolation
- Configuration interfaces never expose defaults or sensitive data
- Service interfaces hide implementation details (e.g., IBcryptService exposes hash/compare only)

### Infrastructure Security

- Use parameterized queries (TypeORM handles this)
- Validate all environment variables at startup
- Never log passwords, tokens, or PII
- Implement proper exception filters that don't leak internal details

### Adapters Security

- Validate all inputs with class-validator DTOs
- Use `whitelist: true` in ValidationPipe to strip unknown properties
- Presenters must explicitly map fields (no object spreading)
- Apply JwtAuthGuard and role guards on protected routes
- Implement rate limiting on sensitive endpoints

### Authentication Flow

- JWT-based authentication with access and refresh tokens
- Access tokens: Short-lived, used for API requests
- Refresh tokens: Longer-lived, used to obtain new access tokens
- Passwords hashed with bcrypt (implemented in infrastructure layer)
- CASL used for attribute-based access control

## Testing Structure

- **Test location:** `test/` directory (separate from `src/`)
- **Test stubs:** Reusable mock data in `test/stubs/`
- **Convention:** Arrange-Act-Assert pattern
- **Naming:** `inputX`, `mockX`, `actualX`, `expectedX`
- **Unit tests:** Test each public function with mocked dependencies
- **E2E tests:** Use `jest-e2e.json` configuration

## Code Style Guidelines

### TypeScript

- Use PascalCase for classes and interfaces
- Use camelCase for variables, functions, and methods
- Use kebab-case for file and directory names
- Use UPPER_CASE for environment variables
- Always declare explicit types (avoid `any`)
- Use readonly for immutable properties
- Prefer interfaces over types for object definitions
- Use strict mode in TypeScript configuration

### Functions

- Functions should be small (<20 instructions) with single purpose
- Start function names with verbs
- Use `isX`, `hasX`, `canX` for boolean returns
- Use arrow functions for callbacks (<3 instructions)
- Avoid nesting; use early returns
- Use RO-RO pattern (Receive Object, Return Object) for complex parameters

### Clean Code Principles

- Replace magic numbers with named constants
- Don't comment what code does; make code self-documenting
- Extract repeated code into reusable functions (DRY)
- Functions follow single responsibility principle
- Avoid abbreviations unless universally understood

### NestJS Patterns

- Use dependency injection with tokens (e.g., `USER_REPOSITORY`, `BCRYPT_SERVICE`)
- Implement guards for authentication/authorization
- Use interceptors for cross-cutting concerns (logging, transformation)
- Use pipes for validation and transformation
- Keep modules focused on specific features

## Maintenance Mode

Set environment variables to enable maintenance mode:

```env
MAINTENANCE_MODE=true
MAINTENANCE_MESSAGE=System is under maintenance
```

When enabled, all requests return 503 with the maintenance message.

## API Documentation

Swagger documentation available at `http://localhost:3000/api` when running.

## Dependency Injection Tokens

When implementing domain interfaces, use string tokens for injection:

```typescript
// Domain layer
export const USER_REPOSITORY = 'USER_REPOSITORY_INTERFACE'
export interface IUserRepository { ... }

// Module registration
providers: [
  {
    provide: USER_REPOSITORY,
    useClass: UserRepository
  }
]

// Use case injection
constructor(
  @Inject(USER_REPOSITORY)
  private readonly userRepository: IUserRepository
) {}
```

## Key Architectural Decisions

1. **Strict Layer Separation:** Domain layer has zero dependencies on external frameworks
2. **Interface-Driven:** All infrastructure concerns defined as interfaces in domain layer
3. **Feature-Based Organization:** Controllers/gateways organized by feature, not by technical concern
4. **Test Isolation:** Tests in separate directory with dedicated stubs
5. **Path Aliases:** Use path aliases consistently to avoid relative import hell
6. **Security First:** Validation at boundaries, authorization in use cases, authentication in infrastructure
