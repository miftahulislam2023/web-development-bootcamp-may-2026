# Development stage
FROM node:20-alpine AS dev
WORKDIR /app
RUN apk add --no-cache openssl libc6-compat
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
EXPOSE 5000
CMD ["npm", "run", "dev"]

# Builder stage 
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl libc6-compat
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# Production stage 
FROM node:20-alpine AS production
WORKDIR /app
RUN apk add --no-cache openssl libc6-compat
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./
EXPOSE 5000

# Run DB migrations then start the server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
