/**
 * AuthController — Handles all authentication-related business logic
 *
 * Each public method corresponds to a specific auth endpoint.
 * Uses class-based OOP style with private helpers for hashing,
 * OTP generation, and database queries.
 *
 * @class AuthController
 * @author Coder-A (Auth Service Lead)
 */

import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import type { Request, Response } from "express";

import { db } from "../utils/database.js";
import { signToken, verifyToken } from "../utils/jwt.js";
import { EmailService } from "../services/EmailService.js";

export class AuthController {
    private emailService: EmailService;
    private googleClient: OAuth2Client;

    constructor() {
        this.emailService = new EmailService();
        this.googleClient = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);
        console.log("[AUTH-CTRL] ✅ AuthController initialised.");
    }

    // ─── Private Helpers ──────────────────────────────────────────────────────

    /** Generates a UUID v4. */
    private generateId(): string {
        return crypto.randomUUID();
    }

    /** Generates a 6-digit OTP string. */
    private generateOtp(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    /** SHA-256 hash with a static salt — suitable for demo, not prod. */
    private hashPassword(pw: string): string {
        return crypto
            .createHash("sha256")
            .update(pw + "lifeos-salt-v1")
            .digest("hex");
    }

    // ─── POST /api/auth/register ──────────────────────────────────────────────

    public async register(req: Request, res: Response): Promise<void> {
        const { name, email, password } = req.body;
        console.log(`[AUTH-CTRL] Register attempt for ${email}`);

        try {
            if (!name || !email || !password || password.length < 6) {
                res.status(400).json({ error: "Name, email, and password (6+ chars) required" });
                return;
            }

            const existing = await db.execute({ sql: "SELECT id FROM users WHERE email = ?", args: [email] });
            if (existing.rows.length > 0) {
                res.status(400).json({ error: "Email already registered" });
                return;
            }

            const id = this.generateId();
            const passwordHash = this.hashPassword(password);

            await db.execute({
                sql: "INSERT INTO users (id, name, email, password_hash, is_verified) VALUES (?, ?, ?, ?, 0)",
                args: [id, name, email, passwordHash],
            });
            await db.execute({
                sql: "INSERT INTO settings (id, user_id) VALUES (?, ?)",
                args: [this.generateId(), id],
            });

            const otp = this.generateOtp();
            const expiresAt = new Date(Date.now() + 10 * 60000).toISOString();

            await db.execute({
                sql: "INSERT INTO otps (id, email, otp_code, purpose, expires_at) VALUES (?, ?, ?, ?, ?)",
                args: [this.generateId(), email, otp, "registration", expiresAt],
            });

            await this.emailService.sendOtpEmail(email, otp, "registration");

            console.log(`[AUTH-CTRL] ✅ Registered user ${email}, OTP sent.`);
            res.json({ success: true, message: "Registration initiated. Check email for OTP." });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            console.error("[AUTH-CTRL] ❌ Register error:", message);
            res.status(500).json({ error: message });
        }
    }

    // ─── POST /api/auth/verify ────────────────────────────────────────────────

    public async verify(req: Request, res: Response): Promise<void> {
        const { email, otp } = req.body;
        console.log(`[AUTH-CTRL] OTP verification for ${email}`);

        try {
            const now = new Date().toISOString();
            const result = await db.execute({
                sql: "SELECT id FROM otps WHERE email = ? AND otp_code = ? AND purpose = 'registration' AND expires_at > ?",
                args: [email, otp, now],
            });

            if (result.rows.length === 0) {
                res.status(400).json({ error: "Invalid or expired OTP" });
                return;
            }

            await db.execute({ sql: "UPDATE users SET is_verified = 1 WHERE email = ?", args: [email] });
            await db.execute({ sql: "DELETE FROM otps WHERE id = ?", args: [result.rows[0].id] });

            const userResult = await db.execute({
                sql: "SELECT id, name, email FROM users WHERE email = ?",
                args: [email],
            });
            const verifiedUser = {
                id: userResult.rows[0].id as string,
                name: userResult.rows[0].name as string,
                email: userResult.rows[0].email as string,
            };
            const token = signToken(verifiedUser);

            console.log(`[AUTH-CTRL] ✅ User ${email} verified.`);
            res.json({ success: true, user: verifiedUser, token });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            console.error("[AUTH-CTRL] ❌ Verify error:", message);
            res.status(500).json({ error: message });
        }
    }

    // ─── POST /api/auth/login ─────────────────────────────────────────────────

    public async login(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;
        console.log(`[AUTH-CTRL] Login attempt for ${email}`);

        try {
            const passwordHash = this.hashPassword(password);
            const result = await db.execute({
                sql: "SELECT id, name, email, is_verified FROM users WHERE email = ? AND password_hash = ?",
                args: [email, passwordHash],
            });

            if (result.rows.length === 0) {
                res.status(401).json({ error: "Invalid email or password" });
                return;
            }

            const user = result.rows[0];

            if (!user.is_verified) {
                const otp = this.generateOtp();
                const expiresAt = new Date(Date.now() + 10 * 60000).toISOString();

                await db.execute({
                    sql: "INSERT INTO otps (id, email, otp_code, purpose, expires_at) VALUES (?, ?, ?, ?, ?)",
                    args: [this.generateId(), email, otp, "registration", expiresAt],
                });
                await this.emailService.sendOtpEmail(email, otp, "registration");

                res.status(403).json({ error: "Account not verified", requiresVerification: true });
                return;
            }

            const payload = {
                id: user.id as string,
                name: user.name as string,
                email: user.email as string,
            };
            const token = signToken(payload);

            console.log(`[AUTH-CTRL] ✅ User ${email} logged in.`);
            res.json({ success: true, user: payload, token });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            console.error("[AUTH-CTRL] ❌ Login error:", message);
            res.status(500).json({ error: message });
        }
    }

    // ─── POST /api/auth/forgot-password ───────────────────────────────────────

    public async forgotPassword(req: Request, res: Response): Promise<void> {
        const { email } = req.body;
        console.log(`[AUTH-CTRL] Forgot-password for ${email}`);

        try {
            const user = await db.execute({ sql: "SELECT id FROM users WHERE email = ?", args: [email] });

            if (user.rows.length > 0) {
                const otp = this.generateOtp();
                const expiresAt = new Date(Date.now() + 10 * 60000).toISOString();

                await db.execute({
                    sql: "INSERT INTO otps (id, email, otp_code, purpose, expires_at) VALUES (?, ?, ?, ?, ?)",
                    args: [this.generateId(), email, otp, "password_reset", expiresAt],
                });
                await this.emailService.sendOtpEmail(email, otp, "password_reset");
            }

            // Always return success to prevent email enumeration
            res.json({ success: true, message: "If an account exists, a reset code was sent." });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            console.error("[AUTH-CTRL] ❌ Forgot-password error:", message);
            res.status(500).json({ error: message });
        }
    }

    // ─── POST /api/auth/reset-password ────────────────────────────────────────

    public async resetPassword(req: Request, res: Response): Promise<void> {
        const { email, otp, newPassword } = req.body;
        console.log(`[AUTH-CTRL] Reset-password for ${email}`);

        try {
            if (!newPassword || newPassword.length < 6) {
                res.status(400).json({ error: "Password too short" });
                return;
            }

            const now = new Date().toISOString();
            const result = await db.execute({
                sql: "SELECT id FROM otps WHERE email = ? AND otp_code = ? AND purpose = 'password_reset' AND expires_at > ?",
                args: [email, otp, now],
            });

            if (result.rows.length === 0) {
                res.status(400).json({ error: "Invalid or expired reset code" });
                return;
            }

            await db.execute({
                sql: "UPDATE users SET password_hash = ? WHERE email = ?",
                args: [this.hashPassword(newPassword), email],
            });
            await db.execute({ sql: "DELETE FROM otps WHERE id = ?", args: [result.rows[0].id] });

            console.log(`[AUTH-CTRL] ✅ Password reset for ${email}.`);
            res.json({ success: true, message: "Password reset securely." });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            console.error("[AUTH-CTRL] ❌ Reset-password error:", message);
            res.status(500).json({ error: message });
        }
    }

    // ─── POST /api/auth/google ────────────────────────────────────────────────

    public async googleAuth(req: Request, res: Response): Promise<void> {
        const { credential } = req.body;
        console.log("[AUTH-CTRL] Google auth attempt");

        try {
            if (!credential) {
                res.status(400).json({ error: "No credential provided" });
                return;
            }

            const ticket = await this.googleClient.verifyIdToken({
                idToken: credential,
                audience: process.env.VITE_GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            if (!payload || !payload.email) {
                res.status(400).json({ error: "Invalid Google token" });
                return;
            }

            const email = payload.email;
            const name = payload.name || "Google User";

            const existing = await db.execute({
                sql: "SELECT id, name, email FROM users WHERE email = ?",
                args: [email],
            });

            if (existing.rows.length > 0) {
                await db.execute({ sql: "UPDATE users SET is_verified = 1 WHERE email = ?", args: [email] });

                const user = existing.rows[0];
                const gPayload = { id: user.id as string, name: user.name as string, email: user.email as string };
                const gToken = signToken(gPayload);

                console.log(`[AUTH-CTRL] ✅ Google login for existing user ${email}`);
                res.json({ success: true, user: gPayload, token: gToken });
                return;
            }

            // New user via Google
            const id = this.generateId();
            const passwordHash = this.hashPassword(crypto.randomBytes(32).toString("hex"));

            await db.execute({
                sql: "INSERT INTO users (id, name, email, password_hash, is_verified) VALUES (?, ?, ?, ?, 1)",
                args: [id, name, email, passwordHash],
            });
            await db.execute({
                sql: "INSERT INTO settings (id, user_id) VALUES (?, ?)",
                args: [this.generateId(), id],
            });

            const newGPayload = { id, name, email };
            const newGToken = signToken(newGPayload);

            console.log(`[AUTH-CTRL] ✅ New Google user registered: ${email}`);
            res.json({ success: true, user: newGPayload, token: newGToken });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            console.error("[AUTH-CTRL] ❌ Google auth error:", message);
            res.status(500).json({ error: message });
        }
    }

    // ─── GET /api/auth/me ─────────────────────────────────────────────────────

    public async me(req: Request, res: Response): Promise<void> {
        console.log("[AUTH-CTRL] /me token verification");

        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                res.status(401).json({ error: "No token provided" });
                return;
            }

            const decoded = verifyToken(authHeader.slice(7));
            if (!decoded) {
                res.status(401).json({ error: "Invalid or expired token" });
                return;
            }

            // Verify user still exists
            const meResult = await db.execute({
                sql: "SELECT id, name, email FROM users WHERE id = ?",
                args: [decoded.sub],
            });

            if (meResult.rows.length === 0) {
                res.status(401).json({ error: "User not found" });
                return;
            }

            const meUser = meResult.rows[0];
            res.json({
                success: true,
                user: { id: meUser.id, name: meUser.name, email: meUser.email },
            });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            console.error("[AUTH-CTRL] ❌ /me error:", message);
            res.status(500).json({ error: message });
        }
    }
}
