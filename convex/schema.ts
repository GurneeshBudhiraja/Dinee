import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  restaurants: defineTable({
    restaurantId: v.string(), // 5-digit uppercase restaurant ID
    name: v.string(),
    agentName: v.string(),
    specialInstructions: v.string(),
    languagePreference: v.union(
      v.literal("english"),
      v.literal("spanish"),
      v.literal("french")
    ),
    menuDetails: v.optional(v.array(v.object({
      name: v.string(),
      price: v.string(),
      description: v.optional(v.string()),
    }))),
    virtualNumber: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_restaurant_id", ["restaurantId"]),

  menuItems: defineTable({
    restaurantId: v.string(),
    name: v.string(),
    price: v.string(),
    description: v.optional(v.string()),
  }).index("by_restaurant_id", ["restaurantId"]),

  calls: defineTable({
    restaurantId: v.string(),
    phoneNumber: v.string(),
    duration: v.number(),
    status: v.union(v.literal("active"), v.literal("completed")),
    transcript: v.optional(v.string()),
    liveTranscript: v.optional(v.string()),
    orderId: v.optional(v.string()),
    sentiment: v.optional(v.union(
      v.literal("positive"),
      v.literal("neutral"),
      v.literal("negative")
    )),
    reason: v.optional(v.string()),
    timestamp: v.number(),
  }).index("by_restaurant_id", ["restaurantId"]),

  orders: defineTable({
    restaurantId: v.string(),
    callId: v.optional(v.string()),
    phoneNumber: v.string(),
    customerName: v.string(),
    items: v.array(v.object({
      id: v.string(),
      name: v.string(),
      quantity: v.number(),
      price: v.number(),
      specialInstructions: v.optional(v.string()),
    })),
    totalAmount: v.number(),
    specialInstructions: v.optional(v.string()),
    status: v.union(
      v.literal("active"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    timestamp: v.number(),
    cancellationReason: v.optional(v.string()),
  }).index("by_restaurant_id", ["restaurantId"]),
});
