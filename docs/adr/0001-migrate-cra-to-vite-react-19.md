# ADR 0001: Migrar CRA para Vite e React 19

- **Status:** Aceita e implementada em 2026-10-11
- **Contexto:** o projeto dependia do Create React App 4, React 17 e `ReactDOM.render`. O plano de melhorias encontrou 210 alertas no lockfile original, ícones referenciados ausentes e dependências de telemetria sem uso.
- **Decisão:** usar Vite 8 para desenvolvimento/build e React 19 com `createRoot`. Manter o escopo como aplicação estática de estudo, sem introduzir servidor de aplicação.
- **Alternativas consideradas:** atualizar para CRA 5 deixaria a aplicação na toolchain em manutenção mínima; Next.js acrescentaria renderização e servidor sem necessidade para um único exercício local. Vite atende ao escopo e permite remover a cadeia antiga do CRA.
- **Consequências:** entrada HTML passa para a raiz; scripts e lint ficam explícitos; Node 22.13+ ou 24 LTS é necessário; o Docker serve o build estático com `serve@14.2.6` como usuário `node`.
- **Esforço observado:** migração focada em uma tela, configuração, metadados, documentação e container; conclusão em um ciclo de implementação. Não há suíte de testes no repositório; sua criação e execução continuam pendentes.
