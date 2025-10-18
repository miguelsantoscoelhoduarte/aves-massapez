const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'public', 'aves_massapez.xlsx');

if (fs.existsSync(filePath)) {
  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  console.log('Total rows:', jsonData.length);
  console.log('Animals found:');
  for (let i = 3; i < jsonData.length; i++) {
    const row = jsonData[i];
    if (row[0] && row[0] !== 'Animal') {
      console.log(`Row ${i}: Animal=${row[0]}, Species=${row[1] || ''}, Color=${row[2] || ''}, EggPrice=${row[3] || 0}`);
    }
  }
} else {
  console.log('File not found:', filePath);
}