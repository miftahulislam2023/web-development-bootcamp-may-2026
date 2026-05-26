// src/utils/sendEmail.ts
// import nodemailer from "nodemailer";

// interface EmailOptions {
//   to: string;
//   subject: string;
//   html: string;
// }

// export const sendEmail = async (options: EmailOptions): Promise<void> => {
//   const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: Number(process.env.SMTP_PORT),
//     secure: false,
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS,
//     },
//       connectionTimeout: 10000,
//   greetingTimeout: 10000,
//   });

//   await transporter.sendMail({
//     from: `"LiveChat" <${process.env.SMTP_USER}>`,
//     to: options.to,
//     subject: options.subject,
//     html: options.html,
//   });
// };


// src/utils/sendEmail.ts
// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// interface EmailOptions {
//   to: string;
//   subject: string;
//   html: string;
// }

// export const sendEmail = async (options: EmailOptions): Promise<void> => {
//   await resend.emails.send({
//     from: "LiveChat <onboarding@resend.dev>",
//     to: options.to,
//     subject: options.subject,
//     html: options.html,
//   });
// };


import { BrevoClient } from "@getbrevo/brevo";

const client = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY as string,
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  await client.transactionalEmails.sendTransacEmail({
    to: [{ email: options.to }],
    subject: options.subject,
    htmlContent: options.html,
    sender: {
      name: "LiveChat",
      email: process.env.BREVO_SENDER_EMAIL as string,
    },
  });
};