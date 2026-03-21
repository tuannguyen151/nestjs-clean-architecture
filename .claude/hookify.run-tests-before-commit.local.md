---
name: run-tests-before-commit
enabled: true
event: bash
pattern: git\s+commit
---

🚫 **Run tests before committing!**

You are about to commit. Make sure all tests pass first:

```bash
# Unit tests
docker exec app-api npm run test

# E2E tests
docker exec app-api npm run test:e2e
```

Only commit when **all tests pass**. If you have already run them and they pass, proceed with the commit.
