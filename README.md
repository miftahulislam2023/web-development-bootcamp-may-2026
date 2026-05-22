<div align="center">
  <h1>💬 ChatSphere</h1>
  <p><strong>A modern, scalable, and responsive real-time chatting platform.</strong></p>
  <p>
    <img src="https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/Node.js-Express-green?style=flat&logo=nodedotjs" alt="Node.js" />
    <img src="https://img.shields.io/badge/Socket.io-Realtime-black?style=flat&logo=socketdotio" alt="Socket.io" />
    <img src="https://img.shields.io/badge/PostgreSQL-Prisma-blue?style=flat&logo=postgresql" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Docker-Containerized-blue?style=flat&logo=docker" alt="Docker" />
  </p>
</div>

---

## 🌟 Overview

ChatSphere is a fully-featured, full-stack live chatting application. It brings people together through real-time public rooms, secure private rooms, and direct one-to-one messaging. Built with a modern tech stack, it features an elegant, fully responsive UI, robust session management, and a highly scalable backend architecture utilizing Redis and PostgreSQL.


**Live Application:** [https://chat-sphere-u7lz.onrender.com](https://chat-sphere-u7lz.onrender.com)


## ✨ Key Features

- **🚀 Real-Time Messaging:** Sub-millisecond latency messaging powered by Socket.io.
- **👥 Dynamic Chat Rooms:** Create or join public rooms instantly.
- **🔒 Secure Private Rooms:** Exclusive rooms with a built-in join request and approval workflow.
- **💬 Direct Messaging (1-on-1):** Discover users and start private, encrypted conversations.
- **🌓 Adaptive UI:** Beautiful Light and Dark themes, built with Tailwind CSS and `shadcn/ui`.
- **🛡️ Robust Authentication:** JWT-based auth with automated session hydration and persistence.
- **😊 Rich Media:** Integrated Emoji-mart for expressive messaging and custom user avatars.
- **📱 Fully Responsive:** Carefully crafted for perfect rendering on desktop, tablet, and mobile devices.
- **🐳 DevOps Ready:** Fully containerized with Docker and orchestrated via Docker Compose.

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework:** Next.js 15 (React 19)
- **Styling:** Tailwind CSS, `shadcn/ui`, Framer Motion
- **State Management:** Zustand, TanStack Query
- **Real-Time:** Socket.io-client
- **Utilities:** Emoji-mart, date-fns

### Backend (Server)
- **Runtime:** Node.js, Express, TypeScript
- **Real-Time:** Socket.io
- **ORM:** Prisma
- **Validation:** Zod
- **Auth:** JWT, bcryptjs

### Database & Infrastructure
- **Primary Database:** PostgreSQL (NeonDB)
- **Cache / PubSub:** Redis
- **Reverse Proxy:** Nginx
- **Containerization:** Docker & Docker Compose

---

## 🗂️ Project Structure

```text
sadik117-live-chatting-platform/
├── client/                 # Next.js Frontend application
│   ├── src/                # Components, Pages, and Hooks
│   ├── Dockerfile          # Client container configuration
│   └── package.json        # Frontend dependencies
├── server/                 # Express & Socket.io Backend application
│   ├── src/                # Controllers, Routes, and Socket events
│   ├── prisma/             # Database schema and migrations
│   ├── Dockerfile          # Server container configuration
│   └── package.json        # Backend dependencies
├── nginx/                  # Nginx reverse proxy configurations
├── docker-compose.yml      # Production orchestration
└── docker-compose.dev.yml  # Local development orchestration with hot-reload
```

---

## ⚡ Getting Started (Local Development)

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Docker](https://www.docker.com/) & Docker Compose
- [NeonDB Account](https://neon.tech/) (or local PostgreSQL)
- Redis (if running locally without Docker)

### 1. Environment Setup

Create `.env` files based on the provided examples.

**Server (`server/.env`):**
```env
DATABASE_URL="your_neon_pgbouncer_url"
DIRECT_URL="your_neon_direct_url"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your_super_secret_key"
CORS_ORIGIN="http://localhost:3000"
```

**Client (`client/.env.local`):**
```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
NEXT_PUBLIC_SOCKET_URL="http://localhost:5000"
```

### 2. Running with Docker (Recommended)

To spin up the entire stack (Database, Redis, Server, Client, Nginx) with hot-reloading:

```bash
# Build and start the development containers
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# To stop the containers
docker-compose down
```
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

### 3. Running without Docker (Manual Setup)

**Terminal 1 (Server):**
```bash
cd server
npm install
npx prisma migrate dev --name init
npm run dev
```

**Terminal 2 (Client):**
```bash
cd client
npm install
npm run dev
```

---

## 🚀 Deployment Guide: Render

Deploying ChatSphere to [Render](https://render.com/) is straightforward. We will deploy the frontend and backend as separate web services to ensure independent scalability.

### Step 1: Database & Redis Setup
1. **PostgreSQL:** Create a database on [Neon](https://neon.tech/) (recommended) or create a PostgreSQL instance on Render. Obtain the Connection string.
2. **Redis:** Create a new **Redis** instance on Render. Copy the Internal Redis URL (e.g., `redis://red-xxxx:6379`).

### Step 2: Deploying the Backend (Web Service)
1. In your Render Dashboard, click **New +** -> **Web Service**.
2. Connect your GitHub repository and select it.
3. Configure the service:
   - **Name:** `chatsphere-api` (or similar)
   - **Root Directory:** `server`
   - **Environment:** `Node` (or `Docker` if you prefer using the provided Dockerfile).
   - **Build Command:** `npm install && npm run build && npx prisma generate`
   - **Start Command:** `npm run db:deploy && npm start` *(Note: ensure you have a script for `db:deploy` or run `npx prisma migrate deploy`)*
4. Add **Environment Variables**:
   - `DATABASE_URL`: Your PostgreSQL Connection String.
   - `DIRECT_URL`: Direct Connection String (for Prisma migrations).
   - `REDIS_URL`: Your Render Internal Redis URL.
   - `JWT_SECRET`: A strong random string.
   - `CORS_ORIGIN`: *Leave blank for now, update after deploying the client.*

### Step 3: Deploying the Frontend (Web Service / Static Site)
1. Click **New +** -> **Web Service**.
2. Connect the same GitHub repository.
3. Configure the service:
   - **Name:** `chatsphere-client`
   - **Root Directory:** `client`
   - **Environment:** `Node` (or `Next.js` / `Docker`).
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start`
4. Add **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: `https://chatsphere-api.onrender.com/api` (Replace with your actual backend Render URL)
   - `NEXT_PUBLIC_SOCKET_URL`: `https://chatsphere-api.onrender.com`
5. Click **Create Web Service**.

### Step 4: Finalize Configuration
Once the Client is deployed, copy its public URL (e.g., `https://chatsphere-client.onrender.com`).
Go back to your Backend Web Service on Render, navigate to **Environment**, and update the `CORS_ORIGIN` variable to match your client's URL.

---

## 📡 API Reference & Socket Events

### REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/api/auth/register` | Register a new user |
| **POST** | `/api/auth/login` | Authenticate user & receive JWT |
| **GET** | `/api/auth/me` | Fetch current hydrated session |
| **GET** | `/api/rooms` | Retrieve public and discoverable rooms |
| **POST** | `/api/rooms` | Create a new room (Public/Private/Direct) |
| **POST** | `/api/rooms/:id/join` | Join a room or request access |
| **GET** | `/api/messages/:roomId`| Fetch paginated message history |

### WebSocket Events (Socket.io)

| Event | Direction | Description |
|-------|-----------|-------------|
| `join_room` | Client → Server | Subscribe to a specific room channel |
| `send_message`| Client → Server | Dispatch a new message to a room |
| `typing_start`| Client → Server | Broadcast typing indicator to room |
| `new_message` | Server → Client | Receive a new message broadcast |
| `user_online` | Server → Client | Notify when a user connects |

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](#) if you want to contribute.
