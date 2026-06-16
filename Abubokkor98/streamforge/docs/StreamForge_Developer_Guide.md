# StreamForge — Technical Documentation & Developer Guide

> Single-Host Live Streaming Platform | Version 1.0 | May 2026

Welcome to the StreamForge developer guide. This document outlines the architectural decisions, folder structures, and coding standards required to build, maintain, and scale the StreamForge platform.

## 1. System Architecture & Tech Stack

StreamForge is structured as an **Nx Monorepo** managed with pnpm. Applications are cleanly separated into `apps/frontend/` (Next.js) and `apps/backend/` (Express.js), with all dependencies managed in a single root `package.json`.

### Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express.js
- **Real-Time / Media**: LiveKit (WebRTC), Socket.io
- **Database / ORM**: PostgreSQL (Neon), Prisma ORM
- **Authentication**: JWT (access token) + HttpOnly Cookie (refresh token) + bcryptjs

---

## 2. Root Folder Structure

The project uses an Nx monorepo with applications under `apps/`:

```text
streamforge/
├── apps/
│   ├── frontend/              # Next.js Application
│   └── backend/               # Express.js Application
├── package.json               # Single root package.json (all dependencies)
├── nx.json                    # Nx workspace configuration
└── pnpm-lock.yaml
```

---

## 3. Frontend Architecture (Next.js)

To maintain a clean, scalable, and highly readable frontend, we strictly enforce a **Hybrid Component Architecture (Views + UI)** with a hard **Separation of Concerns**. This pairs perfectly with `shadcn/ui`.

### Core Rules for Next.js
1. **No UI Components in Routes**: The `app/` directory is **strictly for routing and page composition**. Do not define UI components or complex logic inside `page.tsx` or `layout.tsx`. Delegate everything to the `components/views/` directory.
2. **Separation of Logic and UI**: Never mix data fetching, business logic, and UI rendering in the same file.
3. **Small & Reusable**: Keep components under ~100 lines. If a component grows, split it into smaller sub-components.

### Folder Structure

```text
apps/frontend/src/
├── app/                      # Strictly Routing (Next.js App Router)
│   ├── (auth)/login/page.tsx # Composes the Login view
│   ├── dashboard/page.tsx    # Composes the Dashboard view
│   └── layout.tsx
├── components/
│   ├── ui/                   # Generic building blocks (Auto-populated by shadcn/ui - Button, Input)
│   ├── layout/               # Structural components (Navbar, Footer, Sidebar)
│   └── views/                # Screen-specific grouped components
│       ├── auth/             # Domain: Authentication Screens
│       │   ├── LoginForm.tsx
│       │   └── RegisterForm.tsx
│       ├── dashboard/        # Domain: Dashboard Screen
│       │   ├── DashboardStats.tsx
│       │   └── RoomCard.tsx
│       └── stream/           # Domain: Live Broadcast Screen
├── lib/                      # Global configurations (e.g., API client, LiveKit config, utils for shadcn)
└── hooks/                    # Business logic and global hooks (e.g., useLoginAction, useWindowSize)
```

### Component Implementation Pattern (React 19)

**1. The UI Component (Pure View)**
Focuses entirely on layout, styling, and rendering props. No API calls. Utilizes `shadcn/ui` from the `ui/` folder.
```tsx
// components/views/auth/LoginForm.tsx
import { Input } from '@/components/ui/input';
import { SubmitButton } from '@/components/ui/submit-button';

interface LoginFormProps {
  action: (payload: FormData) => void;
  error?: string | null;
}

export function LoginForm({ action, error }: LoginFormProps) {
  return (
    <form action={action} className="flex flex-col gap-4">
      <Input name="email" type="email" required />
      <Input name="password" type="password" required />
      {error && <span className="text-destructive">{error}</span>}
      <SubmitButton>Login</SubmitButton>
    </form>
  );
}
```

**2. The Custom Hook (Logic with `useActionState`)**
Handles form action state using React 19's `useActionState`. No manual `useState` for loading, error, or submission tracking.
```tsx
// hooks/useLoginAction.ts
import { useActionState } from 'react';
import { loginApi } from '@/lib/api';

interface LoginState {
  error: string | null;
}

const INITIAL_STATE: LoginState = { error: null };

async function loginAction(prevState: LoginState, formData: FormData): Promise<LoginState> {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    await loginApi({ email, password });
    return { error: null };
  } catch {
    return { error: 'Invalid credentials' };
  }
}

export function useLoginAction() {
  const [state, formAction, isPending] = useActionState(loginAction, INITIAL_STATE);
  return { state, formAction, isPending };
}
```

**3. The Page Route (Composition)**
Assembles the logic and UI inside the App Router. Contains no UI or business logic.
```tsx
// app/(auth)/login/page.tsx
'use client';

import { LoginForm } from '@/components/views/auth/LoginForm';
import { useLoginAction } from '@/hooks/useLoginAction';

export default function LoginPage() {
  const { state, formAction } = useLoginAction();
  return <LoginForm action={formAction} error={state?.error} />;
}
```

---

## 4. Backend Architecture (Express.js Modular Monolith)

The backend avoids a disorganized "spaghetti" structure by using a **Modular Monolithic** approach. Each business domain is encapsulated in its own module.

### Folder Structure

