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
    
    // Convert remaining sharp shapes
    content = content.replace(/rounded-xl/g, 'rounded-[1.25rem]');
    content = content.replace(/rounded-3xl/g, 'rounded-[2.5rem]');
    
    // Colors
    content = content.replace(/bg-\[#F8F7F3\]/g, 'bg-[#FDFBF7]');
    content = content.replace(/border-\[#F0EBE6\]/g, 'border-ruru-navy/10');
    content = content.replace(/text-\[#8B8B6B\]/g, 'text-ruru-navy/60');
    
    // Green -> Teal
    content = content.replace(/text-emerald-500/g, 'text-ruru-teal');
    content = content.replace(/text-emerald-400/g, 'text-ruru-teal-light');
    content = content.replace(/bg-emerald-500/g, 'bg-ruru-teal');
    content = content.replace(/bg-emerald-400/g, 'bg-ruru-teal-light');
    content = content.replace(/bg-emerald-600/g, 'bg-ruru-teal');
    content = content.replace(/border-emerald-/g, 'border-ruru-teal-');
    content = content.replace(/shadow-emerald-/g, 'shadow-ruru-teal-');

    
    // Replace the old olive color with ruru-navy-light
    content = content.replace(/#5A5A40/g, 'ruru-navy-light');
    // For CSS classes if they got converted like bg-[#5A5A40], we had replaced it by bg-ruru-navy-light but wait, it will be bg-[ruru-navy-light] which is wrong.
    
    content = content.replace(/text-\[#5A5A40\]/g, 'text-ruru-navy-light');
    content = content.replace(/bg-\[#5A5A40\]/g, 'bg-ruru-navy-light');
    content = content.replace(/border-\[#5A5A40\]/g, 'border-ruru-navy-light');
    content = content.replace(/ring-\[#5A5A40\]/g, 'ring-ruru-navy-light');
    
    // Replace hex that might still be there standalone
    content = content.replace(/#5A5A40/g, '#192b45');
    
    // Background enhancements: only replace EXACT 'bg-white' when followed by space or ' ' or quote
    // Let's use negative lookahead to avoid breaking bg-white/something
    content = content.replace(/(?<!-)bg-white(?!\/)/g, 'bg-white/95 backdrop-blur-3xl');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      replacedCount++;
      console.log('Updated: ' + filePath);
    }
  }
});

console.log('Done! Updated files: ' + replacedCount);
