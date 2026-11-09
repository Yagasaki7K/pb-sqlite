import type { ReactNode } from 'react';
import { DocsShell } from '../docs-shell';

export default function DocsLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <DocsShell>{children}</DocsShell>;
}
