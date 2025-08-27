import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Restaurant
  restaurants: defineTable({
    restaurantId: v.string(), // 5-digit numeric restaurant ID
    name: v.string(),
    agentName: v.string(),
    specialInstructions: v.string(),
    languagePreference: v.union(
      v.literal("english"),
      v.literal("spanish"),
      v.literal("french")
    ),
    createdAt: v.number(),
  }).index("by_restaurant_id", ["restaurantId"]),

  // Menu items
  menuItems: defineTable({
    restaurantId: v.string(),
    name: v.string(),
    price: v.string(),
    description: v.optional(v.string()),
  }).index("by_restaurant_id", ["restaurantId"]),

  // Calls
  calls: defineTable({
    callId: v.string(), // callSid from Twilio
    orderId: v.optional(v.string()), // order id
    restaurantId: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    callStartTime: v.optional(v.number()),
    status: v.optional(v.union(v.literal("active"), v.literal("completed"))),
  })
    .index("by_restaurant_id", ["restaurantId"])
    .index("by_call_and_order_id", ["callId", "orderId"]),

  // Orders
  orders: defineTable({
    // This order id is given to the cx and used to track the order 
    orderId: v.string(),
    restaurantId: v.string(),
    callId: v.string(), // callSid from Twilio
    customerName: v.string(),
    items: v.array(v.object({
      name: v.string(),
      quantity: v.number(),
      price: v.number(),
    })),
    specialInstructions: v.optional(v.string()),
    totalAmount: v.optional(v.number()),
    status: v.union(
      v.literal("active"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    orderPlacementTime: v.optional(v.number()),
    cancellationReason: v.optional(v.string()),
  })
    .index("by_restaurant_id", ["restaurantId"])
    .index("by_order_and_restaurant_id", ["orderId", "restaurantId"])
  ,

  // Transcripts
  transcripts: defineTable({
    callId: v.string(),
    dialogue: v.string(),
    speaker: v.union(v.literal("human"), v.literal("ai"))
  })
    .index("by_call_id", ["callId"]),
});
