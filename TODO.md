## Melhorias necessárias para o PBDB — Roadmap de lançamento 1.0

### 1. Núcleo do banco de dados

1. Implementar suporte completo a `PRAGMA` do SQLite.
2. Implementar gerenciamento de conexões e ciclo de vida do banco.
3. Implementar suporte a múltiplas instâncias de bancos independentes.
4. Implementar modo `readOnly` para conexões somente de leitura.
5. Implementar suporte a `ATTACH DATABASE` e `DETACH DATABASE`.
6. Implementar suporte completo a prepared statements.
7. Implementar gerenciamento automático de statements e liberação de memória.
8. Implementar suporte a savepoints e transações aninhadas.
9. Implementar execução atômica de múltiplas consultas com `batch()`.
10. Implementar suporte a consultas com `RETURNING`.
11. Implementar suporte a BLOBs, Uint8Array, ArrayBuffer e demais tipos nativos do SQLite.
12. Implementar configuração de `busy_timeout`.
13. Implementar configuração de `foreign_keys`.
14. Implementar configuração de journal mode e synchronous.
15. Implementar verificação de integridade utilizando `PRAGMA integrity_check`.
16. Implementar verificação de chaves estrangeiras utilizando `PRAGMA foreign_key_check`.
17. Implementar suporte a SQLite extensions quando tecnicamente compatível com a compilação WASM.
18. Implementar uma API de introspecção para consultar tabelas, índices, views, triggers e schemas.
19. Implementar tratamento padronizado de erros SQLite, preservando códigos e mensagens originais.
20. Implementar cancelamento de consultas de longa duração.

### 2. OPFS e persistência

21. Implementar detecção automática de suporte a OPFS.
22. Implementar estratégia de fallback quando OPFS não estiver disponível.
23. Implementar recuperação automática após falhas de inicialização do OPFS.
24. Implementar tratamento de corrupção do arquivo SQLite.
25. Implementar recuperação de conexões interrompidas.
26. Implementar gerenciamento de locks entre abas.
27. Garantir que nunca existam dois líderes operando simultaneamente o mesmo banco.
28. Implementar detecção de líderes inativos e recuperação de liderança.
29. Implementar tratamento de encerramento inesperado do Web Worker.
30. Implementar recuperação de operações interrompidas durante o failover.
31. Implementar sincronização consistente de mensagens entre líder e seguidores.
32. Implementar identificação única de requisições para evitar execução duplicada após reconexões.
33. Implementar controle de timeout para requisições entre abas.
34. Implementar detecção de quota disponível utilizando Storage API.
35. Implementar tratamento de `QuotaExceededError`.
36. Implementar integração com `navigator.storage.persist()`.
37. Implementar API para consultar o espaço utilizado pelo banco.
38. Implementar API para excluir bancos e liberar recursos do OPFS.
39. Implementar testes de persistência após fechamento e reabertura do navegador.
40. Implementar testes de concorrência com múltiplas abas e múltiplas conexões.

### 3. API e experiência de desenvolvimento

41. Implementar uma API SQL utilizando Tagged Template Literals, com parâmetros automaticamente vinculados.
42. Implementar `batch()` para execução de múltiplas consultas em uma única transação.
43. Implementar `reactiveQuery()` para consultas reativas.
44. Implementar sistema de subscriptions para acompanhar alterações nas tabelas.
45. Implementar notificações de alterações entre abas.
46. Implementar suporte a callbacks `onInit`.
47. Implementar suporte a callbacks `onConnect`.
48. Implementar suporte a callbacks `onClose`.
49. Implementar configuração `verbose` para depuração.
50. Implementar configuração `debug` para diagnóstico.
51. Implementar configuração `readOnly`.
52. Implementar configuração `databasePath`.
53. Implementar uma API de eventos para conexão, desconexão, erro, recuperação e failover.
54. Implementar suporte a operações assíncronas com cancelamento.
55. Implementar métodos `deleteDatabase()` e `overwriteDatabaseFile()`.
56. Implementar documentação e contratos TypeScript para todas as APIs públicas.
57. Implementar validação dos parâmetros recebidos pelas APIs.
58. Implementar compatibilidade consistente entre ESM e CommonJS.

### 4. React e Next.js

