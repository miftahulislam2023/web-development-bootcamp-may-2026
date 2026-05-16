# Realtime Chat App 💬

A fully featured, full-stack realtime chat application built with Next.js, Socket.IO, and Prisma. It supports both public rooms and direct messaging with typing indicators, presence tracking, unseen message badges, and much more.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-Blue)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-green)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)

## Live Demo

Link: https://realtime-chat-frontend-1ujx.onrender.com


## Features

* **Authentication**: Secure login and registration using NextAuth and bcrypt.
* **Protected Routes**: Middleware and session-based protection for chat and DM routes.
* **Room Chat**: Create and join public chat rooms to talk with multiple users.
* **Direct Messaging**: Private 1-on-1 conversations with other users.
* **Realtime Messaging**: Instant message delivery using Socket.IO.
* **Edit/Delete**: Ability to edit or delete your sent messages in realtime.
* **Typing Indicators**: See when others are typing in both rooms and DMs.
* **Presence**: View who is currently online with realtime status updates.
* **Last Seen**: Track when a user was last active on the platform.
* **Seen Status**: Read receipts for direct messages (e.g., when a user opens the conversation).
* **Reconnect Recovery**: Graceful handling of socket disconnections and reconnections.
* **Notifications**: In-app toast notifications for new direct messages.
* **Unread Badges**: Visual indicators for unread messages across rooms and DMs.
* **Responsive UI**: Fully optimized layout for both desktop and mobile devices.
* **Sticky Mobile Headers**: Seamless mobile experience with fixed headers and navigation.
* **Cursor Pagination**: Infinite scrolling for loading older messages efficiently.

## Screenshots

### Login Page

![Login Screenshot](./screenshots/login.png)

### Room Chat

![Room Chat List](./screenshots/room-chat-list.png)

![Room Chats](./screenshots/room-chat.png)
### Direct Messages

![DM Screenshot](./screenshots/dm.png)

### Mobile View

![Mobile Screenshot](./screenshots/mobile.png)

## Tech Stack

* **Framework**: [Next.js App Router](https://nextjs.org/) (v16)
* **Language**: [TypeScript](https://www.typescriptlang.org/)
* **Realtime**: [Socket.IO](https://socket.io/) (v4)
* **ORM**: [Prisma](https://www.prisma.io/) (v6)
* **Database**: [PostgreSQL](https://www.postgresql.org/)
* **Authentication**: [NextAuth.js](https://next-auth.js.org/) (v4)
* **Styling**: [TailwindCSS](https://tailwindcss.com/) (v4)
* **Validation**: [Zod](https://zod.dev/)
* **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
* **Toast Notifications**: React Hot Toast

## Architecture Overview

The application utilizes a decoupled architecture where the Next.js API handles RESTful operations (like fetching historical messages, searching users, or managing sessions), while a standalone Node.js HTTP server running Socket.IO handles all realtime communication.

* **Client**: React Server Components and Client Components in the Next.js App Router.
* **API Engine**: Next.js API Routes for static interactions and database queries.
* **Socket Engine**: Custom Node.js server (`src/server/socket/index.ts`) managing persistent WebSocket connections.
* **Database Engine**: PostgreSQL connected via Prisma ORM for type-safe database queries.

## Realtime Features

* **Event-Driven Architecture**: Uses custom events for broadcasting typing state, presence, messages, edits, and deletions.
* **Room Presence**: Dynamic tracking of how many users and exactly who is currently viewing a specific room.
* **Global Presence**: A global map tracks connected users, broadcasting `online_users`, `user_online`, and `user_offline` events.

## Authentication Features

* **NextAuth Integration**: Manages user sessions, JWT tokens, and secure cookies.
* **Prisma Adapter**: Stores users, accounts, and sessions securely in PostgreSQL.
* **Custom Login/Register**: UI mapped to database creation with hashed passwords using bcrypt.

## Room System Features

* **Create & Join Rooms**: Users can instantiate new topic-based chat rooms.
* **Membership Tracking**: Logs when users join rooms and assigns them to the room presence state.
* **Persistent History**: All room messages are stored in the database for later viewing.

## Direct Messaging Features

* **1-on-1 Conversations**: Isolated chat threads between exactly two users.
* **User Search**: Debounced API search to find and start a DM with registered users.
* **Instant Delivery**: Messages are routed specifically to the `conversationId` socket room.
* **Read Receipts**: Automatically updates the `seenAt` timestamp when the recipient opens the thread.

## Notifications and Presence Features

* **Active Sync**: Presence system that updates the UI instantly when someone comes online or drops offline.
* **Unread System**: Tracks messages that haven't been viewed and calculates total unread counts.
* **Browser Events**: Cross-component communication via native browser CustomEvents (`dm_updated`, `presence_updated`) to keep the UI in sync without heavy global re-renders.

## Database Schema Overview

The database uses PostgreSQL modeled with Prisma. Key entities include:

* `User`: Stores user details, hashed passwords, and `lastSeenAt`.
* `Room`: Represents a public chat room.
* `RoomMember`: Tracks which users have joined which rooms.
* `Conversation`: Represents a 1-on-1 direct messaging thread between two users (`userA` and `userB`).
* `Message`: A unified model for messages. Can belong to either a `roomId` or a `conversationId`. Tracks `editedAt`, `deletedAt`, and `seenAt`.

## Installation Steps

1. Clone the repository.
2. Ensure you have Node.js 20+ installed.
3. Install dependencies:
   ```bash
   npm install
   ```

## Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/chat_app?schema=public"

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_SOCKET_URL="http://localhost:3001"
SOCKET_PORT="3001"
```

## Prisma Setup

1. Initialize the database schema:
   ```bash
   npm run db:push
   ```
2. (Optional) Seed the database with mock data:
   ```bash
   npm run db:seed
   ```
3. (Optional) Open Prisma Studio to view your database:
   ```bash
   npm run prisma:studio
   ```

## Running Locally

To run the full stack simultaneously (Next.js + Socket server):

```bash
npm run dev:all
```

Alternatively, run them separately:
1. Start the Next.js app on port 3000:
   ```bash
   npm run dev
   ```

## Socket Server Setup

If running separately, start the socket server on port 3001:
```bash
npm run dev:socket
```

## Build Commands

To build the project for production:

```bash
npm run build
```

To run type checking without emitting files:

```bash
npm run typecheck
```

## Folder Structure

```text
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets (images, fonts, etc.)
├── src/
│   ├── app/                # Next.js App Router pages and API routes
│   ├── components/         # Reusable React components (UI, Chat, DM)
│   ├── lib/                # Utility functions, validations, db client
│   ├── providers/          # React context providers (Session, Realtime)
│   └── server/             # Standalone Socket.IO server setup
├── .env.example            # Environment variables template
├── package.json            # Project dependencies and scripts
└── README.md               # Project documentation
```

## Future Improvements

* Add media and file upload support for messages.
* Implement end-to-end encryption for direct messages.
* Group chat support in direct messaging.
* Voice and video call integration.
* Push notifications for mobile devices.

## Author

Sayed Ajlan Al Alif

Dept. of CSE

Comilla University
