# Twilio Call Handling Setup

## Overview

The Twilio call handling system has been implemented to:

1. **Greet callers** with a welcome message
2. **Prompt for restaurant code** (5-digit numeric code)
3. **Validate the restaurant code** against the database
4. **Respond appropriately** based on whether the restaurant is found
5. **Track all calls** in the database for monitoring

## Implementation Details

### Route: `/api/v1/twilio/call-response`

This is the main webhook endpoint that Twilio will call when handling incoming calls.

#### Call Flow:

1. **Initial Call**:

   - Plays welcome message
   - Asks for 5-digit restaurant code
   - Waits for keypad input (followed by #)

2. **Code Validation**:

   - Validates that exactly 5 digits were entered
   - Searches the database for the restaurant
   - Creates a call record for tracking

3. **Restaurant Found**:

   - Confirms restaurant name and agent
   - Creates active call record
   - Currently acknowledges and hangs up (ready for order processing extension)

4. **Restaurant Not Found**:
   - Informs caller the code is invalid
   - Creates completed call record with failure reason
   - Gives option to try again or hangs up

### Test Route: `/api/v1/twilio/test-restaurant`

Use this endpoint to test restaurant code lookup without making phone calls:

```bash
# Test with a valid restaurant code
curl "http://localhost:3000/api/v1/twilio/test-restaurant?code=12345"

# Test with invalid code
curl "http://localhost:3000/api/v1/twilio/test-restaurant?code=99999"
```

## Environment Variables Required

Make sure these are set in your `.env.local`:

```env
NEXT_PUBLIC_CONVEX_URL=your_convex_url
NEXT_TWILIO_SID=your_twilio_account_sid
NEXT_TWILIO_AUTH_TOKEN=your_twilio_auth_token
NEXT_PUBLIC_VIRTUAL_NUMBER=your_twilio_phone_number
```

## Twilio Configuration

1. **Purchase a Twilio phone number** if you haven't already
2. **Configure the webhook URL** in your Twilio console:
   - Go to Phone Numbers → Manage → Active numbers
   - Select your number
   - Set the webhook URL to: `https://yourdomain.com/api/v1/twilio/call-response`
   - Set HTTP method to `POST`

## Database Schema

The system uses these Convex tables:

### Restaurants

- `restaurantId`: 5-digit numeric string
- `name`: Restaurant name
- `agentName`: AI agent name
- Other restaurant details...

### Calls

- `restaurantId`: Links to restaurant
- `phoneNumber`: Caller's number
- `status`: "active" or "completed"
- `transcript`: Call summary
- `reason`: Success/failure reason
- `timestamp`: Call time

## Testing the Implementation

### 1. Test Restaurant Lookup

```bash
# First, create a restaurant through the onboarding flow or directly in Convex
# Then test the lookup:
curl "http://localhost:3000/api/v1/twilio/test-restaurant?code=YOUR_RESTAURANT_CODE"
```

### 2. Test Twilio Webhook Locally

Use ngrok to expose your local server:

```bash
# Install ngrok if you haven't
npm install -g ngrok

# Expose your local server
ngrok http 3000

# Use the ngrok URL in your Twilio webhook configuration
# Example: https://abc123.ngrok.io/api/v1/twilio/call-response
```

### 3. Make a Test Call

1. Call your Twilio number
2. Listen for the greeting
3. Enter a 5-digit restaurant code followed by #
4. Verify the response

## Call Flow Examples

### Successful Call:

```
Caller dials → Twilio number
System: "Welcome to our AI restaurant ordering system. Please enter your 5-digit restaurant code..."
Caller: Enters "12345#"
System: "Great! Restaurant Mario's Pizza has been found. You are now connected to Tony..."
System: "Thank you for calling. Our order processing system is currently being set up..."
Call ends
```

### Failed Call:

```
Caller dials → Twilio number
System: "Welcome to our AI restaurant ordering system. Please enter your 5-digit restaurant code..."
Caller: Enters "99999#"
System: "Sorry, the restaurant code you entered is not registered..."
System: "Please enter a different 5-digit restaurant code..."
Caller: No input or invalid input
System: "I didn't receive a new restaurant code. Please contact the restaurant directly..."
Call ends
```

## Next Steps

The current implementation provides the foundation for:

1. **Order Processing**: Extend the successful restaurant verification to handle menu orders
2. **Call Recording**: Add Twilio call recording for quality assurance
3. **Real-time Updates**: Update call status and duration in real-time
4. **Multi-language Support**: Use restaurant language preference for TTS
5. **Advanced Features**: Call transfer, hold music, callback functionality

## Monitoring

All calls are automatically logged in the Convex `calls` table with:

- Call details and timestamps
- Success/failure reasons
- Transcript summaries
- Restaurant association

You can monitor these through your dashboard or directly in the Convex console.
