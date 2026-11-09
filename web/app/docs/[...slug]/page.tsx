import { notFound } from 'next/navigation';
const pages: Record<string, { title: string; body: React.ReactNode }> = {
  'getting-started': { title: 'Getting started', body: <><p>Install <code>pbdb</code>, create a database in a client component, and use OPFS-backed SQLite.</p><pre>{`import { createDB } from 'pbdb';\nconst db = await createDB('pharmacy');\nawait db.run('CREATE TABLE IF NOT EXISTS sales (id INTEGER PRIMARY KEY)');`}</pre></> },
  api: { title: 'API reference', body: <p>The core API includes <code>createDB</code>, <code>run</code>, <code>query</code>, <code>getOne</code>, <code>transaction</code>, <code>migrate</code>, <code>export</code>, <code>import</code>, <code>invalidate</code>, and <code>close</code>.</p> },
  migrations: { title: 'Migrations', body: <p>Migrations are ordered, explicit, and checksum-verified. A changed applied migration raises <code>MigrationChecksumMismatchError</code>.</p> },
  'security/report': { title: 'Report a vulnerability', body: <p>Report security issues privately through the project maintainers or GitHub Security Advisories. Include affected versions, impact, and a minimal reproduction. We acknowledge reports within five business days and coordinate responsible disclosure.</p> },
};
export default function Docs({ params }: { params: { slug: string[] } }) { const page = pages[params.slug.join('/')]; if (!page) notFound(); return <main><h1>{page.title}</h1>{page.body}</main>; }
