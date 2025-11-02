# ---- Stage 1: Build the app ----
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Accept build-time arguments
ARG VITE_API_BASE_URL
ARG VITE_TICKET_EXPIRATION_SECONDS
ARG VITE_APP_ENV

# Expose them to Vite build
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_TICKET_EXPIRATION_SECONDS=${VITE_TICKET_EXPIRATION_SECONDS}
ENV VITE_APP_ENV=${VITE_APP_ENV}

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy the source code
COPY . .

# Build the Vite app for production
RUN npm run build

# ---- Stage 2: Run the app using vite preview ----
FROM node:20-alpine

WORKDIR /app

# Copy build output and dependencies needed to run preview
COPY --from=builder /app ./

# Expose Vite's default preview port
EXPOSE 5173

# Run Vite's production preview server
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173", "--open", "false"]
