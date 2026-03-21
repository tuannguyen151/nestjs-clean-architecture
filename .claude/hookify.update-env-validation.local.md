---
name: update-env-validation
enabled: true
event: file
conditions:
  - field: file_path
    operator: contains
    pattern: environment-config.service.ts
  - field: new_text
    operator: regex_match
    pattern: configService\.get
---

⚠️ **New env var detected in environment-config.service.ts!**

You are adding or modifying an env var. Make sure to also update:

1. **`environment-config.validation.ts`** — add a field with the appropriate decorator (`@IsString() @IsNotEmpty()` or matching type)
2. **`environment-config.validation.spec.ts`** — add the key to the base config object and the `keys[]` array
3. **`.env.example`** — add the new variable with an example value

If you are only changing existing logic (not adding a new env var), ignore this warning.
