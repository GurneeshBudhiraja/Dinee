## Inspiration
AI voice agents are impacting every industry, from banking to software. To extend this initiative, I built a voice AI agent for restaurants that specializes in handling multiple calls simultaneously, adding and updating orders, calling back customers, providing updates, and all of this without human intervention.

## What it does
The main aim of the software is simple: to ease the workload of restaurant owners so they can focus on serving their customers.

### A few key features Dinee provides:
1. **Handling Calls:** The agent assists users on both inbound and outbound calls.
2. **Order Taking and General Query:** **Dinee** excels at taking orders, updating transcripts of the conversation, and answering general questions.
3. **Calling Back the Customer:** Restaurants can command the agent to call back customers to clarify or provide updates about orders.
4. **Handling Multiple Calls Simultaneously:** While staff are limited in how many calls they can take at once, **Dinee** can handle any number of calls all at the same time.

## How we built it
1. The application was built entirely in **Kiro** from frontend to backend, integrating OpenAI Live API, migrating to shadcn-style design, and even generating commit messages (thanks to Kiro hooks).
2. We used **Kiro IDE** to generate systematic plans, organize code, modularize everything, and even clean up unused files in the codebase.
3. **Technology and tools used:**
   - **Frontend:** Next.js, TailwindCSS
   - **Backend:** Fastify (Node.js), Next.js, Convex, Twilio
   - **LLM:** Gemini, OpenAI

## Challenges we ran into
- One of the biggest challenges was displaying calls, orders, and other information in real time, so restaurants are notified immediately when Dinee handles a new call or an order is placed. We solved this using Convex DB’s native realtime API, which is perfect for applications like this.
- Another big challenge was integrating the OpenAI Live API with Twilio. Our solution forwards all incoming and outgoing calls to a custom websocket server, which handles all bi-directional communication.

## Accomplishments we're proud of
- This hackathon turned me into a professional Vibe coder special thanks to **Kiro IDE**.
- Without referencing docs for Fastify, OpenAI Live API, or Twilio, I was able to integrate all three together. All thanks to **Kiro** for making this possible.

## What we learned
- First and foremost, I found a new IDE I can rely on. This will increase the speed of my future software releases.
- I also gained hands-on experience with new technologies such as Twilio and OpenAI Live API.

## What's next for Dinee - Voice AI Agent for Restaurants
- The vision for **Dinee** is to integrate with third-party vendors like Clove, making it even easier for restaurant owners to use this software built with **Kiro**.
