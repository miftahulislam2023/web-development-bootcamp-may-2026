FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev 2>/dev/null || npm install --omit=dev
COPY . .
RUN npx tsc
EXPOSE 4002
CMD ["node", "dist/server.js"]
