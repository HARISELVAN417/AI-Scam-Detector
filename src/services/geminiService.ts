import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const analyzeFinancialNews = async (text: string) => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Analyze the following financial news article for factual accuracy. 
    1. Extract the key factual claims made in the text.
    2. For each claim, determine if it is SUPPORTED, REFUTED, or UNVERIFIED based on your knowledge of financial markets and historical data.
    3. Provide a brief explanation for each claim's status.
    4. Provide a source URL if possible (use real, well-known financial news sources like Bloomberg, Reuters, CNBC, or official SEC filings if applicable).
    5. Determine an overall verdict (REAL, FAKE, or UNVERIFIED).
    6. Provide a confidence score (0-100).
    7. Provide a concise summary of the findings.

    Article Text:
    ${text}
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          verdict: {
            type: Type.STRING,
            enum: ["REAL", "FAKE", "UNVERIFIED"],
            description: "The overall verdict of the article."
          },
          confidence: {
            type: Type.NUMBER,
            description: "Confidence score from 0 to 100."
          },
          summary: {
            type: Type.STRING,
            description: "A concise summary of the verification results."
          },
          claim_results: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                claim: { type: Type.STRING, description: "The factual claim extracted." },
                result: { 
                  type: Type.STRING, 
                  enum: ["SUPPORTED", "REFUTED", "UNVERIFIED"],
                  description: "The verification result for this specific claim."
                },
                explanation: { type: Type.STRING, description: "Brief reasoning for the result." },
                source: { type: Type.STRING, description: "A URL to a verified source supporting or refuting the claim." }
              },
              required: ["claim", "result", "explanation"]
            }
          }
        },
        required: ["verdict", "confidence", "summary", "claim_results"]
      }
    }
  });

  if (!response.text) {
    throw new Error("No response from AI");
  }

  return JSON.parse(response.text);
};
