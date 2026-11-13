import { APIRequestH } from "../../sharedWorker/dboe.shared";
import DBOEPortalElement from "../portal/DBOEPortalElement";
import { getLocalPortal } from "../portal/portal";

type Props = {
  portal: DBOEPortalElement;
  x: number;
  y: number;
};

export default function Menu({ portal, x, y }: Props) {
  const existing = document.getElementById("meta-menu");
  if (existing) {
    return null;
  }

  return (
    <div id="meta-menu" style={{ left: `${x}px`, top: `${y}px` }} class="surface">
      <button
        onclick={() => {
          console.log("Make New Entity");
          const menu = document.getElementById("meta-menu");
          if (menu) {
            portal.removeChild(menu);
          }
        }}
      >
        +
      </button>
      <button
        onclick={() => {
          console.log("Open Search Screen");
          const menu = document.getElementById("meta-menu");
          if (menu) {
            portal.removeChild(menu);
          }
        }}
      >
        *
      </button>
      <button
        title="Delete Database"
        onclick={() => {
          console.log("Delete Database");
          const menu = document.getElementById("meta-menu");
          try {
            const portal = getLocalPortal();
            const deleteDBReq: APIRequestH = { name: "deleteDatabase", data: {} };
            portal.sharedWorker.port.postMessage(deleteDBReq);
          } catch (error) {
            console.error("Error resetting database:", error);
          }
          if (menu) {
            portal.removeChild(menu);
          }
        }}
      >
        x
      </button>
    </div>
  );
}
