import "./styles/reset.css";
import "./styles/fonts/fonts.css";
import "./styles/styles.css";
import DBOEPortalElement from "./portal/DBOEPortalElement";
import DBOEViewElement from "./view/DBOEViewElement";

async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/dboe.service.js");
      if (registration.installing) {
        console.log("Service worker installing");
      } else if (registration.waiting) {
        console.log("Service worker installed");
      } else if (registration.active) {
        console.log("Service worker active");
      }
    } catch (error) {
      console.error("Service worker registration failed:", error);
    }
  }
}

void registerServiceWorker();

customElements.define("dboe-portal", DBOEPortalElement);
customElements.define("dboe-view", DBOEViewElement);
