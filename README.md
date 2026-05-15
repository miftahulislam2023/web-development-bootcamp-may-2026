# ChatSphere — Live Chatting Platform

> Real-time group chat built with Next.js, Express, Socket.io, NeonDB (PostgreSQL), Prisma, Redis, and Docker.

## 🗂️ Project Structure
```
sadik117-live-chatting-platform/
├── client/          # Next.js 14 frontend
├── server/          # Express + Socket.io backend
├── nginx/           # Reverse proxy config
├── docker-compose.yml
└── docker-compose.dev.yml
```

## ⚡ Quick Start (Local Dev without Docker)

### 1. Set up NeonDB
- Create a project at [neon.tech](https://neon.tech)
- Copy the `DATABASE_URL` and `DIRECT_URL` from your dashboard

### 2. Server setup
```bash
cd server
cp .env.example .env      # Fill in your NeonDB URLs + JWT_SECRET
npm install
npx prisma migrate dev --name init
npm run dev               # Starts on http://localhost:5000
```

### 3. Client setup
```bash
cd client
cp .env.local.example .env.local
npm install
npm run dev               # Starts on http://localhost:3000
```

## 🐳 Docker (Production)

```bash
cp .env.example .env      # Fill in your NeonDB URLs + JWT_SECRET

# Build and run all containers
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## 🐳 Docker (Dev with hot reload)

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

## 🔑 Environment Variables

| Variable | Where | Description |
|----------|-------|-------------|
| `DATABASE_URL` | server/.env | NeonDB pooled connection (pgbouncer) |
| `DIRECT_URL` | server/.env | NeonDB direct connection (for migrations) |
| `REDIS_URL` | server/.env | Redis connection string |
| `JWT_SECRET` | server/.env | Secret key for signing tokens |
| `NEXT_PUBLIC_API_URL` | client/.env.local | Backend API URL |
| `NEXT_PUBLIC_SOCKET_URL` | client/.env.local | Socket.io server URL |

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Current user |
| GET | `/api/rooms` | All public rooms |
| GET | `/api/rooms/my` | My rooms |
| POST | `/api/rooms` | Create room |
| POST | `/api/rooms/:id/join` | Join room |
| DELETE | `/api/rooms/:id/leave` | Leave room |
| GET | `/api/messages/:roomId` | Get messages (paginated) |
| POST | `/api/messages/:id/read` | Mark as read |

## 📡 Socket.io Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join_room` | C→S | Join a room channel |
| `send_message` | C→S | Send a message |
| `typing_start` | C→S | Start typing |
| `typing_stop` | C→S | Stop typing |
| `mark_read` | C→S | Mark message as read |
| `room_history` | S→C | Message history on join |
| `new_message` | S→C | New message broadcast |
| `user_typing` | S→C | Someone is typing |
| `user_online` | S→C | User came online |
| `user_offline` | S→C | User went offline |

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, Zustand, TanStack Query, Socket.io-client, Framer Motion
- **Backend**: Express, Socket.io, Prisma ORM
- **Database**: NeonDB (PostgreSQL)
- **Cache**: Redis (online presence, pub/sub)
- **Infrastructure**: Docker Compose, Nginx