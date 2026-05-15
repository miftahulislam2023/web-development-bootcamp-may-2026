const nodemailer = require("nodemailer");

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "loaded" : "MISSING");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

const sendOtpEmail = async (toEmail, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"FinanceHub" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Your FinanceHub verification code",
      html: `
        <div style="font-family:'Segoe UI',sans-serif;max-width:480px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          
          <div style="background:linear-gradient(135deg,#4f46e5,#6366f1);padding:32px 40px;">
            <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">
              FinanceHub
            </h1>
          </div>

          <div style="padding:36px 40px;">
            <h2>Verify your email address</h2>

            <div style="background:#f5f3ff;padding:24px;text-align:center;">
              <div style="font-size:42px;font-weight:800;">
                ${otp}
              </div>
            </div>
          </div>
        </div>
      `,
    });

    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Email send error:", error.message);
  }
};

module.exports = { sendOtpEmail };
