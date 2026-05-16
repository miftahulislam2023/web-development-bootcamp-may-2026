import nodemailer from 'nodemailer';
import { env } from '@/config/env';
import { logger } from '@/utils/logger';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const SMTPS_PORT = 465;

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === SMTPS_PORT,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@');
  if (!localPart || !domain) return '***';
  const visibleChars = Math.min(2, localPart.length);
  return `${localPart.slice(0, visibleChars)}***@${domain}`;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    await transporter.sendMail({
      from: env.SMTP_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    logger.info({ to: maskEmail(options.to), subject: options.subject }, '[Mailer] Email sent successfully');
  } catch (error) {
    logger.error({ error, to: options.to }, '[Mailer] Failed to send email');
    throw error;
  }
}
