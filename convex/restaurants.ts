import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createRestaurant = mutation({
  args: {
    name: v.string(),
    agentName: v.string(),
    menuDetails: v.array(
      v.object({
        name: v.string(),
        price: v.string(),
        description: v.optional(v.string()),
      })
    ),
    specialInstructions: v.string(),
    languagePreference: v.union(
      v.literal("english"),
      v.literal("spanish"),
      v.literal("french")
    ),
  },
  handler: async (ctx, args) => {
    const restaurantId = await ctx.db.insert("restaurants", {
      name: args.name,
      agentName: args.agentName,
      specialInstructions: args.specialInstructions,
      languagePreference: args.languagePreference,
    });

    for (const item of args.menuDetails) {
      await ctx.db.insert("menuItems", {
        restaurantId,
        name: item.name,
        price: parseFloat(item.price),
        description: item.description,
      });
    }

    return restaurantId;
  },
});

export const deleteAllData = mutation({
  handler: async (ctx) => {
    try {
      const allRestaurants = await ctx.db.query("restaurants").collect();
      for (const restaurant of allRestaurants) {
        await ctx.db.delete(restaurant._id);
      }

      const allMenuItems = await ctx.db.query("menuItems").collect();
      for (const item of allMenuItems) {
        await ctx.db.delete(item._id);
      }
      return true
    } catch (error) {
      console.log("Error in `deleteAllData`", (error as Error).message)
      return false
    }
  },
});


