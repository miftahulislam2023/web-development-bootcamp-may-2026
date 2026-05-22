# Crimson Connect

Crimson Connect is a Next.js 16 messaging web app with a modern marketing site and an anonymous real-time group chat powered by Supabase.

## Live Demo

- [https://crimson-connect-six.vercel.app/](https://crimson-connect-six.vercel.app/)

## Features

- Anonymous display-name chat (no account required)
- Pre-seeded shared **Global** room for instant group conversation
- Real-time message updates via Supabase Realtime
- Supabase RLS policies for safe public read/write rules
- Clean marketing pages with soft motion interactions (Framer Motion)

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- HeroUI
- Supabase (`@supabase/supabase-js`)
- Framer Motion

## Project Structure

```text
app/
  (main)/(marketing)/   # Home, features, login marketing routes
  chat/                 # Chat entry and room routes
components/
  features/
    chat/
      components/       # Chat UI pieces
      hooks/            # Chat hooks
      pages/            # Chat page-level components
lib/
  chat/                 # Shared chat constants/types
  supabase/             # Browser client helper
```

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

## Local Development

Install dependencies:

```bash
npm install
```

Start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm run dev` - start local dev server
- `npm run build` - create production build
- `npm run start` - run production server
- `npm run lint` - run lint checks