import { createDB } from 'pb-sqlite';

const db = await createDB('vite-vanilla-example');
await db.exec('CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL)');

const list = document.querySelector<HTMLUListElement>('#tasks');
const add = document.querySelector<HTMLButtonElement>('#add');

async function render(): Promise<void> {
  const tasks = await db.query<{ id: number; title: string }>('SELECT id, title FROM tasks ORDER BY id DESC');
  if (list) list.innerHTML = tasks.map((task) => `<li data-id="${task.id}">${task.title}</li>`).join('');
}

add?.addEventListener('click', async () => {
  await db.run('INSERT INTO tasks (title) VALUES (?)', [`Task ${Date.now()}`]);
  await render();
});

await render();
