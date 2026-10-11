# MELHORIAS — projectsimple

> **Diagnóstico original:** 2026-10-05 · Stack inicial: CRA (react-scripts 4) + React 17 · Branch: `master`

## Atualização de implementação — 2026-10-11

O usuário ampliou o escopo para implementar também os itens estratégicos que estavam adiados. Resultado: `SEC-01/02`, `BUG-01`, `DEVOPS-01/02/03`, `DOC-01/02` e `IMP-01/02` implementados. `TEST-01` continua pendente porque ainda não há suíte de testes; os checks estáticos e o build foram executados, sem executar testes.

| Item | Estado | Resultado |
|---|---|---|
| SEC-01 | Concluído | CRA removido; novo lock npm auditado sem vulnerabilidades. |
| SEC-02 | Concluído | Servidor e preview do Vite escutam apenas em `127.0.0.1`; o README esclarece o bind local. |
| BUG-01 | Concluído | Texto e tela do exercício reescritos em português claro. |
| DEVOPS-01 | Concluído | `package-lock.json` é o único lockfile; `yarn.lock` removido. |
| DEVOPS-02 | Concluído | Docker Node 24 multi-stage, `npm ci`, `serve` pinado e runtime como `node`. |
| DEVOPS-03 | Concluído | `web-vitals` removido. |
| TEST-01 | Pendente | Criar os cenários de abrir/fechar detalhes e executá-los em CI. |
| DOC-01 | Concluído | Compose adicionado e documentado. |
| DOC-02 | Concluído | Favicon e manifest válidos; título, idioma e descrição localizados. |
| IMP-01/02 | Concluído | ADR registra a migração CRA→Vite e React 17→19; `createRoot` e hooks em uso. |

Validações executadas: `npm ci`, audit (0), lint, build, `docker compose config --quiet`, Docker build/inspeção e `git diff --check`; HTML, manifest e referências de ícone conferidos. O CI remoto de `4782ddda159f5e12a92d7e3ba1072f0a70ae6f65` passou. Não iniciei o container e não executei testes.

## 0. Como usar este documento

Este plano foi produzido por **leitura direta dos arquivos** do repositório `/home/servidor/Git/projectsimple`, comandos `git ls-files`, `git branch --show-current` e um `npm audit --package-lock-only` executado em **2026-10-05**. Nenhuma referência `arquivo:linha` foi inventada: cada uma existe no código como está hoje.

Como ler:

- **Severidade** — `P0` crítico (agora), `P1` alto, `P2` médio, `P3` baixo/estratégico.
- **Campos de cada item** — `**Arquivo:**` onde o problema vive; `**Evidência:**` o que foi lido (fato verificado); `**Impacto:**` risco de não corrigir; `**Mudança:**` o que fazer; `**Aceite:**` condição objetiva de concluído; `**Verificação:**` comando bash para conferir (com o resultado de hoje e o alvo).
- **Escopo** — o plano original adiava `IMP-*`; em 2026-10-11 o usuário ampliou o pedido para executar também esses itens estratégicos. `TEST-01` continua sendo a única tarefa de implementação pendente.
- **Contexto** — o próprio README declara que é um **projeto de estudo** (README.md:21-22, 31-34), não um produto em produção; as prioridades abaixo já ponderam isso (por isso nenhum item é `P0`).

Validação do documento: `python3 /tmp/validate.py projectsimple` deve imprimir `OK projectsimple`.

## 1. Diagnóstico executivo original — 2026-10-05

**Stack confirmada:** CRA com `react-scripts ^4.0.1` (package.json:11), preso em `4.0.1` no lock (package-lock.json:11191-11192), e React `^17.0.1` (package.json:9-10). Aplicação: um único arquivo `src/index.js` (24 linhas) — toggle de visibilidade com `ReactDOM.render` manual. Repositório: 11 arquivos versionados, branch `master`.

**Pontos fortes** (lidos, não presumidos):

