## Melhorias necessárias para o PBDB — Roadmap de lançamento 1.0

# PBDB — Roadmap revisado para lançamento 1.0

Após analisar os requisitos e confrontá-los com a proposta e a implementação atual do repositório, minha conclusão é que a maior parte da direção técnica faz sentido, mas o roadmap original está superdimensionado para a versão 1.0.

O PBDB tem uma proposta bem definida:

- Banco de dados SQLite executado diretamente no navegador.
- Persistência local utilizando OPFS.
- SQLite compilado em WebAssembly por meio do `wa-sqlite`.
- Execução isolada em Web Workers.
- Coordenação de múltiplas abas.
- API assíncrona para JavaScript/TypeScript.
- Integração com React.
- Migrations.
- Exportação e importação de bancos.
- Funcionamento offline e sem infraestrutura de backend.

Consultei também o README, o `package.json` e os módulos principais do código-fonte.

Alguns problemas importantes encontrados na implementação atual:

1. O `createDB()` exige OPFS e não possui fallback real para armazenamento alternativo.
2. O fallback quando Web Locks não está disponível cria Workers independentes, não garantindo a coordenação entre abas.
3. A recuperação de falhas do OPFS pode apagar automaticamente o diretório do banco, colocando dados existentes em risco.
4. O `importSQLite()` apaga o armazenamento antes de validar e restaurar o arquivo, sem restauração atômica.
5. O método `purgeSynced()` possui uma referência fixa à tabela `vendas`, que não pertence à responsabilidade de uma biblioteca genérica.
6. O gerenciamento de encerramento e recuperação do líder precisa de melhorias.
7. A documentação apresenta inconsistências de nomenclatura e ainda contém referências a LonaQ.

Esses pontos são mais importantes para o lançamento do que adicionar dezenas de integrações e funcionalidades secundárias.

## 1. Núcleo do banco de dados

- Implementar gerenciamento completo do ciclo de vida das conexões SQLite.
- Implementar suporte a múltiplas instâncias de bancos independentes.
- Implementar gerenciamento seguro de abertura e fechamento de conexões.
- Implementar suporte a prepared statements.
- Implementar gerenciamento automático de statements e liberação de memória.
- Implementar suporte a transações SQLite.
- Implementar suporte a savepoints e transações aninhadas.
- Implementar execução atômica de múltiplas consultas com `batch()`.
- Implementar suporte a consultas com `RETURNING`.
- Implementar suporte a BLOBs, Uint8Array, ArrayBuffer, bigint e demais tipos compatíveis com SQLite.
- Implementar suporte a `ATTACH DATABASE` e `DETACH DATABASE`.
- Implementar suporte a consultas `PRAGMA` por meio da API SQL.
- Implementar configurações de `busy_timeout` e `foreign_keys`.
- Implementar configurações de journal mode e synchronous, respeitando as limitações do VFS utilizado.
- Implementar verificações de integridade utilizando `PRAGMA integrity_check`.
- Implementar verificações de chaves estrangeiras utilizando `PRAGMA foreign_key_check`.
- Implementar API de introspecção para consultar tabelas, índices, views, triggers e schemas.
- Implementar tratamento padronizado de erros SQLite, preservando códigos e mensagens originais.
- Implementar cancelamento de consultas de longa duração.
- Implementar modo `readOnly` para conexões somente de leitura.

## 2. OPFS e persistência

- Implementar detecção automática de suporte a OPFS.
- Implementar estratégia de fallback para armazenamento alternativo quando OPFS não estiver disponível.
- Implementar seleção configurável da estratégia de armazenamento.
- Implementar recuperação segura após falhas de inicialização do OPFS.
- Implementar tratamento de corrupção do arquivo SQLite sem apagar automaticamente os dados existentes.
- Implementar recuperação de conexões interrompidas.
- Implementar gerenciamento de locks entre abas.
- Garantir que nunca existam dois líderes operando simultaneamente o mesmo banco.
- Implementar detecção de líderes inativos.
- Implementar recuperação automática de liderança após encerramento inesperado do líder.
- Implementar tratamento de encerramento inesperado do Web Worker.
- Implementar recuperação de operações interrompidas durante o failover.
- Implementar sincronização consistente de mensagens entre líder e seguidores.
- Implementar identificação única de requisições para evitar execução duplicada após reconexões.
- Implementar controle de timeout para requisições entre abas.
- Implementar tratamento de `QuotaExceededError`.
- Implementar detecção de quota disponível utilizando Storage API.
- Implementar integração com `navigator.storage.persist()`.
- Implementar API para consultar o espaço utilizado pelo banco.
- Implementar API para excluir bancos e liberar recursos do OPFS.
- Implementar testes de persistência após fechamento e reabertura do navegador.
- Implementar testes de concorrência com múltiplas abas e múltiplas conexões.

