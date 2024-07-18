const fs = require('fs');
const path = require('path');

function loadData(file) {
  const filePath = path.join(__dirname, '..', 'data', file);
  const jsonData = fs.readFileSync(filePath);
  return JSON.parse(jsonData);
}

function saveData(file, data) {
  const filePath = path.join(__dirname, '..', 'data', file);
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, jsonData);
}

module.exports = { loadData, saveData };
