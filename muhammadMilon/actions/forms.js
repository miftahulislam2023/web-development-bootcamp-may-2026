"use server";

import { createHash } from "crypto";
import prisma from "@/lib/prisma";
import { sendEmail, appOrigin } from "@/lib/email";

export async function submitContactForm({ subdomain, data, honeypot = "" }) {
  if (honeypot) {
    return { ok: true };
  }

  const site = await prisma.publishedWebsite.findUnique({
    where: { subdomain, isActive: true },
    include: {
      project: {
        include: {
          user: { select: { email: true } },
        },
      },
    },
  });
  if (!site) {
    return { ok: false, error: "Site not found" };
  }

  const submission = await prisma.formSubmission.create({
    data: {
      projectId: site.projectId,
      subdomain,
      data,
      ipHash: data._ip ? createHash("sha256").update(String(data._ip)).digest("hex") : null,
    },
  });

  const notifyEmail = data._notifyEmail || site.project?.user?.email || null;
  if (notifyEmail && process.env.RESEND_API_KEY) {
    const rows = Object.entries(data)
      .filter(([k]) => !k.startsWith("_"))
      .map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${String(v)}</td></tr>`)
      .join("");
    await sendEmail({
      to: notifyEmail,
      subject: `New form submission — ${site.project.name}`,
      html: `<p>New message from ${appOrigin()}/p/${subdomain}</p><table>${rows}</table>`,
    });
  }

  return { ok: true, id: submission.id };
}

export async function listFormSubmissions(projectId) {
  const { auth } = await import("@/lib/auth");
  const session = await auth();
  if (!session?.user?.id) return [];

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: session.user.id },
  });
  if (!project) return [];

  return prisma.formSubmission.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}
