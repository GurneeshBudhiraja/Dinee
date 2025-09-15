# Use Node.js 18 LTS as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the server
RUN npm run server:build:prod

# Remove dev dependencies to reduce image size
RUN npm prune --production

# Expose port
EXPOSE 8000

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_BACKEND_PORT=8000

# Start the server
CMD ["npm", "run", "server:start:prod"]
