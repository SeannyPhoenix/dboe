import type { APIRequestH } from '../../sharedWorker/dboe.shared';
import { initInputController, type InputController } from '../ui/ui';
import DBOEPortalElement from './DBOEPortalElement';

type DBOEPortal = {
  sharedWorker: SharedWorker;
  element: DBOEPortalElement;
  inputControl: InputController;
};

const portals = new Map<string, DBOEPortal>();

export async function initializePortal(portal: DBOEPortalElement) {
  const { id } = portal;

  console.log('Initializing portal with ID:', id);

  const sharedWorkerPromise = initSharedWorker(portal);
  const inputControlPromise = initInputController(portal);

  try {
    await Promise.all([sharedWorkerPromise, inputControlPromise]);
    const sharedWorker = await sharedWorkerPromise;
    if (!sharedWorker) {
      console.error('Failed to initialize shared worker');
      return;
    }
    const inputControl = await inputControlPromise;

    if (sharedWorker && inputControl) {
      portals.set(id, {
        sharedWorker,
        element: portal,
        inputControl,
      });
    }
  } catch (error) {
    console.error('Error initializing portal:', error);
  }
}

async function initSharedWorker(portal: DBOEPortalElement) {
  console.log('Initializing shared worker');
  const worker = new SharedWorker('dboe.shared.js', { type: 'module', name: portal.id });
  return worker;
}

export function removePortal(id: string) {
  const portal = portals.get(id);
  if (!portal) {
    throw new Error(`No portal found with ID: ${id}`);
  }

  portal.sharedWorker.port.close();
  portals.delete(id);
  console.log('Portal removed with ID:', id);
}

export function startPortal(id: string) {
  const portal = portals.get(id);
  if (!portal) {
    throw new Error(`No portal found with ID: ${id}`);
  }

  const { port } = portal.sharedWorker;
  port.onmessage = (event) => {
    console.log(event.data);
  };
  port.start();

  const initRequest: APIRequestH = { name: 'start', data: null };
  const timeRequest: APIRequestH = { name: 'time', data: null };

  port.postMessage(initRequest);
  port.postMessage(timeRequest);
  console.log('Portal started with ID:', id);
}
