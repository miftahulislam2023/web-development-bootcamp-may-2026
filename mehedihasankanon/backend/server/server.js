import "./config/env.js";

import express from "express";
import cors from "cors";

import { createRouteHandler } from "uploadthing/express";
import uploadRouter from "./routes/uploadRouter.js";
import authRouter from "./routes/authRouter.js";
import fileRouter from "./routes/fileRouter.js";
import folderRouter from "./routes/folderRouter.js";

import { prisma } from "./database/db.js";

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5001;

// ================ Routes ==============

// app.use(__path__, __middleware__) -> use this middleware whenever the path starts with __path__
// this middleware ensures all uploads are handled
// for each file upload, uploadthing server will send a request to this path with a payload
// so on that callback request we save the file to DB using prisma

const uploadthingPath = "/api/uploadthing";
const backendUrl = process.env.BACKEND_URL?.replace(/\/$/, "");
const callbackUrl = backendUrl ? `${backendUrl}${uploadthingPath}` : undefined;
const uploadthingToken = process.env.UPLOADTHING_TOKEN;
if (!uploadthingToken) {
  console.warn("UPLOADTHING_TOKEN is not set. UploadThing uploads will fail.");
}
const isDev = process.env.NODE_ENV !== "production";
const uploadthingFetch = async (input, init) => {
  const response = await fetch(input, init);

  if (!response.ok) {
    let bodyText = "";
    try {
      bodyText = await response.clone().text();
    } catch (error) {
      bodyText = "<unable to read response body>";
    }

    const url = typeof input === "string" ? input : input?.toString?.();
    console.warn("UploadThing API error response:", {
      url,
      status: response.status,
      statusText: response.statusText,
      body: bodyText,
    });
  }

  return response;
};
const uploadthingConfig = {
  ...(uploadthingToken ? { token: uploadthingToken } : {}),
  ...(callbackUrl ? { callbackUrl } : {}),
  logLevel: "Debug",
  fetch: uploadthingFetch,
  isDev,
};

app.use(
  uploadthingPath,
  createRouteHandler({
    router: uploadRouter,
    config: Object.keys(uploadthingConfig).length
      ? uploadthingConfig
      : undefined,
  }),
);

app.use("/api/auth", authRouter);
app.use("/api/files", fileRouter);
app.use("/api/folders", folderRouter);

// ==========

app.get("/api/health", async (req, res) => {
  console.log("Connecting to:", process.env.DATABASE_URL?.split("@")[1]);

  try {
    // check if DB is reachable
    const user = await prisma.user.findFirst();

    res.json({
      success: true,
      message: "Server is running",
      user,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Internal server error",
      timestamp: new Date().toISOString(),
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