## 3. API e experiência de desenvolvimento

- Padronizar a API pública do PBDB para JavaScript e TypeScript.
- Implementar uma API SQL utilizando Tagged Template Literals, com parâmetros automaticamente vinculados.
- Implementar `batch()` para execução de múltiplas consultas em uma única transação.
- Implementar `reactiveQuery()` independente de frameworks.
- Implementar sistema de subscriptions para acompanhar alterações nas tabelas.
- Implementar notificações de alterações entre abas.
- Implementar callbacks `onInit`, `onConnect` e `onClose`.
- Implementar configuração `verbose` para depuração.
- Implementar configuração `debug` para diagnóstico.
- Implementar configuração `readOnly`.
- Implementar configuração `databasePath`.
- Implementar API de eventos para conexão, desconexão, erro, recuperação e failover.
- Implementar suporte a operações assíncronas com cancelamento.
- Implementar métodos `deleteDatabase()` e `overwriteDatabaseFile()`.
- Implementar validação dos parâmetros recebidos pelas APIs.
- Implementar documentação e contratos TypeScript para todas as APIs públicas.
- Garantir compatibilidade consistente entre ESM e CommonJS.

## 4. React e Next.js

- Implementar integração oficial com React 18 e React 19.
- Implementar Provider com gerenciamento correto do ciclo de vida do banco.
- Implementar `useDatabase()` como hook de acesso à instância.
- Implementar `useQuery()` com atualização automática.
- Implementar `useMutation()` para operações de escrita.
- Implementar `useReactiveQuery()` para subscriptions.
- Implementar `useTransaction()` para operações transacionais.
- Implementar `useDatabaseStatus()` para monitoramento da conexão.
- Implementar `useDatabaseReady()` para identificar quando o banco está disponível.
- Implementar estados padronizados de loading, error e success.
- Implementar tratamento de desmontagem de componentes durante consultas.
- Implementar prevenção de atualizações desnecessárias de componentes.
- Garantir compatibilidade com React Strict Mode.
- Garantir compatibilidade com Next.js App Router.
- Garantir compatibilidade com Next.js Pages Router.
- Implementar exemplos com Server Components e Client Components, respeitando as limitações de execução no navegador.
- Garantir que imports do pacote não executem APIs exclusivas do navegador durante SSR.
- Garantir funcionamento em builds de produção da Vercel.
- Implementar testes E2E com aplicações Next.js reais.

## 5. Integração com ORMs e ferramentas

- Criar arquitetura de adaptadores independentes para integrações externas.
- Implementar integração oficial com Drizzle ORM.
- Implementar integração oficial com Kysely.
- Garantir inferência correta de tipos nas consultas integradas.
- Implementar suporte a migrations dos ORMs integrados.
- Implementar exemplos de CRUD utilizando Drizzle.
- Implementar exemplos de CRUD utilizando Kysely.
- Garantir que integrações não introduzam dependências obrigatórias desnecessárias.
- Criar exports independentes para cada integração.

## 6. Migrations e gerenciamento de schemas

- Implementar sistema de migrations versionadas.
- Implementar controle de migrations aplicadas no próprio banco.
- Implementar execução automática de migrations pendentes.
- Implementar transações durante a execução de migrations.
- Implementar rollback de migrations.
- Implementar validação da sequência de migrations.
- Implementar prevenção de execução duplicada.
- Implementar tratamento de falhas durante migrations.
- Implementar migrations com suporte a múltiplos arquivos.
- Implementar API para consultar o histórico de migrations.
- Implementar validação de integridade das migrations por checksum.
- Implementar documentação sobre estratégias de atualização de schemas.

## 7. Exportação, importação e backup

