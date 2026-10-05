import App from './components/App';

import './styles/reset.css';
import './styles/fonts/fonts.css';
import './styles/styles.css';

setTimeout(() => {
  const appRoot = document.getElementById('app');

  if (!appRoot) {
    throw new Error('Could not find #app root element');
  }

  appRoot.replaceChildren(<App />);
}, 0);
