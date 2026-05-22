/**
 * JWT Utilities — Token signing and verification
 *
 * Uses a shared JWT_SECRET so the Data Service can verify tokens
 * issued by this Auth Service without inter-service calls.
 *
 * @module jwt
 * @author Coder-A (Auth Service Lead)
 */

import jwt from "jsonwebtoken";

// ── Configuration ────────────────────────────────────────────────────────────

const JWT_SECRET: string =
    process.env.JWT_SECRET ||
    process.env.VITE_JWT_SECRET ||
    "lifeos-jwt-secret-change-me-in-prod";

const JWT_EXPIRES_IN = "7d";

// ── Payload Interfaces ───────────────────────────────────────────────────────

/** Minimal user payload embedded inside the JWT. */
export interface JwtUserPayload {
    id: string;
    name: string;
    email: string;
}

/** Decoded JWT — extends the user payload with standard JWT claims. */
export interface DecodedToken extends JwtUserPayload {
    sub: string;
    iat: number;
    exp: number;
}

// ── Token Operations ─────────────────────────────────────────────────────────

/**
 * Signs a new JWT for the given user.
 *
 * @param user  The user data to embed in the token.
 * @returns     A signed JWT string valid for {@link JWT_EXPIRES_IN}.
 */
export function signToken(user: JwtUserPayload): string {
    return jwt.sign(
        { sub: user.id, name: user.name, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN as any }
    );
}

/**
 * Verifies and decodes a JWT.
 *
 * @param token  The raw JWT string (without "Bearer " prefix).
 * @returns      Decoded payload, or `null` when invalid / expired.
 */
export function verifyToken(token: string): DecodedToken | null {
    try {
        return jwt.verify(token, JWT_SECRET) as DecodedToken;
    } catch {
        return null;
    }
}