- Garantir que `exportSQLite()` produza um arquivo SQLite binário válido.
- Implementar `importSQLite()` com validação do arquivo recebido.
- Implementar validação do cabeçalho SQLite.
- Implementar validação de integridade antes da restauração.
- Implementar exportação por Blob, File e Uint8Array.
- Implementar importação por File, Blob, ArrayBuffer e Uint8Array.
- Implementar suporte a arquivos `.sqlite`, `.sqlite3` e `.db`.
- Implementar substituição segura de bancos existentes.
- Implementar backup sem interromper operações normais, respeitando as limitações do VFS.
- Implementar restauração atômica.
- Implementar proteção contra importação de arquivos inválidos.
- Implementar testes com bancos SQLite externos, criados pelo SQLite convencional.
- Implementar testes de round-trip entre exportação e importação.
- Implementar exemplos de download e upload de arquivos SQLite pelo navegador.
- Documentar a diferença entre exportação SQLite binária e exportação lógica em JSON.

## 8. Offline-first e confiabilidade

- Implementar comportamento consistente quando o dispositivo ficar offline.
- Garantir que operações locais não dependam de conexão com servidores externos.
- Implementar persistência após reinicialização do navegador.
- Implementar recuperação após encerramento inesperado da aplicação.
- Implementar monitoramento de disponibilidade do armazenamento.
- Implementar proteção contra perda de dados durante atualizações.
- Implementar mecanismo de recuperação após falhas do Worker.
- Implementar testes de funcionamento em modo avião.
- Implementar testes com armazenamento limitado.
- Implementar testes com diferentes políticas de limpeza de armazenamento dos navegadores.
- Documentar que OPFS pertence à origem e ao perfil do navegador, não à conta do usuário.
- Documentar que exportação/importação não representa sincronização automática entre dispositivos.

## 9. Segurança

- Implementar isolamento adequado entre bancos independentes.
- Implementar proteção contra acesso acidental a bancos de outras aplicações.
- Implementar validação de nomes e caminhos de bancos.
- Garantir parametrização de consultas SQL.
- Evitar concatenação insegura de parâmetros SQL.
- Implementar tratamento seguro de mensagens entre Workers.
- Implementar validação de origem e identificação das mensagens entre abas.
- Implementar proteção contra operações simultâneas inconsistentes.
- Documentar as limitações de segurança do armazenamento local.
- Documentar que os dados armazenados no navegador não possuem criptografia automática.
- Implementar testes de isolamento entre diferentes origens e bancos.

## 10. Performance

- Implementar benchmarks de leitura e escrita.
- Implementar benchmarks de consultas complexas com JOINs.
- Implementar benchmarks de transações com grandes volumes de registros.
- Implementar testes com bancos de 10 MB, 100 MB e 1 GB, respeitando as limitações dos navegadores.
- Implementar otimização de transferência de dados entre Worker e aplicação.
- Implementar transferência de buffers utilizando Transferable Objects quando aplicável.
- Implementar consultas paginadas.
- Implementar suporte a processamento de grandes resultados sem bloquear a memória.
- Implementar otimização de subscriptions para evitar consultas redundantes.
- Implementar monitoramento de memória do Worker.
- Implementar benchmarks comparativos com SQLocal.

## 11. Testes e qualidade

- Implementar cobertura de testes unitários para todas as APIs públicas.
- Implementar testes de integração com SQLite real.
- Implementar testes E2E em Chromium.
- Implementar testes E2E em Firefox.
- Implementar testes E2E em WebKit.
- Implementar testes de persistência OPFS.
- Implementar testes de failover entre duas ou mais abas.
- Implementar testes de concorrência durante operações de escrita.
- Implementar testes de recuperação após encerramento do Worker.
- Implementar testes de exportação e importação de arquivos externos.
- Implementar testes de migrations.
- Implementar testes de SSR e hidratação do Next.js.
- Implementar testes de compatibilidade com React 18 e 19.
- Implementar testes de compatibilidade entre diferentes versões de navegadores.
- Implementar cobertura mínima obrigatória de 90% para a lógica principal.
- Implementar CI automatizada com Bun.
- Implementar validação de TypeScript, ESLint, testes e build em cada Pull Request.
- Implementar testes de instalação do pacote publicado, não apenas do workspace.
- Implementar testes de instalação com `bun install --frozen-lockfile`.

## 12. Documentação e site

