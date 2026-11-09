import type { ReactNode } from 'react';
import Link from 'next/link';

export default function DocsLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="docs-shell">
      <nav aria-label="Primary navigation">
        <Link href="/">🐻‍❄️ pbdb</Link>
        <Link href="/docs">Docs</Link>
        <Link href="/translate">Translations</Link>
      </nav>
      <main>{children}</main>
      <footer>pbdb — Polar Bear Database</footer>
    </div>
  );
}
