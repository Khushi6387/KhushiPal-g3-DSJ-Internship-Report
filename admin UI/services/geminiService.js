
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeIssueWithAI = async (issue) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Analyze the following citizen report and provide a brief recommendation for an admin.
        Check if the description matches the category and if the urgency seems high.
        
        Title: ${issue.title}
        Category: ${issue.category}
        Description: ${issue.description}
        Location: ${issue.village}, ${issue.mandal}, ${issue.district}
      `,
      config: {
        systemInstruction: "You are an AI assistant for a government administrator. Be concise and helpful.",
      }
    });
    
    return response.text || "No AI feedback available.";
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return "Failed to get AI recommendation.";
  }
};
