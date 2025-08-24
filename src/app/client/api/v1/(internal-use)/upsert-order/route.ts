import { NextRequest } from "next/server";
import { Doc } from "convex/_generated/dataModel";
import { api } from "../../../../../../../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

export async function POST(request: NextRequest) {
  const body = await request.json()
  const {
    callId,
    customerName,
    items,
    orderId,
    restaurantId,
    status,
    totalAmount,
  } = body as Doc<"orders">

  if (!callId || !customerName || !items || !orderId || !restaurantId || !status || !totalAmount) {
    return new Response(JSON.stringify({ success: false, message: "Missing required fields" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  if (status !== "completed" && status !== "active" && status !== "cancelled") {
    return new Response(JSON.stringify({ success: false, message: "Invalid status. Status could only be `completed`, `active`, or `cancelled`" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  const convexClient = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL)
  const convexResponse = await convexClient.mutation(api.internal.upsertOrders, {
    data: body
  })
  return new Response(JSON.stringify(convexResponse), {
    headers: {
      "Content-Type": "application/json",
    },
    status: 200,
  });
}