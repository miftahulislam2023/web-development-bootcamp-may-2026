# 💬 Realtime Chat Application

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-Blue)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-green)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)

---

## 2. Project Overview

This is a comprehensive, full-stack realtime chat application designed to support seamless communication between users. It offers dedicated public **room chat** as well as private **direct messaging** functionality. 

Built on a modern tech stack featuring **Next.js**, **Socket.IO**, **Prisma**, and **PostgreSQL**, the project delivers an exceptional realtime experience. It robustly handles persistent socket connections, live presence tracking, instant toast notifications, graceful reconnect handling, live typing indicators, and secure user authentication.

---

## 3. Live Deployment

**Frontend URL**: [https://realtime-chat-frontend-1ujx.onrender.com](https://realtime-chat-frontend-1ujx.onrender.com)  
**Socket Server URL**: [https://web-development-bootcamp-may-2026-hsxn.onrender.com](https://web-development-bootcamp-may-2026-hsxn.onrender.com) 

---

## 4. Features

### 🔐 Authentication
* **NextAuth Integration**: Secure credential-based login and registration.
* **Protected Routes**: Middleware protection preventing unauthorized access to chats and DMs.

### 🌐 Room Chat & Direct Messaging
* **Public Rooms**: Easily create, join, and browse topic-based chat rooms.
* **Direct Messaging**: Dedicated 1-on-1 private conversation threads.
* **Socket.IO Rooms**: Efficient socket-level room partitioning for isolated message delivery.

### ⚡ Realtime Features
* **Realtime Sync**: Sub-millisecond synchronization of messages across clients.
* **Typing Indicators**: Live visual feedback when participants are typing in rooms or DMs.
* **Message Edit/Delete**: Live mutation of sent messages, immediately reflecting for all clients.

### 🔔 Notifications & Presence
* **Presence System**: Realtime online/offline status tracking with global presence sync.
* **Last Seen Status**: Precise timestamps showing when a user was last active.
* **Unread Badges**: Dynamic visual counters for unseen direct messages and room pings.
* **Toast Notifications**: Interactive in-app popups for incoming messages when navigating away from the chat.

### 🛠 UI, UX & Resilience
* **Responsive UI**: Fully fluid design utilizing Tailwind CSS.
* **Sticky Mobile Headers**: Optimized mobile layouts with sticky navigation headers.
* **Reconnect Handling**: Intelligent auto-recovery of socket connections with automatic state hydration.
* **Cursor Pagination**: Infinite scroll history loading.
* **Zod Validation**: Strict schema validation for all API inputs and socket payloads.
* **Prisma Persistence**: Reliable data persistence backed by PostgreSQL.

---

## 5. Tech Stack

### Frontend
* Next.js 16 (App Router)
* React 19
* Tailwind CSS
* Zustand

### Backend
* Custom Node.js HTTP Server
* Socket.IO
* Next.js API Routes

### Database & ORM
* PostgreSQL
* Prisma

### Authentication & Validation
* NextAuth.js
* Zod
* bcryptjs

### Deployment
* Render (Hosting)
* Neon (PostgreSQL Database)

---

## 6. System Architecture

The architecture separates standard REST/Server-Component data fetching from persistent real-time streaming:
* **Frontend**: Communicates heavily with Next.js APIs for initial state loads, search, and user sessions.
* **Socket.IO**: A standalone WebSocket server processes all real-time events (messages, presence, typing).
* **Prisma**: Acts as the robust ORM layer, securely connecting the API routes and socket event handlers to PostgreSQL.
* **NextAuth**: Intercepts requests to securely authenticate the user and provide secure session tokens.
* **Realtime Synchronization**: Realtime events update local state arrays and broadcast DOM custom events, effortlessly synchronizing all visible client components.

---

## 7. Database Models

* **User**: The core identity model. Stores encrypted credentials, profile information, and last seen timestamps.
* **Room**: Represents a persistent public chat channel. Tracks the creator and room metadata.
* **RoomMember**: A join table tracking which users belong to which rooms and exactly when they joined.
* **Conversation**: Represents an exclusive, private 1-on-1 chat context between `userA` and `userB`.
* **Message**: A polymorphic entity containing the message body. It explicitly connects to either a `roomId` or a `conversationId` and keeps track of `editedAt`, `deletedAt`, and `seenAt` timestamps.

---

## 8. Important UI Actions

| Button/Action | Function |
| :--- | :--- |
| **Create Room** | Opens a modal to initialize a new public chat room. |
| **Join Room** | Authenticates the user into a specific room's message stream. |
| **Send Message** | Emits the message payload through the socket and persists it to the database. |
| **Edit** | Modifies the content of an already sent message in real-time. |
| **Delete** | Soft-deletes a message, replacing the content globally with a `[deleted]` tag. |
| **Back to Rooms** | Navigates the user safely back to the room directory. |
| **Back to DMs** | Navigates the user safely back to their direct message inbox. |
| **Search User** | A debounced API search to find platform users and initialize a new DM. |
| **Logout** | Safely destroys the NextAuth session and forcefully disconnects the socket. |

---

## 9. Realtime Features Workflow

1. **Socket Authentication**: Upon page load, the authenticated client immediately passes its `userId` to the socket server. 
2. **Room Joining**: When a user navigates to a specific chat or DM, the client commands the socket to join that specific string identifier room.
3. **Realtime Event Broadcasting**: When a user acts (sends a message, types), the server receives the emit and aggressively broadcasts it to all other sockets currently subscribed to that room.
4. **Typing Indicator Flow**: Typing triggers a debounced `typing_start` event. If the user stops typing or sends the message, a `typing_stop` event clears the UI indicator.
5. **Unread Tracking**: Messages sent to a DM emit updates. If the receiving user does not have the DM visibly focused, the local client bumps an unread counter stored in local persistence or global state.
6. **Reconnect Handling**: If a network drop occurs, the socket auto-reconnects and implicitly re-authenticates the user, forcing a re-fetch of missed messages.

---

## 10. Screenshots Section

### Login Page
![Login Screenshot](./screenshots/login.png)


### Room Chat List
![Room Chat List](./screenshots/room-chat-list.png)

### Room Chat
![Room Chats](./screenshots/room-chat.png)

### DM Inbox
![DM Inbox](./screenshots/dm-inbox.png)

### Direct Messaging
![DM Screenshot](./screenshots/dm.png)

### Mobile View
![Mobile Screenshot](./screenshots/mobile.png)

---

## 11. Installation & Local Setup

**1. Clone the repository**
```bash
git clone <your-repo-url>
cd ajlanalif
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure Environment Variables**
Copy the `.env.example` to `.env` and fill in the required credentials.
```bash
cp .env.example .env
```

**4. Generate Prisma Client**
```bash
npm run prisma:generate
```

**5. Push Database Schema**
```bash
npm run db:push
```

**6. Run Full Stack Locally**
You can launch both the Next.js frontend and the standalone Socket server simultaneously using:
```bash
npm run dev:all
```

*Alternatively, run them in separate terminals:*
* Frontend: `npm run dev`
* Socket Server: `npm run dev:socket`

---

## 12. Environment Variables

| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | The PostgreSQL connection string (e.g., Neon database URI). |
| `NEXTAUTH_SECRET` | A secure randomized string used to encrypt JWT session tokens. |
| `NEXTAUTH_URL` | The absolute base URL of your application (e.g., `http://localhost:3000`). |
| `NEXT_PUBLIC_SOCKET_URL` | The publicly accessible URL the client uses to reach the socket server. |
| `NEXT_PUBLIC_APP_URL` | The public base URL for frontend UI routing and API requests. |

---

## 13. Deployment Guide

This project is tailored for split or monolithic deployment configurations:
* **Frontend Hosting (Render)**: The Next.js application is hosted on Render, offering seamless CI/CD. 
* **Database (Neon)**: The PostgreSQL database leverages Neon's serverless Postgres for high availability and rapid connection pooling.
* **Socket Server**: The custom Socket.IO server is deployed alongside the frontend or on a dedicated Render Web Service to ensure persistent WebSocket integrity without serverless timeouts.


---

## 14. Author

**Sayed Ajlan Al Alif**  
Dept. of CSE  
Comilla University  

GitHub: [@ajlanalif](https://github.com/ajlanalif)


