# pb-sqlite

SQLite local-first para aplicações web. O `pb-sqlite` mantém dados no navegador usando OPFS, executa SQLite em Web Worker e coordena múltiplas abas sem depender de um servidor.

> O projeto ainda está em preparação para a primeira publicação pública no npm. A API documentada é a API atual do repositório.

## Por que pb-sqlite?

- **Offline-first:** leituras e escritas continuam funcionando sem conexão.
- **SQLite real:** SQL, índices, joins e transações no navegador.
- **Persistência local:** os dados ficam no OPFS e não são enviados automaticamente para uma API.
- **Worker isolado:** o processamento SQLite não bloqueia a interface.
- **Múltiplas abas:** Web Locks e BroadcastChannel coordenam líder, seguidores e mudanças.
- **Backups:** exporte o payload do banco ou um arquivo SQLite nativo.
- **React opcional:** use `pb-sqlite/react` apenas quando seu app usar React.

## Instalação

```bash
bun install pb-sqlite
# ou
npm install pb-sqlite
```

## Primeiros passos

```ts
import { createDB } from 'pb-sqlite';

const db = await createDB('tasks');

await db.run(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0
  )
`);

await db.run('INSERT INTO tasks (title) VALUES (?)', ['Read the docs']);
const tasks = await db.query<{ id: number; title: string; done: number }>(
  'SELECT * FROM tasks ORDER BY id DESC'
);

await db.close();
```

## React

```tsx
'use client';

import { PbdbProvider, useQuery } from 'pb-sqlite/react';

export function App() {
  return (
    <PbdbProvider dbName="tasks" fallback={<p>Opening database…</p>}>
      <TaskList />
    </PbdbProvider>
  );
}

function TaskList() {
  const { data, isLoading } = useQuery<{ id: number; title: string }>(
    'SELECT id, title FROM tasks ORDER BY id DESC'
  );
  if (isLoading) return <p>Loading…</p>;
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

## Documentação

Leia a documentação completa em [`web/content/docs`](./web/content/docs) ou execute o site localmente:

```bash
bun install
bun run dev
```

Depois abra `http://localhost:3000/`.

## Desenvolvimento e publicação

```bash
bun run build
bun run test
bun run lint
bun run typecheck
```

O pacote publicado inclui `dist`, `README.md` e `LICENSE`. Antes do primeiro `npm publish`, confira a versão, o changelog e os artefatos gerados em `packages/pbdb/dist`.

## Limites importantes

`pb-sqlite` é browser-only: `createDB` precisa de `navigator.storage`, OPFS, Web Worker e, quando disponível, Web Locks. Não inicialize o banco em Server Components ou no processo Node; encapsule a integração em código cliente.

Veja a [documentação completa](./web/content/docs/index.mdx) para arquitetura, API, migrations, React, export/import, suporte de navegador, troubleshooting e FAQ.

## Licença

MIT.
