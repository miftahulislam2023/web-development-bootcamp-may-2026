/**
 * EmailService — Transactional email delivery via SMTP
 *
 * Encapsulates Nodemailer configuration and provides high-level
 * methods for sending OTP verification and password-reset emails.
 *
 * @class EmailService
 * @author Coder-A (Auth Service Lead)
 */

import nodemailer, { type Transporter } from "nodemailer";

type OtpPurpose = "registration" | "password_reset";

export class EmailService {
    private transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.VITE_SMTP_HOST || "smtp.gmail.com",
            port: parseInt(process.env.VITE_SMTP_PORT || "587", 10),
            secure: process.env.VITE_SMTP_SECURE === "true",
            auth: {
                user: process.env.VITE_SMTP_USER || "",
                pass: process.env.VITE_SMTP_PASS || "",
            },
        });

        console.log("[AUTH-EMAIL] ✅ SMTP transporter created.");
    }

    /**
     * Sends an OTP email to the specified address.
     *
     * @param to       Recipient email address.
     * @param otp      The 6-digit OTP code.
     * @param purpose  Either "registration" or "password_reset".
     */
    public async sendOtpEmail(
        to: string,
        otp: string,
        purpose: OtpPurpose
    ): Promise<void> {
        const subject =
            purpose === "registration"
                ? "Welcome to LifeSolver.app - Verify Your Email"
                : "LifeSolver.app - Password Reset Request";

        const bodyText =
            purpose === "registration"
                ? "Thank you for registering!"
                : "Password reset request received.";

        try {
            await this.transporter.sendMail({
                from: `"LifeSolver.app" <${process.env.VITE_SMTP_USER || "noreply@lifesolver.app"}>`,
                to,
                subject,
                html: this.buildOtpHtml(otp, bodyText),
            });
            console.log(`[AUTH-EMAIL] ✅ OTP email sent to ${to} (${purpose})`);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            console.error(`[AUTH-EMAIL] ❌ Failed to send OTP to ${to}:`, message);
        }
    }

    /**
     * Builds the HTML body for OTP emails.
     */
    private buildOtpHtml(otp: string, bodyText: string): string {
        return `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #eee;border-radius:10px">
                <h2 style="color:#0c4a6e">LifeSolver.app</h2>
                <p>${bodyText}</p>
                <div style="background:#f0fdf4;border:1px solid #bbf7d0;padding:15px;border-radius:8px;text-align:center;margin:20px 0">
                    <p style="margin:0;font-size:14px;color:#166534">Your code is</p>
                    <h1 style="margin:10px 0 0;font-size:32px;letter-spacing:5px;color:#166534">${otp}</h1>
                </div>
                <p style="color:#64748b;font-size:12px">Expires in 10 minutes.</p>
            </div>`;
    }
}
