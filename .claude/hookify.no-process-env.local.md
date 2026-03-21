---
name: no-process-env
enabled: true
event: file
action: block
conditions:
  - field: file_path
    operator: regex_match
    pattern: src/.*\.ts$
  - field: new_text
    operator: regex_match
    pattern: process\.env
---

**`process.env` detected in `src/`.**

Use the config service pattern instead:

1. Add getter to `src/domain/config/*.interface.ts` (e.g., `IGcsConfig`)
2. Implement it in `EnvironmentConfigService`
3. Inject via `@Inject(IMyConfig) private readonly config: IMyConfig`
4. Call `this.config.getMyValue()` instead of `process.env['MY_VALUE']`
