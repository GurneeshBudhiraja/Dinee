import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  restaurants: defineTable({
    name: v.string(),
    agentName: v.string(),
    specialInstructions: v.string(),
    languagePreference: v.union(
      v.literal("english"),
      v.literal("spanish"),
      v.literal("french")
    ),
  }),
  menuItems: defineTable({
    restaurantId: v.id("restaurants"),
    name: v.string(),
    price: v.number(),
    description: v.optional(v.string()),
  }),
});