| Arquivo:linha | O que está bom |
|---|---|
| `Dockerfile:1-9` | Build multi-stage com `npm ci`; `node_modules` nunca copiada (`.dockerignore:1` reforça). |
| `Dockerfile:12-18` | Estágio final enxuto: só `/app/build` + `serve`, porta 3000. |
| `Dockerfile:8` | `ENV GENERATE_SOURCEMAP=false` reduz o artefato publicado. |
| `.gitignore:4,9,12` | `/node_modules`, `/coverage` e `/build` ignorados. |
| `package.json:14-19` | Scripts `start/build/test/eject` completos do CRA. |
| `README.md:3-18` | Instruções de execução via Docker e local documentadas. |
| `README.md:29-57` | "Sobre", funcionalidades e estrutura coerentes com o código de `src/index.js`. |
| `LICENSE` + `README.md:59-61` | Licença MIT declarada, arquivo presente no repo. |

**Pontos quebrados encontrados na análise inicial:**

| Arquivo:linha | Problema | Item |
|---|---|---|
| `package.json:11`, `package-lock.json:11191-11192` | `react-scripts` 4.0.1 → `npm audit`: 210 vulnerabilidades (22 critical, 62 high) | SEC-01 |
| `package-lock.json` + `yarn.lock` | Dois lockfiles versionados ao mesmo tempo (`git ls-files`) | DEVOPS-01 |
| `Dockerfile:2`, `Dockerfile:5` | Base `node:16-alpine` (EOL) e fallback `npm ci \|\| npm install` | DEVOPS-02 |
| `package.json:12` | `web-vitals` declarado e nunca importado | DEVOPS-03 |
| `README.md:10` | Manda `docker compose up --build`, mas não existe compose file no repo | DOC-01 |
| `public/index.html:5,12`, `public/manifest.json:6,11,16` | Ícones referenciados não existem em `public/` | DOC-02 |
| `src/index.js:18` | Texto visível da UI com erros: `Its is detais in hide` | BUG-01 |
| `src/` (somente `index.js`) | Zero arquivos de teste; `@testing-library/*` ocioso | TEST-01 |
| `package.json:11`, `src/index.js:21` | CRA 4 + React 17 (`ReactDOM.render`): toolchain sem manutenção ativa | IMP-01, IMP-02 |

## 2. Tabela de prioridades

| ID | Item | Sev | Esforço | Wave |
|---|---|---|---|---|
| SEC-01 | Vulnerabilidades do react-scripts 4 (npm audit: 210) | P1 | Médio | 2 |
| SEC-02 | Servidor local Vite escuta em todas as interfaces | P2 | Baixo | 1 |
| DEVOPS-01 | Lockfile duplo (npm + yarn) | P1 | Baixo | 1 |
| DEVOPS-02 | Dockerfile: Node 16 EOL, fallback npm, serve sem pin | P2 | Baixo | 2 |
| DEVOPS-03 | Dependência ociosa `web-vitals` | P3 | Baixo | 1 |
| TEST-01 | Nenhum arquivo de teste no repositório | P2 | Médio | 2 |
| DOC-01 | README instrui `docker compose` sem compose file | P2 | Baixo | 1 |
| DOC-02 | Ícones/título default do CRA e arquivos ausentes | P2 | Baixo | 3 |
| BUG-01 | Texto da UI com erros (`src/index.js:18`) | P3 | Baixo | 1 |
| IMP-01 | CRA sem manutenção ativa — trilha de migração (Vite) | P3 | Alto | 4 (adiada) |
| IMP-02 | React 17 → 19 (`ReactDOM.render` legado) | P3 | Alto | 4 (adiada) |

Legenda das waves: **1** = correções rápidas sem risco de regressão; **2** = segurança e base (exige cuidado); **3** = polimento; **4** = estratégico, fora do escopo desta rodada (detalhes em §8 e §9).

## 3. Segurança

### SEC-02 — Servidor local do Vite escutava em todas as interfaces [P2]

- **Arquivo:** `package.json:10-13` e `vite.config.mjs:6-14`.
- **Evidência:** os scripts `dev`, `start` e `preview` passavam `--host 0.0.0.0`; a configuração do servidor e do preview também fixava `host: '0.0.0.0'`. O README descreve esses comandos como execução local. O Compose publica o container em `127.0.0.1:3000`, mas isso não restringe o servidor iniciado diretamente pelo npm.
- **Impacto:** executar `npm run dev` ou `npm run preview` poderia deixar a aplicação de desenvolvimento acessível por outras interfaces de rede da máquina.
- **Mudança:** remover os flags de host dos scripts, configurar Vite e preview para `127.0.0.1` e explicitar o bind local no README.
- **Aceite:** nenhum script/configuração local usa `0.0.0.0`; servidor e preview ficam limitados ao loopback. O Compose segue com publicação local.
- **Verificação:**
  ```bash
  ! rg -n '0\.0\.0\.0' package.json vite.config.mjs
  rg -n "host: '127\.0\.0\.1'" vite.config.mjs
  ```

