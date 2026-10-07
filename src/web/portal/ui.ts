export type MouseState = {
  x: number;
  y: number;
  buttons: number;
};

export type PortalInputControl = {
  mouse: MouseState;
  keys: Set<string>;
};

export function updateMouseState(mouse: MouseState, event: MouseEvent) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
  mouse.buttons = event.buttons;
}