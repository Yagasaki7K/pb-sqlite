'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Topic = { href: string; label: string };

const englishTopics: Topic[] = [
  { href: '/docs', label: 'Overview' },
  { href: '/docs/getting-started', label: 'Getting started' },
  { href: '/docs/concepts', label: 'Core concepts' },
  { href: '/docs/use-cases', label: 'Use cases' },
  { href: '/docs/api', label: 'API reference' },
  { href: '/docs/react', label: 'React integration' },
  { href: '/docs/nextjs', label: 'Next.js' },
  { href: '/docs/browser-support', label: 'Browser support' },
  { href: '/docs/storage', label: 'Storage & durability' },
  { href: '/docs/multi-tab', label: 'Multi-tab sync' },
  { href: '/docs/migrations', label: 'Migrations' },
  { href: '/docs/export', label: 'Export & backup' },
  { href: '/docs/troubleshooting', label: 'Troubleshooting' },
  { href: '/docs/faq', label: 'FAQ' },
  { href: '/docs/security/report', label: 'Security' },
];

const portugueseLabels: Record<string, string> = {
  '/docs': 'Visão geral', '/docs/getting-started': 'Primeiros passos', '/docs/concepts': 'Conceitos principais',
  '/docs/use-cases': 'Casos de uso', '/docs/api': 'Referência da API', '/docs/react': 'Integração com React',
  '/docs/nextjs': 'Next.js', '/docs/storage': 'Armazenamento e durabilidade', '/docs/multi-tab': 'Sincronização entre abas',
  '/docs/browser-support': 'Suporte de navegadores',
  '/docs/migrations': 'Migrações', '/docs/export': 'Exportação e backup', '/docs/troubleshooting': 'Solução de problemas',
  '/docs/faq': 'Perguntas frequentes', '/docs/security/report': 'Segurança',
};

export function DocsShell({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname() ?? '/';
  const isPortuguese = pathname.startsWith('/pt-BR');
  const currentPath = isPortuguese ? pathname.replace(/^\/pt-BR/, '') || '/docs' : pathname;
  const topics = isPortuguese
    ? englishTopics.map((topic) => ({ ...topic, href: `/pt-BR${topic.href}`, label: portugueseLabels[topic.href] }))
    : englishTopics;
  const alternatePath = isPortuguese ? currentPath : `/pt-BR${currentPath}`;

  return (
    <div className="docs-shell">
      <header className="docs-header">
        <Link className="brand" href={isPortuguese ? '/pt-BR/docs' : '/docs'}>❄️ Polarbear Database</Link>
        <nav aria-label="Primary navigation" className="top-nav">
          <Link href={isPortuguese ? '/pt-BR/docs' : '/docs'}>{isPortuguese ? 'Documentação' : 'Docs'}</Link>
          <Link href="/translate">{isPortuguese ? 'Traduções' : 'Translations'}</Link>
        </nav>
        <details className="language-menu">
          <summary aria-label={isPortuguese ? 'Selecionar idioma' : 'Select language'}>🌐</summary>
          <div className="language-options">
            <Link className={!isPortuguese ? 'active' : ''} href={isPortuguese ? alternatePath : currentPath}>English</Link>
            <Link className={isPortuguese ? 'active' : ''} href={isPortuguese ? currentPath : alternatePath}>Português</Link>
          </div>
        </details>
        <a className="github-link" href="https://github.com/Yagasaki7K/pb-sqlite" aria-label="Open pb-sqlite on GitHub" target="_blank" rel="noreferrer">
          <svg aria-hidden="true" viewBox="0 0 24 24" role="img"><path fill="currentColor" d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.74.08-.74 1.2.09 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.48.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.45 11.45 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.65 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.62-2.8 5.64-5.48 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .5Z" /></svg>
        </a>
      </header>
      <div className="docs-layout">
        <aside className="docs-sidebar">
          <p className="sidebar-label">{isPortuguese ? 'Neste guia' : 'In this guide'}</p>
          <nav aria-label="Documentation sections">
            {topics.map((topic) => (
              <Link className={currentPath === topic.href.replace(/^\/pt-BR/, '') ? 'active' : ''} href={topic.href} key={topic.href}>
                {topic.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="docs-content">{children}</main>
      </div>
      <footer className="docs-footer">
        <span>Polarbear Database — browser-first SQLite for local applications</span>
        <span>Developed by <a href="https://github.com/Yagasaki7K" target="_blank" rel="noreferrer">Yagasaki7K</a></span>
      </footer>
    </div>
  );
}
