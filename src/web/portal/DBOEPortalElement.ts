import { DBOEPortalData, initializePortal, removePortal, startPortal } from "./portal";

export default class DBOEPortalElement extends HTMLElement {
  dboePortalData: DBOEPortalData | null = null;

  constructor() {
    super();
  }

  async connectedCallback() {
    try {
      await initializePortal(this);
      startPortal(this.id);
    } catch (error) {
      throw new Error("Error connecting portal element", { cause: error });
    }
  }

  disconnectedCallback() {
    if (this.id) {
      removePortal(this.id);
    }
  }
}