- Refazer o README.md com apresentação profissional.
- Utilizar a logo oficial do PBDB.
- Criar uma apresentação clara da proposta do PBDB.
- Criar seção de funcionalidades com indicadores de implementação.
- Criar seção de compatibilidade com navegadores.
- Criar seção de requisitos técnicos.
- Criar seção de instalação com Bun.
- Criar Quick Start com TypeScript.
- Criar exemplos completos com JavaScript/TypeScript.
- Criar exemplos completos com React.
- Criar exemplos completos com Next.js App Router.
- Criar exemplos completos com Next.js Pages Router.
- Criar exemplos de utilização com Vercel.
- Criar exemplos de aplicações offline-first.
- Criar exemplos de exportação e importação SQLite.
- Criar exemplos de migrations.
- Criar documentação de todas as configurações disponíveis.
- Criar documentação de todas as APIs públicas.
- Criar documentação de erros e soluções.
- Criar guia de troubleshooting.
- Criar guia de migração para PBDB.
- Criar seção de comparação com alternativas existentes.
- Criar seção de arquitetura interna.
- Criar seção de limitações conhecidas.
- Criar seção de segurança e privacidade.
- Criar seção de contribuição.
- Corrigir todas as referências residuais a LonaQ e `@lona-up/lona-q`.
- Garantir que todos os exemplos utilizem `pbdb` e os exports públicos atuais.
- Garantir consistência entre documentação EN e PT-BR.
- Garantir que o Nextra 4 utilize corretamente o tema oficial.
- Implementar busca funcional na documentação.
- Implementar navegação por categorias e versões.
- Implementar página de changelog.
- Implementar página de roadmap.
- Implementar página de status de compatibilidade.
- Implementar metadados SEO e Open Graph.
- Implementar favicon e identidade visual consistentes com a logo oficial.

## 13. Estrutura e distribuição do pacote

- Revisar os exports definidos no `packages/pbdb/package.json`.
- Garantir que todos os arquivos declarados em `exports` sejam efetivamente gerados.
- Garantir que os arquivos `.d.ts` sejam publicados corretamente.
- Garantir compatibilidade entre importações ESM e CommonJS.
- Garantir que o Worker seja disponibilizado corretamente após a publicação.
- Validar resolução de caminhos dos arquivos WASM em aplicações Next.js.
- Garantir que os arquivos WASM sejam incluídos na distribuição NPM.
- Implementar verificação automática do conteúdo do pacote utilizando `npm pack --dry-run`.
- Revisar `sideEffects` para garantir que não prejudique a inicialização do Worker.
- Implementar testes de instalação em projetos externos.
- Implementar versionamento semântico.
- Implementar publicação automatizada no NPM.
- Implementar GitHub Releases.
- Implementar geração automática do changelog.
- Implementar documentação de breaking changes.
- Garantir que Bun seja o gerenciador oficial em todos os fluxos de desenvolvimento e CI.

## 14. Infraestrutura e lançamento

- Configurar GitHub Actions para CI.
- Configurar matriz de testes para Node.js 20 e 22.
- Configurar build automatizado do site Nextra.
- Configurar deploy automático da documentação na Vercel.
- Implementar validação de build antes de publicar versões.
- Implementar verificação de dependências vulneráveis.
- Implementar auditoria de licenças das dependências.
- Implementar política de suporte a versões.
- Criar política de manutenção e descontinuação de APIs.
- Criar templates de Issues.
- Criar templates de Pull Requests.
- Revisar `CONTRIBUTING.md`.
- Revisar `CODE_OF_CONDUCT.md`.
- Revisar a licença e os créditos de atribuição ao projeto original.

## 15. Diferenciais competitivos

- Implementar API SQL Tagged Template nativa.
- Implementar sistema de subscriptions reativas independente do React.
- Implementar consultas reativas com identificação de dependências de tabelas.
- Implementar notificações de alterações com granularidade por tabela.
- Implementar gerenciamento avançado de conexões.
- Implementar gerenciamento de múltiplos bancos independentes.
- Implementar sistema de backup automático configurável.
- Implementar recuperação automática de conexões.
- Implementar fallback inteligente de armazenamento.
- Implementar API de monitoramento de performance.
- Implementar API de diagnóstico do banco.
- Implementar API de gerenciamento de arquivos SQLite.
- Implementar importação e exportação compatíveis com SQLite convencional.
- Implementar adaptadores independentes para diferentes estratégias de armazenamento.
- Implementar integrações com frameworks adicionais sem dependência obrigatória de React.

## 16. Critérios obrigatórios para liberar a versão 1.0

