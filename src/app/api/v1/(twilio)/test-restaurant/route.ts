import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../../../convex/_generated/api";

// Initialize Convex client for server-side usage
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantCode = searchParams.get('code');

    if (!restaurantCode) {
      return NextResponse.json({
        error: 'Please provide a restaurant code as a query parameter: ?code=12345'
      }, { status: 400 });
    }

    // Validate that the code is exactly 5 digits
    if (!/^\d{5}$/.test(restaurantCode)) {
      return NextResponse.json({
        error: 'Restaurant code must be exactly 5 digits',
        provided: restaurantCode
      }, { status: 400 });
    }

    // Search for the restaurant in the database
    const restaurant = await convex.query(api.restaurants.getRestaurant, {
      restaurantId: restaurantCode
    });

    if (restaurant) {
      return NextResponse.json({
        found: true,
        restaurant: {
          id: restaurant.restaurantId,
          name: restaurant.name,
          agentName: restaurant.agentName,
          languagePreference: restaurant.languagePreference,
          createdAt: new Date(restaurant.createdAt).toISOString()
        },
        message: `Restaurant ${restaurant.name} found successfully!`
      });
    } else {
      return NextResponse.json({
        found: false,
        restaurantCode,
        message: 'Restaurant code not found in the system'
      });
    }

  } catch (error) {
    console.error('Error testing restaurant lookup:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}