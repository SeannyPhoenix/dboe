import { Reactive } from './reactive';

export function reactiveComponent(
  subscriptions: Reactive<any>[],
  render: () => Node | Node[],
): HTMLElement {
  const container = document.createElement('div');

  function update() {
    container.innerHTML = '';
    const content = render();
    container.append(...(Array.isArray(content) ? content : [content]));
  }

  subscriptions.forEach((sub) => sub.subscribe(update));
  update();
  return container;
}
