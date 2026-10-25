export class StoryMarker {
  constructor(i, map, site, onSelect) {
    this.artworkNumber = i;
    this.title = site.title;
    this.latLng = [site.lat, site.lng];
    const marker = L.circleMarker(this.latLng, {
      radius: 5, opacity: .9, color: 'blue', fillColor: 'blue', fillOpacity: 0.5
    });
    this.marker = marker;
    marker.addTo(map);
    marker.bindPopup(this.title);
    marker.on('mouseover', e => {
      e.target.closePopup();
      setTimeout(() => e.target.openPopup(), 1000);
    });
    marker.on('mouseout', e => e.target.closePopup());
    marker.on('click', e => {
      e.target.closePopup();
      onSelect(i);
    });
  }

  getLatLng() { return this.latLng; }
}
