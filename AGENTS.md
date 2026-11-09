# Instruções para Agentes

## Regras permanentes

- Toda atualização de versão publicada DEVE atualizar `CHANGELOG.md`.
- Toda nova página de documentação DEVE existir em EN e PT-BR e ser registrada em `web/content/translations.json`.
- Não criar `SECURITY.md`; reporte de vulnerabilidades vive em `/docs/security/report`.
- Não criar dependências sem atualizar `pnpm-lock.yaml` no mesmo commit.
- Commits seguem Conventional Commits.

## Fluxo de contribuição

1. Abrir issue descrevendo a mudança.
2. Criar changeset (`pnpm changeset`) se a mudança afeta a biblioteca.
3. Abrir PR; CI deve passar em Node 18 e 20.
4. Atualizar `CHANGELOG.md` na release, não no PR.

## i18n

- Idiomas atuais: `en` (padrão) e `pt-BR`.
- Novas línguas: adicionar em `web/i18n.config.ts`, criar `web/content/<locale>/` e atualizar `web/content/translations.json`.
