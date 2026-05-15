// server/src/utils/emailService.js

const nodemailer = require("nodemailer");

/**
 * Create transporter lazily (called at send time, not at startup).
 * This way if env vars are missing we get a clear error immediately
 * instead of a silent broken transporter created at boot.
 */
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error(
      "Email not configured. Add EMAIL_USER and EMAIL_PASS to your Render environment variables.",
    );
  }

  return nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Gmail App Password (16 chars)
    },
    // 10 second connection timeout — prevents 2-minute hangs
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });
};

const sendOtpEmail = async (toEmail, otp) => {
  // This will throw immediately if env vars are missing
  const transporter = createTransporter();

  const mailOptions = {
    from: `"FinanceHub" <${process.env.EMAIL_USER}>`,
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
  };

  // ✅ Now THROWS on failure instead of silently swallowing the error
  // This means authController gets the real error and returns it to frontend fast
  const info = await transporter.sendMail(mailOptions);
  console.log("✅ OTP email sent to:", toEmail, "| Response:", info.response);
};

module.exports = { sendOtpEmail };
