# TODO — PB-SQLite

### 🔴 P0 — Bloqueadores de build (fazer agora)

- [ ] **Corrigir build do site de documentação** (`web/`)
  - [ ] Alinhar versões: `nextra@4` + `nextra-theme-docs@4` exigem o formato de `pageMap` do Nextra 4. Confirmar `getPageMap` importado de `nextra/pages` (não de `nextra`).
  - [ ] Em `app/layout.tsx`, trocar `LayoutProps<'/'>` por `LayoutProps<'/[lang]'>` se o site for i18n-routeado; ou remover o `[[...mdxPath]]` se ainda não houver i18n (recomendado no P0).
  - [ ] **Recomendação:** desabilitar i18n no `next.config.ts` (`i18n: undefined`) enquanto a rota `[[...mdxPath]]` não estiver estabilizada. O log mostra `[nextra] You have Next.js i18n enabled` + falha em `{(...)}[lang] is not a function` — é exatamente essa mistura que quebra.
  - [ ] Em `app/[[...mdxPath]]/page.tsx`, garantir que `importPage` aceita `string[]` vazio e retorna `null` em vez de `undefined` quando a rota não existe; proteger com `notFound()`.
- [ ] **Corrigir MDX quebrado de `/docs/api`**
  - [ ] O erro `[a] is not a function` em `chunks/782.js` vem de um componente/expressão importada no MDX. Isolar o arquivo e simplificar até o build passar.
  - [ ] Regra: nenhum `.mdx` importa código da lib (`pb-sqlite`) diretamente. Exemplos são **blocos de código estáticos**, não imports executáveis.
- [ ] **Adicionar ESLint do Next.js** (o log avisa `The Next.js plugin was not detected`). Instalar `eslint-config-next` e referenciar no `eslint.config.*`.
- [ ] **Desbloquear `service-worker.js`**: a rota `/service-worker.js` retorna 500 porque o `RootLayout` explode. Só validar SW **depois** que `/` buildar verde.
- [ ] **Configurar `VERCEL_DEEP_CLONE=true`** no projeto Vercel (o log avisa que o clone raso impede `lastModified` do Nextra).

**Critério de saída do P0:** `bun run build` verde em CI, `bun run dev` servindo `/` e `/docs/*` sem erro no console, deploy Vercel verde.

---

### 🟠 P1 — Núcleo da biblioteca (MVP 1.0)

#### 1. Banco de dados

- [ ] Inicializar SQLite no navegador via `wa-sqlite` (WASM).
- [ ] Rodar SQLite em **Web Worker** dedicado; main thread nunca bloqueia.
- [ ] Suportar `CREATE`, `INSERT`, `UPDATE`, `DELETE`, `SELECT`.
- [ ] Parâmetros posicionais (`?`) em todas as queries.
- [ ] Transações: `BEGIN` / `COMMIT` / `ROLLBACK` com rollback automático em erro.
- [ ] `open`, `close` e reabertura segura da conexão.
- [ ] Erros tipados: `PbSqliteError`, `QuotaExceededError`, `WorkerCrashedError`, `OPFSUnavailableError`.

#### 2. Persistência

- [ ] Persistir em **OPFS** (sem fallback silencioso para IndexedDB).
- [ ] Dados sobrevivem a reload e fechamento da aba.
- [ ] Reabrir DB existente sem sobrescrever.
- [ ] Falha na inicialização **não apaga** dados existentes.
- [ ] Tratar erros de leitura/escrita/quota do OPFS com mensagem clara.
- [ ] Escrita atômica: operação interrompida não corrompe o arquivo.

#### 3. API pública (mínima)

