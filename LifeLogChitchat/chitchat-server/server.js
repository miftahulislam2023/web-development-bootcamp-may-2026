import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();
import authRoute from "./src/routes/auth.route.js";
import messageRoute from "./src/routes/message.route.js";



import {connectDB} from './src/lib/connectDb.js'
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rgrxfrw.mongodb.net/chitchat-db?appName=Cluster0`;

connectDB(uri)

const app = express();
const CLIENT_URL = process.env.CLIENT_URL

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/message", messageRoute);

app.use(express.json());

app.listen(PORT, () => {
  console.log("hello chitchat 1234");
});
