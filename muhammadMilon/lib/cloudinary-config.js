/**
 * Shared Cloudinary configuration (safe for server + client).
 */

const PLACEHOLDER_SECRETS = ["YOUR_API_SECRET", "API_SECRET", "xxx"];

export function getCloudName() {
  const fromUrl = parseCloudinaryUrl()?.cloudName;
  return (
    fromUrl ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim() ||
    null
  );
}

export function getUploadPreset() {
  return (
    process.env.CLOUDINARY_UPLOAD_PRESET?.trim() ||
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim() ||
    null
  );
}

export function parseCloudinaryUrl() {
  const url = process.env.CLOUDINARY_URL?.trim();
  if (!url) return null;

  const secretLooksPlaceholder = PLACEHOLDER_SECRETS.some((p) =>
    url.includes(p),
  );
  if (secretLooksPlaceholder) return null;

  try {
    const parsed = new URL(url);
    const apiKey = decodeURIComponent(parsed.username || "");
    const apiSecret = decodeURIComponent(parsed.password || "");
    const cloudName = parsed.hostname;

    if (!apiKey || !apiSecret || !cloudName) return null;

    return { cloudName, apiKey, apiSecret };
  } catch {
    return null;
  }
}

/** Unsigned preset + cloud name is enough for uploads */
export function isCloudinaryUploadReady() {
  return Boolean(getCloudName() && getUploadPreset());
}

/** Signed admin API (delete, etc.) needs CLOUDINARY_URL with real secret */
export function isCloudinaryAdminReady() {
  return Boolean(parseCloudinaryUrl());
}

export function getCloudinaryUploadUrl() {
  const cloudName = getCloudName();
  if (!cloudName) return null;
  return `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
}
