// import {readEntries} from './readEntries.js';
import {StoryMarker} from './storyMarker.js';
import {StoryDialog} from './storyDialog.js';
export class Main {

   constructor(siteFile){
      this.siteFile = siteFile;
      this.sites = [];
      const self = this;
      this.state = {};
      this.state['fu'] = 99;
      this.state['markers'] = [];
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
      }).then(function(){
          console.log("all sites read")
          self.curateCategories()
          self.addMarkers()
          self.createThumbnailsAndPopups()
      }).fail(function(e){
              self.sites = []
              console.log("failure reading csv file.  " + e)
              console.log(e)
              })
      $('#map, #artwork, #header').css('visibility', 'visible');
      $('div.loader').css('visibility', 'hidden');
      } // ctor

  curateCategories(){
     var categories = []
     for (let i=0; i < main.sites.length; i++){
        let categoriesRaw = main.sites[i].categories;
        let categoriesExtracted = categoriesRaw.split(';')
                   .map(function(x){return(x.trim())})
        main.sites[i].categories = categoriesExtracted;
        categories = [...categories, ...categoriesExtracted]
        } // for i
     this.categories = [...new Set(categories)]
     } 

  showSites(categories){
     let visibleSites = []
     function intersection (a, b) {
        const setA = new Set(a);
        return b.filter(value => setA.has(value));
        }
     for (let i=0; i < main.sites.length; i++){
        let siteCategories = main.sites[i].categories
        if (categories[0] == "All"){
           visibleSites.push(i)
           }
        else if (intersection(categories, siteCategories).length > 0){
           visibleSites.push(i)
           }
        console.log(categories[i]);
        } // for i
     console.log(visibleSites);
     for (let i=0; i < main.sites.length; i++){
        let divID = '#thumbnail-' + i;
        if (visibleSites.indexOf(i) >= 0){
           $(divID).show()
           }
        else {
           $(divID).hide()
           }
        } // let i
     } // showSites

  getTable(){
     console.log("main.getTable() called")
     return(this.sites)
     }

  addMarkers(){
     this.bounds = []
     for (let i=0; i < this.sites.length; i++){
        const lat = this.sites[i].Latitude;
        const lon = this.sites[i].Longitude;
        var newMarker = new StoryMarker(i, this.map, this.sites[i]);
        console.log("--- new marker with bounds: ")
        console.log(newMarker.getLatLng())
        this.bounds.push(newMarker.getLatLng())
       } // for i
     this.map.fitBounds(this.bounds)
     } // addMarkers

    //----------------------------------------
    createThumbnailsAndPopups(){
       for (let i=0; i < this.sites.length; i++){
          this.createThumbnail(i, this.sites[i])
          //this.createDialog(i, this.sites[i].Chapter)
          var dialog = new StoryDialog(i, this.sites[i]);
          this.createThumbnailClickEventHandler(i, this.sites[i])
          } // for i
       } // createThumbnailsAndPopups

    //----------------------------------------
    createThumbnail(i, site){
       const thumbnailImage = site['thumbnail']
       const targetDialog = `dialog-${i}`;
       const thumbnailId = `thumbnail-${i}`;
       const title = site['Chapter'];

       console.log('creating thumbnail and click handler for ' + thumbnailImage)
       let divID = 'thumbnail-' + i;
       const markup = '<div id="' + divID + '" ' +
                      'style="border: 1px solid black; border-radius: 10px; ' +
                      'padding:10px; margin: 20px;">' + 
                       `<img src="${thumbnailImage}"` +
                         ` class="thumbnail" id="${thumbnailId}">` +
                       `<div>${title}</div>` +
                       '</div>'
        
       console.log("--- markup for thumbnail");
       //console.log(markup)
       var tg = $("#thumbnail-grid")
       tg.append(markup);
       } // createThumbnail

    //----------------------------------------
    createThumbnailClickEventHandler(i, site){
      const thumbnailId = `#thumbnail-${i}`;
      const targetDialog = `dialog-${i}`;
      console.log("thumbnailId: " + thumbnailId)
      console.log("targetDialog: " + targetDialog)

      $(thumbnailId).on("click", function(){
         console.log("thumbnail clicked");
         const dialog = document.getElementById(targetDialog);
         dialog.showModal();
         })
      } // createThumbnailClickEventHandler


    //----------------------------------------
    createDialog(i, artworkTitle){
       console.log(i + ") creating popup for " + artworkTitle)
       const id = `dialog-${i}`;
       const imgSrc = this.sites[i]['Media Link'];
       const h4 = this.sites[i]['Chapter'];
       const descriptiveText = this.sites[i]['Description'];
       var d = `<dialog id="${id}"` +
                '  <div class="image-container">' +
                `     <img src="${imgSrc}" style="margin: 0 auto; width: 50%" alt="alt"> ` + 
                      '    <div style="overflow-y: auto; padding: 30px; padding-top:0px; padding-bottom: 0px;">' +
                      `<h4>${h4}</h4>` +
                      `${descriptiveText}` +
                      '</dialog>';
       console.log("---- popup dialog newly constructed")
       console.log(d)
       //var tg = $("#thumbnail-grid")
       //tg.append(d);
       var body = $("body");
       body.append (d);
       } // createDialog


} // class Main
//---------------------------------------------------------------------
function trySetting(s, def) {
  s = getSetting(s);
  if (!s || s.trim() === '') { return def; }
  return s;
  }
//---------------------------------------------------------------------

    