59. Implementar integração oficial com React 18 e React 19.
60. Implementar um Provider com gerenciamento correto do ciclo de vida.
61. Implementar `useDatabase()`.
62. Implementar `useQuery()` com atualização automática.
63. Implementar `useMutation()` para operações de escrita.
64. Implementar `useReactiveQuery()` para subscriptions.
65. Implementar `useTransaction()` para operações transacionais.
66. Implementar `useDatabaseStatus()` para monitoramento da conexão.
67. Implementar `useDatabaseReady()` para identificar quando o banco está disponível.
68. Implementar estados padronizados de loading, error e success.
69. Implementar tratamento de desmontagem de componentes durante consultas.
70. Implementar prevenção de atualizações desnecessárias de componentes.
71. Implementar suporte a React Strict Mode.
72. Garantir compatibilidade com Next.js App Router.
73. Garantir compatibilidade com Next.js Pages Router.
74. Implementar exemplos de utilização com Server Components e Client Components, respeitando as limitações de execução no navegador.
75. Garantir que imports do pacote não executem APIs exclusivas do navegador durante SSR.
76. Garantir funcionamento em builds de produção da Vercel.
77. Implementar testes E2E com aplicações Next.js reais.

### 5. Integração com ORMs e ferramentas

78. Implementar integração oficial com Drizzle ORM.
79. Implementar integração oficial com Kysely.
80. Criar adaptadores independentes para cada ORM.
81. Garantir inferência correta de tipos nas consultas.
82. Implementar suporte a migrations dos ORMs integrados.
83. Implementar exemplos de CRUD utilizando Drizzle.
84. Implementar exemplos de CRUD utilizando Kysely.
85. Garantir que as integrações não introduzam dependências obrigatórias desnecessárias.
86. Criar exports independentes para cada integração.

### 6. Migrations e gerenciamento de schemas

87. Implementar sistema de migrations versionadas.
88. Implementar controle de migrations aplicadas no próprio banco.
89. Implementar execução automática de migrations pendentes.
90. Implementar transações durante a execução de migrations.
91. Implementar rollback de migrations.
92. Implementar validação da sequência de migrations.
93. Implementar prevenção de execução duplicada.
94. Implementar tratamento de falhas durante migrations.
95. Implementar migrations com suporte a múltiplos arquivos.
96. Implementar API para consultar o histórico de migrations.
97. Implementar documentação sobre estratégias de atualização de schemas.

### 7. Exportação, importação e backup

98. Garantir que `exportSQLite()` produza um arquivo SQLite binário válido.
99. Implementar `importSQLite()` com validação do arquivo recebido.
100.  Implementar validação do cabeçalho SQLite.
101.  Implementar validação de integridade antes da restauração.
102.  Implementar exportação por `Blob`, `File` e `Uint8Array`.
103.  Implementar importação por `File`, `Blob`, `ArrayBuffer` e `Uint8Array`.
104.  Implementar suporte a arquivos `.sqlite`, `.sqlite3` e `.db`.
105.  Implementar substituição segura de bancos existentes.
106.  Implementar backup sem interromper operações normais.
107.  Implementar restauração atômica.
108.  Implementar proteção contra importação de arquivos inválidos.
109.  Implementar testes com bancos SQLite externos, criados pelo SQLite convencional.
110.  Implementar testes de round-trip entre exportação e importação.
111.  Implementar exemplos de download e upload de arquivos SQLite pelo navegador.

### 8. Offline-first e confiabilidade

112. Implementar comportamento consistente quando o dispositivo ficar offline.
113. Garantir que operações locais não dependam de conexão com servidores externos.
114. Implementar persistência após reinicialização do navegador.
115. Implementar recuperação após encerramento inesperado da aplicação.
116. Implementar monitoramento de disponibilidade do armazenamento.
117. Implementar proteção contra perda de dados durante atualizações.
118. Implementar mecanismo de recuperação após falhas do Worker.
119. Implementar testes de funcionamento em modo avião.
120. Implementar testes com armazenamento limitado.
121. Implementar testes com diferentes políticas de limpeza de armazenamento dos navegadores.
122. Documentar que OPFS pertence à origem e ao perfil do navegador, não à conta do usuário.
123. Documentar que exportação/importação não representa sincronização automática entre dispositivos.

### 9. Segurança

124. Implementar isolamento adequado entre bancos de diferentes usuários.
125. Implementar proteção contra acesso acidental a bancos de outras aplicações.
126. Implementar validação de nomes e caminhos de bancos.
127. Garantir parametrização de consultas SQL.
128. Evitar concatenação insegura de parâmetros SQL.
129. Implementar tratamento seguro de mensagens entre Workers.
130. Implementar validação de origem e identificação das mensagens entre abas.
131. Implementar proteção contra operações simultâneas inconsistentes.
132. Documentar as limitações de segurança do armazenamento local.
133. Documentar que os dados armazenados no navegador não possuem criptografia automática.
134. Implementar testes de isolamento entre diferentes origens e bancos.

