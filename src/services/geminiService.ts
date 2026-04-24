import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;
const cache = new Map<string, string>();

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

export async function translateText(text: string, targetLanguage: string): Promise<string> {
  if (targetLanguage === 'en') return text;
  
  const cacheKey = `${text}:${targetLanguage}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }
  
  try {
    const ai = getAiClient();
    const prompt = `Translate to ${targetLanguage}. Return ONLY the result.\n\n"${text}"`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { temperature: 0.1 }
    });
    
    const translated = response.text?.trim() || text;
    cache.set(cacheKey, translated);
    return translated;
  } catch (error: any) {
    if (error?.status === 429) {
      console.warn("Translation limit reached, showing original text.");
      return text; // Return original if rate-limited
    }
    console.error("Translation failed:", error);
    return text;
  }
}
