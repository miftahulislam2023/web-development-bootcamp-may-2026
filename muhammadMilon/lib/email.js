import nodemailer from "nodemailer";

/**
 * Sends transactional email using Nodemailer (Gmail SMTP).
 * Falls back to console logs in development if EMAIL_PASS is not set.
 */
export async function sendEmail({ to, subject, html, text }) {
  const user = process.env.EMAIL_USER?.trim();
  const pass = process.env.EMAIL_PASS?.trim();
  const from = process.env.EMAIL_FROM?.trim() || "Nexora Studio <noreply@nexora-studio.com>";

  console.log("[email] Checking credentials:", { 
    hasUser: !!user, 
    hasPass: !!pass, 
    user: user 
  });

  if (user && pass) {
    try {
      console.log(`[email] Sending real email via SMTP to: ${to}`);
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: user,
          pass: pass,
        },
      });

      await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html,
      });

      return { ok: true };
    } catch (error) {
      console.error("[email] Nodemailer error:", error);
      return { ok: false, error: "Failed to send email via SMTP" };
    }
  }

  if (process.env.NODE_ENV === "production") {
    console.warn("[email] EMAIL_PASS not set — email not sent:", { to, subject });
    return { ok: false, error: "Email service not configured" };
  }

  console.log("\n[nexora] ── Dev email (Nodemailer fallback) ──");
  console.log("To:", to);
  console.log("Subject:", subject);
  console.log("From:", from);
  console.log(text || html);
  console.log("────────────────────────────────────────\n");
  return { ok: true, dev: true };
}

export function appOrigin() {
  return (
    process.env.AUTH_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}
