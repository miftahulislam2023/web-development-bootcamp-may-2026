"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/permissions";

async function requireAdmin() {
  const session = await auth();
  if (!isAdmin(session)) {
    throw new Error("Forbidden");
  }
  return session;
}

const activeUserWhere = { deletedAt: null };

export async function adminOverviewStats() {
  try {
    await requireAdmin();
    const [userCount, activeUsers, revenueAgg, purchaseCount, templateCount, premiumUsers] = await Promise.all([
      prisma.user.count({ where: activeUserWhere }),
      prisma.user.count({ where: { ...activeUserWhere, blockedAt: null } }),
      prisma.templatePurchase.aggregate({
        where: { status: "succeeded" },
        _sum: { amountCents: true },
      }),
      prisma.templatePurchase.count({ where: { status: "succeeded" } }),
      prisma.template.count(),
      prisma.templatePurchase.groupBy({
        by: ["userId"],
        where: { status: "succeeded" },
      }),
    ]);

    return {
      userCount,
      activeUsers,
      revenueCents: revenueAgg._sum.amountCents ?? 0,
      purchasesSucceeded: purchaseCount,
      templateCount,
      premiumUsers: premiumUsers.length,
    };
  } catch {
    return {
      userCount: 0,
      activeUsers: 0,
      revenueCents: 0,
      purchasesSucceeded: 0,
      templateCount: 0,
      premiumUsers: 0,
    };
  }
}

export async function adminRecentUsers() {
  try {
    await requireAdmin();
    return prisma.user.findMany({
      where: activeUserWhere,
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });
  } catch {
    return [];
  }
}

export async function adminRecentPurchases() {
  try {
    await requireAdmin();
    return prisma.templatePurchase.findMany({
      where: { status: "succeeded" },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        user: { select: { name: true, email: true } },
        template: { select: { name: true } },
      },
    });
  } catch {
    return [];
  }
}

export async function adminPurchaseSeries() {
  try {
    await requireAdmin();
    const since = new Date(Date.now() - 30 * 86400000);
    const rows = await prisma.templatePurchase.findMany({
      where: { status: "succeeded", createdAt: { gte: since } },
      select: { createdAt: true, amountCents: true },
    });
    const map = {};
    for (const r of rows) {
      const d = r.createdAt.toISOString().slice(0, 10);
      map[d] = (map[d] || 0) + (r.amountCents || 0);
    }
    return Object.keys(map)
      .sort()
      .map((date) => ({ date, total: (map[date] || 0) / 100 }));
  } catch {
    return [];
  }
}

export async function adminUserGrowthSeries() {
  try {
    await requireAdmin();
    const since = new Date(Date.now() - 30 * 86400000);
    const users = await prisma.user.findMany({
      where: { createdAt: { gte: since }, ...activeUserWhere },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    });
    const map = {};
    for (const u of users) {
      const d = u.createdAt.toISOString().slice(0, 10);
      map[d] = (map[d] || 0) + 1;
    }
    return Object.keys(map)
      .sort()
      .map((date) => ({ date, count: map[date] }));
  } catch {
    return [];
  }
}

export async function adminPurchaseDistribution() {
  try {
    await requireAdmin();
    const rows = await prisma.templatePurchase.groupBy({
      by: ["status"],
      _count: { _all: true },
    });
    return rows.map((r) => ({ status: r.status, count: r._count._all }));
  } catch {
    return [];
  }
}

