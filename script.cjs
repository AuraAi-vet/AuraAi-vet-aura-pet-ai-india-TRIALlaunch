const fs = require('fs');
const file = 'src/services/geminiService.ts';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/gemini-1\.5-flash-preview-0514/g, 'gemini-3-flash-preview');
content = content.replace(/gemini-1\.5-flash/g, 'gemini-3-flash-preview');
// also fix the JSON parse error by using Type from @google/genai and responseSchema instead of responseMimeType if we want. Or just remove responseMimeType since it sometimes ignores the prompt if schema is missing, or we can use Type.ARRAY.
fs.writeFileSync(file, content);
console.log("Replaced!");
