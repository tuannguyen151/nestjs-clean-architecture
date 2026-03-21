---
name: no-nestjs-exceptions
enabled: true
event: file
action: block
conditions:
  - field: file_path
    operator: regex_match
    pattern: src/use-cases/.*\.ts$
  - field: new_text
    operator: regex_match
    pattern: (NotFoundException|ConflictException|BadRequestException|UnauthorizedException|ForbiddenException|InternalServerErrorException)\(
---

**NestJS core exception detected in `src/use-cases/`.**

Use the `IException` service instead:

```typescript
@Inject(IException)
private readonly exceptionsService: IException,
```

Mapping:

- `NotFoundException` → `this.exceptionsService.notFoundException({ type: 'NotFound', message: '...' })`
- `ConflictException` / `BadRequestException` → `this.exceptionsService.badRequestException(...)`
- `UnauthorizedException` → `this.exceptionsService.unauthorizedException(...)`
- `ForbiddenException` → `this.exceptionsService.forbiddenException(...)`
