var entries;
async function readEntries()
{
   var chapters;
   console.log("pshannon.js sees document ready");
   $.get('csv/Chapters.csv', function(chapters) {
      $.csv.toObjects(chapters)
      console.log("pshannon reads chapters");
      entries = chapters;
      console.log("entries read?")
      return(entries)
      // console.log(chapters.length)
      }).fail(function(e) {
        console.log("failure in reading Chapters.csv");
        })
} // document ready

export {readEntries};