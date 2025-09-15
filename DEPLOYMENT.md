# Deployment Guide for WebSocket Server

## Docker Deployment (Recommended)

### Local Testing with Docker

1. **Build the Docker image:**

   ```bash
   docker build -t kiro-ws-server .
   ```

2. **Run the container:**

   ```bash
   docker run -p 8000:8000 \
     -e NEXT_OPENAI_KEY=your_openai_key \
     -e NEXT_TWILIO_SID=your_twilio_sid \
     -e NEXT_TWILIO_AUTH_TOKEN=your_twilio_token \
     -e NEXT_VIRTUAL_NUMBER=your_virtual_number \
     -e NEXT_APP_URL=your_frontend_url \
     -e NEXT_PUBLIC_CONVEX_URL=your_convex_url \
     -e NEXT_GEMINI_API_KEY=your_gemini_key \
     kiro-ws-server
   ```

3. **Or use docker-compose:**
   ```bash
   # Create a .env file with your environment variables
   docker-compose up --build
   ```

### Render Docker Deployment

1. **Connect your GitHub repository to Render**
2. **Create a new Web Service**
3. **Configure the service:**

   - **Environment**: Docker
   - **Dockerfile Path**: `./Dockerfile` (or leave empty if Dockerfile is in root)
   - **Plan**: Starter (or higher based on your needs)

4. **Add Environment Variables** (see list below)
5. **Deploy**

## Render Deployment (Alternative)

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
