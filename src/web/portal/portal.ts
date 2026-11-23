import { v7 as uuidV7, validate } from "uuid";

import type { APIRequestH } from "../../sharedWorker/dboe.shared";
import { debugError, debugLog } from "../logging/log";
import { initInputController, type InputController } from "../ui/ui";
import { DBOEViewData } from "../view/view";
import DBOEPortalElement from "./DBOEPortalElement";

export type DBOEPortalData = {
  sharedWorker: SharedWorker;
  element: DBOEPortalElement;
  inputControl: InputController;
  views: DBOEViewData[];
};

const SINGLETON_PORTAL_ERROR = new Error("Only one portal may exist in the DOM at a time");

export async function initializePortal(portalElement: DBOEPortalElement) {
  const portals = document.getElementsByTagName("dboe-portal");
  if (portals.length > 1) {
    debugError(SINGLETON_PORTAL_ERROR.message);
    portalElement.remove();
    throw SINGLETON_PORTAL_ERROR;
  }

  if (!validate(portalElement.id)) {
    portalElement.id = uuidV7();
  }
  debugLog(`Initializing portal with ID ${portalElement.id}`);

  portalElement.setAttribute("tabindex", "0"); // Make element focusable

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

export function startPortal(portalElement: DBOEPortalElement) {
  if (!portalElement.isInitialized()) {
    throw new Error("Portal element is not initialized");
  }

  const id = portalElement.id;

  const { port } = portalElement.dboePortalData!.sharedWorker;
  port.onmessage = (event) => {
    console.log(event.data);
  };
  port.start();

  const initDBReq: APIRequestH = { name: "ensureDB", data: {} };

  port.postMessage(initDBReq);
  console.log("Portal started with ID:", id);
}
