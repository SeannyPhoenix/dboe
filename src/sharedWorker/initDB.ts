import { EmptyData, Handler } from "./dboe.shared";

export const initDB: Handler<EmptyData, void> = ({ port }) => {
  const openReq = indexedDB.open("dboe", 1);

  openReq.onupgradeneeded = (event) => {
    port.postMessage({ success: true, message: "Database upgrade started" });

    const db = (event.target as IDBOpenDBRequest).result;

    try {
      const valueTypesStore = db.createObjectStore("valueTypes", { keyPath: "id" });
      valueTypesStore.createIndex("serde", "serde", {
        multiEntry: false,
        unique: false,
      });

      const valuesStore = db.createObjectStore("values", { keyPath: "id" });
      valuesStore.createIndex("entity", "entity", {
        multiEntry: false,
        unique: false,
      });
      valuesStore.createIndex("valueType", "valueType", {
        multiEntry: false,
        unique: false,
      });

      db.createObjectStore("linkTypes", { keyPath: "id" });

      const linksStore = db.createObjectStore("links", { keyPath: "id" });
      linksStore.createIndex("entities", "entities", {
        multiEntry: true,
        unique: false,
      });
      linksStore.createIndex("linkType", "linkType", {
        multiEntry: false,
        unique: false,
      });
      port.postMessage({ success: true, message: "Database upgraded" });
    } catch (error: any) {
      port.postMessage({ success: false, error: (error as Error).message });
    }
  };

  openReq.onerror = (event) => {
    port.postMessage({ success: false, error: { event } });
  };

  openReq.onsuccess = () => {
    // const db = (event.target as IDBOpenDBRequest).result;
    port.postMessage({ success: true, message: "Database opened successfully" });
  };
};

export const deleteDatabase: Handler<EmptyData, void> = ({ port }) => {
  const deleteReq = indexedDB.deleteDatabase("dboe");

  deleteReq.onsuccess = () => {
    port.postMessage({ success: true, message: "Database deleted successfully" });
  };

  deleteReq.onerror = (event) => {
    port.postMessage({ success: false, error: { event } });
  };
};

export const addValueType: Handler<{ id: string; serde: string }, void> = ({ port, data }) => {
  const { id, serde } = data;
  const openReq = indexedDB.open("dboe", 1);

  openReq.onsuccess = (event) => {
    const db = (event.target as IDBOpenDBRequest).result;
    const tx = db.transaction("valueTypes", "readwrite");
    const store = tx.objectStore("valueTypes");
    const addReq = store.add({ id, serde });

    addReq.onsuccess = (event) => {
      port.postMessage({ success: true, message: "Value type added successfully", event });
    };

    addReq.onerror = (event) => {
      port.postMessage({ success: false, error: { event } });
    };
  };
};
