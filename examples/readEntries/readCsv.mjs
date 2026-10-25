var entries;
function readEntries(){
   var chapters;
   console.log("pshannon.js sees document ready");
   $.get('csv/Chapters.csv',
       .done(function(chapters){
          console.log("done, success");
          return($.csv.toObjects(chapters))
          })
       .fail(function(e) {
           console.log("failure in reading Chapters.csv");
           })
        )

