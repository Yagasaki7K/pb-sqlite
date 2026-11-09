import nextra from 'nextra';
import type { NextConfig } from 'next';
import path from 'node:path';

const mdxComponentsPath = path.join(process.cwd(), 'app', 'mdx-components.tsx');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  i18n: { locales: ['en', 'pt-BR'], defaultLocale: 'en' },
  turbopack: {
    resolveAlias: {
      'next-mdx-import-source-file': './app/mdx-components.tsx',
    },
  },
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      'next-mdx-import-source-file': mdxComponentsPath,
    };
    return config;
  },
};

export default nextra({ contentDirBasePath: '/' })(nextConfig);
