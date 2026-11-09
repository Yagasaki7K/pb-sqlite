import { cp } from 'node:fs/promises';
import path from 'node:path';

const packageRoot = process.cwd();
const source = path.join(packageRoot, 'node_modules', 'wa-sqlite', 'dist', 'wa-sqlite.wasm');
const destination = path.join(packageRoot, 'dist', 'wa-sqlite.wasm');

await cp(source, destination);
