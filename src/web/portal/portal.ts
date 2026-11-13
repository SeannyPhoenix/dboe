import { v7 as uuidV7 } from "uuid";

import type { APIRequestH } from "../../sharedWorker/dboe.shared";
import { initInputController, type InputController } from "../ui/ui";
import { DBOEViewData } from "../view/view";
import DBOEPortalElement from "./DBOEPortalElement";

export type DBOEPortalData = {
  sharedWorker: SharedWorker;
  element: DBOEPortalElement;
  inputControl: InputController;
  views: DBOEViewData[];
};

const portals = new Map<string, DBOEPortalData>();

export function newPortalId(): string {
  return `portal_${uuidV7()}`;
}

export async function initializePortal(portalElement: DBOEPortalElement) {
  const id = newPortalId();
  portalElement.id = id;
  portalElement.setAttribute("tabindex", "0"); // Make element focusable

  console.log("Initializing portal with ID:", id);

  const sharedWorkerPromise = initSharedWorker();
  const inputControlPromise = initInputController(portalElement);

  try {
    await Promise.all([sharedWorkerPromise, inputControlPromise]);
    const sharedWorker = await sharedWorkerPromise;
    if (!sharedWorker) {
      console.error("Failed to initialize shared worker");
      return;
    }
    const inputControl = await inputControlPromise;

    if (sharedWorker && inputControl) {
      const portalData: DBOEPortalData = {
        sharedWorker,
        element: portalElement,
        inputControl,
        views: [],
      };
      portals.set(id, portalData);
      portalElement.dboePortalData = portalData;
    }
  } catch (error) {
    console.error("Error initializing portal:", error);
  }
}

async function initSharedWorker() {
  console.log("Initializing shared worker");
  const worker = new SharedWorker("dboe.shared.js", { type: "module" });
  const { port: workerPort } = worker;

  try {
    console.log("Initializing database");
    const { port1: localPort, port2: remotePort } = new MessageChannel();
    const promise = Promise.withResolvers();

    localPort.onmessage = (event) => {
      const { data } = event;
      if (data.error) {
        promise.reject(data.error);
      } else {
        promise.resolve(data);
      }
    };
    localPort.onmessageerror = (event) => {
      promise.reject(event);
    };

    const initRequest: APIRequestH = { name: "start", data: null };
    workerPort.postMessage(initRequest, [remotePort]);
    await promise.promise;

    return worker;
  } catch (error) {
    console.error("Failed to initialize database:", error);
    return null;
  }
}

export function removePortal(id: string) {
  const portal = portals.get(id);
  if (!portal) {
    throw new Error(`No portal found with ID: ${id}`);
  }

  portal.sharedWorker.port.close();
  portals.delete(id);
  console.log("Portal removed with ID:", id);
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

  const initDBReq: APIRequestH = { name: "initDB", data: {} };

  port.postMessage(initDBReq);
  console.log("Portal started with ID:", id);
}

export function getPortal(id: string) {
  const portal = portals.get(id);
  if (!portal) {
    throw new Error(`No portal found with ID: ${id}`);
  }
  return portal;
}

export function getLocalPortal() {
  const portal = document.getElementsByTagName("dboe-portal");
  if (portal.length === 0) {
    throw new Error("No local portal found");
  }
  return getPortal(portal[0].id);
}
