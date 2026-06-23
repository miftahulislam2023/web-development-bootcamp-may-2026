import type { Request } from 'express';
import type { JwtPayload } from 'jsonwebtoken';

export const getUserIdFromReq = (req: Request): string => {
  return (req.user as JwtPayload).userId;
};
