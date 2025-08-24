import { Doc } from "convex/_generated/dataModel";
import { api } from "../../../../../../../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    callId,
    dialogue,
    speaker
  } = body as Doc<"transcripts">

  // Validate the request body
  if (!callId?.trim() || !dialogue?.trim() || !speaker?.trim()) {
    return new Response(JSON.stringify({
      success: false,
      error: "`callId`, `dialogue`, `speaker` are required fields."
    }), {
      status: 400,
      headers: {
        "Content-Type": "application/json"
      }
    })
  }
  // Validate the speaker
  if ((speaker !== "ai" && speaker !== "human")) {
    return new Response(JSON.stringify({
      success: false,
      error: "Invalid `speaker` field. Must be either `ai` or `human`"
    }), {
      status: 400,
      headers: {
        "Content-Type": "application/json"
      }
    })
  }

  const convexClient = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL)
  const convexResponse = await convexClient.mutation(api.internal.addTranscript, { data: body })
  return new Response(JSON.stringify(convexResponse), {
    headers: {
      "Content-Type": "application/json",
    },
    status: 200,
  });

}