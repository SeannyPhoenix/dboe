import { v7 as uuidV7, validate } from "uuid";

import { DBIndex } from "../../db/DBIndex/DBIndex";
import { RecordSet, newRecordSet } from "../../db/recordSet";
import { debugError, debugLog } from "../logging/log";
import DBOEPortalElement from "../portal/DBOEPortalElement";
import DBOEViewElement from "./DBOEViewElement";

export type DBOEViewData = {
  element: DBOEViewElement;
  records: RecordSet;
  index: DBIndex;
};

const VIEW_PORTAL_ERROR = new Error("View element must be attached to a portal");

export function initializeView(viewElement: DBOEViewElement) {
  if (!validate(viewElement.id)) {
    viewElement.id = uuidV7();
  }
  debugLog(`Initializing view with ID ${viewElement.id}`);

  const portalElement = viewElement.parentElement;
  if (!(portalElement instanceof DBOEPortalElement) || !portalElement.isInitialized()) {
    viewElement.remove();
    debugError(VIEW_PORTAL_ERROR.message);
    throw VIEW_PORTAL_ERROR;
  }

  const recordSet = newRecordSet();
  const index = new DBIndex(recordSet);

  const data: DBOEViewData = {
    element: viewElement,
    records: recordSet,
    index,
  };

  portalElement.dboePortalData?.views.push(data);
}
