import DBOEPortalElement from '../portal/DBOEPortalElement';

type Props = {
  portal: DBOEPortalElement;
  x: number;
  y: number;
};

export default function Menu({ portal, x, y }: Props) {
  const existing = document.getElementById('meta-menu');
  if (existing) {
    return null;
  }

  return (
    <div id="meta-menu" style={{ left: `${x}px`, top: `${y}px` }} class="surface">
      <button
        onclick={(event) => {
          console.log('Make New Entity');
          const menu = document.getElementById('meta-menu');
          if (menu) {
            portal.removeChild(menu);
          }
        }}
      >
        +
      </button>
      <button
        onclick={(event) => {
          console.log('Open Search Screen');
          const menu = document.getElementById('meta-menu');
          if (menu) {
            portal.removeChild(menu);
          }
        }}
      >
        *
      </button>
    </div>
  );
}
