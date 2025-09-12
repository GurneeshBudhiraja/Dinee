import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { PROMPT_READ_MENU } from "@/lib/constants";

export default class BedrockService {
  private static instance: BedrockService;
  private client: BedrockRuntimeClient;

  private constructor() {
    // Validate required environment variables
    if (!process.env.NEXT_AWS_ACCESS_KEY_ID || !process.env.NEXT_AWS_SECRET_ACCESS_KEY) {
      throw new Error('AWS credentials are required. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.');
    }

    this.client = new BedrockRuntimeClient({
      region: process.env.NEXT_AWS_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.NEXT_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  public static getInstance(): BedrockService {
    if (!BedrockService.instance) {
      BedrockService.instance = new BedrockService();
    }

    return BedrockService.instance;
  }

  async readMenu(base64MenuData: string, fileType: "image" | "pdf", mimeType?: string) {
    try {
      // Prepare the content based on file type
      const content = [];

      if (fileType === "image") {
        // Use the actual mime type or default to jpeg
        const imageMimeType = mimeType || "image/jpeg";
        content.push({
          type: "image",
          source: {
            type: "base64",
            media_type: imageMimeType,
            data: base64MenuData,
          },
        });
      } else if (fileType === "pdf") {
        content.push({
          type: "document",
          source: {
            type: "base64",
            media_type: "application/pdf",
            data: base64MenuData,
          },
        });
      }

      content.push({
        type: "text",
        text: `${PROMPT_READ_MENU}
        Please analyze the provided ${fileType} and extract menu items with their names, prices, and descriptions (if available). Return the data in the following JSON format:
        {
        "menuDetails": [
        {
          "name": "Menu item name",
          "price": "Menu item price (without currency symbol)",
          "description": "Menu item description (empty string if not available)"
        }
      ]
    }
    If no menu items are found, return an empty array for menuDetails.`,
      });

      const payload = {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 4000,
        messages: [
          {
            role: "user",
            content: content,
          },
        ],
        temperature: 0.1,
      };

      const command = new InvokeModelCommand({
        modelId: "anthropic.claude-3-5-sonnet-20241022-v2:0", // Claude 3.5 Sonnet supports images and PDFs
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify(payload),
      });

      const response = await this.client.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));

      // Extract the text content from Claude's response
      console.log("responseBody")
      console.log(responseBody)
      const responseText = responseBody.content[0].text;
      // Try to parse the JSON response
      let parsedData: { menuDetails: Array<{ name: string; price: string; description: string }> };
      try {
        // Look for JSON in the response text
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No JSON found in response");
        }
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
        return {
          success: false,
          data: { menuDetails: [] }
        };
      }

      return {
        success: true,
        data: parsedData,
      };
    } catch (error) {
      console.error("Bedrock API error:", error);

      // More specific error handling
      if (error instanceof Error) {
        if (error.message.includes('AccessDenied')) {
          console.error('AWS Access Denied - Check IAM permissions and model access');
        } else if (error.message.includes('ValidationException')) {
          console.error('Validation Error - Check request format and model parameters');
        } else if (error.message.includes('ThrottlingException')) {
          console.error('Rate Limiting - Too many requests to Bedrock');
        }
      }

      return {
        success: false,
        data: { menuDetails: [] },
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}