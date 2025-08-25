import { Doc } from "convex/_generated/dataModel";
import { api } from "../../../../../../../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json()
  const {
    callId,
    status,
  } = body as Doc<"calls">

  console.log("🛣️ Upserting call data")
  console.log(body)
  // Validate the request body
  if (!callId?.trim()) {
    return new Response(JSON.stringify({
      success: false,
      error: "`callId` are required fields."
    }), {
      status: 400,
      headers: {
        "Content-Type": "application/json"
      }
    })
  }

  // Validate the status value
  if (status?.trim() && status !== "completed" && status !== "active") {
    return new Response(JSON.stringify({
      success: false,
      error: "`status` must be either `completed` or `active`."
    }), {
      status: 400,
      headers: {
        "Content-Type": "application/json"
      }
    })
  }

  const convexClient = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL)
  const convexResponse = await convexClient.mutation(api.internal.upsertCallData, { data: body })
  console.log("🔎 UPSERTING convex response")
  console.log(convexResponse)
  return new Response(JSON.stringify(convexResponse), {
    headers: {
      "Content-Type": "application/json",
    },
    status: 200,
  });
}