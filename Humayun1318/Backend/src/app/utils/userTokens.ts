import { envVars } from '../config/env';
import AppError from '../errorHelpers/AppError';
import type { IAuthTokens, IUserDocument } from '../modules/user/user.interface';
import User from '../modules/user/user.models';
import { HTTP_STATUS } from './HTTP_STATUS_CODE';
import { generateToken, verifyToken } from './jwt';

// Create access and refresh tokens for a user
export const createUserTokens = (
  user: Pick<IUserDocument, '_id' | 'email' | 'role'>,
): IAuthTokens => {
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };
  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES,
  );

  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES,
  );

  return {
    accessToken,
    refreshToken,
  };
};

// Refresh access token using refresh token
export const createNewAccessTokenUsingRefreshToken = async (refreshToken: string) => {
  const decoded = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET);

  const user = await User.findById(decoded.userId);

  if (!user) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, 'User does not exist');
  }

  if (!user.isLoginAllowed()) {
    throw new AppError(HTTP_STATUS.FORBIDDEN, 'Your account is not allowed');
  }

  const newAccessToken = generateToken(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
    },
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES,
  );

  return newAccessToken;
};
