import { JSX } from '../../jsx/jsx-runtime/html';
import { Reactive } from './reactive';

export function reactiveComponent<T extends JSX.ComponentProps>(
  subscriptions: Reactive<any>[],
  props: T,
  Component: JSX.Component<T>,
): Node | Node[] {
  const anchor = (<></>) as DocumentFragment;

  function update() {
    const component = <Component {...props} />;
    anchor.replaceChildren(component);
  }

  update();
  subscriptions.forEach((sub) => sub.subscribe(update));
  return anchor;
}
