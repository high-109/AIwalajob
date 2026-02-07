
import { GoogleGenAI, Type } from "@google/genai";
import { Job, JobAnalysis } from "../types";

export const analyzeJobWithAI = async (job: Job): Promise<JobAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Analyze this job posting and provide a structured JSON summary.
  Job Title: ${job.title}
  Description: ${job.description}
  
  Focus on identifying the core requirements, a summary of the role, and an estimated market salary range based on the details.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            keyRequirements: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            estimatedSalaryRange: { type: Type.STRING },
            matchScore: { type: Type.NUMBER, description: 'Likelihood of job market demand (1-100)' }
          },
          required: ['summary', 'keyRequirements', 'estimatedSalaryRange', 'matchScore']
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result as JobAnalysis;
  } catch (error) {
    console.error("AI Analysis failed", error);
    throw error;
  }
};
