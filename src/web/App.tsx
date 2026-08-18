import App from './components/App';
import './reset.css';
import './styles.css';

const appRoot = document.getElementById('app');

if (!appRoot) {
  throw new Error('Could not find #app root element');
}

appRoot.replaceChildren(<App />);