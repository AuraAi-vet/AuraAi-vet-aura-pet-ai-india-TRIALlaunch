import { GoogleGenAI } from '@google/genai';

async function test() {
  const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  console.log("API Key present:", !!apiKey, apiKey?.length);
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `Analyze pets [] and records [].
        Generate 4 to 5 personalized, actionable care insights.
        ALWAYS return a valid JSON array of objects: [{ "title": "string", "description": "string", "category": "health|nutrition|behavior", "priority": "high|medium|low" }].
        No extra text outside the JSON.`,
      config: { maxOutputTokens: 2000, responseMimeType: "application/json" }
    });
    console.log("SUCCESS");
  } catch (e) {
    console.log("FAILED", JSON.stringify(e));
  }
}
test();
