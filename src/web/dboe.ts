import "./styles/reset.css";
import "./styles/fonts/fonts.css";
import "./styles/styles.css";
import DBOEPortalElement from "./portal/DBOEPortalElement";
import DBOEViewElement from "./view/DBOEViewElement";

async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    try {
      await navigator.serviceWorker.register("/dboe.service.js");
    } catch (error) {
      console.error("Service worker registration failed:", error);
    }
  }
}

void registerServiceWorker();

customElements.define("dboe-portal", DBOEPortalElement);
customElements.define("dboe-view", DBOEViewElement);
