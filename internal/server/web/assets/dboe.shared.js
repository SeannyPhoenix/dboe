// src/sharedWorker/initDB.ts
var initDB = ({ port }) => {
  const openReq = indexedDB.open("dboe", 1);
  openReq.onupgradeneeded = (event) => {
    port.postMessage({ success: true, message: "Database upgrade started" });
    const db = event.target.result;
    try {
      const valueTypesStore = db.createObjectStore("valueTypes", { keyPath: "id" });
      valueTypesStore.createIndex("serde", "serde", {
        multiEntry: false,
        unique: false
      });
      const valuesStore = db.createObjectStore("values", { keyPath: "id" });
      valuesStore.createIndex("entity", "entity", {
        multiEntry: false,
        unique: false
      });
      valuesStore.createIndex("valueType", "valueType", {
        multiEntry: false,
        unique: false
      });
      db.createObjectStore("linkTypes", { keyPath: "id" });
      const linksStore = db.createObjectStore("links", { keyPath: "id" });
      linksStore.createIndex("entities", "entities", {
        multiEntry: true,
        unique: false
      });
      linksStore.createIndex("linkType", "linkType", {
        multiEntry: false,
        unique: false
      });
      port.postMessage({ success: true, message: "Database upgraded" });
    } catch (error) {
      port.postMessage({ success: false, error: error.message });
    }
  };
  openReq.onerror = (event) => {
    port.postMessage({ success: false, error: { event } });
  };
  openReq.onsuccess = () => {
    port.postMessage({ success: true, message: "Database opened successfully" });
  };
};
var deleteDatabase = ({ port }) => {
  const deleteReq = indexedDB.deleteDatabase("dboe");
  deleteReq.onsuccess = () => {
    port.postMessage({ success: true, message: "Database deleted successfully" });
  };
  deleteReq.onerror = (event) => {
    port.postMessage({ success: false, error: { event } });
  };
};

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
  const [port] = event.ports;
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
    void handleRequest(req, handlers);
  };
  port.start();
};
var handlers = {
  start,
  initDB,
  deleteDatabase
};
