import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";



app.use(express.json());
app.use(cors({origin:ENV.CLIENT_URL, credentials:true}));
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

const PORT= ENV.PORT || 3000;

server.listen(PORT, ()=>{
    console.log("server is run+ing 3000");
    connectDB();
})