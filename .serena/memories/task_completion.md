# Task Completion Checklist

When a coding task is completed, ensure:

1. **Lint**: `docker exec -it app-api npm run lint`
2. **Format**: `docker exec -it app-api npm run format`
3. **Tests**: `docker exec -it app-api npm run test` (or `test:cov` for coverage)
4. **Build**: `docker exec -it app-api npm run build`

## For Database Changes

5. **Generate migration**: `docker exec -it app-api npm run migration:generate --name=<name>`
6. **Run migration**: `docker exec -it app-api npm run migration:run`
7. **Update TypeORM entity** at `src/infrastructure/databases/postgresql/entities/`

## For New Features

Ensure all layers are implemented:

1. Domain entity
2. Repository interface
3. Use cases
4. TypeORM entity + repository impl
5. DTOs + Presenters + Controller
6. Module wiring
7. Migration
8. Tests
