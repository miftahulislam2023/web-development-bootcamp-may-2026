import { OTP_EXPIRY_MINUTES } from '@/utils/otp';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function passwordResetEmailHtml(name: string, otp: string): string {
  const safeName = escapeHtml(name);
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2>Password Reset Request</h2>
      <p>Hi ${safeName},</p>
      <p>Use the following code to reset your password:</p>
      <div style="background: #f4f4f5; padding: 16px; text-align: center; border-radius: 8px; margin: 24px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px;">${otp}</span>
      </div>
      <p>This code expires in <strong>${OTP_EXPIRY_MINUTES} minutes</strong>.</p>
      <p style="color: #71717a; font-size: 14px;">If you did not request this, please ignore this email.</p>
    </div>
  `;
}
