# Multi-stage Dockerfile for the Vite React frontend
# - builder: installs dependencies and builds the app
# - runner: lightweight Node image with `serve` to host the built `dist` directory on port 3000

FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Use npm install to ensure devDependencies (vite) are available for the build
RUN npm install

# Copy rest of the project and build
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

# Install a tiny static server to serve the build output
RUN npm install -g serve

# Copy built assets from builder
COPY --from=builder /app/dist ./dist

# Expose the port the server will listen on
EXPOSE 3000
ENV NODE_ENV=production

# Health check: ensure root responds with 200
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:3000/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Serve the static `dist` output on 0.0.0.0:3000
CMD ["serve", "-s", "dist", "-l", "3000"]
