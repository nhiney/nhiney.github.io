# Project agent rules

These rules apply to **every** agent and contributor working in this repository.

## Commit identity (MANDATORY — do not change)

All commits in this repository — on **every** branch, including `gh-pages`
deploy commits — MUST be authored **and** committed by:

```
Nguyễn Thị Yến Nhi <nhiyen.engineer@gmail.com>
```

This is a public repository. No other name or email may ever appear as the
author or committer of a commit (in particular, do not leak any developer's
personal git identity). Do **not** add `Co-Authored-By` trailers or any
AI/tool attribution.

Before committing, make sure the repo-local identity is set:

```bash
git config user.name  "Nguyễn Thị Yến Nhi"
git config user.email "nhiyen.engineer@gmail.com"
```

Enforcement:
- The repo-local `user.name` / `user.email` are set to the identity above.
- A versioned `pre-commit` hook (`.githooks/pre-commit`, wired via
  `core.hooksPath`) blocks any commit whose author or committer email is not
  `nhiyen.engineer@gmail.com`.

Do not weaken, bypass (`--no-verify`), or remove this hook, and do not change
this rule.
