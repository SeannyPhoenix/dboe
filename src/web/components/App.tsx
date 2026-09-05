import { createState, State } from './state';
import Values from './Values';

export default function App() {
  const state = createState();
  return (
    <div class="portal">
      <div>The Database of Everything V3</div>
      <Values state={state} />
    </div>
  );
}
