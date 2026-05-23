// src/core/BaseController.ts
import { Request, Response } from "express";
import { HTTPStatusCode } from "@/types/HTTPStatusCode";
import { ApiResponse, PaginatedResponse } from "@/types/types";
import { AppLogger } from "./logging/logger";

export abstract class BaseController {
  /**
   * Send a standard successful response
   */
  protected sendResponse<T>(
    req: Request,
    res: Response,
    message?: string,
    statusCode: HTTPStatusCode = HTTPStatusCode.OK,
    data?: T,
  ): Response<ApiResponse<T>> | void {
    if (req.timedout || res.headersSent) {
      AppLogger.warn(
        `[Blocked] Prevented sending response for ${req.method} ${req.originalUrl} - Request timed out or was closed.`,
      );
      return;
    }

    const response: ApiResponse<T> = {
      success: true,
      message,
      meta: {
        requestId: req.id,
        timestamp: new Date().toISOString(),
      },
      data,
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Send a paginated response
   */
  protected sendPaginatedResponse<T>(
    req: Request,
    res: Response,
    pagination: PaginatedResponse<T>["meta"]["pagination"],
    message?: string,
    data?: T[],
  ): Response<PaginatedResponse<T>> | void {
    if (req.timedout || res.headersSent || req.abortSignal.aborted) {
      AppLogger.warn(
        `[Blocked] Prevented sending response for ${req.method} ${req.originalUrl} - Request timed out or was closed.`,
      );
      return;
    }

    const response: PaginatedResponse<T> = {
      success: true,
      message,
      meta: {
        requestId: req.id,
        timestamp: new Date().toISOString(),
        pagination,
      },
      data,
    };

    return res.status(HTTPStatusCode.OK).json(response);
  }

  /**
   * Send a 201 Created response
   */
  protected sendCreatedResponse<T>(
    req: Request,
    res: Response,
    data: T,
    message: string = "Resource created successfully",
  ): Response<ApiResponse<T>> | void {
    return this.sendResponse(req, res, message, HTTPStatusCode.CREATED, data);
  }

  /**
   * Send a 204 No Content response
   */
  protected sendNoContentResponse(res: Response): Response {
    return res.status(HTTPStatusCode.NO_CONTENT).send();
  }

  /**
   * Standardize extracting pagination parameters from query string.
   * @param req The Express Request object
   * @param maxLimit The maximum allowed limit (defaults to 100 to prevent DDoS via massive DB queries)
   */
  protected extractPaginationParams(
    req: Request,
    maxLimit: number = 100,
  ): {
    page: number;
    limit: number;
    offset: number;
  } {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);

    // Use the provided maxLimit parameter instead of a hardcoded 100
    const limit = Math.min(
      maxLimit,
      Math.max(1, parseInt(req.query.limit as string) || 10),
    );

    const offset = (page - 1) * limit;

    return { page, limit, offset };
  }
}