- [ ] `createDB(name, options?)` → `PbSqliteDB`.
- [ ] `db.exec(sql)` — DDL sem parâmetros.
- [ ] `db.run(sql, params?)` — DML com parâmetros.
- [ ] `db.query<T>(sql, params?)` — `SELECT` → `T[]`.
- [ ] `db.getOne<T>(sql, params?)` — primeira linha ou `null`.
- [ ] `db.transaction(fn)` — commit/rollback automáticos.
- [ ] `db.close()`.
- [ ] Tipos TypeScript exportados: `PbSqliteDB`, `QueryOptions`, `PbSqliteError`.
- [ ] JSDoc em todos os métodos públicos.

#### 4. Estabilidade

- [ ] Serializar operações concorrentes na fila do Worker.
- [ ] Detectar e reiniciar Worker morto **sem perder** transações em andamento (buffer de comandos + replay controlado).
- [ ] Timeout configurável para operações pendentes (evitar `await` infinito).
- [ ] **Coordenação multi-aba** via Web Locks + BroadcastChannel (não é feature extra — é garantia de integridade; ver sua observação).
- [ ] Múltiplas inicializações no mesmo DB **não** corrompem estado.
- [ ] Testes obrigatórios: persistência, queries, transações, rollback, erro de quota, worker crash, multi-aba.

#### 5. Distribuição

- [ ] `package.json` com `"name": "pb-sqlite"`, `"exports"`, `"files": ["dist", "README.md", "LICENSE"]`, `"sideEffects": false`.
- [ ] Build `tsup` gerando ESM + d.ts; **sem** dependência de APIs Node em runtime browser.
- [ ] Compatível com Vite e Next.js (App Router, `'use client'`).
- [ ] README com instalação, `createDB`, exemplos de CRUD, transação e `close`.
- [ ] `examples/vite-vanilla/` mínimo funcional.

**Critério de saída do P1:** o snippet abaixo roda de ponta a ponta em Vite e Next.js:

```ts
const db = await createDB("my-database");
await db.exec(
  `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)`,
);
await db.run("INSERT INTO users (name) VALUES (?)", ["Anderson"]);
const users = await db.query("SELECT * FROM users");
await db.close();
```

---

### 🟡 P2 — Site de documentação (depois do P0 verde)

- [ ] Página `/docs/api` com **blocos de código estáticos** (sem import de `pb-sqlite`).
- [ ] Página `/docs/getting-started` (EN + PT-BR).
- [ ] Página `/docs/browser-support` (tabela de compatibilidade OPFS/Worker).
- [ ] Página `/docs/multi-tab` (modelo de consistência e comportamento em crash).
- [ ] Página `/docs/security/report` (substitui `SECURITY.md` — **não criar `SECURITY.md`**).
- [ ] Página `/changelog` — renderiza `CHANGELOG.md` da raiz; **deve ser atualizada a cada release** (regra em `AGENTS.md`).
- [ ] Página `/translate` — tabela de status por idioma/seção, alimentada por `web/content/translations.json`.
- [ ] i18n EN + PT-BR estável **após** P0 (rotas `/` e `/pt-BR/`).
- [ ] `AGENTS.md` na raiz com regras:
  - [ ] toda release atualiza `CHANGELOG.md`;
  - [ ] toda página de doc nasce em EN + PT-BR e atualiza `translations.json`;
  - [ ] não criar `SECURITY.md`;
  - [ ] commits em Conventional Commits;
  - [ ] não adicionar dependência sem atualizar lockfile.

---

### 🟢 P3 — Publicação

- [ ] Changesets configurado; primeira versão `0.1.0` (MVP) → `1.0.0` quando critérios abaixo passarem.
- [ ] CI: `bun run typecheck && bun run lint && bun run test && bun run build` em Node 20 (manter matriz Node 20; adicionar 22 se quiser).
- [ ] Workflow de release publica no npm e cria GitHub Release.
- [ ] `npm pack --dry-run` mostra apenas `dist/`, `README.md`, `LICENSE`, `package.json`.

---

### 🚫 Fora do escopo da 1.0 (não implementar agora)

