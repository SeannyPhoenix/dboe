import { DBIndex } from '../../db/DBIndex/DBIndex';
import { readTombstones, readValues, readValueTypes } from '../../db/localStorage/journal';

type DBOEPortal = {
  index: DBIndex;
  sharedWorker: SharedWorker;
};

const portals = new Map<string, DBOEPortal>();

export async function initializePortal(id: string) {
  console.log('Initializing portal with ID:', id);
  const portal: Partial<DBOEPortal> = {};
  await Promise.all([
    buildIndex()
      .then((index) => {
        portal.index = index;
        console.log('Index built');
      })
      .catch((error) => {
        console.error('Error building index:', error);
      }),
    initializeSharedWorker()
      .then((worker) => {
        portal.sharedWorker = worker;
        console.log('Shared worker initialized');
      })
      .catch((error) => {
        console.error('Error initializing shared worker.', error);
      }),
  ]);

  if (portal.index && portal.sharedWorker) {
    portals.set(id, { index: portal.index, sharedWorker: portal.sharedWorker });
  }
}

async function buildIndex() {
  console.log('Building Index');
  const index = new DBIndex();
  index.addTombstones(readTombstones());
  index.addValueTypes(readValueTypes());
  index.addValues(readValues());
  return index;
}

async function initializeSharedWorker() {
  console.log('Initializing shared worker');
  const worker = new SharedWorker('sharedWorker/dboe.shared.js', { type: 'module' });
  return worker;
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
  if (portal) {
    const { port: messagePort } = portal.sharedWorker;
    messagePort.start();

    messagePort.onmessage = (event) => {
      console.log(event);
    };

    messagePort.postMessage({ type: 'start' });
    console.log('Portal started with ID:', id);
  } else {
    console.warn('No portal found with ID:', id);
  }
}
