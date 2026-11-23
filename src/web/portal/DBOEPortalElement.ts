import { DBOEPortalData, initializePortal, startPortal } from "./portal";

export default class DBOEPortalElement extends HTMLElement {
  dboePortalData: DBOEPortalData | null = null;

  constructor() {
    super();
  }

  async connectedCallback() {
    try {
      await initializePortal(this);
      startPortal(this);
    } catch (error) {
      throw new Error("Error connecting portal element", { cause: error });
    }
  }

  disconnectedCallback() {}

  isInitialized() {
    return !!this.dboePortalData && !!this.id;
  }
}
