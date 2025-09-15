# Deployment Guide for WebSocket Server

## Render Deployment

### Build Commands

- **Build Command**: `npm run server:deploy`
- **Start Command**: `npm run server:start:prod`

### Environment Variables Required

Add these environment variables in your Render dashboard:

#### Required Variables:

1. **NEXT_OPENAI_KEY** - Your OpenAI API key for the realtime API
2. **NEXT_TWILIO_SID** - Your Twilio Account SID
3. **NEXT_TWILIO_AUTH_TOKEN** - Your Twilio Auth Token
4. **NEXT_VIRTUAL_NUMBER** - Your Twilio virtual phone number (e.g., +1234567890)
5. **NEXT_APP_URL** - The URL of your Next.js frontend (e.g., https://your-app.onrender.com)
6. **NEXT_PUBLIC_CONVEX_URL** - Your Convex deployment URL
7. **NEXT_GEMINI_API_KEY** - Your Google Gemini API key (if using Gemini features)

#### Optional Variables:

- **NEXT_BACKEND_PORT** - Port for the server (defaults to 8000)
- **NODE_ENV** - Set to "production" for production deployments

### Manual Deployment Steps

1. **Connect your GitHub repository to Render**
2. **Create a new Web Service**
3. **Configure the service:**

   - **Build Command**: `npm run server:deploy`
   - **Start Command**: `npm run server:start:prod`
   - **Environment**: Node
   - **Plan**: Starter (or higher based on your needs)

4. **Add Environment Variables** (see list above)
5. **Deploy**

### Local Testing

To test the production build locally:

```bash
# Build the server
npm run server:build:prod

# Start the production server
npm run server:start:prod
```

### Important Notes

- The server will be available at `https://your-service-name.onrender.com`
- Make sure to update your Twilio webhook URLs to point to your Render deployment
- The server handles both incoming calls (`/incoming-call`) and callback requests (`/callback`)
- WebSocket connections are supported for real-time communication with Twilio

### Troubleshooting

- If the build fails, check that all dependencies are properly installed
- Ensure all environment variables are set correctly
- Check Render logs for any runtime errors
- Verify that your Twilio credentials are correct and the virtual number is active
