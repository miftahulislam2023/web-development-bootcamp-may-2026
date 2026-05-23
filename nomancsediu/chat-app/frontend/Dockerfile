FROM node:20-alpine AS deps
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci && npm cache clean --force

FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./

# Copy source files
COPY tsconfig.json next.config.ts postcss.config.mjs ./
COPY next-env.d.ts* ./
COPY app ./app
COPY components ./components
COPY context ./context
COPY public ./public

# Build arguments
ARG NEXT_PUBLIC_USER_SERVICE
ARG NEXT_PUBLIC_CHAT_SERVICE
ENV NEXT_PUBLIC_USER_SERVICE=${NEXT_PUBLIC_USER_SERVICE}
ENV NEXT_PUBLIC_CHAT_SERVICE=${NEXT_PUBLIC_CHAT_SERVICE}
ENV NODE_ENV=production

# Build application
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

# Install wget for health checks
RUN apk add --no-cache wget

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Copy built application with proper ownership
COPY package*.json ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Switch to non-root user
USER nextjs

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

CMD ["node", "server.js"]
