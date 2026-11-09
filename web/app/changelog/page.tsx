import fs from 'node:fs';
import path from 'node:path';
export default function Changelog() { const file = path.join(process.cwd(), '..', 'CHANGELOG.md'); const content = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : 'Changelog unavailable in this deployment.'; return <main><h1>Changelog</h1><pre>{content}</pre></main>; }
