import otpGenerator from "otp-generator"

const NEXT_APP_URL = "http://localhost:3000"

// TODO: remove the default value in production
export async function wrapperGetRestaurantDetails(restaurantId: string = "67126") {
  const response = await fetch(`${NEXT_APP_URL}/api/v1/get-restaurant-data/${restaurantId}`)
  const data = await response.json()
  return data
}


// Inserts or updates the call in the table
export async function wrapperUpsertCallData(callData: Partial<Doc<"calls">>) {
  const response = await fetch(`${NEXT_APP_URL}/api/v1/upsert-call`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(callData)
  })
  const data = await response.json()
  return data
}


// Add dialogues for the final transcript
export async function wrapperAddTranscriptDialogues(dialogueData: Doc<"transcripts">) {
  const response = await fetch(`${NEXT_APP_URL}/api/v1/add-transcript-dialogue`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dialogueData)
  })
  const data = await response.json()
  return data
}


export async function wrapperUpsertOrders(orderData: Doc<"orders">) {
  const response = await fetch(`${NEXT_APP_URL}/api/v1/upsert-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(orderData)
  })
  const data = await response.json()
  return data
}


export function generateOrderId() {
  return otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
}
