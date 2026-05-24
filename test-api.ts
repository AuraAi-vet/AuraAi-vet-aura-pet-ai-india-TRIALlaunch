import { GoogleGenAI } from '@google/genai';

async function run() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: "Hello",
      config: { responseMimeType: "application/json" }
    });
    console.log("SUCCESS", response.text);
  } catch (e) {
    console.log("FAILED", JSON.stringify(e));
  }
}
run();
