require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

async function test() {
  const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  console.log("API Key present:", !!apiKey);
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Hello",
    });
    console.log("SUCCESS");
  } catch (e) {
    console.log("FAILED", JSON.stringify(e));
  }
}
test();
