import { NextRequest } from "next/server";
import GeminiService from "../../api-services/gemini";

/**
 * API route for extracting menu data from uploaded images or PDFs
 * Uses Google Gemini AI to analyze and extract menu items with names, prices, and descriptions
 */
export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File

  if (typeof (file) !== "object") return new Response(JSON.stringify({ success: false, message: "Invalid file" }), { status: 400 })

  if (file.size > 20000000) return new Response(JSON.stringify({ success: false, message: "File size too large (max 20MB)" }), { status: 400 })

  if (file.type !== "image/png" && file.type !== "image/jpeg" && file.type !== "image/jpg" && file.type !== "application/pdf") return new Response(JSON.stringify({ success: false, message: "Invalid file type" }), { status: 400 })

  const data = await file.arrayBuffer()
  const buffer = Buffer.from(data)
  const base64Data = buffer.toString("base64")

  try {
    const geminiInstance = GeminiService.getInstance()

    const response = await geminiInstance.readMenu(base64Data, file.type === "application/pdf" ? "pdf" : "image") as { success: boolean; data: { menuDetails: Array<{ name: string; price: string; description: string }> } }

    console.log("Gemini response:", response)

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