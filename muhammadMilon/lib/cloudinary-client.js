"use client";

/**
 * Direct browser upload to Cloudinary (unsigned preset).
 * Uses NEXT_PUBLIC_* env vars inlined at build time.
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export function isClientCloudinaryReady() {
  return Boolean(CLOUD_NAME && UPLOAD_PRESET);
}

export async function uploadFileToCloudinary(file, { folder } = {}) {
  if (!isClientCloudinaryReady()) {
    throw new Error("Cloudinary is not configured in the browser");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  if (folder) formData.append("folder", folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData },
  );
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || "Upload failed");
  }

  return {
    url: data.secure_url,
    publicId: data.public_id,
    width: data.width,
    height: data.height,
    bytes: data.bytes,
  };
}
