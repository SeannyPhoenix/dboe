/// <reference lib="webworker" />

if (!('SharedWorkerGlobalScope' in self && self instanceof SharedWorkerGlobalScope)) {
  throw new Error('Not running in SharedWorkerGlobalScope');
}

self.onconnect = (event: MessageEvent) => {
  const port = event.ports[0];
  port.start();

  port.onmessage = (event) => {
    port.postMessage(event.data);
  };
};
