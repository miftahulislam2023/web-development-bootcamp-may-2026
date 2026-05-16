# DevConnect — Live Chatting Platform

DevConnect is a full-stack realtime chatting platform built with Next.js, TypeScript, MongoDB, Mongoose, and Socket.io. It supports authentication, friend connections, private chats, group chats, message history, and realtime message delivery.

## Live Demo
- Live App: https://devconnect-live-chat.vercel.app/
- Socket Server: Add your Render URL here

## Features
- JWT authentication with HTTP-only cookies
- Register, login, logout
- Auth-protected app flow
- User search
- Friend request system
- Accept/reject friend requests
- Friends list
- Private one-to-one chats
- Group chat creation
- Group chats
- Message history from MongoDB
- Realtime message updates with Socket.io
- Light/dark theme toggle
- Responsive chat layout

## Tech Stack
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- MongoDB
- Mongoose
- Socket.io
- Vercel
- Render

## Architecture
- Vercel hosts the Next.js frontend and API routes.
- Render hosts the Socket.io server because Socket.io needs a persistent Node.js process.
- MongoDB Atlas stores users, friendships, chats, and messages.
- REST APIs are the source of truth for authentication and message persistence.
- Socket.io is used for realtime delivery of already-saved messages.

## Project Structure
- `app/`: Next.js App Router pages and layouts.
- `app/api/`: Next.js REST API routes.
- `app/(auth)/`: Authentication-related routes.
- `components/`: Reusable React components.
- `providers/`: React context providers.
- `models/`: Mongoose database schemas.
- `lib/`: Utility functions and configurations.
- `server/`: Backend server logic.
- `socket/`: Socket.io server implementation.
- `types/`: TypeScript interface definitions.

## Local Setup
```bash
npm install
npm run dev
```

For socket server:
```bash
npm run socket
```

*Note: The Next.js app and socket server should run in separate terminals during local development.*

## Environment Variables
Create a `.env.local` file by copying `.env.example`.

Variables used:
- `MONGODB_URI`: For MongoDB Atlas/local MongoDB.
- `JWT_SECRET`: Used for signing JWT auth tokens.
- `NEXT_PUBLIC_SOCKET_URL`: Used by the frontend to connect to the deployed/local socket server.
- `CLIENT_URL`: Used by the socket server CORS configuration.
- `SOCKET_PORT`: Optional for local socket server.

## Deployment
- Deploy Next.js app to Vercel.
- Deploy Socket.io server to Render/Railway/Fly.io.
- Set `NEXT_PUBLIC_SOCKET_URL` in Vercel to the Render socket URL.
- Set `CLIENT_URL` in Render to the Vercel frontend URL.

## Known Limitations
- Socket authentication is simplified for this demo; REST APIs remain the source of truth for authenticated message creation.
- Message pagination is not implemented yet.
- Automated tests are not added yet.

## Future Improvements
- Short-lived socket authentication token
- Message pagination
- Better notification system
- Redis adapter for scalable presence
- Automated tests

## What I Learned
- Structuring a Next.js App Router project
- Building JWT auth with HTTP-only cookies
- Modeling users, friendships, chats, and messages with Mongoose
- Combining REST APIs with Socket.io realtime updates
- Deploying a split architecture with Vercel, Render, and MongoDB Atlas
