/**
 * Utilites are used by the AI to perform tasks.
 * */

import { v } from "convex/values";
import { query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";


export const getRestaurantAndMenuDetailsUsingId = query({
  args: { restaurantId: v.string() },
  handler: async (ctx, args) => {
    try {
      // TODO: remove in prod
      console.log("🏃 Getting restaurant details")
      const restaurantDetails = await ctx.db
        .query("restaurants")
        .withIndex("by_restaurant_id", (q) => q.eq("restaurantId", args.restaurantId))
        .collect();

      // When no details are present in the Convex DB
      if (!restaurantDetails.length) {
        return {
          success: true,
          data: {
            restaurantDetails: null,
            menuDetails: null,
          }
        }
      }

      // Gets the menu details using the restaurant id
      const menuDetails = await ctx.db
        .query("menuItems")
        .withIndex("by_restaurant_id", (q) => q.eq("restaurantId", args.restaurantId))
        .collect();

      // The restaurant details do not exist if the menu details are absent
      if (!menuDetails.length) {
        return {
          success: true,
          data: {
            restaurantDetails: null,
            menuDetails: null,
          }
        }
      }

      // transform restaurant and menu details
      // extra restaurant keys
      const EXTRA_RESTAURANT_KEYS: (keyof (Doc<"restaurants">))[] = ["_id", "_creationTime", "createdAt", "restaurantId"]
      // extra menu keys
      const EXTRA_MENU_KEYS: (keyof (Doc<"menuItems">))[] = ["_id", "_creationTime", "restaurantId"]

      EXTRA_RESTAURANT_KEYS.forEach((key) => {
        delete restaurantDetails[0][key]
      })
      menuDetails.forEach((menu) => {
        EXTRA_MENU_KEYS.forEach((key) => {
          delete menu[key]
        })
      })

      return {
        success: true,
        data: {
          restaurantDetails: restaurantDetails[0],
          menuDetails
        }
      }
    } catch (error) {
      console.log("😵 Error in `getRestaurantAndMenuDetailsUsingId`", error)
      return {
        success: false,
        data: {}
      }
    }
  },
})



