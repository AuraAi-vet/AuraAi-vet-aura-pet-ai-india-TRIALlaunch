import { GoogleGenAI } from '@google/genai';

async function run() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'models/gemini-1.5-flash',
      contents: 'Hello',
    });
    console.log("models/gemini-1.5-flash Success!");
  } catch (e) {
    console.log("models/gemini-1.5-flash Failed!", e.status, e.message);
  }
}
run();
