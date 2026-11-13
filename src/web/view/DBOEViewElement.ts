import { debugError, debugLog } from "../logging/log";
import { initializeView, type DBOEViewData } from "./view";

export default class DBOEViewElement extends HTMLElement {
  dboeViewData: DBOEViewData | null = null;

  constructor() {
    super();
  }

  connectedCallback() {
    try {
      initializeView(this);
    } catch (error) {
      debugError("Failed to initialize view:", error);
    }
  }

  disconnectedCallback() {
    if (this.id) {
      debugLog(`Removing view with ID: ${this.id}`);
    } else {
      debugLog("Removing view with no ID");
    }
  }
}
