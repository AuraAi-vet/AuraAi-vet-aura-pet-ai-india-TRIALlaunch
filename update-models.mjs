const fs = require('fs');
const filePath = 'src/services/geminiService.ts';
let content = fs.readFileSync(filePath, 'utf8');

// The task commands "update all its workflows, networks to be smooth and user friendly with lowest cost model for the app".
// gemini-3.1-flash-lite is the lowest cost model.
content = content.replace(/gemini-3-flash-preview/g, 'gemini-3.1-flash-lite');

fs.writeFileSync(filePath, content);
console.log('Successfully updated models to gemini-3.1-flash-lite');
