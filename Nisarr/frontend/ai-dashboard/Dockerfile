FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci 2>/dev/null || npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
RUN echo 'server { listen 3002; root /usr/share/nginx/html; index index.html; location / { try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 3002
CMD ["nginx", "-g", "daemon off;"]
