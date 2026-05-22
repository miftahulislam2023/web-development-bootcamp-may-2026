import prisma from "@/lib/prisma";

function activityDelegate() {
  return typeof prisma.projectActivity?.create === "function"
    ? prisma.projectActivity
    : null;
}

export async function logProjectActivity(userId, action, { projectId = null, detail = null } = {}) {
  const delegate = activityDelegate();
  if (!delegate) return;

  try {
    await delegate.create({
      data: { userId, projectId, action, detail },
    });
  } catch (e) {
    console.error("[activity]", e);
  }
}
