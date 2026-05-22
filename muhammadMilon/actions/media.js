"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  uploadImageBuffer,
  deleteCloudinaryImage,
  isCloudinaryConfigured,
} from "@/lib/cloudinary-server";

export async function uploadMediaAsset(formData) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };

  const file = formData.get("file");
  const projectId = formData.get("projectId")?.toString() || null;
  const folder = formData.get("folder")?.toString() || "general";
  const altText = formData.get("altText")?.toString() || null;

  if (!file || typeof file === "string") {
    return { ok: false, error: "No file provided" };
  }

  if (projectId) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: session.user.id },
    });
    if (!project) return { ok: false, error: "Project not found" };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = file.name || "upload.jpg";
  const mimeType = file.type || "image/jpeg";

  let url;
  let publicId = null;
  let sizeBytes = buffer.length;

  if (!isCloudinaryConfigured()) {
    if (process.env.NODE_ENV === "production") {
      return {
        ok: false,
        error:
          "Cloudinary is not configured. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to .env",
      };
    }
    url = `data:${mimeType};base64,${buffer.toString("base64")}`;
  } else {
    try {
      const uploaded = await uploadImageBuffer(buffer, {
        folder: `nexora/${session.user.id}/${folder}`,
        filename,
        mimeType,
      });
      url = uploaded.url;
      publicId = uploaded.publicId;
      sizeBytes = uploaded.bytes || sizeBytes;
    } catch (e) {
      if (process.env.NODE_ENV !== "production") {
        url = `data:${mimeType};base64,${buffer.toString("base64")}`;
      } else {
        return { ok: false, error: e.message || "Upload failed" };
      }
    }
  }

  const asset = await prisma.mediaAsset.create({
    data: {
      userId: session.user.id,
      projectId,
      folder,
      filename,
      url,
      publicId,
      mimeType,
      sizeBytes,
      altText,
    },
  });

  if (projectId) {
    const p = await prisma.project.findUnique({
      where: { id: projectId },
      select: { slug: true },
    });
    if (p?.slug) revalidatePath(`/dashboard/projects/${p.slug}/builder`);
  }

  return { ok: true, asset };
}

/** Register an asset already uploaded from the browser (unsigned preset). */
export async function registerMediaAsset({ projectId, folder, filename, url, publicId, mimeType, sizeBytes, altText }) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };

  if (projectId) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: session.user.id },
    });
    if (!project) return { ok: false, error: "Project not found" };
  }

  const asset = await prisma.mediaAsset.create({
    data: {
      userId: session.user.id,
      projectId: projectId || null,
      folder: folder || "general",
      filename: filename || "upload",
      url,
      publicId: publicId || null,
      mimeType: mimeType || "image/jpeg",
      sizeBytes: sizeBytes || 0,
      altText: altText || null,
    },
  });

  if (projectId) {
    const p = await prisma.project.findUnique({
      where: { id: projectId },
      select: { slug: true },
    });
    if (p?.slug) revalidatePath(`/dashboard/projects/${p.slug}/builder`);
  }

  return { ok: true, asset };
}

export async function listMediaAssets(projectId, { folder = null, q = "" } = {}) {
  const session = await auth();
  if (!session?.user?.id) return [];

  const where = {
    userId: session.user.id,
    ...(projectId ? { projectId } : {}),
    ...(folder ? { folder } : {}),
    ...(q
      ? {
          OR: [
            { filename: { contains: q, mode: "insensitive" } },
            { altText: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  return prisma.mediaAsset.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function deleteMediaAsset(assetId) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };

  const asset = await prisma.mediaAsset.findFirst({
    where: { id: assetId, userId: session.user.id },
  });
  if (!asset) return { ok: false, error: "Not found" };

  if (asset.publicId) {
    await deleteCloudinaryImage(asset.publicId).catch(() => null);
  }

  await prisma.mediaAsset.delete({ where: { id: assetId } });
  return { ok: true };
}

export async function updateMediaAsset(assetId, data) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };

  const asset = await prisma.mediaAsset.findFirst({
    where: { id: assetId, userId: session.user.id },
  });
  if (!asset) return { ok: false, error: "Not found" };

  const updated = await prisma.mediaAsset.update({
    where: { id: assetId },
    data: {
      altText: data.altText?.trim() || null,
      folder: data.folder?.trim() || asset.folder,
    },
  });
  return { ok: true, asset: updated };
}

export async function getCloudinaryStatus() {
  return {
    configured: isCloudinaryConfigured(),
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || null,
    preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || null,
  };
}
