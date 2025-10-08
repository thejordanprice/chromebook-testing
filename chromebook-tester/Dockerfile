# Multi-stage build for Next.js (App Router) production image

# 1) Install deps only when needed
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* npm-shrinkwrap.json* ./
RUN npm ci --no-audit --no-fund

# 2) Build
FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build Next.js
RUN npm run build

# 3) Production runner (non-standalone)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs

# Copy necessary files
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Install only production deps
RUN npm ci --omit=dev --no-audit --no-fund

# Expose port
EXPOSE 3000

# Run as non-root
USER nextjs

ENV PORT=3000
# Start Next.js server
CMD ["npm", "run", "start"]
