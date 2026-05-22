/**
 * Local Development API Server
 * 
 * This script runs both the Auth Service and Data Service
 * on their respective ports (4001 and 4002) during local development.
 *
 * Usage:  npm run dev:api
 */

import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// Load env files so process.env has the DB/keys
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });

// Import and run both services dynamically so dotenv is loaded first
import("../backend/auth-service/src/server.ts").catch(console.error);
import("../backend/data-service/src/server.ts").catch(console.error);

