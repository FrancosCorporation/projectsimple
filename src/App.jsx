import { useState } from 'react';
import './App.css';

function App() {
  const [detailsVisible, setDetailsVisible] = useState(false);

  const toggleDetails = () => {
    setDetailsVisible((visible) => !visible);
  };

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="projectsimple, início">
          <span className="brand-mark" aria-hidden="true">p.</span>
          <span>projectsimple</span>
        </a>
        <span className="topbar-note">
          <span className="status-dot" aria-hidden="true" />
          laboratório de interface
        </span>
      </header>

      <section className="intro" id="inicio" aria-labelledby="page-title">
        <div className="intro-copy">
          <p className="eyebrow"><span>01</span> ESTUDO DE REACT</p>
          <h1 id="page-title">
            Uma pequena ação.
            <br />
            <span>Uma resposta visível.</span>
          </h1>
          <p className="intro-description">
            Explore como o estado de um componente muda o que aparece na tela.
            Clique, observe e entenda o ciclo por trás da interface.
          </p>
        </div>

        <aside className="intro-aside" aria-label="Conceito deste exercício">
          <span className="aside-index">A ideia</span>
          <p>Uma interface clara deixa o comportamento fácil de perceber.</p>
          <span className="aside-rule" aria-hidden="true" />
          <span className="aside-caption">ESTADO → INTERFACE</span>
        </aside>
      </section>

      <section className="workbench" aria-labelledby="exercise-title">
        <div className="workbench-heading">
          <div>
            <p className="eyebrow">EXERCÍCIO INTERATIVO</p>
            <h2 id="exercise-title">Mostrar ou ocultar detalhes</h2>
          </div>
          <span className="technology-tag">useState</span>
        </div>

        <div className="exercise-grid">
          <div className="exercise-copy">
            <p className="exercise-label">COMPONENTE EM AÇÃO</p>
            <h3>O que muda quando você clica?</h3>
            <p className="exercise-description">
              O botão atualiza um valor de estado. O React usa esse novo valor
              para renderizar os detalhes abaixo.
            </p>

            <button
              className="toggle-button"
              type="button"
              aria-expanded={detailsVisible}
              aria-controls="details-panel"
              onClick={toggleDetails}
            >
              <span>{detailsVisible ? 'Ocultar detalhes' : 'Mostrar detalhes'}</span>
              <span className="button-icon" aria-hidden="true">
                {detailsVisible ? '−' : '+'}
              </span>
            </button>

            <div
              className={`state-readout${detailsVisible ? ' is-visible' : ''}`}
              aria-live="polite"
              aria-atomic="true"
            >
              <span className="state-indicator" aria-hidden="true" />
              <span>Estado atual</span>
              <strong>{detailsVisible ? 'Visível' : 'Recolhido'}</strong>
            </div>
          </div>

          <div
            className={`details-panel${detailsVisible ? ' is-visible' : ''}`}
            id="details-panel"
            aria-hidden={!detailsVisible}
          >
            {detailsVisible ? (
              <div className="detail-content">
                <div className="detail-topline">
                  <span className="detail-symbol" aria-hidden="true">✳</span>
                  <span>POR DENTRO DO COMPONENTE</span>
                </div>
                <h3>Três passos, uma mudança.</h3>
                <ol className="detail-steps">
                  <li>
                    <span className="step-number">01</span>
                    <span>O clique chama a função do botão.</span>
                  </li>
                  <li>
                    <span className="step-number">02</span>
                    <span>O estado alterna entre aberto e fechado.</span>
                  </li>
                  <li>
                    <span className="step-number">03</span>
                    <span>A tela acompanha o novo estado.</span>
                  </li>
                </ol>
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-state-icon" aria-hidden="true">↗</span>
                <p>Os detalhes aparecem aqui.</p>
                <span>Experimente o botão para começar.</span>
              </div>
            )}
          </div>
        </div>

        <div className="workbench-footer">
          <span>INTERAÇÃO 01 <span aria-hidden="true">/</span> ESTADO LOCAL</span>
          <span>Use <kbd>Tab</kbd> e <kbd>Enter</kbd> para navegar</span>
        </div>
      </section>

      <footer className="page-footer">
        <span>Feito para aprender, um componente de cada vez.</span>
        <span>React · {new Date().getFullYear()}</span>
      </footer>
    </main>
  );
}

export default App;
