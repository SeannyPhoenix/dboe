import { v7 as uuidv7 } from 'uuid';

import { initializePortal, removePortal, startPortal } from './portal';

export default class DBOEPortalElement extends HTMLElement {
  id = uuidv7();

  constructor() {
    super();
    this.setAttribute('tabindex', '0'); // Make element focusable
  }

  async connectedCallback() {
    await initializePortal(this);
    startPortal(this.id);
  }

  disconnectedCallback() {
    removePortal(this.id);
  }
}
