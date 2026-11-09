import 'nextra-theme-docs/style.css';
import './globals.css';
import { Layout, Navbar, Footer } from 'nextra-theme-docs';
import { getPageMap } from 'nextra/page-map';

export const metadata = {
  title: 'pbdb — Polar Bear Database',
  description: 'Browser SQLite for offline-first applications.',
};

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Layout>
          <Navbar pageMap={await getPageMap()} logo={<strong>🐻‍❄️ pbdb</strong>} />
          {children}
          <Footer>pbdb — Polar Bear Database</Footer>
        </Layout>
      </body>
    </html>
  );
}
