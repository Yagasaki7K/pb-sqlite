<p align="center">
  <img src="https://github.com/user-attachments/assets/1b1a0d0c-483c-40fc-a60e-4003430d5231"/>
</p>

# pbdb (Polarbear Database)

> Browser SQLite for offline-first applications, with OPFS persistence, worker threading, React hooks, and safe multi-tab coordination.

**Initial commit has a fork of [lona-q](https://github.com/Lona-up/lona-q)**

## Features

- **Just `bun add`** — Zero configuration required
- **Data persists after closing the browser** — Saved to OPFS (Origin Private File System)
- **Data stays in the browser** — Never sent to a server (privacy-first)
- **Real SQLite** — Full support for JOINs, transactions, and indexes
- **React hooks** — Reactive data binding with `useQuery`
- **Multi-tab support** — Safe data sharing via leader election pattern
- **Export / Import** — Back up and restore your data anytime

## Quick Start

### Install

```bash
bun add pbdb
```

### Vanilla JS

```typescript
import { createDB } from "pbdb";

const db = await createDB("myapp");

await db.run(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    completed INTEGER DEFAULT 0
  )
`);

await db.run("INSERT INTO todos (text) VALUES (?)", ["Buy milk"]);

const todos = await db.query("SELECT * FROM todos");
console.log(todos); // [{ id: 1, text: 'Buy milk', completed: 0 }]
```

### React

```tsx
import { LonaQProvider, useLonaQ, useQuery } from "pbdb/react";
import type { Migration } from "pbdb";

const migrations: Migration[] = [
  {
    version: 1,
    up: `CREATE TABLE todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      completed INTEGER DEFAULT 0
    )`,
  },
];

function App() {
  return (
    <LonaQProvider dbName="myapp" migrations={migrations}>
      <TodoList />
    </LonaQProvider>
  );
}

function TodoList() {
  const db = useLonaQ();
  const { data: todos } = useQuery<{
    id: number;
    text: string;
    completed: number;
  }>("SELECT * FROM todos ORDER BY id DESC");

  const addTodo = async (text: string) => {
    await db.run("INSERT INTO todos (text) VALUES (?)", [text]);
    // useQuery automatically refetches — no manual refresh needed
  };

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
```

## API Reference

### `createDB(dbName, options?)`

Creates and connects to a database.

```typescript
const db = await createDB("myapp");
```

### `db.run(sql, params?)`

Executes INSERT, UPDATE, DELETE, CREATE TABLE, etc.

```typescript
await db.run("INSERT INTO users (name) VALUES (?)", ["Alice"]);
```

### `db.query<T>(sql, params?)`

Executes a SELECT query and returns an array of results.

```typescript
const users = await db.query<{ id: number; name: string }>(
  "SELECT * FROM users",
);
```

### `db.getOne<T>(sql, params?)`

Returns the first row, or `null` if none found.

```typescript
const user = await db.getOne("SELECT * FROM users WHERE id = ?", [1]);
```

### `db.transaction(fn)`

Executes a transaction. Automatically rolls back on error.

```typescript
await db.transaction(async (tx) => {
  await tx.run(
    "UPDATE accounts SET balance = balance - ? WHERE id = ?",
    [100, 1],
  );
  await tx.run(
    "UPDATE accounts SET balance = balance + ? WHERE id = ?",
    [100, 2],
  );
});
```

### `db.export()` / `db.import(data)`

Export / import the database in JSON format.

```typescript
const data = await db.export();
// Save data somewhere...

// Restore on another environment
await db.import(data);
```

### `db.close()`

Closes the database and releases resources.

## React Hooks

### `<PbqbProvider>`

Place at the root of your app.

```tsx
<PbqbProvider
  dbName="myapp"
  migrations={[{ version: 1, up: "CREATE TABLE ..." }]}
  fallback={<p>Loading...</p>}
>
  {children}
</PbqbProvider>
```

### `usePBQB()`

Get the database instance (for mutations).

### `useQuery<T>(sql, params?)`

Reactive SELECT query. Automatically refetches when data changes.

```typescript
const { data, isLoading, error, refetch } = useQuery<Todo>(
  "SELECT * FROM todos WHERE completed = ?",
  [0],
);
```

## Multi-Tab Support

Polarbear supports multiple tabs via a leader election pattern.

- The first tab to open becomes the **leader** and directly operates SQLite
- Subsequent tabs become **followers** and execute queries through the leader
- When the leader is closed, a follower is automatically promoted to the new leader
- Table changes are broadcast to all tabs in real time

No special configuration needed — just call `createDB()` and it works.

## Deploying to Vercel / Next.js

No special configuration required. Just `bun run build` and deploy to Vercel.

**Note**: Polarbear runs on the client side only. It cannot be used in Server Components. The `'use client'` directive is required.

## FAQ

**Q: Will my data disappear when I close the browser?**
A: No. Data is persisted in OPFS and survives browser restarts.

**Q: Can I share data across browsers or devices?**
A: You can use export/import to transfer data between environments.

**Q: How much data can I store?**
A: It depends on the browser's storage quota (typically tens of percent of disk space).

**Q: Can I use this with Next.js SSR?**
A: Client-side only. The `'use client'` directive is required.

**Q: What happens if I open multiple tabs?**
A: Polarbear uses a leader election pattern to handle this safely. No data conflicts will occur.

## Browser Support

- Chrome 102+
- Firefox 111+
- Safari 17+
- Edge 102+

## Acknowledgments

Polarbear is built on [wa-sqlite](https://github.com/rhashimoto/wa-sqlite) by Roy T. Hashimoto (MIT License) — a WebAssembly build of SQLite.

## License

MIT
