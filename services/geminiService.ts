import { GoogleGenAI, Type } from "@google/genai";
import { Review, UserProfile } from "../types";

// Always use a named parameter for apiKey and use process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMirrorInsight = async (reviews: Review[]) => {
  if (!reviews || reviews.length === 0) return "Not enough data for insights yet.";

  try {
    const prompt = `Analyze the following anonymous community reviews for a user and provide a constructive summary for personal growth. 
    Focus on 3 top strengths and 1 area for improvement. Keep it concise and supportive.
    Reviews: ${JSON.stringify(reviews.map(r => ({ domain: r.domain, rating: r.rating, comment: r.comment, tag: r.tag })))}`;

    // Calling generateContent with model and contents as per guidelines
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are a specialized personal growth coach. Your tone is professional, encouraging, and highly analytical.",
      }
    });

    // Access the .text property directly
    return response.text || "Insight generation failed.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The mirror is currently foggy. Try again later.";
  }
};