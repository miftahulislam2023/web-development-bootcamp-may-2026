import type { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from '../utils/HTTP_STATUS_CODE';
import AppError from '../errorHelpers/AppError';
import { envVars } from '../config/env';
import { verifyToken } from '../utils/jwt';
import User from '../modules/user/user.models';

// Middleware to authenticate requests using JWT access token
export const authenticate =
  (...authRoles: string[]) =>
    async (req: Request, _res: Response, next: NextFunction) => {
      try {
        const accessToken = req?.headers?.authorization || req?.cookies?.accessToken;

        if (!accessToken) {
          throw new AppError(HTTP_STATUS.UNAUTHORIZED, 'Authentication token missing');
        }

        // Verify the access token and extract user information
        // This will throw an error within verifyToken if the token is invalid or expired
        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET);

        const user = await User.findOne({ email: verifiedToken.email });

        if (!user) {
          throw new AppError(HTTP_STATUS.UNAUTHORIZED, 'User not found');
        }

        if (!user.isLoginAllowed()) {
          throw new AppError(HTTP_STATUS.FORBIDDEN, 'Your account is not allowed');
        }

        if (authRoles.length > 0 && !authRoles.includes(verifiedToken.role)) {
          throw new AppError(
            HTTP_STATUS.FORBIDDEN,
            'You do not have permission to access this resource',
          );
        }

        req.user = verifiedToken;
        next();
      } catch (error) {
        console.log('authenticate error', error);
        next(error);
      }
    };
