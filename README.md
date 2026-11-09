<p align="center">
  <img src="https://github.com/user-attachments/assets/e653500b-e600-41ae-a8f2-4a370874d511"/>
</p>

# pb-sqlite (Polarbear Database)

Local-first SQLite for web applications. `pb-sqlite` keeps data in the browser using OPFS, runs SQLite in a Web Worker, and coordinates multiple tabs without relying on a server.

> The repository is prepared for its first public npm release as `1.0.0`. The documented API reflects the current state of the repository.

## Why pb-sqlite?

- **Offline-first:** reads and writes keep working without a connection.
- **Real SQLite:** SQL, indexes, joins, and transactions in the browser.
- **Local persistence:** data lives in OPFS and is not automatically sent to an API.
- **Isolated Worker:** SQLite processing never blocks the UI.
- **Multiple tabs:** Web Locks and BroadcastChannel coordinate leader, followers, and changes.
- **Backups:** export the database payload or a native SQLite file.
- **Optional React:** use `pb-sqlite/react` only when your app uses React.

## Installation

```bash
bun install pb-sqlite
# or
npm install pb-sqlite
```

## Getting started

```ts
import { createDB } from "pb-sqlite";

const db = await createDB("tasks");

await db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0
  )
`);

await db.run("INSERT INTO tasks (title) VALUES (?)", ["Read the docs"]);
const tasks = await db.query<{ id: number; title: string; done: number }>(
  "SELECT * FROM tasks ORDER BY id DESC",
);

await db.close();
```

## React

```tsx
"use client";

import { PbSqliteProvider, useQuery } from "pb-sqlite/react";

export function App() {
  return (
    <PbSqliteProvider dbName="tasks" fallback={<p>Opening database…</p>}>
      <TaskList />
    </PbSqliteProvider>
  );
}

function TaskList() {
  const { data, isLoading } = useQuery<{ id: number; title: string }>(
    "SELECT id, title FROM tasks ORDER BY id DESC",
  );
  if (isLoading) return <p>Loading…</p>;
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

## Documentation

Read the full documentation at [`web/content/docs`](./web/content/docs) or run the site locally:

```bash
bun install
bun run dev
```

Then open `http://localhost:3000/`.

## Development and publishing

```bash
bun run build
bun run test
bun run lint
bun run typecheck
```

The published package includes `dist`, `README.md`, and `LICENSE`. Before the first `npm publish`, review the version, the changelog, and the artifacts generated in `packages/pb-sqlite/dist`.

## Important limits

`pb-sqlite` is browser-only: `createDB` requires `navigator.storage`, OPFS, a Web Worker, and — when available — Web Locks. Do not initialize the database in Server Components or in the Node process; wrap the integration in client code.

See the [full documentation](./web/content/docs/index.mdx) for architecture, API, migrations, React, export/import, browser support, troubleshooting, and FAQ.

## License

MIT.
