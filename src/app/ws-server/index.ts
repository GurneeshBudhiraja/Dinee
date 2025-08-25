import Fastify from "fastify";
import WebSocket from "ws";
import dotenv from "dotenv";
import fastifyFormBody from "@fastify/formbody";
import fastifyWs from "@fastify/websocket";
import {
  LOG_EVENT_TYPES,
  SHOW_TIMING_MATH,
  SYSTEM_PROMPT,
  VOICE,
} from "./server-constants.ts";
import {
  wrapperGetRestaurantDetails,
  wrapperUpsertCallData,
  wrapperAddTranscriptDialogues,
  wrapperUpsertOrders,
  generateOrderId,
} from "./tools.ts";

dotenv.config({ path: ".env.local" });
const PORT = (process.env.NEXT_BACKEND_PORT || 8000) as number | undefined;
const { NEXT_OPENAI_KEY } = process.env;
if (!NEXT_OPENAI_KEY) {
  console.error("Missing OpenAI API key.");
  process.exit(1);
}

const fastify = Fastify({ logger: true });
fastify.register(fastifyFormBody);
fastify.register(fastifyWs);

/* test route */
fastify.all("/testing", async (_req, reply) => {
  const res = await wrapperGetRestaurantDetails();
  reply.send(res);
});

/* Twilio entry-point */
fastify.all("/incoming-call", async (request: any, reply) => {
  const callSid = request.body.CallSid || request.query?.CallSid;
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
  <Response>
    <Pause length="1"/>
    <Connect>
      <Stream url="wss://${request.headers.host}/media-stream?callSid=${callSid}" />
    </Connect>
  </Response>`;
  reply.type("text/xml").send(twiml);
});

/* websocket */
fastify.register(async (fastify) => {
  fastify.get("/media-stream", { websocket: true }, (connection, req) => {
    console.log("🔗 WebSocket connected");

    // Extract callSid from query parameters
    const urlParams = new URLSearchParams(req.url?.split('?')[1]);
    const callSid = urlParams.get('callSid') ?? generateOrderId(); // fallback
    console.log("CallSid from URL:", callSid);

    // Connection-specific state
    let streamSid: string | null = null;
    let latestMediaTimestamp = 0;
    let lastAssistantItem: string | null = null;
    let markQueue: string[] = [];
    let responseStartTimestampTwilio: number | null = null;

    // OpenAI socket
    const oaWs = new WebSocket(
      "wss://api.openai.com/v1/realtime?model=gpt-4o-mini-realtime-preview-2024-12-17",
      {
        headers: {
          Authorization: `Bearer ${NEXT_OPENAI_KEY}`,
          "OpenAI-Beta": "realtime=v1",
        },
      },
    );

    const initializeSession = () => {
      oaWs.send(
        JSON.stringify({
          type: "session.update",
          session: {
            turn_detection: { type: "server_vad" },
            input_audio_format: "g711_ulaw",
            output_audio_format: "g711_ulaw",
            voice: VOICE,
            instructions: SYSTEM_PROMPT,
            modalities: ["text", "audio"],
            temperature: 0.8,
            tools: [
              // Get restaurant details tool
              {
                type: "function",
                name: "get_restaurant_details",
                description:
                  "Fetch restaurant profile and menu for a given restaurant ID",
                parameters: {
                  type: "object",
                  properties: {
                    restaurant_id: { type: "string" },
                  },
                  required: ["restaurant_id"],
                },
              },
              // Upsert call data tool
              {
                type: "function",
                name: "upsert_call_data",
                description: "Insert or update a call row in the Convex `calls` table",
                parameters: {
                  type: "object",
                  properties: {
                    callId: { type: "string", description: "Twilio CallSid" },
                    restaurantId: { type: "string", description: "5-digit restaurant ID" },
                    phoneNumber: { type: "string", description: "Customer's phone number" },
                    status: { type: "string", enum: ["active", "completed"] },
                    sentiment: { type: "string", enum: ["positive", "neutral", "negative"] },
                    orderId: { type: "string", description: "Optional orderId linked to this call." }
                  },
                  required: ["callId", "restaurantId", "phoneNumber", "status"]
                }
              },
              // Add transcription dialogue tool
              {
                type: "function",
                name: "add_transcript_dialogue",
                description: "Append a transcript line (human or AI) to the Convex `transcripts` table",
                parameters: {
                  type: "object",
                  properties: {
                    callId: { type: "string", description: "Twilio CallSid for this call" },
                    dialogue: { type: "string", description: "The spoken words to store" },
                    speaker: { type: "string", enum: ["human", "ai"] }
                  },
                  required: ["callId", "dialogue", "speaker"]
                }
              },
              // Upsert the order tool
              {
                type: "function",
                name: "upsert_order",
                description: "Insert or update a food order in the Convex `orders` table",
                parameters: {
                  type: "object",
                  properties: {
                    orderId: { type: "string", description: "4-digit ID you gave to the caller" },
                    restaurantId: { type: "string", description: "Restaurant ID" },
                    callId: { type: "string", description: "Twilio CallSid" },
                    customerName: { type: "string", description: "Customer's name" },
                    items: {
                      type: "array",
                      description: "One row per menu item",
                      items: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          quantity: { type: "integer" },
                          price: { type: "number" }
                        },
                        required: ["name", "quantity", "price"]
                      }
                    },
                    specialInstructions: { type: "string" },
                    totalAmount: { type: "number", description: "Sum of (price × quantity)" },
                    status: { type: "string", enum: ["active", "completed", "cancelled"] },
                    cancellationReason: { type: "string" }
                  },
                  required: ["orderId", "restaurantId", "callId", "customerName", "items", "totalAmount", "status"]
                }
              },
              {
                type: "function",
                name: "generate_order_id",
                description: "Generate a 4-digit numeric order ID",
                parameters: { type: "object", properties: {}, required: [] }
              },
            ],
          },
        }),
      );
    };

    const greet = () => {
      oaWs.send(
        JSON.stringify({
          type: "conversation.item.create",
          item: {
            type: "message",
            role: "user",
            content: [
              {
                type: "input_text",
                text: "Greet the caller and ask for their restaurant ID.",
              },
            ],
          },
        }),
      );
      oaWs.send(JSON.stringify({ type: "response.create" }));
    };

    // Helper function to handle interruptions
    const handleSpeechStartedEvent = () => {
      console.log("Speech started - handling interruption");
      if (markQueue.length > 0 && responseStartTimestampTwilio != null) {
        const elapsedTime = latestMediaTimestamp - responseStartTimestampTwilio;
        if (SHOW_TIMING_MATH)
          console.log(
            `Calculating elapsed time for truncation: ${latestMediaTimestamp} - ${responseStartTimestampTwilio} = ${elapsedTime}ms`
          );

        if (lastAssistantItem) {
          const truncateEvent = {
            type: "conversation.item.truncate",
            item_id: lastAssistantItem,
            content_index: 0,
            audio_end_ms: elapsedTime,
          };
          if (SHOW_TIMING_MATH)
            console.log(
              "Sending truncation event:",
              JSON.stringify(truncateEvent)
            );
          oaWs.send(JSON.stringify(truncateEvent));
        }

        connection.send(
          JSON.stringify({
            event: "clear",
            streamSid: streamSid,
          })
        );

        // Reset the local states
        markQueue = [];
        lastAssistantItem = null;
        responseStartTimestampTwilio = null;
      }
    };

    // Helper function
    const sendMark = () =>
      streamSid &&
      connection.send(
        JSON.stringify({
          event: "mark",
          streamSid,
          mark: { name: "responsePart" },
        }),
      );

    // Listen for messages from Twilio WebSocket
    connection.on("message", (data: string | Buffer) => {
      try {
        const message = JSON.parse(data.toString());

        switch (message.event) {
          case 'media':
            latestMediaTimestamp = message.media.timestamp;
            if (SHOW_TIMING_MATH) console.log(`Received media message with timestamp: ${latestMediaTimestamp}ms`);

            if (oaWs.readyState === WebSocket.OPEN) {
              const audioAppend = {
                type: 'input_audio_buffer.append',
                audio: message.media.payload
              };
              oaWs.send(JSON.stringify(audioAppend));
            }
            break;

          case 'start':
            streamSid = message.start.streamSid;
            console.log('Incoming stream has started', streamSid);
            // Reset start and media timestamp on a new stream
            responseStartTimestampTwilio = null;
            latestMediaTimestamp = 0;
            break;

          case 'mark':
            if (markQueue.length > 0) {
              markQueue.shift();
            }
            break;

          case 'stop':
            console.log('Stream stopped');
            if (oaWs.readyState === WebSocket.OPEN) {
              oaWs.close();
            }
            break;

          default:
            console.log('Received non-media event:', message.event);
            break;
        }
      } catch (error) {
        console.error("Error processing Twilio message:", error);
      }
    });

    // OpenAI events
    oaWs.on("message", async (raw) => {
      const res = JSON.parse(raw.toString());

      if (LOG_EVENT_TYPES.includes(res.type)) console.log(res);

      // Function call from the model
      if (res.type === "response.function_call_arguments.done") {
        const args = JSON.parse(res.arguments);
        let output: any = { success: false };

        try {
          console.log("Calling Tool")
          switch (res.name) {
            case "get_restaurant_details":
              console.log("👨‍🍳 Getting restaurant details")
              output = await wrapperGetRestaurantDetails(args.restaurant_id);
              break;
            case "upsert_call_data":
              console.log("📲 Upserting call data")
              output = await wrapperUpsertCallData({
                ...args,
                callId: callSid,
              });
              break;
            case "add_transcript_dialogue":
              console.log("🗣️ Adding transcript dialogue")
              output = await wrapperAddTranscriptDialogues({
                ...args,
                callId: callSid // From Twilio
              });
              break;
            case "upsert_order":
              console.log("📝 Upserting order")
              output = await wrapperUpsertOrders({
                ...args,
                callId: callSid // Call id from Twilio
              });
              break;
            case "generate_order_id":
              output = { order_id: generateOrderId() };
              break;
          }
        } catch (e) {
          output = { success: false, error: String(e) };
        }

        oaWs.send(
          JSON.stringify({
            type: "conversation.item.create",
            item: {
              type: "function_call_output",
              call_id: res.call_id,
              output: JSON.stringify(output),
            },
          }),
        );
        oaWs.send(JSON.stringify({ type: "response.create" }));
        return;
      }

      // Audio back to Twilio
      if (res.type === "response.audio.delta" && res.delta) {
        connection.send(
          JSON.stringify({
            event: "media",
            streamSid,
            media: { payload: res.delta },
          }),
        );

        // First delta from a new response starts the elapsed time counter
        if (!responseStartTimestampTwilio) {
          responseStartTimestampTwilio = latestMediaTimestamp;
          if (SHOW_TIMING_MATH) console.log(`Setting start timestamp for new response: ${responseStartTimestampTwilio}ms`);
        }

        if (res.item_id) {
          lastAssistantItem = res.item_id;
        }

        sendMark();
        markQueue.push("responsePart");
      }

      // Handle speech interruption
      if (res.type === "input_audio_buffer.speech_started") {
        handleSpeechStartedEvent();
      }

      // Log completed text responses for debugging
      if (res.type === "response.content.done") {
        if (res.content && Array.isArray(res.content)) {
          const textContent = res.content.find((item: any) => item.type === 'text');
          if (textContent) {
            console.log("💬 AI Response Text:", textContent.text);
          }
        }
      }
    });

    // OpenAI socket lifecycle
    oaWs.on("open", () => {
      console.log("Connected to the OpenAI Realtime API");
      initializeSession();
      setTimeout(greet, 200);
    });
    oaWs.on("close", (code, reason) => {
      console.log("🤖 OpenAI socket closed:", code, reason.toString());
    });
    oaWs.on("error", err => {
      console.error("😵 OpenAI socket error:", err);
    });

    // Twilio socket lifecycle
    connection.on("close", () => {
      console.log("📵 Twilio socket closed");
      // Shuts down the openAI socket
      if (oaWs.readyState === WebSocket.OPEN) oaWs.close();
    });

    connection.on("error", err => {
      console.error("😵 Twilio socket error:", err);
    });
  });
});

fastify.listen({ port: PORT }, (err, url) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running at ${url}`);
});