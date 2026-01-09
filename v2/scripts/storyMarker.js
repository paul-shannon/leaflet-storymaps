export class StoryMarker {

    constructor(i, map, site){
       console.log("--- creating marker for artwork " + i)
       var self = this;
       this.artworkNumber = i;
       this.map = map;
       this.site = site;
       this.title = site.Chapter;
       this.latLng = [site.Latitude, site.Longitude];
       var marker = L.circleMarker(this.latLng, {
                                   radius: 5,
                                   opacity: .9,                            
                                   color: "blue",
                                   fillColor: "blue",
                                   fillOpacity: 0.5
                                   })
       this.marker = marker;
       marker.addTo(map)
       marker.bindPopup(this.title)
       marker.on('mouseover', function (e) {
          e.target.closePopup();
          setTimeout(function() {
          e.target.openPopup();
          }, 1000);
       });
       marker.on('mouseout', function (e) {
          this.closePopup();
          });
       marker.on('click', function(e) {
         console.log('  marker click: ' + self.artworkNumber);
         e.target.closePopup()
         const targetDialog = `dialog-${self.artworkNumber}`;
         const dialog = document.getElementById(targetDialog);
         dialog.showModal();

         })

       } // ctor
    //------------------------------------------------------------
    getLatLng(){
       return(this.latLng)
       }
} // class       
