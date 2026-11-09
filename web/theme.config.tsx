const config = {
  logo: <span>🐻‍❄️ pbdb</span>,
  project: { link: 'https://github.com/yagasaki/pbdb' },
  docsRepositoryBase: 'https://github.com/yagasaki/pbdb/tree/main/web',
  i18n: [
    { locale: 'en', name: 'English' },
    { locale: 'pt-BR', name: 'Português (Brasil)' },
  ],
  footer: { text: 'pbdb — Polar Bear Database' },
  useNextSeoProps() {
    return { titleTemplate: '%s – pbdb' };
  },
};

export default config;
