# StreamForge

StreamForge is a high-performance, single-host live streaming platform designed
for digital creators. It provides a seamless, low-latency broadcasting
experience with real-time interactivity, built using a modern full-stack
architecture.

Deployment Links:

- Frontend: <https://streamforge-live.vercel.app>
- Backend: <https://streamforge-backend-k1ex.onrender.com>

---

## IMPORTANT: Backend Cold Start Notice

The backend is hosted on Render's free tier to ensure proper WebSocket support.
However, this means the server may spin down after periods of inactivity.

- First visit: The initial request may take 30-60 seconds to "wake up" the server.
- WebSocket Connection: If the chat or reactions don't connect immediately,
  please refresh the page once the site has loaded.

---

## Table of Contents

- [Technical Stack](#technical-stack)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Key Features Implementation](#key-features-implementation)
  - [Authentication & Security](#authentication--security)
  - [Broadcasting (Host)](#broadcasting-host)
  - [Interactive Experience (Viewer)](#interactive-experience-viewer)
  - [Host Dashboard](#host-dashboard)
- [Project Structure](#project-structure-nx-monorepo)
- [Versioning & Roadmap](#versioning--roadmap)
- [Developer Setup Guide](#developer-setup-guide)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Project](#running-the-project)

---

## Technical Stack

### Frontend

- Framework: Next.js (App Router)
- Styling: Tailwind CSS
- UI Components: shadcn/ui & Radix UI
- Icons: Phosphor Icons
- State Management: Zustand
- Data Fetching: Axios & React Query
- Real-time: Socket.io-client & LiveKit Components

### Backend

- Runtime: Node.js
- Framework: Express.js
- Database ORM: Prisma
- Database: PostgreSQL (Neon)
- Authentication: JWT (jsonwebtoken) with HttpOnly Cookie rotation
- Real-time Engine: Socket.io
- Media Server: LiveKit SDK (WebRTC)
- Security: BcryptJS & Express Rate Limit

---

## Key Features Implementation

### Authentication & Security

- Full JWT-based authentication with Access and Refresh token rotation.
- Secure session management via HttpOnly, SameSite cookies.
- Forgot password workflow with OTP verification via Gmail SMTP.
- Protected routes and strict middleware-based route guards.

### Broadcasting (Host)

- Low-latency WebRTC streaming via LiveKit SFU.
- Native browser broadcasting (Camera & Microphone).
- Screen sharing capabilities (Full screen, Window, or Tab).
- Live control panel: Mute/Unmute, Camera toggle, and Screen share switching.
- Graceful "Camera-Off" states with host avatar placeholders.

### Interactive Experience (Viewer)

- Sub-500ms latency for a truly "live" feel.
- Real-time Chat: High-speed messaging with moderation tools (Pin/Delete).
- Chat Controls: Slow mode (10s, 30s, 60s) and Guest chat toggling.
- Emoji Reactions: Floating animations with rate-limiting.
- Live Metrics: Real-time viewer count and stream status updates.

### Host Dashboard

- Room Management: Create, Edit, and Delete stream rooms.
- Stream History: Overview of past sessions with detailed summaries.
- Analytics: Post-stream data including peak viewers and message counts.

---

## Project Structure (Nx Monorepo)

- apps/frontend: Next.js application (Client-facing site and Dashboard).
- apps/backend: Express.js server (API, Sockets, and Business Logic).
- docs: Architectural diagrams, database planning, and developer guides.

---

## Versioning & Roadmap

### Version 1.0 (Current)

- Completed MVP with full Broadcasting and Viewer interactivity.
- Integrated JWT Auth and Host Dashboard.
- Implemented Real-time Chat and Reactions.

### Version 2.0 (Planned)

- Viewer Follow System & Notifications.
- Stream Scheduling.
- Automated Stream Recording (VOD).
- Full Dark Mode implementation.

---

## Developer Setup Guide

### Prerequisites

- Node.js (Latest LTS)
- pnpm (Package Manager)
- PostgreSQL Database (Local or Neon.tech)
- LiveKit Cloud project or self-hosted instance

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Abubokkor98/streamforge.git
   cd streamforge
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

### Configuration

Create environment files in the following locations:

#### apps/backend/.env

```env
# Database Connection
DATABASE_URL=postgresql://user:password@localhost:5432/streamforge?schema=public

# Server Configuration
PORT=5000
FRONTEND_URL=http://localhost:3000

# Authentication
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=15m

# Gmail SMTP Configuration (for Forgot Password OTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_specific_password
SMTP_FROM="StreamForge <your_email@gmail.com>"

# LiveKit Configuration (Media Server)
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret
```

#### apps/frontend/.env.local

```env
# Backend API URL (Internal)
BACKEND_URL=http://localhost:5000

# Socket.io Connection URL (Public)
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

# LiveKit Connection URL (Public)
NEXT_PUBLIC_LIVEKIT_URL=wss://your-project.livekit.cloud
```

### Running the Project

1. Generate Prisma client:

   ```bash
   pnpm prisma generate --schema=apps/backend/prisma/schema.prisma
   ```

2. Push database schema:

   ```bash
   npx prisma db push --schema=apps/backend/prisma/schema.prisma
   ```

3. Start development servers:

   ```bash
   pnpm dev
   ```
