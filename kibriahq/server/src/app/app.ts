import express, { type Express } from "express";
import dotenv from "dotenv";
import routes from "../routes/index.js";
import middlewares from "../middlewares/index.js";

dotenv.config();

const app: Express = express();

app.use(middlewares);
app.use(routes);

export default app;