### SEC-01 — react-scripts 4.0.1 com 210 vulnerabilidades no `npm audit` [P1]

- **Arquivo:** `package.json:11` (`"react-scripts": "^4.0.1"`) e `package-lock.json:11191-11192` (versão instalada travada em `react-scripts` `4.0.1`).
- **Evidência:** `npm audit --package-lock-only` executado em 2026-10-05 contra o `package-lock.json` versionado: **210 vulnerabilidades** (22 critical, 62 high, 120 moderate, 6 low) em 1.778 dependências. Exemplos do próprio relatório: `@babel/core` (GHSA-4x5r-pxfx-6jf8, via `babel-preset-react-app`/`react-scripts`) com `fixAvailable` apontando `react-scripts@5.0.1` (semVerMajor), e `@babel/plugin-transform-modules-systemjs` (GHSA-fv7c-fp4j-7gwp, high, CVSS 8.2) na árvore do build.
- **Impacto:** cadeia de dependências de build com advisories públicos e sem correção vindo do CRA4; parte dos advisories vem de transitivos que só se resolvem saindo da versão 4 — risco de supply chain no `npm ci` do Docker e no dev server local.
- **Mudança:** degrau curto: subir para `react-scripts@5.0.1` (caminho indicado pelo próprio audit) e revalidar `build`/`test`; degrau definitivo: executar a migração proposta na IMP-01. Regenerar o lock após a decisão e manter apenas um lockfile (DEVOPS-01).
- **Aceite:** `npm audit --package-lock-only` com **critical = 0** e **high = 0**; `npm run build` e `CI=true npm test` verdes após o upgrade.
- **Verificação:**
```bash
cd /home/servidor/Git/projectsimple
npm audit --package-lock-only --json | python3 -c "import json,sys; print(json.load(sys.stdin)['metadata']['vulnerabilities'])"
# hoje: {'info': 0, 'low': 6, 'moderate': 120, 'high': 62, 'critical': 22, 'total': 210}
# aceite: critical == 0 e high == 0
```

## 4. Bugs e defeitos funcionais

### BUG-01 — Texto da UI com erros de digitação [P3]

- **Arquivo:** `src/index.js:18`.
- **Evidência:** linha literal do arquivo: `{visibility && (<p>Its is detais in hide</p>)}` — quando `visibility` é `true`, o app exibe "Its is detais in hide", com erros de grafia/gramática visíveis ao usuário. O restante do toggle funciona (linhas 3-8 e 15-17 lidas integralmente).
- **Impacto:** o único texto de conteúdo do app aparece errado na tela; mesmo num projeto de estudo, é o que se vê ao clicar no botão e é o que um avaliador nota primeiro.
- **Mudança:** corrigir o conteúdo para texto claro e coerente com o README, ex.: `<p>Detalhes visíveis.</p>`, mantendo a renderização condicional `{visibility && (...)}` intacta.
- **Aceite:** `grep` não encontra mais `detais`/`Its is` em `src/`; o comportamento do botão continua: clique alterna entre "Show"/"Hide Details" e mostra/oculta o parágrafo.
- **Verificação:**
```bash
cd /home/servidor/Git/projectsimple
grep -n "detais\|Its is" src/index.js   # hoje: linha 18 | aceite: sem saída
```

## 5. Qualidade: testes

### TEST-01 — Nenhum arquivo de teste no repositório [P2]

