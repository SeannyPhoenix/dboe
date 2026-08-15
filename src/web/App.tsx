import './reset.css';
import './styles.css';

const appRoot = document.getElementById('app');

if (!appRoot) {
  throw new Error('Could not find #app root element');
}

appRoot.replaceChildren(<App />);

export default function App() {
  return <div>The Database of Everything</div>
}