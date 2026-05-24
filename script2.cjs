const fs = require('fs');

const file = 'src/services/GeminiAIService.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/gemini-1\.5-flash-preview-0514/g, 'gemini-3-flash-preview');
content = content.replace(/gemini-1\.5-flash/g, 'gemini-3-flash-preview');

fs.writeFileSync(file, content);
console.log("Replaced models in GeminiAIService.ts");
