# projectsimple

Experimento mínimo em **React** (Create React App) para praticar renderização
condicional e estado.

![React](https://img.shields.io/badge/React-17-61DAFB?style=flat-square&logo=react&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![Status](https://img.shields.io/badge/status-estudo-lightgrey?style=flat-square)

## Sobre

**Projeto de estudo** com o esqueleto do CRA e um único exercício de
renderização manual (`ReactDOM.render`): um botão alterna a visibilidade de um
bloco de detalhes ("Show"/"Hide Details") usando estado em variável e
re-render explícito — um degrau anterior ao `useState`.

## Funcionalidades

Comprovadas pelo código em `src/index.js`:

- Renderização manual com `ReactDOM.render`.
- Botão que alterna a visibilidade de um parágrafo (`visibility`).
- Estrutura padrão do Create React App (`public/index.html`, manifest,
  scripts de start/build/test).

## Como rodar

```bash
npm install     # ou yarn
npm start       # http://localhost:3000
```

## Estrutura do projeto

```
public/          # index.html + manifest
src/index.js     # exercício de visibilidade condicional
```

## Licença

MIT — veja [LICENSE](LICENSE).