- **Arquivo:** `package.json:17` (`"test": "react-scripts test"`), `package.json:6-8` (`@testing-library/jest-dom`, `@testing-library/react`, `@testing-library/user-event`) e `src/index.js` (único arquivo de `src/`).
- **Evidência:** `git ls-files` não lista nenhum `*.test.*`, `*.spec.*` ou `setupTests*`; `find . -not -path './.git/*' (\( -name '*.test.*' -o -name '*.spec.*' -o -name 'setupTests*' \))` também não retorna nada. `src/` contém somente `index.js` (confirmado com `find src -type f`). As três libs de teste estão declaradas no `package.json` e nunca foram usadas.
- **Impacto:** zero rede de segurança para as mudanças de SEC-01 (upgrade do react-scripts), IMP-01 (migração de toolchain) e IMP-02 (React 18/19); o comportamento central do app — alternar `visibility` pelo clique — pode quebrar silenciosamente.
- **Mudança:** criar `src/index.test.js` cobrindo três cenários: (1) render inicial com o botão "Show" e parágrafo ausente; (2) clique exibe "Hide Details" **e** o parágrafo; (3) novo clique oculta os dois — usando `@testing-library/react` e `user-event` já declarados; adicionar `src/setupTests.js` somente se `jest-dom` for usado.
- **Aceite:** arquivo `src/*.test.js` versionado e `CI=true npm test` termina com exit 0 e ≥ 1 teste passando.
- **Verificação:**
```bash
cd /home/servidor/Git/projectsimple
find src -name '*.test.*' | wc -l   # hoje: 0 | aceite: >= 1
CI=true npm test                    # aceite: exit 0
```

## 6. DevOps / Infra

### DEVOPS-01 — Lockfiles duplicados: `package-lock.json` e `yarn.lock` ambos versionados [P1]

- **Arquivo:** `package-lock.json` e `yarn.lock` (ambos presentes em `git ls-files`), `Dockerfile:4-5`, `README.md:48`.
- **Evidência:** `git ls-files` lista os dois lockfiles entre os 11 arquivos do repo. O Dockerfile copia `package*.json` e roda `npm ci` (linha 5) — ou seja, o build usa o `package-lock.json` e **ignora** o `yarn.lock`. O README, por outro lado, ensina `npm install     # ou yarn` (README.md:48). Dois gerentes convivem sem definição de qual é o oficial.
- **Impacto:** o `yarn.lock` pode resolver versões diferentes das do `package-lock.json`: dependências instaladas localmente com yarn divergem do que o Docker builda com `npm ci` → "funciona na minha máquina", builds não reprodutíveis e auditoria (SEC-01) feita sobre um lock enquanto o build usa outro.
- **Mudança:** adotar **npm** como gerente único (é o que Dockerfile e scripts já usam); remover `yarn.lock` do repositório; corrigir o README.md:48 (remover "# ou yarn") e padronizar `npm ci` para instalações reproduzíveis.
- **Aceite:** `git ls-files` mostra um único lockfile; `npm ci` verde em ambiente limpo; README sem menção a yarn.
- **Verificação:**
```bash
cd /home/servidor/Git/projectsimple
git ls-files | grep -E '^(yarn\.lock|package-lock\.json)$'
# hoje: package-lock.json e yarn.lock | aceite: somente package-lock.json
```

### DEVOPS-02 — Dockerfile: base Node 16 (EOL), fallback `npm ci || npm install` e `serve` sem pin [P2]

- **Arquivo:** `Dockerfile:2` (`FROM node:16-alpine AS build`), `Dockerfile:5` (`RUN npm ci || npm install`), `Dockerfile:14` (`RUN npm i -g serve`).
- **Evidência:** Dockerfile lido integralmente (18 linhas). Estágio de build roda em `node:16-alpine`; o `RUN npm ci || npm install` executa `npm install` caso o `npm ci` falhe; o estágio final (`node:20-alpine`) instala `serve` globalmente **sem versão**. Ponto positivo já confirmado: `node_modules` não é copiada — `COPY package*.json ./` (linha 4) e `.dockerignore:1`.
- **Impacto:** Node 16 saiu do suporte (EOL) — base de build sem patches de segurança; o fallback mascara falha do `npm ci` e reintroduz resolução não-pinhada (perde reprodutibilidade em silêncio); `serve` sem pin muda entre um build e outro.
- **Mudança:** subir a base de build para Node 20/22-alpine (alinhar com o estágio de serve da linha 12); remover o `|| npm install` para que o `npm ci` falhe alto; pinar o servidor (`npm i -g serve@<versão>`) e, de preferência, fixar digest da imagem base.
- **Aceite:** `docker build` verde com a nova base; Dockerfile sem `node:16`, sem fallback de instalação e com `serve` pinado.
- **Verificação:**
```bash
cd /home/servidor/Git/projectsimple
grep -n "node:16\||| npm install\|npm i -g serve$" Dockerfile
# hoje: linhas 2, 5 e 14 | aceite: sem saída (base LTS + serve@x.y.z)
```

