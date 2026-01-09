import {readEntries} from './readEntries.mjs';

$(document).ready(function(){
   console.log("document ready in pshannon.mjs")
   let e = Promise.resolve(readEntries())
   console.log("after readEntries in pshannon.mjs")
   console.log(e)
   console.log("entry count: " + e.length)
   })

