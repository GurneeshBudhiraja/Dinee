import twilio from "twilio"

export default async function routes(fastify, options) {
  await fastify.register(async function testingRoutes(fastify) {
    fastify.post('/callback', async (request, reply) => {
      try {
        const { phoneNumber, reason, data } = request.body;
        // Validate required fields
        if (!phoneNumber) {
          return reply.code(400).send({
            error: 'Phone number is required'
          });
        }

        if (!reason) {
          return reply.code(400).send({
            error: 'Reason for callback is required'
          });
        }

        // Get Twilio credentials from environment
        const accountSid = process.env.NEXT_TWILIO_SID;
        const authToken = process.env.NEXT_TWILIO_AUTH_TOKEN;
        const twilioPhoneNumber = process.env.NEXT_PUBLIC_VIRTUAL_NUMBER;

        if (!accountSid || !authToken || !twilioPhoneNumber) {
          console.error('Missing Twilio credentials');
          return reply.code(500).send({
            error: 'Twilio configuration error'
          });
        }

        // Initialize Twilio client
        const twilioClient = twilio(accountSid, authToken);

        console.log(`📞 Initiating callback to ${phoneNumber} for reason: ${reason}`);

        // Create the callback call - THIS IS THE KEY CHANGE
        const call = await twilioClient.calls.create({
          to: phoneNumber,
          from: twilioPhoneNumber,
          // Point to the new callback-specific webhook
          url: `${request.protocol}://${request.headers.host}/callback-webhook?reason=${encodeURIComponent(reason)}&phoneNumber=${encodeURIComponent(phoneNumber)}&data=${encodeURIComponent(data)}`,
          method: 'POST',
        });

        console.log(`✅ Callback initiated. Call SID: ${call.sid}`);

        return reply.send({
          success: true,
          message: 'Callback initiated successfully',
          callSid: call.sid,
          phoneNumber,
          reason,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        console.error('Error initiating callback:', error);
        return reply.code(500).send({
          error: 'Failed to initiate callback',
          details: error.message
        });
      }
    });
  });
}