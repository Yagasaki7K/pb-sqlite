const config = {
  logo: <span>❄️ pb-sqlite</span>,
  project: { link: 'https://github.com/Yagasaki7K/pb-sqlite' },
  docsRepositoryBase: 'https://github.com/Yagasaki7K/pb-sqlite/tree/main/web',
  i18n: [
    { locale: 'en', name: 'English' },
    { locale: 'pt-BR', name: 'Português (Brasil)' },
  ],
  footer: { text: 'pb-sqlite — browser-first SQLite' },
  useNextSeoProps() {
    return { titleTemplate: '%s – pb-sqlite' };
  },
};

export default config;
