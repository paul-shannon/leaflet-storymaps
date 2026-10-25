// "Find me" button. The browser asks permission when tapped; the position stays on this device.
export function addLocateControl(map) {
  const group = L.layerGroup().addTo(map);
  const Control = L.Control.extend({
    options: {position: 'topleft'},
    onAdd() {
      const b = L.DomUtil.create('button', 'map-locate');
      b.type = 'button';
      b.textContent = 'Find me';
      L.DomEvent.disableClickPropagation(b);
      const reset = () => { b.textContent = 'Find me'; b.disabled = false; };
      b.addEventListener('click', () => {
        b.textContent = 'Locating…';
        b.disabled = true;
        map.locate({enableHighAccuracy: true, timeout: 10000});
      });
      map.on('locationfound', e => {
        group.clearLayers();
        L.circle(e.latlng, {radius: e.accuracy, weight: 1, fillOpacity: 0.1}).addTo(group);
        L.circleMarker(e.latlng, {radius: 8, color: '#fff', weight: 2, fillColor: '#2f6f8f', fillOpacity: 1}).addTo(group);
        map.setView(e.latlng, Math.max(map.getZoom(), 15));
        reset();
      });
      map.on('locationerror', () => {
        b.textContent = 'Location unavailable';
        b.disabled = false;
        setTimeout(reset, 3000);
      });
      return b;
    }
  });
  new Control().addTo(map);
}
