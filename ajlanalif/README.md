# Realtime Chat App Setup

Initial project setup and architecture for a production-ready real-time chat application.

Stack:
- Next.js App Router + TypeScript
- Tailwind CSS v4
- Prisma + PostgreSQL
- NextAuth credentials strategy
- Socket.IO (separate socket service)
- Zustand
- react-hot-toast

## Environment

1. Copy `.env.example` to `.env`.
2. Update `DATABASE_URL` for your local PostgreSQL instance.
3. Set a strong `NEXTAUTH_SECRET`.

## Install and Generate

```bash
npm install
npm run prisma:generate
```

## Database Commands

```bash
npm run prisma:migrate
npm run db:seed
npm run prisma:studio
```

## Run in Development

Run Next.js only:

```bash
npm run dev
```

Run Socket.IO only:

```bash
npm run dev:socket
```

Run both services:

```bash
npm run dev:all
```

## Quality Scripts

```bash
npm run lint
npm run typecheck
```

## Folder Structure

```text
src/
	app/
		(auth)/
			sign-in/page.tsx
		(protected)/
			chat/page.tsx
			profile/page.tsx
		api/
			auth/[...nextauth]/route.ts
			health/route.ts
		globals.css
		layout.tsx
		page.tsx
	lib/
		auth.ts
		prisma.ts
		socket/client.ts
		validations/auth.ts
	providers/
		app-providers.tsx
	server/
		socket/index.ts
	store/
		chat-ui-store.ts
		index.ts
	types/
		next-auth.d.ts
prisma/
	schema.prisma
	seed.ts
prisma.config.ts
```

## Notes

- This setup intentionally focuses on architecture only, not complete feature implementation.
- Route Handlers are used under `src/app/api/*` to stay fully within App Router conventions.
- Socket.IO runs as a dedicated Node process for stable WebSocket behavior.
