import nextra from 'nextra';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  i18n: { locales: ['en', 'pt-BR'], defaultLocale: 'en' },
};

export default nextra({ contentDirBasePath: '/' })(nextConfig);
