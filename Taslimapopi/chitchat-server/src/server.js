import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();
import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";



import {connectDB} from './lib/connectDb.js'
import { app, server } from "./lib/socket.js";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rgrxfrw.mongodb.net/chitchat-db?appName=Cluster0`;

connectDB(uri)


const CLIENT_URL = process.env.CLIENT_URL

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/message", messageRoute);


app.get("/deploy", (req, res) => {
  res.send("deploy successful");
});

app.use(express.json());



server.listen(PORT, () => {
  console.log("hello chitchat 1234");
});
