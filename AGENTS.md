# Instruções para Agentes

## Regras permanentes

- Toda atualização de versão publicada DEVE atualizar `CHANGELOG.md`. Certifique-se de olhar os commits da branch e atualizar.
- Toda nova página de documentação DEVE existir em EN e PT-BR, de acordo com as linguagens implementadas e registrada em `web/content/translations.json`.
- Não criar `SECURITY.md`; reporte de vulnerabilidades vive em `/docs/security/report`.
- O gerenciador de pacotes oficial é Bun.js; sempre use `bun` e mantenha `bun.lock` atualizado.
- Todo código JavaScript novo ou alterado DEVE ser TypeScript devidamente tipado; não adicionar arquivos `.js`/`.mjs` para lógica da aplicação.
- Commits seguem Conventional Commits.
- Para atualizações deste projeto, usar os prefixos solicitados pelo proprietário: `Update:` para atualização, `Fix:` para correção, `Delete:` para remoção e `Added:` para adição. Cada fase P0–P3 deve ter seu próprio commit e push após a verificação verde.
- Não avançar para a próxima fase sem `bun run ci` verde; quando aplicável, validar também `bun run test:e2e` e `npm pack --dry-run`.
- Manter `web/` sincronizado com a API e os serviços realmente disponíveis no código, em EN e PT-BR.

## i18n

- Novas línguas: adicionar em `web/i18n.config.ts`, criar `web/content/<locale>/` e atualizar `web/content/translations.json`.
