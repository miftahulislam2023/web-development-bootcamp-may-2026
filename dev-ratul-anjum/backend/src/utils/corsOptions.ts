import { CorsOptions } from "cors";
import { env } from "./env.js";

const origins = env.CORS_ORIGINS?.split(",").map((o) => o.trim()) || [];

const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (!origin || origins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["POST", "GET", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Accept", "User-Agent"],
};

export default corsOptions;
