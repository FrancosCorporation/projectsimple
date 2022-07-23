import ReactDOM from 'react-dom';

let visibility = false;

const toggleVisibility = () => {
  visibility = !visibility
  render();
};
const render = () => {
  const jsx = (
    <div>
      <h1>
        Visibility
          </h1>
      <button onClick={toggleVisibility}>
        {visibility ? 'Hide Details' : 'Show'}
      </button>
      {visibility && (<p>Its is detais in hide</p>)}
    </div>
  );
  ReactDOM.render(jsx, document.getElementById('root'))
};

render();