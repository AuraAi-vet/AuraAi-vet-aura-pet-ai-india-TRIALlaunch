import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  try {
    const res = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: 'What is the northernmost city in the US?',
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    console.log("gemini-1.5-flash with search Success!", res.text);
  } catch (e) {
    console.log("gemini-1.5-flash with search Failed!", e.status, e.message);
  }
}
run();
