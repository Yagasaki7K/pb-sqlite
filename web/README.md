# pbdb documentation

The docs site uses the Nextra 4 App Router and official docs theme. Run `bun install`, then `bun run --cwd web dev` or `bun run --cwd web build`.

Content is mirrored in `content/en/` and `content/pt-BR/`. To add a locale, add it to `i18n.config.ts`, create the matching content folder, and update `content/translations.json`. The changelog page reads the root `CHANGELOG.md` at release time.
