const fs = require('fs');

const file = 'src/services/geminiService.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/maxOutputTokens: 1000,/g, 'maxOutputTokens: 1000,\n        responseMimeType: "application/json",');

fs.writeFileSync(file, content);
