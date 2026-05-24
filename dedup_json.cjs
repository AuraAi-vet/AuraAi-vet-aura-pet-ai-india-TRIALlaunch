const fs = require('fs');

const file = 'src/services/geminiService.ts';
let content = fs.readFileSync(file, 'utf8');

// deduplicate responseMimeType
const lines = content.split('\n');
const newLines = [];
let lastWasMimeType = false;

for (const line of lines) {
  if (line.includes('responseMimeType: "application/json"')) {
    if (lastWasMimeType) continue;
    lastWasMimeType = true;
  } else {
    lastWasMimeType = false;
  }
  newLines.push(line);
}

fs.writeFileSync(file, newLines.join('\n'));
