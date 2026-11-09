# pbdb documentation

The docs site is an App Router site with an Nextra-compatible content layout. Run `pnpm install`, then `pnpm --dir web dev` or `pnpm --dir web build`.

Content is mirrored in `content/en/` and `content/pt-BR/`. To add a locale, add it to `i18n.config.ts`, create the matching content folder, and update `content/translations.json`. The changelog page reads the root `CHANGELOG.md` at release time.
