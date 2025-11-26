// import {readEntries} from './readEntries.js';
//--------------------------------------------------------------------------------
export class Main {

   constructor(siteFile){
      this.siteFile = siteFile;
      this.sites = [];
      const self = this;
      // $("#scratchPad").append("constructing Main, creating map");
      this.map = L.map('map', {
          zoom: 1,
          scrollWheelZoom: true,
          zoomControl: true,
          tap: false});
      this.map.setView([47.65544, -122.30508], 12);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  maxZoom: 19,
                  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  }).addTo(this.map);

      $.get(this.siteFile, function(data){
          self.sites = $.csv.toObjects(data)
          console.log("*** read csv, object count: " + self.sites.length)
          self.addMarkers()
          }).fail(function(e){
              self.sites = []
              console.log("failure reading csv file.  " + e)
              })
      } // ctor

  getTable(){
     console.log("main.getTable() called")
     return(this.sites)
     }

  addMarkers(){
     this.bounds = []
     for (let i=0; i < this.sites.length; i++){
        const lat = this.sites[i].Latitude;
        const lon = this.sites[i].Longitude;
        var marker = L.marker([lat, lon])
        marker.addTo(this.map)      
        var self = this;
        marker.on('click', function(){
           const msg = self.sites[i].Chapter;
           console.log(msg)
           })
        this.bounds.push(marker.getLatLng())
       } // for i
     this.map.fitBounds(this.bounds)
  } // addMarkers

} // class Main
//---------------------------------------------------------------------
function trySetting(s, def) {
  s = getSetting(s);
  if (!s || s.trim() === '') { return def; }
  return s;
  }
//---------------------------------------------------------------------

    
