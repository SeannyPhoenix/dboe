import { DBIndex } from '../../db/DBIndex/DBIndex';
import { readTombstones, readValues, readValueTypes } from '../../db/localStorage/journal';
import Menu from '../components/Menu';
import DBOEPortalElement from './DBOEPortalElement';
import { updateMouseState, type PortalInputControl } from './ui';

type DBOEPortal = {
  index: DBIndex;
  sharedWorker: SharedWorker;
  element: DBOEPortalElement;
  inputControl: PortalInputControl;
};

const portals = new Map<string, DBOEPortal>();

export async function initializePortal(element: DBOEPortalElement) {
  const { id } = element;

  console.log('Initializing portal with ID:', id);

  const indexPromise = buildIndex();
  const sharedWorkerPromise = initSharedWorker();
  const inputControlPromise = initInputControl(element);

  try {
    await Promise.all([indexPromise, sharedWorkerPromise, inputControlPromise]);
  } catch (error) {
    console.error('Error initializing portal:', error);
  }

  const index = await indexPromise;
  if (!index) {
    console.error('Failed to build index');
    return;
  }
  const sharedWorker = await sharedWorkerPromise;
  if (!sharedWorker) {
    console.error('Failed to initialize shared worker');
    return;
  }
  const inputControl = await inputControlPromise;

  if (index && sharedWorker && inputControl) {
    portals.set(id, {
      index,
      sharedWorker,
      element,
      inputControl,
    });
  }
}

async function buildIndex() {
  console.log('Building index');
  const index = new DBIndex();
  index.addTombstones(readTombstones());
  index.addValueTypes(readValueTypes());
  index.addValues(readValues());
  return index;
}

async function initSharedWorker() {
  console.log('Initializing shared worker');
  const worker = new SharedWorker('sharedWorker/dboe.shared.js', { type: 'module' });
  return worker;
}

async function initInputControl(portal: DBOEPortalElement) {
  console.log('Initializing input control');
  const inputState: PortalInputControl = {
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

export function removePortal(id: string) {
  const portal = portals.get(id);
  if (portal) {
    portal.sharedWorker.port.close();
    portals.delete(id);
    console.log('Portal removed with ID:', id);
  } else {
    console.warn('No portal found with ID:', id);
  }
}

export function startPortal(id: string) {
  const portal = portals.get(id);

  if (!portal) {
    console.warn('No portal found with ID:', id);
    return;
  }

  const { port: messagePort } = portal.sharedWorker;
  messagePort.start();

  messagePort.onmessage = (event) => {
    console.log(event.data);
  };

  messagePort.postMessage({ name: "initialize", data: null });
  console.log('Portal started with ID:', id);
}
