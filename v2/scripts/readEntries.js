var entries;
async function readEntries()
{
   var entries;
   console.log("------- readEntries.js entered");
    $.get('csv/seattleSmall.csv')
        .done (function(entries){
           var objectArray = $.csv.toObjects(entries)
           console.log("objects read? " + objectArray.length)
           console.log("--- returning objectArray from readEntries")
           return(objectArray)
           })
        .fail(function(e) {
          console.log("failure in reading seattleSmall.csv");
          return([]);
         })
} // readEntries

export {readEntries};
