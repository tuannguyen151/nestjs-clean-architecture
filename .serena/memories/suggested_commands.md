# Suggested Commands

All commands must be run inside the Docker container `app-api`.

## Development

```bash
docker compose up -d                      # Start all services
docker exec -it app-api bash              # Shell into container
docker exec -it app-api npm run start:dev # Hot-reload development
docker exec -it app-api npm run build     # Build
```

## Testing

```bash
docker exec -it app-api npm run test          # Run all tests
docker exec -it app-api npm run test:cov      # Coverage report
docker exec -it app-api npm run test:watch <test-file>  # Watch mode
docker exec -it app-api npm run test:e2e      # E2E tests
```

## Lint & Format

```bash
docker exec -it app-api npm run lint    # ESLint fix
docker exec -it app-api npm run format  # Prettier
```

## Database Migrations (always in Docker)

```bash
docker exec -it app-api npm run migration:run
docker exec -it app-api npm run migration:revert
docker exec -it app-api npm run migration:generate --name=<kebab-case-name>
docker exec -it app-api npm run migration:create --name=<kebab-case-name>
```

## Seeding

```bash
docker exec -it app-api npm run seed:run
```

## Package Management

```bash
docker exec -it app-api npm install <package-name>
```

## System Utilities (macOS/Darwin)

- `git`, `ls`, `cd`, `grep`, `find` work as expected
- Use `sed -i ''` (BSD sed) instead of `sed -i` (GNU)
