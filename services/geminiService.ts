
import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are a high-end personal fashion stylist for NOMAD, a premium unisex minimalist brand.
Your style is professional, sophisticated, and helpful. 
You know the NOMAD collection well: ${JSON.stringify(PRODUCTS.map(p => ({ name: p.name, price: p.price, desc: p.description })))}.

Instructions:
1. Provide personalized outfit advice based on user requests (mood, occasion, weather).
2. Recommend specific items from the NOMAD collection listed above.
3. Keep responses concise and elegant.
4. If a user asks for something outside of fashion, gently guide them back to styling.
5. Use markdown for lists and bolding.
`;

export async function getStylistResponse(history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: history,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.9,
      },
    });

    return response.text || "I'm sorry, I couldn't process that request. How else can I help you style your NOMAD collection today?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm experiencing a brief moment of reflection. Please try again in a moment.";
  }
}
