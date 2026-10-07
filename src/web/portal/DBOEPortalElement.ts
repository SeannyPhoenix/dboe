import { v7 as uuidv7 } from 'uuid';

import { initializePortal, removePortal, startPortal } from './portal';

export default class DBOEPortalElement extends HTMLElement {
  id = uuidv7();

  constructor() {
    super();
  }

  async connectedCallback() {
    await initializePortal(this.id);
    startPortal(this.id);
  }

  disconnectedCallback() {
    removePortal(this.id);
  }
}
