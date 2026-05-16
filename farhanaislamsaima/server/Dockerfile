FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY server/package.json ./server/package.json
COPY server/prisma.config.ts ./server/prisma.config.ts
COPY server/prisma ./server/prisma

RUN npm install --workspace server

COPY server ./server

WORKDIR /app/server

EXPOSE 4000

CMD ["sh", "-c", "npm run db:push && npm start"]
