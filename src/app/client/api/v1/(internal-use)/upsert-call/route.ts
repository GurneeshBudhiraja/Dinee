import { Doc } from "convex/_generated/dataModel";
import { api } from "../../../../../../../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json()
  const {
    callId,
    phoneNumber,
    restaurantId,
    status,
  } = body as Doc<"calls">

  // Validate the request body
  if (!callId?.trim() || !phoneNumber?.trim() || !restaurantId?.trim() || !status?.trim()) {
    return new Response(JSON.stringify({
      success: false,
      error: "`callId`, `phoneNumber`, `restaurantId`, `status` are required fields."
    }), {
      status: 400,
      headers: {
        "Content-Type": "application/json"
      }
    })
  }

  // Validate the status value
  if (status !== "completed" && status !== "active") {
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
  return new Response(JSON.stringify(convexResponse), {
    headers: {
      "Content-Type": "application/json",
    },
    status: 200,
  });
}