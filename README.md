# projectsimple

Um laboratório pequeno de React para explorar estado e renderização condicional.
Use o botão para abrir e fechar os detalhes e acompanhe a mudança na interface.

## Executar com Docker

Requisitos: Docker Engine e Docker Compose.

```bash
docker compose up --build
```

Abra [http://localhost:3000](http://localhost:3000). O serviço é publicado apenas
na máquina local.

Para encerrar:

```bash
docker compose down
```

## Executar localmente

Requisitos: Node.js 22.13+ ou 24 LTS e npm.

```bash
npm ci
npm run dev
```

O Vite abre a aplicação em [http://localhost:3000](http://localhost:3000).

## Comandos disponíveis

| Comando | Ação |
|---|---|
| `npm run dev` | inicia o servidor de desenvolvimento |
| `npm run build` | gera os arquivos de produção em `dist/` |
| `npm run preview` | serve a compilação localmente |
| `npm run lint` | verifica JavaScript, JSX e regras dos hooks |

## Tecnologias

- React 19 e Vite 8
- JavaScript com ESLint flat config
- Docker multi-stage com processo sem privilégios de root

## Estrutura

```text
index.html                 # entrada HTML e metadados
src/App.jsx                # exercício de estado e interface
src/App.css                # estilos do exercício
src/index.css              # estilos globais e acessibilidade
src/main.jsx               # montagem com createRoot e StrictMode
public/                    # ícone e manifest da aplicação
```

## Licença

MIT — consulte [LICENSE](LICENSE).
