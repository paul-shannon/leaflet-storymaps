export class StoryDialog {

    constructor(i, site){
       this.site = site;
       console.log(i + ") creating dialog for " + this.site.Chapter);
       const id = `dialog-${i}`;
       const imgSrc = this.site['Media Link'];
       const h4 = this.site['Chapter'];
       const descriptiveText = this.site['Description'];
       var d = `<dialog id="${id}"` +
            '  <div class="image-container">' +
            `     <img src="${imgSrc}" style="margin: 0 auto; width: 50%" alt="alt"> ` + 
            '    <div style="overflow-y: auto; padding: 30px; padding-top:0px; padding-bottom: 0px;">' +
            `<h4>${h4}</h4>` +
            `${descriptiveText}` +
           '</dialog>';
      console.log("---- popup dialog newly constructed")
      var body = $("body");
      body.append (d);
      } // createDialog ctor

} // StoryDialog class  
