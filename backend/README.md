# Express Class-Based Backend Template (Ignitor App)

Welcome to the Express Class-Based Backend Server template! This starter kit provides a robust, modular, and highly scalable architecture for building Node.js applications using Express, TypeScript, Prisma, and Bun.

> ℹ️ **Info:** This project utilizes an `IgnitorApp` core engine to cleanly separate infrastructure, business logic (modules), and server bootstrapping.

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your local machine:

- **Bun:** We use Bun as the primary package manager and runtime.
- **Docker:** (Optional but recommended) For quickly spinning up the local PostgreSQL database.

### Installation & Setup

1. **Install Dependencies:**
   Run the following command to install all required packages:

```bash
bun install

```

1. **Environment Configuration:**
   Ensure you have your environment variables set up. Copy the `.env.demo` file to create your own `.env` file and update the database credentials.
2. **Start the Database:**
   Use the built-in Docker script to spin up your database via docker-compose:

```bash
bun run docker:up

```

1. **Database Setup (Prisma):**
   Run the setup script which handles client generation and migrations automatically:

```bash
bun run setup

```

> 💡 **Tip:** The `setup` script is a convenient wrapper that bundles `bun install`, `prisma generate`, and `prisma migrate dev` into a single command.

### Running the Application

- **Development Mode:**

```bash
bun run dev

```

This will start the server in watch mode with `NODE_ENV=development`.

- **Production Build:**

```bash
bun run build
bun run start

```

> ⚠️ **Warning:** Always ensure you compile the TypeScript code using `bun run build` before deploying to production. The `start` script specifically looks for the compiled output in the `dist` directory (`dist/index.js`).

## 🏗 Architecture (The Ignitor Engine)

This app relies on a structured, class-based bootstrap process located in `src/index.ts`. It is designed to keep your codebase organized as it scales.

1. **Initialization:** The application begins by instantiating the `IgnitorApp` engine.
2. **Infrastructure Providers:** Essential external services and databases (like the `PrismaProvider`) are registered into the app context first.
3. **Module Registration:** Business logic is encapsulated in standalone modules (e.g., `AuthModule`, `ProductModule`). You register these modules to attach their specific routes, controllers, and services to the app.
4. **Spark:** The server is officially started by calling `app.spark()` on your configured port.

> ℹ️ **Info:** Centralized error handling is built directly into the bootstrap process to gracefully catch, log, and terminate the process if any fatal startup errors occur.

## 📜 Key Scripts

Here are some of the most useful commands included in this template:

- **`bun run dev`**: Starts the development server with hot-reloading.
- **`bun run add:module`**: A handy utility script to generate the boilerplate files for a new module.
- **`bun run db:studio`**: Opens Prisma Studio in your browser to easily view and edit your database tables.
- **`bun run lint:fix`**: Automatically scans and fixes ESLint rule violations.
- **`bun run format`**: Formats your code using Prettier to maintain a consistent style.

> 💡 **Tip:** If your local database ever gets into an unrecoverable state, use `bun run reset`. This command safely resets the Prisma migrations and runs your database seeder to give you a fresh slate.
