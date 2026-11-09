import 'nextra-theme-docs/style.css';
import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Polarbear Database — browser-first SQLite',
  description: 'Browser SQLite for offline-first applications.',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
