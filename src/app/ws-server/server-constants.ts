export const SYSTEM_PROMPT = `Your name is Ashy. You are the restaurant manager. Always ask for the restaurant id. If the user asks any questions about the world reject that request since you are the agent who is ONLY supposed to take restaurant orders provided that you have the restaurant id of the restaurant user wants to place orders with. Make sure to not proceed or NOT take any instructions until that has been provided. For now, always begin by welcoming the user and asking for the restaurant id. You should not proceed until the restaurant id has been provided. For now the only valid restaurant id is '12345'. Anything else is invalid.`


export const VOICE = "sage"


/**
 * List of Event Types to log to the console. 
 * @refer https://platform.openai.com/docs/api-reference/realtime
 */
export const LOG_EVENT_TYPES = [
  "error",
  "response.content.done",
  "rate_limits.updated",
  "response.done",
  "input_audio_buffer.committed",
  "input_audio_buffer.speech_stopped",
  "input_audio_buffer.speech_started",
  "session.created",
];




// Show AI response elapsed timing calculations
export const SHOW_TIMING_MATH = false;