### DEVOPS-03 — Dependência ociosa `web-vitals` [P3]

- **Arquivo:** `package.json:12` (`"web-vitals": "^0.2.4"`).
- **Evidência:** `src/` contém somente `src/index.js` (24 linhas, lido integralmente) e esse arquivo **não** importa `web-vitals`; o hook padrão do CRA (`reportWebVitals`) não existe em lugar nenhum do repositório (`git ls-files` não mostra `reportWebVitals`/arquivo equivalente).
- **Impacto:** dependência que só infla `node_modules`, o `package-lock.json` e a superfície do `npm audit` sem nenhum benefício; `web-vitals@0.2.4` é uma versão antiga arrastada junto do esqueleto do CRA.
- **Mudança:** remover `web-vitals` de `package.json`, regenerar o lock com `npm install` e confirmar que os builds seguem verdes.
- **Aceite:** `grep` sem ocorrências de `web-vitals` em `package.json` e `src/`; `npm run build` verde.
- **Verificação:**
```bash
cd /home/servidor/Git/projectsimple
grep -rn "web-vitals" package.json src/
# hoje: package.json:12 | aceite: sem saída
```

## 7. Documentação

### DOC-01 — README manda rodar `docker compose up` mas não existe compose file [P2]

- **Arquivo:** `README.md:10` (comando `docker compose up --build`).
- **Evidência:** o README apresenta Docker como caminho "recomendado" (README.md:3) e manda executar `docker compose up --build` (README.md:10); porém `git ls-files` não lista nenhum `docker-compose.yml`/`compose.yaml` e `find . -not -path './.git/*' -iname '*compose*'` não encontra arquivo algum. Só existe o `Dockerfile`.
- **Impacto:** o caminho de instalação **recomendado** do projeto falha na primeira execução (erro de "no configuration file provided") — a primeira impressão de quem clona o repositório é um comando quebrado.
- **Mudança:** escolher uma das duas e executar: (a) adicionar `docker-compose.yml` de serviço único que builda o `Dockerfile` e publique a porta 3000; ou (b) trocar o README por `docker build -t projectsimple . && docker run -p 3000:3000 projectsimple`. Em qualquer caso, manter a instrução local `npm install && npm start` (README.md:14-18) consistente com o gerente escolhido na DEVOPS-01.
- **Aceite:** num clone limpo, o comando exatamente como está escrito no README executa sem erro de configuração.
- **Verificação:**
```bash
cd /home/servidor/Git/projectsimple
grep -n "docker compose" README.md        # instrução presente (hoje: linha 10)
test -f docker-compose.yml && docker compose config >/dev/null && echo "compose OK"
# hoje: compose inexistente | aceite: "compose OK" ou README sem menção a "docker compose"
```

### DOC-02 — Ícones referenciados inexistentes e títulos ainda os do sample do CRA [P2]

