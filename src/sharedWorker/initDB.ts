// import { EmptyData, Handler } from "./dboe.shared";

// type IDTimestampKey = [string, string];

// interface DBOE_DB extends DBSchema {
//   valueTypes: {
//     key: string;
//     value: ValueType;
//     indexes: {
//       serde: string;
//       time: IDTimestampKey;
//     };
//   };
//   values: {
//     key: string;
//     value: Value;
//     indexes: {
//       entity: string;
//       type: string;
//       time: IDTimestampKey;
//     };
//   };
//   linkTypes: {
//     key: string;
//     value: LinkType;
//     indexes: {
//       time: IDTimestampKey;
//     };
//   };
//   links: {
//     key: string;
//     value: Link;
//     indexes: {
//       entities: string;
//       type: string;
//       time: IDTimestampKey;
//     };
//   };
//   tombstones: {
//     key: string;
//     value: Tombstone;
//     indexes: {
//       time: IDTimestampKey;
//     };
//   };
// }

// export async function initDB() {
// await openDB("dboe", 1, {
//   upgrade(db) {
//     const valueTypesStore = db.createObjectStore("valueTypes", { keyPath: "id" });
//     valueTypesStore.createIndex("serde", "serde", {
//       multiEntry: false,
//       unique: false,
//     });
//     const valuesStore = db.createObjectStore("values", { keyPath: "id" });
//     valuesStore.createIndex("entity", "entity", {
//       multiEntry: false,
//       unique: false,
//     });
//     valuesStore.createIndex("type", "type", {
//       multiEntry: false,
//       unique: false,
//     });
//     db.createObjectStore("linkTypes", { keyPath: "id" });
//     const linksStore = db.createObjectStore("links", { keyPath: "id" });
//     linksStore.createIndex("entities", "entities", {
//       multiEntry: true,
//       unique: false,
//     });
//     linksStore.createIndex("type", "type", {
//       multiEntry: false,
//       unique: false,
//     });
//   },
// });
// }
// export const ensureDB: Handler<EmptyData, void> = () => {
// void openDB("dboe", undefined, {
//   upgrade(db) {
//     const valueTypesStore = db.createObjectStore("valueTypes", { keyPath: "id" });
//     valueTypesStore.createIndex("serde", "serde", {
//       multiEntry: false,
//       unique: false,
//     });
//     const valuesStore = db.createObjectStore("values", { keyPath: "id" });
//     valuesStore.createIndex("entity", "entity", {
//       multiEntry: false,
//       unique: false,
//     });
//     valuesStore.createIndex("type", "type", {
//       multiEntry: false,
//       unique: false,
//     });
//     db.createObjectStore("linkTypes", { keyPath: "id" });
//     const linksStore = db.createObjectStore("links", { keyPath: "id" });
//     linksStore.createIndex("entities", "entities", {
//       multiEntry: true,
//       unique: false,
//     });
//     linksStore.createIndex("type", "type", {
//       multiEntry: false,
//       unique: false,
//     });
//   },
// });
// };

// export const deleteDB: Handler<EmptyData, void> = ({ port }) => {
//   const deleteReq = indexedDB.deleteDatabase("dboe");

//   deleteReq.onsuccess = () => {
//     port.postMessage({ success: true, message: "Database deleted successfully" });
//   };

//   deleteReq.onerror = (event) => {
//     port.postMessage({ success: false, error: { event } });
//   };
// };

// export const addValueType: Handler<{ id: string; serde: string }, void> = ({ port, data }) => {
//   const { id, serde } = data;
//   const openReq = indexedDB.open("dboe", 1);

//   openReq.onsuccess = (event) => {
//     const db = (event.target as IDBOpenDBRequest).result;
//     const tx = db.transaction("valueTypes", "readwrite");
//     const store = tx.objectStore("valueTypes");
//     const addReq = store.add({ id, serde });

//     addReq.onsuccess = (event) => {
//       port.postMessage({ success: true, message: "Value type added successfully", event });
//     };

//     addReq.onerror = (event) => {
//       port.postMessage({ success: false, error: { event } });
//     };
//   };
// };
