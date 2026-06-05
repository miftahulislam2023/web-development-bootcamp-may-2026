import { check, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import error from '../../../utils/error.js';
import { findUserByEmail } from "../../../services/user.js";
import type { Request, Response, NextFunction } from 'express';

export const loginValidator = [
    check('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email address')
        .trim()
        .custom(async (value) => {
            try {
                const user = await findUserByEmail(value);
                if (!user) throw error('User not found', 404);
            } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : String(err);
                throw error(msg, 404);
            }
        }),
    check('password')
        .notEmpty()
        .withMessage('Password is required')
        .custom(async (value, { req }) => {
            try {
                const user = await findUserByEmail(req.body.email);
                if (!user) return true;

                const isValid = await bcrypt.compare(value, user.password);
                if (!isValid) throw error('Invalid credentials', 401);
            } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : String(err);
                throw error(msg, 401);
            }
        })
]

export const loginValidatorHandler = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    const mappedErros = errors.mapped();

    if (Object.keys(mappedErros).length === 0) return next();
    else res.status(400).json({
        errors: mappedErros
    });
}