import { check, validationResult } from 'express-validator';
import error from '../../../utils/error.js';
import { findUserByEmail } from "../../../services/user.js";
import type { Request, Response, NextFunction } from 'express';

export const registerValidator = [
    check('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 3 })
        .withMessage('Name should be minimum 3 characters')
        .trim(),
    check('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email address')
        .trim()
        .custom(async (value) => {
            try {
                const user = await findUserByEmail(value);
                if (user) throw error('Email already in use', 400);
            } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : String(err);
                throw error(msg, 400);
            }
        }),
    check('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters'),
    check('confirmPassword')
        .notEmpty()
        .withMessage('Confirm password is required')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw error('Passwords do not match', 400);
            }
            return true;
        })
]

export const registerValidatorHandler = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    const mappedErros = errors.mapped();

    if (Object.keys(mappedErros).length === 0) return next();
    else res.status(400).json({
        errors: mappedErros
    });
}