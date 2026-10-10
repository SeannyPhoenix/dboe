import Menu from '../components/Menu';
import DBOEPortalElement from '../portal/DBOEPortalElement';

export type MouseState = {
  x: number;
  y: number;
  buttons: number;
};

export type InputController = {
  mouse: MouseState;
  keys: Set<string>;
};

export function updateMouseState(mouse: MouseState, event: MouseEvent) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
  mouse.buttons = event.buttons;
}

export async function initInputController(portal: DBOEPortalElement) {
  console.log('Initializing input control');
  const inputState: InputController = {
    mouse: {
      x: 0,
      y: 0,
      buttons: 0,
    },
    keys: new Set<string>(),
  };

  portal.onmousemove = (event) => {
    updateMouseState(inputState.mouse, event);
  };

  portal.onmousedown = (event) => {
    updateMouseState(inputState.mouse, event);
    if (inputState.keys.has('Meta')) {
      const { x, y } = inputState.mouse;
      const menu = <Menu portal={portal} x={x} y={y} />;
      if (menu) {
        portal.appendChild(menu);
      }
    }
  };

  portal.onmouseup = (event) => {
    updateMouseState(inputState.mouse, event);
  };

  portal.oncontextmenu = (event) => {
    updateMouseState(inputState.mouse, event);
    event.preventDefault();

    const { x, y } = inputState.mouse;
    const menu = <Menu portal={portal} x={x} y={y} />;
    if (menu) {
      portal.appendChild(menu);
    }
  };

  portal.onkeydown = (event) => {
    inputState.keys.add(event.key);
    if (inputState.keys.has('Escape')) {
      const menu = document.getElementById('meta-menu');
      if (menu) {
        portal.removeChild(menu);
      }
    }
  };

  portal.onkeyup = (event) => {
    inputState.keys.delete(event.key);
  };

  return inputState;
}
