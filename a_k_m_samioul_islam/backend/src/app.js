import express from "express"
import cors from "cors"
import userRoutes from "./routes/user/user.routes.js"

const app=express();

app.use(cors());

app.use(express.json());

// User routes

app.use("/api", userRoutes)

export default app;