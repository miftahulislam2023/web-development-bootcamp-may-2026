# AGENTS.md

## Dev Commands
- `pnpm dev` - Run dev server with hot reload (nodemon + tsx)
- `pnpm build` - Compile TypeScript to `dist/`
- `pnpm start` - Run production build
- `pnpm db-init` - Initialize PostgreSQL tables

## Setup Requirements
- PostgreSQL must be running with credentials in `.env`
- Uncomment `initializeDatabase()` in `src/db/init.ts` before running db-init

## Architecture
- Entry: `src/server.ts` → port 4000
- Express app: `src/app/app.ts`
- Routes: `src/routes/v1/` (API v1)
- Database: `src/db/db.ts` (pg connection pool)
- Validators: `src/middlewares/validators` (user input validators)

## Important Quirks
- Uses **pnpm** (not npm/yarn)
- ESM modules (`"type": "module"` in package.json)
- Uses `tsx` for dev, `tsc` for build
- DB init is **commented out by default** - must uncomment to use