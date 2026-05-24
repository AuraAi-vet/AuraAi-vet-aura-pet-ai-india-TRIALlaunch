const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

let replacedCount = 0;

walk(directoryPath, (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // typography
    content = content.replace(/font-serif/g, 'font-brand');
    
    // update colors
    content = content.replace(/bg-\[#2D2A26\]/g, 'bg-ruru-navy');
    content = content.replace(/text-\[#2D2A26\]/g, 'text-ruru-navy');
    content = content.replace(/border-\[#2D2A26\]/g, 'border-ruru-navy');
    
    // soft UI
    content = content.replace(/rounded-2xl/g, 'rounded-[1.5rem]');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      replacedCount++;
      console.log('Updated: ' + filePath);
    }
  }
});

console.log('Done! Updated files: ' + replacedCount);
