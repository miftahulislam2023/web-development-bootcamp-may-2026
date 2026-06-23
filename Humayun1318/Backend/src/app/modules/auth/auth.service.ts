import AppError from '../../errorHelpers/AppError';
import { HTTP_STATUS } from '../../utils/HTTP_STATUS_CODE';
import { createNewAccessTokenUsingRefreshToken } from '../../utils/userTokens';
import type { IAuthEntry } from '../user/user.interface';
import { AuthProvider } from '../user/user.interface';
import User from '../user/user.models';

const getNewAccessTokenUsingRefreshToken = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, 'No refresh token recieved from cookies');
  }

  const accessTokenInfo = await createNewAccessTokenUsingRefreshToken(refreshToken);

  return {
    accessToken: accessTokenInfo,
  };
};

const setPassword = async (userId: string, plainPassword: string) => {
  const user = await User.findById(userId).select('+password');

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  if (
    user.password &&
    user.auths.some((providerObject) => providerObject.provider === AuthProvider.GOOGLE)
  ) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      'You have already set you password. Now you can change the password from your profile password update',
    );
  }
  if (
    user.password &&
    user.auths.some((providerObject) => providerObject.provider === AuthProvider.LOCAL)
  ) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      'You have already password. Now you can change the password from your profile password update',
    );
  }

  const credentialProvider: IAuthEntry = {
    provider: AuthProvider.LOCAL,
    providerId: user.email,
  };

  const auths: IAuthEntry[] = [...user.auths, credentialProvider];

  user.auths = auths;
  // The pre-save hook in the User model will hash the password before saving to the database.
  user.password = plainPassword;
  await user.save();
};

export const authService = {
  getNewAccessTokenUsingRefreshToken,
  setPassword,
};
