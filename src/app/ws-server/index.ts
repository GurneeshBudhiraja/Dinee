import Fastify from "fastify";
import WebSocket from "ws";
import dotenv from "dotenv";
import fastifyFormBody from "@fastify/formbody";
import fastifyWs from "@fastify/websocket";
import { LOG_EVENT_TYPES, SHOW_TIMING_MATH, SYSTEM_PROMPT, VOICE } from "./server-constants.ts";
import { wrapperGetRestaurantDetails } from "./tools.ts";

dotenv.config({ path: ".env.local" });
// Server port
const PORT = (process.env.NEXT_BACKEND_PORT || 8000) as number | undefined;
// OpenAI key
const { NEXT_OPENAI_KEY } = process.env;

if (!NEXT_OPENAI_KEY) {
  console.error("Missing OpenAI API key. Please set it in the .env file.");
  process.exit(1);
}

const fastify = Fastify({
  logger: true,
});

fastify.register(fastifyFormBody);
fastify.register(fastifyWs);

fastify.all("/testing", async (request, reply) => {
  const response = await wrapperGetRestaurantDetails()
  reply.send(response);
});

// Handles all the incoming calls from Twilio
fastify.all("/incoming-call", async (request: any, reply) => {
  // Get the CallSid from Twilio's request
  const callSid = request.body.CallSid || request.query?.CallSid;

  const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
                        <Response>
                            <Pause length="1"/>
                            <Connect>
                                <Stream url="wss://${request.headers.host}/media-stream?callSid=${callSid}" />
                            </Connect>
                        </Response>`;

  reply.type("text/xml").send(twimlResponse);
});

fastify.register(async (fastify) => {
  fastify.get("/media-stream", { websocket: true }, (connection, req) => {
    console.log("Client connected");

    // Extract callSid from query parameters
    const urlParams = new URLSearchParams(req.url?.split('?')[1]);
    let callSid = urlParams.get('callSid');

    console.log("CallSid from URL:", callSid);

    // Connection-specific state
    let streamSid: string | null = null;
    let latestMediaTimestamp = 0;
    let lastAssistantItem = null;
    let markQueue: string[] = [];
    let responseStartTimestampTwilio: number | null = null;

    // Use the stable model version that works
    const openAiWs = new WebSocket('wss://api.openai.com/v1/realtime?model=gpt-4o-mini-realtime-preview-2024-12-17', {
      headers: {
        Authorization: `Bearer ${NEXT_OPENAI_KEY}`,
        "OpenAI-Beta": "realtime=v1"
      }
    });

    const initializeSession = () => {
      const sessionUpdate = {
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
            {
              type: "function",
              name: "get_restaurant_details",
              description: "Get restaurant details and menu items for a given restaurant ID",
              parameters: {
                type: "object",
                properties: {
                  restaurant_id: {
                    type: "string",
                    description: "The restaurant ID to fetch details for"
                  }
                },
                required: ["restaurant_id"]
              }
            }
          ],
          tool_choice: "auto"
        },
      };

      console.log("Sending session update:", JSON.stringify(sessionUpdate));
      openAiWs.send(JSON.stringify(sessionUpdate));
    };

    // Utility to let the AI speak first
    const sendInitialConversationItem = () => {
      const initialConversationItem = {
        type: 'conversation.item.create',
        item: {
          type: 'message',
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: 'Greet the user and ask for their restaurant ID to begin taking their order.'
            }
          ]
        }
      };

      console.log('Sending initial conversation item:', JSON.stringify(initialConversationItem));
      openAiWs.send(JSON.stringify(initialConversationItem));
      openAiWs.send(JSON.stringify({ type: 'response.create' }));
    };

    // Utility to Handle interruptions
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
          openAiWs.send(JSON.stringify(truncateEvent));
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

    // Send mark messages to Media Streams so we know if and when AI response playback is finished
    const sendMark = (connection: any, streamSid: string | null) => {
      if (streamSid) {
        const markEvent = {
          event: "mark",
          streamSid: streamSid,
          mark: { name: "responsePart" },
        };
        connection.send(JSON.stringify(markEvent));
        markQueue.push("responsePart");
      }
    };

    // Listen for messages from Twilio WebSocket
    connection.on("message", async (data: string | Buffer) => {
      try {
        const message = JSON.parse(data.toString());

        switch (message.event) {
          case 'media':
            latestMediaTimestamp = message.media.timestamp;
            if (SHOW_TIMING_MATH) console.log(`Received media message with timestamp: ${latestMediaTimestamp}ms`);

            if (openAiWs.readyState === WebSocket.OPEN) {
              const audioAppend = {
                type: 'input_audio_buffer.append',
                audio: message.media.payload
              };
              openAiWs.send(JSON.stringify(audioAppend));
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
            if (openAiWs.readyState === WebSocket.OPEN) {
              openAiWs.close();
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

    // Listen for messages from the OpenAI WebSocket
    openAiWs.on("message", async (data) => {
      try {
        const response = JSON.parse(data.toString());

        if (LOG_EVENT_TYPES.includes(response.type)) {
          console.log(`Received event: ${response.type}`, response);
        }

        // Handle function calls from OpenAI
        if (response.type === "response.function_call_arguments.done") {
          console.log("Function call detected:", response);

          if (response.name === "get_restaurant_details") {
            const args = JSON.parse(response.arguments);
            console.log("Calling restaurant function with args:", args);

            try {
              const restaurantData = await wrapperGetRestaurantDetails(args.restaurant_id);

              // Send function result back to OpenAI
              const functionResult = {
                type: "conversation.item.create",
                item: {
                  type: "function_call_output",
                  call_id: response.call_id,
                  output: JSON.stringify(restaurantData)
                }
              };

              console.log("Sending function result:", functionResult);
              openAiWs.send(JSON.stringify(functionResult));

              // Continue the response
              openAiWs.send(JSON.stringify({ type: 'response.create' }));

            } catch (error) {
              console.error("Error calling restaurant function:", error);

              // Send error result
              const errorResult = {
                type: "conversation.item.create",
                item: {
                  type: "function_call_output",
                  call_id: response.call_id,
                  output: JSON.stringify({ success: false, error: "Failed to fetch restaurant details" })
                }
              };

              openAiWs.send(JSON.stringify(errorResult));
              openAiWs.send(JSON.stringify({ type: 'response.create' }));
            }
          }
        }

        if (response.type === "response.audio.delta" && response.delta) {
          const audioDelta = {
            event: "media",
            streamSid: streamSid,
            media: { payload: response.delta },
          };
          connection.send(JSON.stringify(audioDelta));

          // First delta from a new response starts the elapsed time counter
          if (!responseStartTimestampTwilio) {
            responseStartTimestampTwilio = latestMediaTimestamp;
            if (SHOW_TIMING_MATH) console.log(`Setting start timestamp for new response: ${responseStartTimestampTwilio}ms`);
          }

          if (response.item_id) {
            lastAssistantItem = response.item_id;
          }

          sendMark(connection, streamSid);
        }

        if (response.type === "input_audio_buffer.speech_started") {
          handleSpeechStartedEvent();
        }

        // Log completed text responses for debugging
        if (response.type === "response.content.done") {
          if (response.content && Array.isArray(response.content)) {
            const textContent = response.content.find((item: any) => item.type === 'text');
            if (textContent) {
              console.log("💬 AI Response Text:", textContent.text);
            }
          }
        }
      } catch (error) {
        console.error(
          "Error processing OpenAI message:",
          error,
          "Raw message:",
          data
        );
      }
    });

    // Open event for OpenAI WebSocket
    openAiWs.on("open", () => {
      console.log("Connected to the OpenAI Realtime API");
      setTimeout(initializeSession, 100);
      // Let the AI speak first
      setTimeout(sendInitialConversationItem, 250);
    });

    // On connection close
    connection.on("close", () => {
      console.log("📵 Client disconnected.");
      if (openAiWs.readyState === WebSocket.OPEN) openAiWs.close();
    });

    // WebSocket close
    openAiWs.on("close", () => {
      console.log("💔 Disconnected from the OpenAI Realtime API");
    });

    // WebSocket errors
    openAiWs.on("error", (error) => {
      console.error("😵 Error in the OpenAI WebSocket:", error);
    });
  });
});

fastify.listen({ port: PORT }, (err, url) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is running on ${url}`);
});