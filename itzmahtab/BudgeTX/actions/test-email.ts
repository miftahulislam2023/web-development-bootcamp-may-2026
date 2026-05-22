"use server";

import React from "react";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { Resend } from "resend";

function TestEmailTemplate({ userName, email }: { userName: string; email: string }) {
  return React.createElement(
    "div",
    { style: { fontFamily: "Arial, sans-serif", padding: "20px" } },
    React.createElement("h1", null, `Hi ${userName},`),
    React.createElement("p", null, "This is a test email from BudgeTX."),
    React.createElement("p", null, "If you received this, email sending is working correctly."),
    React.createElement("p", null, `Your email on file: ${email}`)
  );
}

export async function sendTestEmail() {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Not authenticated" };

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) return { success: false, error: "User not found in DB" };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { success: false, error: "RESEND_API_KEY not set" };

  const emailAddress = user.email;
  if (!emailAddress) return { success: false, error: "No email on user record" };

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: "BudgetX <onboarding@resend.dev>",
    to: emailAddress,
    subject: "Test Email from BudgeTX",
    react: TestEmailTemplate({ userName: user.name ?? "User", email: emailAddress }),
  });

  if (error) {
    console.error("Test email failed:", error);
    return { success: false, error: error.message };
  }

  return { success: true, email: emailAddress };
}
