---
name: no-eslint-disable
enabled: true
event: file
action: block
conditions:
  - field: file_path
    operator: regex_match
    pattern: src/.*\.ts$
  - field: new_text
    operator: regex_match
    pattern: eslint-disable
---

**eslint-disable detected in `src/`.**

Fix the root cause instead of suppressing the lint error:

- `@typescript-eslint/no-unsafe-*` → add proper types or use typed imports
- `@typescript-eslint/no-require-imports` → use ES `import` syntax; if the package lacks `exports` in package.json, add a `.d.ts` declaration file
- `import/no-unresolved` → check tsconfig path aliases or add the package to `eslint.config.mjs` ignorePatterns