```text
apps/backend/src/
├── config/                 # DB, Server, Socket configs
├── middlewares/            # Global middlewares (e.g., error handler, auth verifier)
├── modules/                # Feature modules
│   ├── auth/
│   │   ├── auth.controller.ts  # HTTP Request/Response handling
│   │   ├── auth.service.ts     # Business logic, Prisma DB calls
│   │   ├── auth.routes.ts      # Express route definitions
│   │   └── auth.schema.ts      # Zod validation schemas
│   ├── rooms/
│   ├── streams/
│   └── chat/
├── server.ts               # Express App initialization
└── main.ts                 # Entry point
```

### Backend Principles
1. **Fat Services, Skinny Controllers**: Controllers should only extract request data (params, body), pass it to the Service, and return the formatted HTTP response. **All business logic lives in the Service.**
2. **Centralized Error Handling**: Do not send raw `res.status(500)` everywhere. Throw custom API Error classes in the Service, let the controller catch them via `next(err)`, and handle them in a global error middleware.
3. **Validation at the Gates**: Use Zod middleware at the Route level to sanitize and validate request bodies before they hit the controller.

---

## 5. Global Coding Standards

To ensure long-term maintainability, all developers must adhere to these rules:

1. **Strict TypeScript**: Never use `any`. Define interfaces/types for all data models, component props, and API responses.
2. **Descriptive Naming**: Use clear, human-readable names. Avoid cryptic abbreviations.
   - Good: `handleUserLogin`, `hasStreamEnded`
   - Bad: `hdlUsrLg`, `streamSt`
3. **Early Returns**: Reduce code nesting by returning early in functions (Guard Clauses).
4. **No Magic Strings/Numbers**: Extract repeated strings and numbers into a `constants.ts` file or environment variables.
5. **Self-Documenting Code**: Code should explain *what* it does. Use comments only to explain *why* something is done if it involves complex or non-obvious business logic.
6. **Error Handling**: Every async operation on the frontend and backend must be wrapped in proper try/catch blocks. Never swallow errors silently.
7. **Semantic HTML**: Always use semantic HTML5 tags (`<main>`, `<section>`, `<article>`, `<nav>`, `<header>`, `<footer>`) to structure the document. Avoid unnecessary `<div>` and `<span>` elements.

---

## 6. React 19 & Next.js 16 Best Practices

With Next.js 16 utilizing React 19, we take advantage of the new hooks and features to drastically reduce boilerplate code, especially around forms and state management.

### 1. Form Actions (No more `e.preventDefault()`)
React 19 integrates natively with standard HTML `<form>` elements. Pass an async function directly to the `action` prop. This eliminates the need for manual event handling and boilerplate state.

```tsx
// ✅ React 19 — Use <form action={fn}>
const submitData = async (formData: FormData) => {
  "use server"; // If using Next.js Server Actions
  // process formData
};
<form action={submitData}>
```

### 2. `useActionState` (Replaces `useState` for Forms)
Instead of manually tracking `isLoading`, `error`, and `data` states, use `useActionState`. It takes your action function and an initial state, returning the current state, a new action to attach to the form, and the pending status.

```tsx
import { useActionState } from "react";

interface LoginState {
  error: string | null;
}

async function loginAction(prevState: LoginState, formData: FormData): Promise<LoginState> {
  return { error: "Invalid credentials" };
}

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, { error: null });

  return (
    <form action={formAction}>
      <input name="email" type="email" />
      {state?.error && <p className="text-red-500">{state.error}</p>}
      <button disabled={isPending}>
        {isPending ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
```

### 3. `useFormStatus` (For Child Components)
If you have a deeply nested submit button, you no longer need to pass `isPending` via props or context. `useFormStatus` hooks into the parent `<form>` automatically.

```tsx
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Submitting..." : children}
    </Button>
  );
}
```

### 4. `useOptimistic` (Instant UI Updates)
When a user sends a chat message or reacts with an emoji, the UI should update *instantly* before the server responds. React 19's `useOptimistic` handles this and automatically rolls back if the server request fails.

```tsx
import { useOptimistic } from "react";

interface ChatMessage {
  id: string;
  text: string;
}

export function ChatList({ messages }: { messages: ChatMessage[] }) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state: ChatMessage[], newMessage: ChatMessage) => [...state, newMessage]
  );

  return (
    <ul>
      {optimisticMessages.map((msg) => <li key={msg.id}>{msg.text}</li>)}
    </ul>
  );
}
```

### 5. The `use` API (Read Promises & Context Dynamically)
React 19 introduces the `use` API. Unlike traditional hooks, `use` can be called *inside conditionals or loops*. Use `use()` instead of `useContext()` for reading context.

```tsx
import { use } from "react";
import { ThemeContext } from "@/contexts/theme";

// Consuming Context — use `use()` instead of `useContext()`
function AdminPanel({ isAdmin }: { isAdmin: boolean }) {
  if (!isAdmin) return null;
  const theme = use(ThemeContext);
  return <div className={theme}>Admin tools</div>;
}
```

### 6. Next.js 16: Async Request APIs
All request-time APIs are now async. You must `await` them.

```tsx
interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page(props: PageProps) {
  const { slug } = await props.params;
  return <h1>Post: {slug}</h1>;
}
```

### 7. Next.js 16: `proxy.ts` replaces `middleware.ts`
The `middleware.ts` convention is deprecated. Use `proxy.ts` for network boundary logic (auth checks, redirects).

```tsx
// proxy.ts
export function proxy(request: Request) {
  // Auth checks, redirects, etc.
}
```

By leveraging these React 19 and Next.js 16 features in our frontend, we eliminate unnecessary `useState` and `useEffect` calls, resulting in a much cleaner, faster, and more maintainable codebase.
