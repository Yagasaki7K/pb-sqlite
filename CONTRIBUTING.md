# Contributing to pbdb

pbdb is a browser-only SQLite library forked from lona-q. Node 18+ and pnpm are required.

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

Use Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`, `ci:`, `chore:`). Library changes need a Changeset. Translations are welcome: add or update both `web/content/en/` and `web/content/pt-BR/`, then update `web/content/translations.json`.
