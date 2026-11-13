import "./styles/reset.css";
import "./styles/fonts/fonts.css";
import "./styles/styles.css";
import DBOEPortalElement from "./portal/DBOEPortalElement";
import DBOEViewElement from "./view/DBOEViewElement";

customElements.define("dboe-portal", DBOEPortalElement);
customElements.define("dboe-view", DBOEViewElement)