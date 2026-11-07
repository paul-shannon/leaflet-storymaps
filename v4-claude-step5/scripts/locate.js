const ME_COLOR = '#c026d3';   // magenta: unlike the blue artwork dots and the amber selected dot

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
        L.circle(e.latlng, {radius: e.accuracy, color: ME_COLOR, weight: 1, fillColor: ME_COLOR, fillOpacity: 0.12}).addTo(group);
        L.circleMarker(e.latlng, {radius: 9, color: ME_COLOR, weight: 4, fillColor: '#fff', fillOpacity: 1}).addTo(group);   // ring, so it differs in shape as well as color
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
