
import { api } from "../../../../../../../../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";


export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  console.log(id)
  const convexClient = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL)
  const convexResponse = await convexClient.query(api.internal.getRestaurantAndMenuDetailsUsingId, { restaurantId: id })
  return new Response(JSON.stringify(convexResponse), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });


}