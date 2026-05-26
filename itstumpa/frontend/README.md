# LiveChat — Frontend

A real-time chat platform frontend built with Next.js 16, TypeScript, and Socket.IO. WhatsApp-inspired dark UI with mesh gradients, role-based dashboards, and full messaging features.

---

## live: https://web-development-bootcamp-may-2026-one.vercel.app

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| State | Redux Toolkit |
| Real-time | Socket.IO Client |
| Forms | React Hook Form + Zod |
| HTTP | Axios |
| Auth | httpOnly cookies (JWT) |

---

## Features

- 🔐 **Auth** — Login, signup, email verification, forgot password
- 💬 **Real-time messaging** — Socket.IO powered instant delivery
- 📎 **File sharing** — Images and documents via Cloudinary
- ✅ **Read receipts** — Delivered/read indicators per message
- ⌨️ **Typing indicators** — Live typing status per conversation
- 🟢 **Online/offline status** — Real-time presence with last seen
- 📜 **Infinite scroll** — Cursor-based paginated message history
- 🔍 **User search** — Find and start conversations with pagination
- 👑 **Admin dashboard** — Stats, user management, conversation moderation
- 🚫 **Suspend/unsuspend users** — Admin moderation controls
- 📱 **Fully responsive** — 320px to 1600px, mobile drawer navigation

---

## Project Structure

```
src/
├── app/
│   ├── (main)/          # Landing page
│   ├── (auth)/          # Login, signup, verify-email, forgot-password
│   ├── (dashboard)/     # User chat dashboard
│   └── (admin)/         # Admin panel
├── components/
│   ├── chat/            # ConversationSidebar, ChatWindow, NewChatModal
│   ├── layout/          # Navbar, AdminSidebar, ReduxProvider
│   └── admin/           # UserDetailModal
├── store/
│   └── slices/          # authSlice, conversationsSlice, messagesSlice
├── lib/                 # axios.ts, socket.ts
├── hooks/               # Typed Redux hooks
└── types/               # Shared TypeScript interfaces
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Backend running at `http://localhost:5000`


### Environment

Create `.env.local` in the root:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Role-based Routing

| Role | Redirect |
|---|---|
| `USER` | `/dashboard` |
| `ADMIN` | `/admin` |
| `SUPER_ADMIN` | `/admin` (full access) |

Route protection is handled via `proxy.ts` (Next.js 16 middleware).
Now change to middleware.ts, because vercel didnt accept proxy.ts

---

## Backend

This frontend connects to a separate Node.js + Express + Socket.IO + Prisma backend.

> Backend repo: [LiveChat Backend](https://github.com/itstumpa)

---

## Color Palette

| Token | Value | Usage |
|---|---|---|
| Base | `#0F1419` | Background |
| Secondary | `#1E2530` | Cards, sidebar |
| Primary | `#06B6D4` | Cyan accent |
| Accent Purple | `#8B5CF6` | Gradient start |
| Accent Green | `#10B981` | Online status |
| Bubble Sent | `#0E7490` | Outgoing messages |
| Bubble Received | `#1E293B` | Incoming messages |

---

