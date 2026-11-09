# Contributing to pbdb

pbdb is a browser-only SQLite library forked from lona-q. Node 18+ and Bun.js are required.

```bash
bun install --frozen-lockfile
bun run typecheck
bun run lint
bun run test
bun run build
```

Use Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`, `ci:`, `chore:`). Library changes need a Changeset. Translations are welcome: add or update both `web/content/en/` and `web/content/pt-BR/`, then update `web/content/translations.json`.
