# Instruções para Agentes

## Regras permanentes

- Toda atualização de versão publicada DEVE atualizar `CHANGELOG.md`. Certifique-se de olhar os commits da branch e atualizar.
- Toda nova página de documentação DEVE existir em EN e PT-BR, de acordo com as linguagens implementadas e registrada em `web/content/translations.json`.
- Não criar `SECURITY.md`; reporte de vulnerabilidades vive em `/docs/security/report`.
- O gerenciador de pacotes oficial é Bun.js; sempre use `bun` e mantenha `bun.lock` atualizado.
- Todo código JavaScript novo ou alterado DEVE ser TypeScript devidamente tipado; não adicionar arquivos `.js`/`.mjs` para lógica da aplicação.
- Commits seguem Conventional Commits.

## i18n

- Novas línguas: adicionar em `web/i18n.config.ts`, criar `web/content/<locale>/` e atualizar `web/content/translations.json`.
