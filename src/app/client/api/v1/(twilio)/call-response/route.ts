import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../../../convex/_generated/api";

const VoiceResponse = twilio.twiml.VoiceResponse;

// Initialize Convex client for server-side usage
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const body = Object.fromEntries(formData.entries());

    // Extract speech recognition result from Twilio webhook
    const speechResult = body.SpeechResult as string | undefined;

    const twiml = new VoiceResponse();

    // Check if the user has spoken. This request comes from the <Gather> action.
    if (speechResult) {
      const spokenCode = speechResult.replace(/\s+/g, '');
      console.log('Processing spoken restaurant code:', spokenCode);

      try {
        // Search for the restaurant in the database
        const restaurant = await convex.query(api.restaurants.getRestaurant, {
          restaurantId: spokenCode,
        });

        if (restaurant) {
          // Restaurant found
          twiml.say({ voice: 'alice', language: 'en-US' }, `Great! Restaurant ${restaurant.name} has been found.`);
          // TODO: Add logic for next steps (e.g., call transfer)
          twiml.hangup();
        } else {
          // Restaurant not found, re-prompt the user
          twiml.say({ voice: 'alice', language: 'en-US' }, 'Sorry, the restaurant code you said is not registered in our system. Please try again.');
          // The code will fall through to the gather section below.
        }
      } catch (error) {
        console.error('Error querying restaurant:', error);
        twiml.say({ voice: 'alice', language: 'en-US' }, 'Sorry, we\'re experiencing technical difficulties. Please try again later.');
        twiml.hangup();
      }
    }

    // This section is a loop that prompts for input and re-runs on invalid input.
    const gather = twiml.gather({
      input: ['speech'], // FIX: Correctly specify input as an array
      speechTimeout: 'auto', // Automatically detect when the user has finished speaking
      action: '/api/v1/call-response',
      method: 'POST',
    });

    gather.say({
      voice: 'alice',
      language: 'en-US',
    }, 'Please say your restaurant code.');

    // If no speech input is received, this redirect will restart the call flow.
    twiml.redirect({ method: 'POST' }, '/api/v1/call-response');

    // Return TwiML response
    return new NextResponse(twiml.toString(), {
      status: 200,
      headers: {
        'Content-Type': 'text/xml',
      },
    });

  } catch (error) {
    console.error('Error processing Twilio webhook:', error);
    const twiml = new VoiceResponse();
    twiml.say({ voice: 'alice', language: 'en-US' }, 'Sorry, we\'re experiencing technical difficulties. Please try again later.');
    twiml.hangup();

    return new NextResponse(twiml.toString(), {
      status: 500,
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  }
}