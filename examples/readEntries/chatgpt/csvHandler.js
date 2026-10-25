/* csvHandler.js content */
export class CsvHandler {
    constructor(tableSelector) {
        this.$table = $(tableSelector);
    }

//--------------------------------------------------------------------------------
// return an array of arrays
parseCSV(csvText) {
   return new Promise((resolve, reject) => {
       try {
          const rows = csvText.trim().split('\n');
          const data = rows.map(row => row.split(','));
          resolve(data);
       } catch (error) {
           reject(error);
       }
   });

} // parseCSV
//--------------------------------------------------------------------------------
displayTable(data) {
   this.$table.empty();
   data.forEach(row => {
      const tr = $('<tr></tr>');
      row.forEach(cell => {
          tr.append($('<td></td>').text(cell));
      });
      this.$table.append(tr);
   });

} // displayTable
//--------------------------------------------------------------------------------
// return an array of objects
parseCSV2(csvString) {

  return new Promise((resolve, reject) => {
     try {
        const lines = csvString.split('\n');
        const headers = lines[0].split(',');
        const result = [];
        for (let i = 1; i < lines.length; i++) {
           const values = lines[i].split(',');
           const obj = {};
           for (let j = 0; j < headers.length; j++) {
              obj[headers[j].trim()] = values[j] ? values[j].trim() : '';
              } // j
           result.push(obj);
           } // i
        resolve(result);
     } catch (error) {
         reject(error);
         }
     }); // Promise

} // parseCSV2
//--------------------------------------------------------------------------------

} // class CsvHandler