- **Arquivo:** `public/index.html:5,10,12,27` e `public/manifest.json:2,3,6,11,16`.
- **Evidência:** `find public -type f` mostra apenas `index.html` e `manifest.json`. Ainda assim: `index.html:5` referencia `%PUBLIC_URL%/favicon.ico` e `index.html:12` referencia `%PUBLIC_URL%/logo192.png`; `manifest.json:6,11,16` listam `favicon.ico`, `logo192.png` e `logo512.png` — nenhum existe. Título ainda é `<title>React App</title>` (index.html:27), description é "Web site created using create-react-app" (index.html:10) e o manifest se chama "Create React App Sample" (manifest.json:3) com `short_name` "React App" (manifest.json:2).
- **Impacto:** favicon/ícones de PWA dando 404 (inclusive no build, já que o template copia o conteúdo de `public/`); aba do navegador e manifest mantêm a identidade genérica do CRA em vez do nome `projectsimple`.
- **Mudança:** adicionar os ícones reais (favicon + 192 + 512) **ou** remover as tags/entradas que os referenciam; renomear `title`, `description`, `name` e `short_name` para `projectsimple`.
- **Aceite:** todo arquivo referenciado por `index.html` e `manifest.json` existe em `public/`; título da aba = `projectsimple`.
- **Verificação:**
```bash
cd /home/servidor/Git/projectsimple
grep -o '%PUBLIC_URL%/[^"]*' public/index.html | sed 's|%PUBLIC_URL%/||' | while read f; do test -f "public/$f" || echo "FALTA: $f"; done
grep -o '"src": "[^"]*"' public/manifest.json | cut -d'"' -f4 | while read f; do test -f "public/$f" || echo "FALTA: $f"; done
# hoje: 6 linhas FALTA (favicon.ico, logo192.png e logo512.png, repetindo entre os arquivos) | aceite: sem saída
grep -n "<title>" public/index.html       # aceite: <title>projectsimple</title>
```

## 8. Ordem de execução (waves)

**Wave 1 — correções rápidas (P1 barato + P3, sem risco de regressão)**

1. DEVOPS-01 — escolher npm, remover `yarn.lock`, ajustar `README.md:48`.
2. DOC-01 — adicionar `docker-compose.yml` **ou** corrigir o comando em `README.md:10`.
3. BUG-01 — corrigir o texto em `src/index.js:18`.
4. DEVOPS-03 — remover `web-vitals` de `package.json:12` e regenerar o lock.
5. SEC-02 — limitar os servidores Vite locais ao loopback.

*Gate da wave:* `git ls-files` com um único lockfile; o comando documentado no README executa; `grep` de BUG-01 e DEVOPS-03 sem saída.

**Wave 2 — segurança e base (exige cuidado, seguir a ordem)**

1. TEST-01 — **primeiro**: criar a rede de segurança (teste do toggle).
2. SEC-01 — `react-scripts@5.0.1` (ou decisão antecipada de migração via IMP-01) e regenerar o lock.
3. DEVOPS-02 — Dockerfile em Node LTS, sem fallback, `serve` pinado.

*Gate da wave:* `CI=true npm test` verde; `npm audit --package-lock-only` sem critical/high; `docker build` verde.

**Wave 3 — polimento**

1. DOC-02 — ícones e títulos (`public/index.html`, `public/manifest.json`).

*Gate da wave:* script de referências sem `FALTA` e título da aba `projectsimple`.

**Wave 4 — estratégico (executado após ampliação explícita do escopo)**

- IMP-01 (migração do CRA) e IMP-02 (React 17 → 19): concluídos com Vite 8, React 19, `createRoot` e ADR.

## 9. Itens estratégicos e riscos

Os itens `IMP-*` estavam adiados no plano original e foram implementados nesta rodada conforme ampliação do escopo pelo usuário. As descrições abaixo registram a evidência inicial e a mudança realizada.

### IMP-01 — CRA em manutenção mínima: planejar migração de toolchain (Vite) [P3]

**Estado: concluído.** Decisão e esforço registrados em [`docs/adr/0001-migrate-cra-to-vite-react-19.md`](docs/adr/0001-migrate-cra-to-vite-react-19.md).

- **Arquivo:** `package.json:11` (`react-scripts ^4.0.1`), scripts em `package.json:14-19` e `eslintConfig` em `package.json:20-25` (`extends: react-app`, `react-app/jest`).
- **Evidência:** build/dev/test dependem 100% de `react-scripts` (package.json:14-19) e o lint depende dos presets embutidos do CRA (package.json:20-25). O `npm audit` (SEC-01) mostra que o único caminho de correção apontado é `react-scripts@5.0.1` (major) e que a árvore do CRA4 continua suja. Premissa externa registrada explicitamente: o Create React App está em modo de manutenção mínima (sem releases ativos) — não é medida pelo código, é contexto de ecossistema.
- **Impacto:** sem rota de migração, toda a toolchain congela com a dívida (SEC-01 fica reabrindo) e adiar encarece a mudança; alternativas modernas (Vite para este escopo, Next se o projeto crescer) eliminam a classe de problema de uma vez.
- **Mudança:** spike de 1 dia migrando para **Vite**: `index.html` na raiz sem `%PUBLIC_URL%`, scripts `dev/build` apontando para o Vite, `eslintConfig` standalone e decisão registrada num ADR curto (Vite × CRA5 × Next) com esforço real medido.
- **Aceite:** ADR no repositório com decisão e estimativa; se migração aprovada, build e testes verdes fora do CRA.
- **Verificação:**
```bash
cd /home/servidor/Git/projectsimple
grep -c react-scripts package.json   # hoje: 5 (linha 11 + 4 scripts) | aceite: 0 após migração
```

