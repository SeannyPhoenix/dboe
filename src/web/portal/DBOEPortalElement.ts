import { v7 as uuidv7 } from 'uuid';

import { initializePortal, removePortal, startPortal } from './portal';

export default class DBOEPortalElement extends HTMLElement {
  id = uuidv7();

  constructor() {
    super();
    this.setAttribute('tabindex', '0'); // Make element focusable
  }

  async connectedCallback() {
    try {
      await initializePortal(this);
      startPortal(this.id);
    } catch (error) {
      throw new Error('Error connecting portal element', { cause: error });
    }
  }

  disconnectedCallback() {
    removePortal(this.id);
  }
}
