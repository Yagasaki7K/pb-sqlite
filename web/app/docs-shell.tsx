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
        <Link className="brand" href={isPortuguese ? '/pt-BR/docs' : '/docs'}>❄️ pb-sqlite</Link>
        <nav aria-label="Primary navigation" className="top-nav">
          <Link href={isPortuguese ? '/pt-BR/docs' : '/docs'}>{isPortuguese ? 'Documentação' : 'Docs'}</Link>
          <Link href="/translate">{isPortuguese ? 'Traduções' : 'Translations'}</Link>
        </nav>
        <div className="language-switch" aria-label="Language">
          <Link className={!isPortuguese ? 'active' : ''} href={isPortuguese ? alternatePath : currentPath}>English</Link>
          <Link className={isPortuguese ? 'active' : ''} href={isPortuguese ? currentPath : alternatePath}>Português</Link>
        </div>
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
      <footer className="docs-footer">pb-sqlite — browser-first SQLite for local applications</footer>
    </div>
  );
}