### 10. Performance

135. Implementar benchmarks de leitura e escrita.
136. Implementar benchmarks de consultas complexas com JOINs.
137. Implementar benchmarks de transações com grandes volumes de registros.
138. Implementar testes com bancos de 10 MB, 100 MB e 1 GB, respeitando as limitações dos navegadores.
139. Implementar otimização de transferência de dados entre Worker e aplicação.
140. Implementar transferência de buffers utilizando Transferable Objects quando aplicável.
141. Implementar consultas paginadas.
142. Implementar suporte a processamento de grandes resultados sem bloquear a memória.
143. Implementar otimização de subscriptions para evitar consultas redundantes.
144. Implementar monitoramento de memória do Worker.
145. Implementar benchmarks comparativos com SQLocal.

### 11. Testes e qualidade

146. Implementar cobertura de testes unitários para todas as APIs públicas.
147. Implementar testes de integração com SQLite real.
148. Implementar testes E2E em Chromium.
149. Implementar testes E2E em Firefox.
150. Implementar testes E2E em WebKit.
151. Implementar testes de persistência OPFS.
152. Implementar testes de failover entre duas ou mais abas.
153. Implementar testes de concorrência durante operações de escrita.
154. Implementar testes de recuperação após encerramento do Worker.
155. Implementar testes de exportação e importação de arquivos externos.
156. Implementar testes de migrations.
157. Implementar testes de SSR e hidratação do Next.js.
158. Implementar testes de compatibilidade com React 18 e 19.
159. Implementar testes de compatibilidade entre diferentes versões de navegadores.
160. Implementar cobertura mínima obrigatória de 90% para a lógica principal.
161. Implementar CI automatizada com Bun.
162. Implementar validação de TypeScript, ESLint, testes e build em cada Pull Request.
163. Implementar testes de instalação do pacote publicado, não apenas do workspace.
164. Implementar testes de instalação com `bun install --frozen-lockfile`.

### 12. Documentação e site

167. Criar uma apresentação clara da proposta do PBDB.
168. Criar seção de funcionalidades com indicadores de implementação.
169. Criar seção de compatibilidade com navegadores.
170. Criar seção de requisitos técnicos.
171. Criar seção de instalação com Bun.
172. Criar Quick Start com TypeScript.
173. Criar exemplos completos com React.
174. Criar exemplos completos com Next.js App Router.
175. Criar exemplos completos com Next.js Pages Router.
176. Criar exemplos de utilização com Vercel.
177. Criar exemplos de aplicações offline-first.
178. Criar exemplos de exportação e importação SQLite.
179. Criar exemplos de migrations.
180. Criar documentação de todas as configurações disponíveis.
181. Criar documentação de todas as APIs públicas.
182. Criar documentação de erros e soluções.
183. Criar guia de troubleshooting.
184. Criar guia de migração para PBDB.
185. Criar seção de comparação com alternativas existentes.
186. Criar seção de arquitetura interna.
187. Criar seção de limitações conhecidas.
188. Criar seção de segurança e privacidade.
189. Criar seção de contribuição.
190. Corrigir todas as referências residuais a LonaQ e `@lona-up/lona-q`.
191. Garantir que todos os exemplos utilizem `pbdb` e os exports públicos atuais.
192. Garantir consistência entre documentação EN e PT-BR.
193. Garantir que o Nextra 4 utilize corretamente o tema oficial.
194. Implementar busca funcional na documentação.
195. Implementar navegação por categorias e versões.
196. Implementar página de changelog.
197. Implementar página de roadmap.
198. Implementar página de status de compatibilidade.
199. Implementar metadados SEO e Open Graph.
200. Implementar favicon e identidade visual consistentes com a logo oficial.

### 13. Estrutura e distribuição do pacote

201. Revisar os exports definidos no `packages/pbdb/package.json`.
202. Garantir que todos os arquivos declarados em `exports` sejam efetivamente gerados.
203. Garantir que os arquivos `.d.ts` sejam publicados corretamente.
204. Garantir compatibilidade entre importações ESM e CommonJS.
205. Garantir que o Worker seja disponibilizado corretamente após a publicação.
206. Validar resolução de caminhos dos arquivos WASM em aplicações Next.js.
207. Garantir que os arquivos WASM sejam incluídos na distribuição NPM.
208. Implementar verificação automática do conteúdo do pacote utilizando `npm pack --dry-run`.
209. Revisar `sideEffects` para garantir que não prejudique a inicialização do Worker.
210. Implementar testes de instalação em projetos externos.
211. Implementar versionamento semântico.
212. Implementar publicação automatizada no NPM.
213. Implementar GitHub Releases.
214. Implementar geração automática do changelog.
215. Implementar documentação de breaking changes.
216. Garantir que Bun seja o gerenciador oficial em todos os fluxos de desenvolvimento e CI.

