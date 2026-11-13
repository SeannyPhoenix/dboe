import { v7 as uuidV7 } from "uuid";

import { DBIndex } from "../../db/DBIndex/DBIndex";
import { RecordSet, newRecordSet } from "../../db/recordSet";
import DBOEPortalElement from "../portal/DBOEPortalElement";
import DBOEViewElement from "./DBOEViewElement";

export type DBOEViewData = {
  element: DBOEViewElement;
  records: RecordSet;
  index: DBIndex;
};

export function newViewId(): string {
  return `view_${uuidV7()}`;
}

export function initializeView(viewElement: DBOEViewElement) {
  const id = newViewId();
  viewElement.id = id;

  const portalElement = viewElement.parentElement;
  if (!(portalElement instanceof DBOEPortalElement)) {
    viewElement.remove();
    throw new Error("View element must be attached to a portal");
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
