import type { Request, Response, NextFunction } from "express";

export const root = (_req: Request, res: Response) => {
    res.status(200).json({
        msg: "Hello World!"
    })
}

export const notFound = (_req: Request, res: Response) => {
    res.status(404).json({
        msg: "Not found!",
        status: 404
    })
}

export const error = (error: Error & { status: number }, _req: Request, res: Response, _next: NextFunction) => {
    const msg = error.message || "Server error occurred!";
    const status = error.status || 500;

    res.status(status).json({
        msg,
        status
    })
}