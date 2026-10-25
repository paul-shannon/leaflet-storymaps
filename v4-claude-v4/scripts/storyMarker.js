// Hover tooltips only where a real pointer exists; touch gets the preview card instead.
const HOVER = matchMedia('(hover: hover) and (pointer: fine)').matches;

export class StoryMarker {
  constructor(i, map, site, onSelect) {
    this.artworkNumber = i;
    this.title = site.title;
    this.latLng = [site.lat, site.lng];
    this.selected = false;
    // 44 px hit area around an 18 px dot; Leaflet makes the icon focusable, and Enter triggers a click.
    const icon = L.divIcon({className: 'story-marker', html: '<span class="dot"></span>',
                            iconSize: [44, 44], iconAnchor: [22, 22]});
    this.marker = L.marker(this.latLng, {icon, keyboard: true, riseOnHover: true});
    this.marker.on('add', () => this.decorate());      // the icon element is rebuilt every time the marker is re-added
    if (HOVER) this.marker.bindTooltip(this.title, {direction: 'top', offset: [0, -14]});
    this.marker.on('click', () => onSelect(i));
    this.marker.addTo(map);
  }

  decorate() {
    const el = this.marker.getElement();
    if (!el) return;
    el.setAttribute('aria-label', this.title);
    el.setAttribute('role', 'button');
    el.classList.toggle('is-selected', this.selected);
  }

  setSelected(on) {
    this.selected = on;
    this.marker.setZIndexOffset(on ? 1000 : 0);
    this.decorate();
  }

  getLatLng() { return this.latLng; }
}
