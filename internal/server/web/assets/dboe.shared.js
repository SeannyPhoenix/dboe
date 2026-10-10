// src/sharedWorker/start.ts
async function start({ port }) {
  port.postMessage({
    success: true,
    data: { workerName: self.name }
  });
}

// src/sharedWorker/dboe.shared.ts
if (!("SharedWorkerGlobalScope" in self && self instanceof SharedWorkerGlobalScope)) {
  throw new Error("Not running in SharedWorkerGlobalScope");
}
self.onconnect = (event) => {
  const port = event.ports[0];
  port.onmessage = (event2) => {
    async function handleRequest({ name, data }, handlers2) {
      try {
        const handler = handlers2[name];
        if (!handler) {
          throw new Error(`Handler for ${name} not found`);
        }
        handler({ port, data });
      } catch (error) {
        port.postMessage({ error: error.message });
      }
    }
    const req = event2.data;
    handleRequest(req, handlers);
  };
  port.start();
};
var handlers = {
  start,
  time: async ({ port }) => {
    port.postMessage({
      success: true,
      data: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
};
