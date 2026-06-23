import type { NextFunction, Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import passport from 'passport';
import AppError from '../../errorHelpers/AppError';
import { HTTP_STATUS } from '../../utils/HTTP_STATUS_CODE';
import { createUserTokens } from '../../utils/userTokens';
import { setAuthCookie } from '../../utils/setAuthCookie';
import { sendResponse } from '../../utils/sendResponse';
import { authService } from './auth.service';
import { envVars } from '../../config/env';
import { getUserIdFromReq } from '../../utils/getUserIdFromReq';

const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // -------------using passport to credentials login-----------------------
  passport.authenticate('local', async (err: any, user: any, info: any) => {
    if (err) {
      // ❌❌❌❌❌
      // throw new AppError(401, "Some error")
      // next(err)
      // return new AppError(401, err)

      // ✅✅✅✅
      // return next(err)
      // console.log("from err");
      return next(new AppError(HTTP_STATUS.UNAUTHORIZED, err));
    }

    if (!user) {
      // console.log("from !user");
      // return new AppError(401, info.message)
      return next(new AppError(HTTP_STATUS.UNAUTHORIZED, info.message));
    }

    //generate tokens
    const userTokens = createUserTokens(user);

    //set cookies in browser
    setAuthCookie(res, userTokens);

    sendResponse(res, {
      success: true,
      statusCode: HTTP_STATUS.OK,
      message: 'User Logged In Successfully',
      data: {
        user: user,
        tokens: {
          accessToken: userTokens.accessToken,
          refreshToken: userTokens.refreshToken,
        },
      },
    });
  })(req, res, next);
});

const getNewAccessTokenUsingRefreshToken = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const refreshToken = req?.cookies?.refreshToken;

    const tokenInfo = await authService.getNewAccessTokenUsingRefreshToken(refreshToken);

    // Set the new access token in an HTTP-only cookie
    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
      success: true,
      statusCode: HTTP_STATUS.OK,
      message: 'New Access Token Retrived Successfully',
      data: tokenInfo,
    });
  },
);

const logout = catchAsync(async (_req: Request, res: Response) => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: envVars.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: envVars.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: 'User Logged Out Successfully',
    data: null,
  });
});

const googleCallbackController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('google', (err: any, user: any, info: any) => {
      try {
        // ERROR CASE
        if (err) {
          return res.redirect(
            `${envVars.FRONTEND_URL}/login?error=${encodeURIComponent(
              err || 'Internal google strategy error',
            )}`,
          );
        }

        // AUTH FAILED CASE
        if (!user) {
          const message = info?.message || 'Authentication failed';

          return res.redirect(`${envVars.FRONTEND_URL}/login?error=${encodeURIComponent(message)}`);
        }

        // SUCCESS CASE
        req.user = user;

        // ───── STATE HANDLING ─────
        let redirectTo = '';

        if (req.query.state && typeof req.query.state === 'string') {
          try {
            const parsed = JSON.parse(req.query.state);
            if (parsed?.redirect) {
              redirectTo = parsed.redirect;
            }
          } catch {
            redirectTo = '';
          }
        }

        if (redirectTo.startsWith('/')) {
          redirectTo = redirectTo.slice(1);
        }

        // ───── TOKEN + COOKIE ─────
        const tokenInfo = createUserTokens(user);
        setAuthCookie(res, tokenInfo);

        // ───── FINAL REDIRECT ─────
        return res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
      } catch (error) {
        next(error);
      }
    })(req, res, next);
  },
);

const setPassword = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const userId = getUserIdFromReq(req);
  const { password } = req.body;

  await authService.setPassword(userId, password);

  sendResponse(res, {
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: 'Password Changed Successfully',
    data: null,
  });
});
export const authController = {
  createAuth: credentialsLogin,
  getNewAccessTokenUsingRefreshToken,
  logout,
  googleCallbackController,
  setPassword,
};
