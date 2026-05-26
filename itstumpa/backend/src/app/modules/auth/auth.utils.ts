import jwt, { SignOptions } from "jsonwebtoken";
import config from "../../config";

export const generateAccessToken = (userId: string, role: string): string =>
  jwt.sign({ sub: userId, role }, config.accessSecret as string, {
    expiresIn: (config.accessExpires || "15m") as SignOptions["expiresIn"],
  });

export const generateRefreshToken = (userId: string): string =>
  jwt.sign({ sub: userId }, config.refreshSecret as string, {
    expiresIn: (config.refreshExpires || "7d") as SignOptions["expiresIn"],
  });
