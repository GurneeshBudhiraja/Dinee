

const NEXT_APP_URL = "http://localhost:3000"

// TODO: remove the default value in production
export async function wrapperGetRestaurantDetails(restaurantId: string = "67126") {
  const response = await fetch(`${NEXT_APP_URL}/api/v1/get-restaurant-data/${restaurantId}`)
  const data = await response.json()
  return data
}