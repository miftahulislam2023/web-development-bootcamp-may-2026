# Frontend – Dialog Application

**Tech Stack:** **Next.js**, **React**, **TypeScript**, **Tailwind CSS**, **Lucide‑React**, **React Query**, **Socket.IO‑client**, **Better‑Auth**, **Zod**.

---

## 📦 Prerequisites

- **Node.js** (v20 or later) – includes npm or yarn.
- **Git** – to clone the repository.

---

## 🚀 Quick Start

```bash
# Clone the repo (if you haven't already)
git clone https://github.com/dev-ratul-anjum/web-development-bootcamp-may-2026.git
cd web-development-bootcamp-may-2026/dev-ratul-anjum/frontend

# Install dependencies (using your preferred package manager)
# npm
npm install
# or yarn
# yarn install
# or pnpm
# pnpm install

# Create a .env file based on .env.example
cp .env.example .env
# Populate the variables – at minimum:
# NEXT_PUBLIC_BACKEND_BASE_URL=<backend URL>
# NEXT_PUBLIC_FRONTEND_OAUTH_SUCCESS_REDIRECT_URL=<your‑frontend URL>

# Run the development server
npm run dev   # or yarn dev, pnpm dev
```

Open `http://localhost:3000` in your browser.

---

## 🛠️ Available Scripts

| Script     | Description                                       |
| ---------- | ------------------------------------------------- |
| `dev`      | Starts the Next.js dev server with hot‑reloading. |
| `build`    | Creates an optimized production build.            |
| `start`    | Serves the production build (run after `build`).  |
| `lint`     | Runs ESLint across the codebase.                  |
| `lint:fix` | Auto‑fixes lintable issues.                       |
| `format`   | Formats files with Prettier.                      |

---

## ⚙️ Environment Variables

| Variable                                          | Purpose                                                  |
| ------------------------------------------------- | -------------------------------------------------------- |
| `NEXT_PUBLIC_BACKEND_BASE_URL`                    | URL of the backend API (e.g., `https://api.fabaka.com`). |
| `NEXT_PUBLIC_FRONTEND_OAUTH_SUCCESS_REDIRECT_URL` | Frontend redirect after successful social login.         |
| `NEXT_PUBLIC_SITE_URL`                            | Used for Open Graph meta tags.                           |

Add any additional variables required by **Better‑Auth** (client IDs/secrets) – they are prefixed with `NEXT_PUBLIC_` to expose them to the browser.

---

## 📂 Project Structure (high‑level)

```
frontend/
├─ src/
│  ├─ app/               # Next.js App Router – pages are inside folders
│  │   ├─ about/          # Static About page (implemented)
│  │   ├─ features/       # Static Features page (implemented)
│  │   ├─ technology/     # Static Technology page (implemented)
│  │   └─ ...
│  ├─ components/        # Re‑usable UI components (buttons, cards, etc.)
│  ├─ hooks/             # Custom React hooks (e.g., authentication, socket)
│  ├─ lib/               # Utility functions, API clients
│  └─ providers/         # Context providers (React Query, Auth)
├─ public/               # Static assets (icons, images)
├─ styles/               # Global CSS (Tailwind config lives at root)
└─ ...
```

---

## 🧪 Testing

The project currently does **not** include automated tests. Add Jest or React Testing Library as needed.

---

## 📦 Production Build & Deployment

1. Build the app:
   ```bash
   npm run build   # or yarn build
   ```
2. The output lives in the `.next` folder. Deploy to Vercel, Netlify, or any Node.js‑compatible host.
3. Ensure the environment variables are set on the hosting platform.

---

## 📚 Helpful Resources

- **Next.js Documentation** – https://nextjs.org/docs
- **Tailwind CSS** – https://tailwindcss.com
- **Better‑Auth** – https://github.com/nextauthjs/better-auth
- **Socket.IO client** – https://socket.io/docs/v4/client-api/

---

Feel free to reach out if you encounter any issues during setup!
