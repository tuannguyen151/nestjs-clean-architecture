# Code Style & Conventions

## Naming Conventions

| Type         | Convention                      | Example                     |
| ------------ | ------------------------------- | --------------------------- |
| File         | kebab-case                      | `create-task.use-case.ts`   |
| Class        | PascalCase                      | `CreateTaskUseCase`         |
| Interface    | PascalCase, prefix `I`          | `ITaskRepository`           |
| Symbol token | Same name as interface          | `Symbol('ITaskRepository')` |
| Enum         | PascalCase + suffix `Enum`      | `TaskStatusEnum`            |
| DTO          | PascalCase + suffix `Dto`       | `CreateTaskDto`             |
| Presenter    | PascalCase + suffix `Presenter` | `CreateTaskPresenter`       |

## Code Patterns

- **Use cases**: 1 file = 1 class = 1 `execute()` method
- **Controllers**: thin — no business logic, delegate to use cases
- **Repository implementations**: must have private `toEntity()` for TypeORM → domain conversion
- **Modules**: bind `IRepository` Symbol → concrete class in `providers`
- **Domain entities**: pure TypeScript, no framework imports

## Testing

- Test files: `test/**/*.spec.ts` (not inside `src/`)
- Pattern: **Arrange → Act → Assert**
- Variable naming: `inputX`, `mockX`, `actualX`, `expectedX`
- Mocks in `test/mocks/`, Stubs in `test/stubs/`

## Git

- Conventional Commits enforced by commitlint
- Pre-commit hooks: prettier, eslint, tsc