### 14. Infraestrutura e lançamento

217. Configurar GitHub Actions para CI.
218. Configurar matriz de testes para Node.js 20 e 22.
219. Configurar build automatizado do site Nextra.
220. Configurar deploy automático da documentação na Vercel.
221. Implementar validação de build antes de publicar versões.
222. Implementar verificação de dependências vulneráveis.
223. Implementar auditoria de licenças das dependências.
224. Implementar política de suporte a versões.
225. Criar política de manutenção e descontinuação de APIs.
226. Criar templates de Issues.
227. Criar templates de Pull Requests.
228. Revisar `CONTRIBUTING.md`.
229. Revisar `CODE_OF_CONDUCT.md`.
230. Revisar a licença e os créditos de atribuição ao projeto original.

## 15. Diferenciais para competir com SQLocal

Com base nas funcionalidades documentadas do SQLocal — incluindo Worker, OPFS, consultas reativas, integração com Drizzle e Kysely, transações, batch e gerenciamento de arquivos SQLite — estas são as oportunidades mais relevantes para o PBDB.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://sqlocal.dev&sz=32)

sqlocal.dev+5

231. Implementar uma API SQL Tagged Template nativa.
232. Implementar integração oficial com Drizzle ORM.
233. Implementar integração oficial com Kysely.
234. Implementar sistema de subscriptions reativas independente do React.
235. Implementar suporte a Vue.
236. Implementar suporte a Angular.
237. Implementar integração com outros frameworks sem dependência de React.
238. Implementar um sistema de migrations mais completo.
239. Implementar gerenciamento avançado de conexões.
240. Implementar gerenciamento de múltiplos bancos.
241. Implementar sistema de backup automático configurável.
242. Implementar recuperação automática de conexões.
243. Implementar fallback inteligente de armazenamento.
244. Implementar API de monitoramento de performance.
245. Implementar API de diagnóstico do banco.
246. Implementar API de gerenciamento de arquivos SQLite.
247. Implementar importação e exportação compatíveis com SQLite convencional.
248. Implementar suporte a consultas reativas com dependências de tabelas.
249. Implementar notificações de alterações com granularidade por tabela.
250. Implementar adaptadores independentes para diferentes estratégias de armazenamento.

### 16. Critérios obrigatórios para liberar a versão 1.0

251. Todos os testes unitários devem passar.
252. Todos os testes E2E devem passar.
253. O failover real deve funcionar em múltiplas abas.
254. A persistência OPFS deve sobreviver ao encerramento do navegador.
255. A exportação deve gerar arquivos SQLite binários válidos.
256. A importação deve restaurar bancos SQLite externos.
257. O pacote deve funcionar em projetos Next.js App Router.
258. O pacote deve funcionar em projetos Next.js Pages Router.
259. O pacote deve compilar e funcionar em produção na Vercel.
260. O pacote deve funcionar sem configuração manual de infraestrutura para o cenário padrão suportado.
261. O pacote deve funcionar offline após sua inicialização.
262. Todas as APIs públicas devem possuir tipagem TypeScript.
263. Todos os exports devem estar disponíveis na distribuição NPM.
264. A documentação deve refletir exatamente a implementação publicada.
265. Todos os exemplos devem ser executáveis.
266. O README deve apresentar a identidade oficial do PBDB.
267. Não devem existir referências incorretas a LonaQ na documentação do produto.
268. Não devem existir erros de lint.
269. Não devem existir erros de TypeScript.
270. O build da biblioteca e da documentação deve passar.
271. O pacote deve ser testado em uma instalação limpa, fora do monorepo.
272. Deve existir uma versão de release candidate antes da publicação definitiva.

Referências técnicas:

- [SQLocal — documentação oficial](https://sqlocal.dev/?utm_source=chatgpt.com).
- [SQLocal — API SQL](https://sqlocal.dev/api/sql?utm_source=chatgpt.com).
- [SQLocal — transações](https://sqlocal.dev/api/transaction?utm_source=chatgpt.com).
- [SQLocal — batch](https://sqlocal.dev/api/batch?utm_source=chatgpt.com).
- [SQLocal — gerenciamento de arquivos SQLite](https://sqlocal.dev/api/overwritedatabasefile?utm_source=chatgpt.com).
- [PBDB — repositório](https://github.com/Yagasaki7K/pbdb?utm_source=chatgpt.com).
