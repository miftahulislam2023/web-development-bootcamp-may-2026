import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { Resend } from "resend";

import dotenv from "dotenv";
import path from "path";

const __dirname = path.resolve();

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

let resend;

const getResend = () => {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set in .env file");
    }
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
};

export const sendResetEmail = async (email, resetLink) => {
  const client = getResend();
  await client.emails.send({
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_EMAIL}>`,
    to: email,
    subject: "Reset your fylestash password",
    html: `
      <div style="font-family: sans-serif; background: #000; color: #fff; padding: 40px; text-align: center;">
        <h1 style="letter-spacing: -0.05em;">fylestash</h1>
        <p style="color: #a1a1aa; margin-bottom: 24px;">You requested a password reset. Click the button below to reset your password.</p>
        <a href="${resetLink}" style="display: inline-block; background: #fff; color: #000; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: bold; margin-top: 20px;">Reset Password</a>
        <p style="margin-top: 30px; font-size: 12px; color: #52525b;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
};

