# ---- Stage 1: Build the app ----
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

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
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
