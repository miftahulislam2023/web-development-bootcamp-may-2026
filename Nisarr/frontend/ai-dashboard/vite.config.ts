import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  server: { host: "::", port: 3002, proxy: { "/api/ai": { target: "http://localhost:4002", changeOrigin: true } } },
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
})
