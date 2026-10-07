// src/web/sharedWorker/dboe.shared.ts
if (!("SharedWorkerGlobalScope" in self && self instanceof SharedWorkerGlobalScope)) {
  throw new Error("Not running in SharedWorkerGlobalScope");
}
self.onconnect = (event) => {
  const port = event.ports[0];
  port.start();
  port.onmessage = (event2) => {
    port.postMessage(event2.data);
  };
};