Drizzle, Kysely, hooks React, Vue/Angular, migrations avançadas, export/import, sync entre dispositivos, backup automático, criptografia própria, subscriptions, benchmarks, comparativos com SQLocal, extensões SQLite, monitoramento avançado. **Só reavaliar após a 1.0 estar publicada e em uso.**

---

### ✅ Critérios de lançamento 1.0

- [ ] `bun install && bun run build && bun run test && bun run typecheck && bun run lint` passam do zero.
- [ ] Site `web/` builda verde (P0 resolvido) e serve `/`, `/docs/getting-started`, `/docs/api` em EN e PT-BR.
- [ ] Instalar `pb-sqlite` em projeto novo → inicializar sem erro → criar tabela → inserir/consultar/atualizar/deletar → transação commit e rollback → reload mantém dados → `close`/reabrir mantém dados.
- [ ] Erro simulado (quota, worker crash) **não corrompe** dados existentes.
- [ ] Testes automatizados essenciais passando (persistência, transações, worker crash, multi-aba).
- [ ] Publicado no npm como `pb-sqlite` `1.0.0`.
- [ ] `/changelog` reflete `1.0.0`.

---

## 🔁 Substituições globais a aplicar no repositório

Trocar **todas** as ocorrências abaixo (código, docs, nomes de arquivo, tabelas internas, badges, READMEs dos exemplos, comentários, `package.json`, URLs internas):

| De                                  | Para                                               |
| ----------------------------------- | -------------------------------------------------- |
| `lona-q`                            | `pb-sqlite`                                        |
| `@lona-up/lona-q`                   | `pb-sqlite`                                        |
| `lonaq` / `LonaQ`                   | `pbsqlite` / `PbSqlite`                            |
| `LonaQProvider`                     | `PbSqliteProvider` (quando existir React, pós-1.0) |
| `useLonaQ`                          | `usePbSqlite` (pós-1.0)                            |
| `_lonaq_migrations`                 | `_pbsqlite_migrations`                             |
| `lonaq-leader-<dbName>` (Web Locks) | `pbsqlite-leader-<dbName>`                         |
| `[lona-q]` (prefixo de log)         | `[pb-sqlite]`                                      |
| `pbdb` / `PBDB`                     | `pb-sqlite` / `PB-SQLite`                          |
| `PbdbDB`                            | `PbSqliteDB`                                       |
| `PbdbError`                         | `PbSqliteError`                                    |
| `PbdbProvider`                      | `PbSqliteProvider` (pós-1.0)                       |
| `usePbdb`                           | `usePbSqlite` (pós-1.0)                            |
| `_pbdb_migrations`                  | `_pbsqlite_migrations`                             |
| `pbdb-leader-<dbName>`              | `pbsqlite-leader-<dbName>`                         |
| `[pbdb]` (prefixo de log)           | `[pb-sqlite]`                                      |
| `pbdb-worker.js`                    | `pb-sqlite-worker.js`                              |

**Atenção especial:**

- O **nome npm** precisa ser checado (`npm view pb-sqlite`) antes de fixar. Se estiver ocupado, escolher variante imediata (ex.: `pb-sqlite-browser`, `@yagasaki7k/pb-sqlite`) e refletir em TODO + README + imports.
- Manter **atribuição ao `lona-q`** em uma seção "Forked from lona-q" no README e no `LICENSE` — a substituição acima é de **identidade do produto**, não de crédito histórico.
- Na página `/translate`, a tabela deve usar `pb-sqlite` como nome exibido, não `pbdb`/`lona-q`.

---

## 📌 Ordem de execução recomendada

1. **P0** (build verde) → commit `fix(web): stabilize Nextra 4 + Next 15 build`
2. **P1** (núcleo MVP) → commits por subseção (`feat(core)`, `feat(worker)`, `feat(opfs)`, `feat(multi-tab)`, `test(...)`)
3. **P2** (docs) → commits `docs(...)`
4. **P3** (publicação) → `chore(release): 1.0.0` + changeset

Não avançar de fase sem CI verde.
