import { FormData } from "@/components/onboarding/RestaurantSetup";
import { NextRequest } from "next/server";
import GeminiService from "../../api-services/gemini";

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const { file } = Object.fromEntries(formData) as { file: File }

  // File validation
  if (typeof (file) !== "object") return new Response(JSON.stringify({ success: false, message: "Invalid file" }), { status: 400 })

  // Validating max file size
  if (file.size > 10000000) return new Response(JSON.stringify({ success: false, message: "File size too large" }), { status: 400 })

  // Validating file type
  if (file.type !== "image/png" && file.type !== "image/jpeg" && file.type !== "image/jpg" && file.type !== "application/pdf") return new Response(JSON.stringify({ success: false, message: "Invalid file type" }), { status: 400 })

  // Converts to the ArrayBuffer
  const data = await file.arrayBuffer()
  // Convert ArryaBuffer to Node.js Buffer
  const buffer = Buffer.from(data)
  // Node.js buffer to base64 
  const base64Data = buffer.toString("base64")

  // Gets Gemini instance
  const geminiInstance = GeminiService.getInstance()

  const response = await geminiInstance.readMenu(base64Data, file.type === "application/pdf" ? "pdf" : "image") as { success: boolean; data: { menuDetails: FormData["menuDetails"] } }
  console.log(response)
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

}