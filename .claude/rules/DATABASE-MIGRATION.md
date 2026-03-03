# Database Migration

All migration commands **must** be run inside the `app-api` Docker container using the npm scripts defined in `package.json`.

## Commands

| Action                         | Command                                                                      |
| ------------------------------ | ---------------------------------------------------------------------------- |
| Run migrations                 | `docker exec -it app-api npm run migration:run`                              |
| Revert last migration          | `docker exec -it app-api npm run migration:revert`                           |
| Generate migration from entity | `docker exec -it app-api npm run migration:generate --name=<migration-name>` |
| Create empty migration         | `docker exec -it app-api npm run migration:create --name=<migration-name>`   |

## Rules

**Do:**

- Always prefix commands with `docker exec -it app-api`
- Always use npm scripts (`npm run migration:*`)
- Name migrations in **kebab-case** that clearly describe the change (e.g. `add-email-to-users`)
- Place migration files in `database/migrations/`
- **Always create a new migration** for any database schema change (add/remove/rename table, column, index, constraint, relation, etc.)

**Don't:**

- Run migration commands directly on the host machine
- Call the `typeorm` CLI directly — always use npm scripts
- Modify the database schema directly (via SQL, DB GUI tools, or editing existing migration files)
- Edit an already-committed migration file — create a new one instead

## TypeORM Entity

After creating or modifying a migration, **always** update the corresponding TypeORM entity at `src/infrastructure/databases/postgresql/entities/`.

| Case                         | Action                                                        |
| ---------------------------- | ------------------------------------------------------------- |
| New migration (new table)    | Create a new TypeORM entity                                   |
| Add / remove / rename column | Update the corresponding entity                               |
| Add relation                 | Add `@ManyToOne`, `@OneToMany`, etc. decorators to the entity |

> TypeORM entities are the source of truth for the schema — always keep entities in sync with migrations.
