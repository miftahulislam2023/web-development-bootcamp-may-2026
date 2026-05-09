import { AppLogger } from "@/core/logging/logger";
import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import config from "@/core/config";

export function requestLogger() {
  return (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    // Ensure requestId exists
    const requestId = req.id || crypto.randomUUID();
    req.id = requestId;

    // Safely extract IP
    const xff = req.headers["x-forwarded-for"];
    const ip = Array.isArray(xff) ? xff[0] : xff || req.ip;

    const method = req.method;
    const path = req.originalUrl || req.url;
    const userAgent = req.get("User-Agent") || "Unknown UA";

    // Listen for response end
    res.on("finish", () => {
      const duration = Date.now() - start;
      const status = res.statusCode;
      const contentLength = res.get("Content-Length") || 0;
      const contentType = res.get("Content-Type") || "Unknown";

      // 1. Build the comprehensive base string for all environments
      let logMessage = `📩 [${method}] ${path} | Status: ${status} | Time: ${duration}ms | Size: ${contentLength}b | Type: ${contentType} | IP: ${ip} | ReqID: ${requestId} | UA: ${userAgent}`;

      const payloadData = {
        query: req.query,
        params: req.params,
        body: req.body,
      };

      // Log as a single string
      AppLogger.info(logMessage, payloadData);
    });

    // Listen for aborted requests
    res.on("close", () => {
      if (!res.writableEnded) {
        const duration = Date.now() - start;

        let abortMessage = `⚠️ ABORTED [${method}] ${path} | Time: ${duration}ms | IP: ${ip} | ReqID: ${requestId} | UA: ${userAgent}`;

        // Include the same dev-only details for aborted requests
        if (config.server.isDevelopment) {
          if (req.query && Object.keys(req.query).length > 0) {
            abortMessage += ` | Query: ${JSON.stringify(req.query)}`;
          }
          if (req.params && Object.keys(req.params).length > 0) {
            abortMessage += ` | Params: ${JSON.stringify(req.params)}`;
          }
          if (req.body && Object.keys(req.body).length > 0) {
            abortMessage += ` | Body: ${JSON.stringify(req.body)}`;
          }
        }

        // Log as a single string
        AppLogger.warn(abortMessage);
      }
    });

    next();
  };
}
