# Backend – Dialog Application

**Tech Stack:** **Node.js**, **Express.js**, **TypeScript**, **Prisma**, **PostgreSQL**, **Better Auth**, **Socket.IO**, **Zod**.

---

## 📦 Prerequisites
- **Node.js** (v20 or later) – includes npm or yarn.
- **PostgreSQL** database instance (local or remote).
- **Git** – to clone the repository.

---

## 🚀 Quick Start
```bash
# Clone the repository (if you haven't already)
git clone https://github.com/dev-ratul-anjum/web-development-bootcamp-may-2026.git
cd web-development-bootcamp-may-2026/dev-ratul-anjum/backend

# Install dependencies (using your preferred package manager)
# npm
npm install
# or yarn
yarn install
# or pnpm
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env and provide required values:
#   DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
#   CLOUDINARY_* (if using image uploads)
#   GOOGLE_CLIENT_ID / SECRET, GITHUB_*, TWITTER_* (for social auth)
#   PORT=your_port (default 3000)
#   CORS_ORIGINS=comma-separated list of allowed origins

# Generate Prisma client and push schema to DB
npx prisma generate
npx prisma db push   # or npx prisma migrate dev for migrations

# Run the development server
npm run dev   # or yarn dev, pnpm dev
```
The API will be available at `http://localhost:<PORT>`.

---

## 📂 Project Structure (high‑level)
```
backend/
├─ src/
│  ├─ actions/          # Custom actions/helpers
│  ├─ app/              # Core Express app, router registration
│  ├─ components/       # Middleware and utilities
│  ├─ hooks/            # Custom hooks (if any)
│  ├─ lib/              # Shared libraries (e.g., email, cloudinary)
│  ├─ providers/        # Service providers (auth, socket)
│  ├─ modules/          # Feature modules (user, conversation, message, etc.)
│  │   ├─ user/         # User‑related controllers, routes, schema, services
│  │   ├─ conversation/ # Conversation logic
│  │   └─ message/      # Message handling
│  ├─ utils/            # Helper functions (date, file upload, error handling)
│  └─ server.ts         # Entry point – creates Express app & starts HTTP & Socket.io servers
├─ prisma/               # Prisma schema & migrations
│  ├─ schema.prisma
│  └─ migrations/
├─ .env.example          # Example environment file
├─ package.json
└─ tsconfig.json
```

---

## 🛠️ Key Commands
| Script | Description |
|--------|-------------|
| `dev` | Starts the server with live reload (tsx watch). |
| `build` | Compiles TypeScript to JavaScript (`dist/`). |
| `start` | Runs the compiled server (`node dist/server.js`). |
| `prisma:generate` | Generates Prisma client. |
| `prisma:push` | Pushes schema to the database (no migration history). |
| `prisma:migrate` | Runs migrations in development. |
| `lint` | Runs ESLint checks. |
| `format` | Formats code with Prettier. |

---

## 🔐 Authentication & Authorization
- **Better Auth** handles email/password, email verification, password reset, and social logins (Google, GitHub, Twitter).
- Tokens are stored in **HTTP‑only cookies**. The backend validates JWTs via the `checkAuth` middleware.
- Role‑based access control can be added using the `checkAuth` utility with role checks.

---

## 📡 Real‑time Communication
- **Socket.IO** server is instantiated in `src/server.ts` and attaches to the same HTTP server.
- Events include:
  - `message:new` – New chat message.
  - `conversation:update` – Conversation meta‑data changes.
  - `user:online` / `user:offline` – Presence tracking.
- The client connects via the frontend's `src/lib/socket.ts`.

---

## 🗄️ Database (Prisma)
- The schema lives in `prisma/schema.prisma` and defines models for **User**, **Conversation**, **Message**, **UserBlock**, **UserReport**, etc.
- Run migrations with `npx prisma migrate dev`.
- Use the generated client (`import { prisma } from '@/lib/prisma'`).

---

## 🧪 Testing
The repository currently does not contain test suites. To add tests:
1. Install Jest & React Testing Library (`npm i -D jest ts-jest @types/jest`).
2. Create a `tests/` folder with unit/integration tests for routes and services.
3. Run `npm test`.

---

## 📦 Production Build & Deployment
1. Build the project:
   ```bash
   npm run build   # or yarn build
   ```
   This compiles TypeScript to `dist/`.
2. Start the compiled server:
   ```bash
   npm start   # or yarn start
   ```
3. Deploy to any Node‑compatible platform (Render, Railway, Fly.io, Heroku, etc.).
   - Ensure environment variables are set in the hosting service.
   - Attach a PostgreSQL database and run `npx prisma migrate deploy` on first boot.

---

## 📚 Helpful Resources
- **Express.js Documentation** – https://expressjs.com/
- **Prisma Docs** – https://www.prisma.io/docs
- **Better Auth** – https://github.com/nextauthjs/better-auth
- **Socket.IO** – https://socket.io/docs/v4/server-api/
- **Zod** – https://zod.dev/

---

*The backend expects the frontend to be reachable via the URL set in `NEXT_PUBLIC_BACKEND_BASE_URL` (frontend) and `CORS_ORIGINS` (backend). Ensure these match in your development and production environments.*