- Todos os testes unitários devem passar.
- Todos os testes de integração devem passar.
- Todos os testes E2E devem passar.
- O failover real deve funcionar em múltiplas abas.
- A persistência OPFS deve sobreviver ao encerramento do navegador.
- O armazenamento não pode apagar automaticamente bancos existentes durante tentativas de recuperação.
- A exportação deve gerar arquivos SQLite binários válidos.
- A importação deve restaurar bancos SQLite externos.
- A importação deve possuir mecanismo de restauração segura em caso de falha.
- O pacote deve funcionar em projetos Next.js App Router.
- O pacote deve funcionar em projetos Next.js Pages Router.
- O pacote deve compilar e funcionar em produção na Vercel.
- O pacote deve funcionar sem configuração manual de infraestrutura para o cenário padrão suportado.
- O pacote deve funcionar offline após sua inicialização.
- Todas as APIs públicas devem possuir tipagem TypeScript.
- Todos os exports devem estar disponíveis na distribuição NPM.
- A documentação deve refletir exatamente a implementação publicada.
- Todos os exemplos devem ser executáveis.
- O README deve apresentar a identidade oficial do PBDB.
- Não devem existir referências incorretas a LonaQ na documentação do produto.
- Não devem existir erros de lint.
- Não devem existir erros de TypeScript.
- O build da biblioteca e da documentação deve passar.
- O pacote deve ser testado em uma instalação limpa, fora do monorepo.
- Deve existir uma versão Release Candidate antes da publicação definitiva.

## O que removi do roadmap original

Estas funcionalidades não foram mantidas como requisitos do roadmap principal:

| Funcionalidade                                        | Motivo                                                                                              |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Suporte oficial a Vue                                 | Expansão de ecossistema, não requisito da primeira versão.                                          |
| Suporte oficial a Angular                             | Expansão de ecossistema, não requisito da primeira versão.                                          |
| Extensões SQLite                                      | Dependem de compatibilidade e compilação WASM específicas.                                          |
| Integração obrigatória com ORMs                       | Devem ser adaptadores opcionais.                                                                    |
| Implementar suporte completo a PRAGMA individualmente | O objetivo deve ser preservar a execução SQL nativa, não recriar funcionalidades do SQLite.         |
| Sistema próprio de sincronização entre dispositivos   | O PBDB é um banco local, não um serviço de sincronização.                                           |
| Criptografia automática do banco                      | Não deve ser prometida sem uma estratégia criptográfica definida.                                   |
| Suporte irrestrito a qualquer tamanho de banco        | Limitado pelo armazenamento e pela memória disponíveis no navegador.                                |
| Implementar funcionalidades duplicadas                | `batch()`, `readOnly`, exportação e outras apareciam em várias seções.                              |
| Competir com todos os recursos do SQLocal             | O diferencial deve ser a qualidade da arquitetura, confiabilidade e experiência de desenvolvimento. |

Importante: Drizzle e Kysely foram mantidos como integrações opcionais, não como dependências do núcleo.

## Minha recomendação de prioridades

Eu não tentaria implementar todos os itens simultaneamente. Organizaria o desenvolvimento em quatro etapas:

Fase 1 — Estabilidade do Core

Prioridade máxima

Conexões, Workers, OPFS, failover, segurança, concorrência, recuperação e integridade dos dados.

Fase 2 — API e funcionalidades

Prepared statements, batch, transações, migrations, subscriptions, exportação e importação SQLite.

Fase 3 — Ecossistema

React, Next.js, Drizzle, Kysely, documentação, exemplos e experiência de desenvolvimento.

Fase 4 — Lançamento

Benchmarks, testes de compatibilidade, CI/CD, distribuição NPM, Release Candidate e documentação definitiva.

Uma decisão arquitetural importante: não sacrifique a confiabilidade do OPFS para oferecer suporte indiscriminado a múltiplas conexões. Os VFS disponíveis possuem trade-offs diferentes em concorrência, desempenho e compatibilidade. A arquitetura deve escolher e documentar a estratégia adequada.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://sqlite.org&sz=32)

sqlite.org+1

Minha avaliação final: o PBDB deve competir com o SQLocal pela qualidade de sua abstração, confiabilidade, tipagem, experiência de desenvolvimento e integração com aplicações modernas — não simplesmente pelo número de funcionalidades.

O roadmap acima mantém essa direção e evita transformar a versão 1.0 em um projeto muito maior do que sua proposta original.