### IMP-02 — React 17 com API legada `ReactDOM.render` (linha atual: React 19) [P3]

**Estado: concluído.** React 19 usa `createRoot`, `StrictMode` e `useState` em `src/main.jsx` e `src/App.jsx`.

- **Arquivo:** `package.json:9-10` (`react ^17.0.1`, `react-dom ^17.0.1`), `src/index.js:1` (import de `react-dom`) e `src/index.js:21` (`ReactDOM.render(jsx, document.getElementById('root'))`).
- **Evidência:** dependências presas na linha 17 do React; `src/index.js:21` usa `ReactDOM.render`, API que deixou de ser a recomendada a partir do React 18 (substituída por `createRoot`); o estado é uma variável de módulo (`src/index.js:3`, `let visibility = false`) com re-render manual via `render()` — comportamento que o próprio README descreve como "um degrau anterior ao `useState`" (README.md:33-34).
- **Impacto:** sem acesso a melhorias do React 18/19 (`createRoot`, StrictMode, concorrência); quanto mais se espera, mais caro fica o salto; warnings de depreciação assim que subir de versão.
- **Mudança:** em ciclo separado e **após TEST-01**: React 17 → 18 (`createRoot` + `StrictMode` e converter `visibility` para `useState`), depois 18 → 19; coordenar com IMP-01 para não mudar toolchain e biblioteca ao mesmo tempo.
- **Aceite:** `npm ls react --depth=0` ≥ 18 (alvo 19); nenhum `ReactDOM.render` em `src/`; build e testes verdes.
- **Verificação:**
```bash
cd /home/servidor/Git/projectsimple
grep -rn "ReactDOM.render" src/   # hoje: src/index.js:21 | aceite: sem saída
npm ls react --depth=0            # hoje: react@17.x | aceite: >= 18
```

**Riscos residuais:**

- `TEST-01` continua pendente; o comportamento abrir/fechar detalhes ainda não tem cobertura automatizada.
- A validação documental opcional `python3 /tmp/validate.py projectsimple` depende de um script externo que não está neste repositório.

## 10. Definição de pronto (DoD)

A rodada está pronta quando **todos** os itens abaixo forem verdadeiros:

- [ ] `python3 /tmp/validate.py projectsimple` imprime `OK projectsimple` (contrato externo deste documento; script não disponível no repositório).
- [x] O repositório mantém apenas `package-lock.json` como lockfile versionado (DEVOPS-01).
- [x] `docker compose config --quiet` aceita o comando documentado no README (DOC-01).
- [x] `rg -n "detais|Its is" src/` sem saída (BUG-01).
- [x] `rg -n "web-vitals|react-scripts" package.json src/` sem saída (SEC-01/DEVOPS-03).
- [ ] `find src -name '*.test.*' | wc -l` ≥ 1 e `CI=true npm test` com exit 0 (TEST-01).
- [x] `npm audit --audit-level=high` sem vulnerabilidades (SEC-01).
- [x] `rg -n "node:16|\|\| npm install" Dockerfile` sem saída; `docker build` verde e imagem roda como usuário `node` (DEVOPS-02).
- [x] Arquivos de ícone/manifest referenciados existem e o título é `projectsimple` (DOC-02).
- [x] IMP-01 e IMP-02 registrados e executados no ADR (§9).
- [x] SEC-02 — scripts/configuração Vite limitam dev e preview a `127.0.0.1`.

*Fim do plano. O diagnóstico foi feito em 2026-10-05; o estado de execução e a validação remota foram atualizados em 2026-10-11.*
