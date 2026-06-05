import type { NextFunction, Request, Response } from "express"
import { body, validationResult } from 'express-validator'

export const userSearchValidator = [
    body('search')
        .notEmpty()
        .withMessage('Search query is required'),
    body('docId')
        .notEmpty()
        .withMessage('Document ID is required'),
]

export const userSearchValidatorHandler = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();

    if (Object.keys(mappedErrors).length === 0) return next();
    else res.status(400).json({
        errors: mappedErrors
    });
}