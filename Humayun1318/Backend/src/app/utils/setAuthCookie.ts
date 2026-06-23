import type { Response } from 'express';
import type { IAuthTokens } from '../modules/user/user.interface';

export const setAuthCookie = (res: Response, tokenInfo: IAuthTokens) => {
  if (tokenInfo.accessToken) {
    res.cookie('accessToken', tokenInfo.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
  }

  if (tokenInfo.refreshToken) {
    res.cookie('refreshToken', tokenInfo.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
  }
};
