import { signToken } from '@/utils/jwt';
import type { AuthResponse, TokenPayload } from '@/modules/auth/auth.types';

export function buildAuthResponse(
  user: { id: number; name: string; email: string },
  refreshToken: string,
): AuthResponse {
  const tokenPayload: TokenPayload = {
    userId: user.id,
    email: user.email,
  };

  return {
    user: { id: user.id, name: user.name, email: user.email },
    accessToken: signToken(tokenPayload),
    refreshToken,
  };
}
