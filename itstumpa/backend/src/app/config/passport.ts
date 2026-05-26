// src/config/passport.ts
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { prisma } from "../../lib/prisma";
import { Request } from "express";
import config from "./index";

// ✅ Extract JWT from cookie instead of Authorization header
const cookieExtractor = (req: Request): string | null => {
  return req?.cookies?.accessToken ?? null;
};

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor, // ✅ reads from cookie
      secretOrKey: config.accessSecret as string,
      passReqToCallback: true,
    },
    async (_req, payload, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { id: payload.sub } });
        if (!user) return done(null, false);
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

export default passport;