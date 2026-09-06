# Multi-stage Dockerfile for Kuruvilla ChatBot Backend
# Optimized for Render.com deployment

# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package*.json ./
# Copy backend directory
COPY backend/ ./backend/
# Copy scripts directory  
COPY scripts/ ./scripts/

# Install all dependencies (including dev dependencies for build)
RUN npm install && npm --prefix backend install

# Build the TypeScript
RUN npm run build:render

# Runtime stage
FROM node:24-alpine

WORKDIR /app

# Copy root package files
COPY package*.json ./
# Copy built backend
COPY backend/ ./backend/
# Copy scripts
COPY scripts/ ./scripts/

# Install only production dependencies for runtime
RUN npm ci --production && npm --prefix backend ci --production

# Expose port 3000
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start the application
CMD ["npm", "run", "start:render"]
