import { NextRequest } from "next/server";
import BedrockService from "../../api-services/bedrock";

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File

  // File validation
  if (typeof (file) !== "object") return new Response(JSON.stringify({ success: false, message: "Invalid file" }), { status: 400 })

  // Validating max file size (increased for Bedrock as it can handle larger files)
  if (file.size > 20000000) return new Response(JSON.stringify({ success: false, message: "File size too large (max 20MB)" }), { status: 400 })

  // Validating file type
  if (file.type !== "image/png" && file.type !== "image/jpeg" && file.type !== "image/jpg" && file.type !== "application/pdf") return new Response(JSON.stringify({ success: false, message: "Invalid file type" }), { status: 400 })

  // Converts to the ArrayBuffer
  const data = await file.arrayBuffer()
  // Convert ArrayBuffer to Node.js Buffer
  const buffer = Buffer.from(data)
  // Node.js buffer to base64 
  const base64Data = buffer.toString("base64")

  try {
    // Gets Bedrock instance
    const bedrockInstance = BedrockService.getInstance()

    const response = await bedrockInstance.readMenu(base64Data, file.type === "application/pdf" ? "pdf" : "image", file.type) as { success: boolean; data: { menuDetails: Array<{ name: string; price: string; description: string }> } }

    console.log("Bedrock response:", response)

    if (!response.success) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Failed to extract menu data"
        }), {
        headers: {
          "Content-Type": "application/json",
        },
        status: 500,
      })
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: response.data.menuDetails
      }), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    })
  } catch (error) {
    console.error("Error processing menu extraction:", error)
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error during menu extraction"
      }), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 500,
    })
  }
}