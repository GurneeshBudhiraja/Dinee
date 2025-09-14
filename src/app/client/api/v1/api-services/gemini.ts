import { GEMINI_MODEL_2POINT5_FlASH, PROMPT_READ_MENU } from "@/lib/constants";
import { GoogleGenAI } from "@google/genai";

/**
 * Gemini service for AI-powered menu data extraction
 * Uses Google's Gemini 2.5 Flash model to analyze menu images and PDFs
 */
export default class GeminiService {
  private static instance: GeminiService;
  private ai: GoogleGenAI;

  private constructor() {
    if (!process.env.NEXT_GEMINI_API_KEY) {
      throw new Error('Gemini API key is required. Please set NEXT_GEMINI_API_KEY environment variable.');
    }

    this.ai = new GoogleGenAI({
      apiKey: process.env.NEXT_GEMINI_API_KEY
    });
  }

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  async readMenu(base64MenuData: string, fileType: "image" | "pdf") {
    const contents = [
      { text: PROMPT_READ_MENU },
    ];

    const RESPONSE_SCHEMA = {
      type: "object",
      properties: {
        menuDetails: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string", description: "Menu item name" },
              price: { type: "string", description: "Menu item price" },
              description: { type: "string", description: "Menu item description from the menu (if provided)" }
            },
            required: ["name", "price"]
          }
        }
      },
      required: ["menuDetails"]
    };

    try {
      if (fileType === "image") {
        contents.unshift({
          // @ts-ignore
          inlineData: {
            mimeType: "image/png",
            data: base64MenuData,
          },
        });
      } else if (fileType === "pdf") {
        contents.push({
          // @ts-ignore
          inlineData: {
            mimeType: "application/pdf",
            data: base64MenuData,
          },
        });
      }

      const response = await this.ai.models.generateContent({
        model: GEMINI_MODEL_2POINT5_FlASH,
        contents: contents,
        config: {
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA,
        }
      });
      console.log("GEMINI RESPONSE")
      console.log(response)

      return {
        success: true,
        data: JSON.parse(response.text as string),
      };
    } catch (error) {
      console.error("Gemini API error:", error);

      return {
        success: false,
        data: { menuDetails: [] },
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}