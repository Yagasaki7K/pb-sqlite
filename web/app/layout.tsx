import './globals.css';
import Link from 'next/link';

export const metadata = { title: 'pbdb — Polar Bear Database', description: 'Browser SQLite for offline-first applications.' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <><nav><Link className="brand" href="/">🐻‍❄️ pbdb</Link><Link href="/docs/getting-started">Docs</Link><Link href="/translate">Translate</Link><a href="https://github.com/yagasaki/pbdb">GitHub</a><Link href="/pt-BR">PT-BR</Link></nav>{children}</>;
}