export async function adminTemplateUsageStats() {
  try {
    await requireAdmin();
    const purchases = await prisma.templatePurchase.groupBy({
      by: ["templateId"],
      where: { status: "succeeded" },
      _count: { _all: true },
    });
    const templateIds = purchases.map((p) => p.templateId);
    const templates = await prisma.template.findMany({
      where: { id: { in: templateIds } },
      select: { id: true, name: true },
    });
    const nameById = Object.fromEntries(templates.map((t) => [t.id, t.name]));
    return purchases
      .map((p) => ({
        name: nameById[p.templateId] || "Unknown",
        count: p._count._all,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  } catch {
    return [];
  }
}

export async function adminListUsers() {
  try {
    await requireAdmin();
    return prisma.user.findMany({
      where: activeUserWhere,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        blockedAt: true,
        createdAt: true,
      },
    });
  } catch {
    return [];
  }
}

export async function adminCreateUser({ name, email, password, role = "user" }) {
  try {
    await requireAdmin();
    const normalized = email.toLowerCase().trim();
    if (!normalized || !password || password.length < 8) {
      return { ok: false, error: "Valid email and password (8+ chars) required" };
    }
    if (role !== "admin" && role !== "user") {
      return { ok: false, error: "Invalid role" };
    }

    const existing = await prisma.user.findUnique({ where: { email: normalized } });
    if (existing && !existing.deletedAt) {
      return { ok: false, error: "Email already registered" };
    }

    const hashed = await bcrypt.hash(password, 12);
    if (existing?.deletedAt) {
      await prisma.user.update({
        where: { id: existing.id },
        data: {
          name: name?.trim() || null,
          password: hashed,
          role,
          deletedAt: null,
          blockedAt: null,
        },
      });
    } else {
      await prisma.user.create({
        data: {
          name: name?.trim() || null,
          email: normalized,
          password: hashed,
          role,
        },
      });
    }

    revalidatePath("/admin/users");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Create failed" };
  }
}

export async function adminSetUserBlocked(userId, blocked) {
  try {
    await requireAdmin();
    await prisma.user.update({
      where: { id: userId },
      data: { blockedAt: blocked ? new Date() : null },
    });
    revalidatePath("/admin/users");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Update failed" };
  }
}

export async function adminSetUserRole(userId, role) {
  try {
    await requireAdmin();
    if (role !== "admin" && role !== "user") return { ok: false, error: "Invalid role" };
    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });
    revalidatePath("/admin/users");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Update failed" };
  }
}

export async function adminSoftDeleteUser(userId) {
  try {
    const session = await requireAdmin();
    if (userId === session.user.id) {
      return { ok: false, error: "Cannot delete your own account" };
    }
    await prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date(), blockedAt: new Date() },
    });
    revalidatePath("/admin/users");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Delete failed" };
  }
}

export async function adminListPurchases() {
  try {
    await requireAdmin();
    return prisma.templatePurchase.findMany({
      where: { status: "succeeded" },
      orderBy: { createdAt: "desc" },
      take: 200,
      include: {
        user: { select: { email: true, id: true, name: true } },
        template: { select: { name: true, slug: true } },
      },
    });
  } catch {
    return [];
  }
}

export async function adminListTemplates() {
  try {
    await requireAdmin();
    return prisma.template.findMany({ orderBy: { updatedAt: "desc" } });
  } catch {
    return [];
  }
}

export async function adminUpsertTemplate(payload) {
  try {
    await requireAdmin();
    const {
      id,
      name,
      slug,
      description,
      category,
      thumbnail,
      isPremium,
      priceCents,
      canvasData,
    } = payload;
    if (!name?.trim() || !slug?.trim()) return { ok: false, error: "Name and slug required" };

    if (id) {
      await prisma.template.update({
        where: { id },
        data: {
          name: name.trim(),
          slug: slug.trim().toLowerCase(),
          description: description?.trim() || null,
          category: category?.trim() || null,
          thumbnail: thumbnail?.trim() || null,
          isPremium: Boolean(isPremium),
          priceCents: Math.max(0, Number(priceCents) || 0),
          canvasData: canvasData || {},
        },
      });
    } else {
      await prisma.template.create({
        data: {
          name: name.trim(),
          slug: slug.trim().toLowerCase(),
          description: description?.trim() || null,
          category: category?.trim() || null,
          thumbnail: thumbnail?.trim() || null,
          isPremium: Boolean(isPremium),
          priceCents: Math.max(0, Number(priceCents) || 0),
          canvasData: canvasData || { version: 1, sections: [] },
        },
      });
    }
    revalidatePath("/admin/templates");
    revalidatePath("/dashboard/templates");
    revalidatePath("/templates");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Save failed" };
  }
}

export async function adminDeleteTemplate(id) {
  try {
    await requireAdmin();
    await prisma.template.delete({ where: { id } });
    revalidatePath("/admin/templates");
    revalidatePath("/templates");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Delete failed" };
  }
}
