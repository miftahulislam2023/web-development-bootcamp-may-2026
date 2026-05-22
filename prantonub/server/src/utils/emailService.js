// server/src/utils/emailService.js
// Using Brevo (Sendinblue) SMTP — works on Render, sends to any email

const nodemailer = require("nodemailer");

const sendOtpEmail = async (toEmail, otp) => {
  if (!process.env.BREVO_USER || !process.env.BREVO_PASS) {
    throw new Error(
      "Email not configured. Add BREVO_USER and BREVO_PASS to your Render environment variables.",
    );
  }

  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.BREVO_USER,
      pass: process.env.BREVO_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  // ✅ FIX: nodemailer.sendMail() does NOT return { error }.
  // It either resolves with info or THROWS an error.
  // The old code { error } was always undefined — real failures were silently swallowed.
  try {
    const info = await transporter.sendMail({
      from: `"FinanceHub" <${process.env.BREVO_USER}>`,
      to: toEmail,
      subject: "Your FinanceHub Verification Code",
      html: `
        <div style="font-family:'Segoe UI',sans-serif;max-width:480px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <div style="background:linear-gradient(135deg,#4f46e5,#6366f1);padding:32px 40px;">
            <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">FinanceHub</h1>
            <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Personal Expense Tracker</p>
          </div>

          <div style="padding:36px 40px;">
            <h2 style="margin:0 0 8px;color:#111827;font-size:20px;">Verify your email address</h2>
            <p style="margin:0 0 24px;color:#6b7280;font-size:14px;">
              Enter this 6-digit code to complete your registration.
              This code expires in <strong>10 minutes</strong>.
            </p>

            <div style="background:#f5f3ff;border:2px solid #e0e7ff;border-radius:12px;padding:28px;text-align:center;margin-bottom:24px;">
              <p style="margin:0 0 8px;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;font-weight:600;">
                Verification Code
              </p>
              <div style="font-size:48px;font-weight:800;color:#4f46e5;letter-spacing:0.15em;">
                ${otp}
              </div>
            </div>

            <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center;">
              If you didn't request this, you can safely ignore this email.<br/>
              This code will expire in 10 minutes.
            </p>
          </div>

          <div style="background:#f9fafb;padding:16px 40px;border-top:1px solid #f3f4f6;">
            <p style="margin:0;color:#9ca3af;font-size:11px;text-align:center;">
              © 2026 FinanceHub · This is an automated email, please do not reply.
            </p>
          </div>
        </div>
      `,
    });

    console.log(
      "✅ OTP email sent to:",
      toEmail,
      "| Message ID:",
      info.messageId,
    );
  } catch (err) {
    console.error("❌ Brevo email error:", err.message);
    throw new Error(err.message || "Failed to send verification email");
  }
};

module.exports = { sendOtpEmail };
