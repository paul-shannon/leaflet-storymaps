const fs = require('fs').promises; // Use the promise-based version of fs
const {parse} = require('csv-parse');

async function getCsvData(filePath) {
  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    const records = await parse(fileContent, {
      columns: true, // Treat the first row as column headers
      skip_empty_lines: true
    });
    console.log("records found: " + records.length)
    return records;
  } catch (error) {
    console.error('Error reading or parsing CSV:', error);
    throw error; // Re-throw the error for handling by the caller
  }
}

// Example usage:
getCsvData('../../csv/Chapters.csv')
  .then(data => {
      
      console.log('CSV Data obtained');
    // Process your CSV data here
  })
  .catch(error => {
    console.error('Failed to get CSV data:', error);
  });

