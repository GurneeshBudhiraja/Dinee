import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createCall = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const callId = await ctx.db.insert("calls", {
      restaurantId: args.restaurantId,
      phoneNumber: args.phoneNumber,
      duration: args.duration,
      status: args.status,
      transcript: args.transcript,
      liveTranscript: args.liveTranscript,
      orderId: args.orderId,
      sentiment: args.sentiment,
      reason: args.reason,
      timestamp: Date.now(),
    });

    return callId;
  },
});

export const getCallsByRestaurant = query({
  args: { restaurantId: v.string() },
  handler: async (ctx, args) => {
    const calls = await ctx.db
      .query("calls")
      .withIndex("by_restaurant_id", (q) => q.eq("restaurantId", args.restaurantId))
      .order("desc")
      .collect();

    return calls;
  },
});

export const getActiveCallsByRestaurant = query({
  args: { restaurantId: v.string() },
  handler: async (ctx, args) => {
    const calls = await ctx.db
      .query("calls")
      .withIndex("by_restaurant_id", (q) => q.eq("restaurantId", args.restaurantId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .order("desc")
      .collect();

    return calls;
  },
});

export const getPastCallsByRestaurant = query({
  args: { restaurantId: v.string() },
  handler: async (ctx, args) => {
    const calls = await ctx.db
      .query("calls")
      .withIndex("by_restaurant_id", (q) => q.eq("restaurantId", args.restaurantId))
      .filter((q) => q.eq(q.field("status"), "completed"))
      .order("desc")
      .collect();

    return calls;
  },
});

export const updateCall = mutation({
  args: {
    callId: v.id("calls"),
    duration: v.optional(v.number()),
    status: v.optional(v.union(v.literal("active"), v.literal("completed"))),
    transcript: v.optional(v.string()),
    liveTranscript: v.optional(v.string()),
    orderId: v.optional(v.string()),
    sentiment: v.optional(v.union(
      v.literal("positive"),
      v.literal("neutral"),
      v.literal("negative")
    )),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { callId, ...updates } = args;

    await ctx.db.patch(callId, updates);
    return callId;
  },
});