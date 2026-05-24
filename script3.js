import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY });
async function test() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Hello",
    });
    console.log("SUCCESS");
  } catch (e) {
    console.log("FAILED", e);
  }
}
test();
