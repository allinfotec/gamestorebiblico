import { GoogleGenAI, Type } from "@google/genai";

let ai: GoogleGenAI | null = null;
try {
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
} catch (error) {
  console.warn("Gemini API missing", error);
}

export async function explainVerse(verse: string, text: string): Promise<string> {
  if (!ai) throw new Error("API não configurada");
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Explique o seguinte versículo bíblico de forma simples, reconfortante e teologicamente correta em português: "${verse} - ${text}". Mantenha o texto em até 2 parágrafos.`,
  });
  return response.text || "Não foi possível gerar a explicação.";
}

export async function generateDevotional(): Promise<{ title: string, verse: string, content: string }> {
  if (!ai) throw new Error("API não configurada");
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: "Gere um devocional diário curto baseado na Bíblia em português. Retorne o resultado em JSON com os campos: title, verse, content.",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          verse: { type: Type.STRING },
          content: { type: Type.STRING }
        },
        required: ["title", "verse", "content"]
      }
    }
  });

  if (!response.text) throw new Error("Não foi possível gerar o devocional");
  return JSON.parse(response.text);
}

export async function suggestThematicVerses(theme: string): Promise<Array<{ reference: string, text: string }>> {
  if (!ai) throw new Error("API não configurada");
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Sugira 3 versículos bíblicos conhecidos que ajudem no tema: "${theme}". Retorne o resultado em JSON como um array de objetos, onde cada objeto tem os campos: reference, text.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            reference: { type: Type.STRING },
            text: { type: Type.STRING }
          },
          required: ["reference", "text"]
        }
      }
    }
  });

  if (!response.text) throw new Error("Não foi possível sugerir versículos");
  return JSON.parse(response.text);
}
