import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new order
export const createOrder = mutation({
  args: {
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
    cancellationReason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const orderId = await ctx.db.insert("orders", {
      restaurantId: args.restaurantId,
      callId: args.callId,
      phoneNumber: args.phoneNumber,
      customerName: args.customerName,
      items: args.items,
      totalAmount: args.totalAmount,
      specialInstructions: args.specialInstructions,
      status: args.status,
      timestamp: Date.now(),
      cancellationReason: args.cancellationReason,
    });

    return orderId;
  },
});

// Get all orders for a restaurant
export const getOrdersByRestaurant = query({
  args: { restaurantId: v.string() },
  handler: async (ctx, args) => {
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_restaurant_id", (q) => q.eq("restaurantId", args.restaurantId))
      .order("desc")
      .collect();

    return orders;
  },
});

// Get active orders for a restaurant
export const getActiveOrdersByRestaurant = query({
  args: { restaurantId: v.string() },
  handler: async (ctx, args) => {
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_restaurant_id", (q) => q.eq("restaurantId", args.restaurantId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .order("desc")
      .collect();

    return orders;
  },
});

// Get past orders (completed or cancelled) for a restaurant
export const getPastOrdersByRestaurant = query({
  args: { restaurantId: v.string() },
  handler: async (ctx, args) => {
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_restaurant_id", (q) => q.eq("restaurantId", args.restaurantId))
      .filter((q) => q.or(
        q.eq(q.field("status"), "completed"),
        q.eq(q.field("status"), "cancelled")
      ))
      .order("desc")
      .collect();

    return orders;
  },
});

// Update an order
export const updateOrder = mutation({
  args: {
    orderId: v.id("orders"),
    callId: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    customerName: v.optional(v.string()),
    items: v.optional(v.array(v.object({
      id: v.string(),
      name: v.string(),
      quantity: v.number(),
      price: v.number(),
      specialInstructions: v.optional(v.string()),
    }))),
    totalAmount: v.optional(v.number()),
    specialInstructions: v.optional(v.string()),
    status: v.optional(v.union(
      v.literal("active"),
      v.literal("completed"),
      v.literal("cancelled")
    )),
    cancellationReason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { orderId, ...updates } = args;

    // Only update fields that are provided
    const fieldsToUpdate: any = {};
    if (updates.callId !== undefined) fieldsToUpdate.callId = updates.callId;
    if (updates.phoneNumber !== undefined) fieldsToUpdate.phoneNumber = updates.phoneNumber;
    if (updates.customerName !== undefined) fieldsToUpdate.customerName = updates.customerName;
    if (updates.items !== undefined) fieldsToUpdate.items = updates.items;
    if (updates.totalAmount !== undefined) fieldsToUpdate.totalAmount = updates.totalAmount;
    if (updates.specialInstructions !== undefined) fieldsToUpdate.specialInstructions = updates.specialInstructions;
    if (updates.status !== undefined) fieldsToUpdate.status = updates.status;
    if (updates.cancellationReason !== undefined) fieldsToUpdate.cancellationReason = updates.cancellationReason;

    await ctx.db.patch(orderId, fieldsToUpdate);
    return orderId;
  },
});

// Delete an order
export const deleteOrder = mutation({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.orderId);
    return args.orderId;
  },
});

// Complete an order
export const completeOrder = mutation({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, {
      status: "completed",
    });
    return args.orderId;
  },
});

// Cancel an order
export const cancelOrder = mutation({
  args: {
    orderId: v.id("orders"),
    cancellationReason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, {
      status: "cancelled",
      cancellationReason: args.cancellationReason,
    });
    return args.orderId;
  },
});