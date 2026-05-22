import crypto from "crypto";
import {
  getCloudName,
  getUploadPreset,
  isCloudinaryUploadReady,
  parseCloudinaryUrl,
} from "@/lib/cloudinary-config";

export {
  getCloudName,
  getUploadPreset,
  isCloudinaryUploadReady,
  parseCloudinaryUrl,
} from "@/lib/cloudinary-config";

export function isCloudinaryConfigured() {
  return isCloudinaryUploadReady();
}

function mimeFromFilename(filename, fallback = "image/jpeg") {
  const ext = filename?.split(".").pop()?.toLowerCase();
  const map = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    svg: "image/svg+xml",
    avif: "image/avif",
  };
  return map[ext] || fallback;
}

function buildSignedParams({ folder, timestamp, apiSecret }) {
  const params = { folder, timestamp };
  const signature = crypto
    .createHash("sha1")
    .update(
      Object.keys(params)
        .sort()
        .map((k) => `${k}=${params[k]}`)
        .join("&") + apiSecret,
    )
    .digest("hex");
  return { signature, params };
}

/**
 * Server-side upload to Cloudinary (unsigned preset or signed API).
 */
export async function uploadImageBuffer(
  buffer,
  { folder = "nexora", filename = "upload.jpg", mimeType } = {},
) {
  if (!isCloudinaryUploadReady()) {
    throw new Error(
      "Cloudinary is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env",
    );
  }

  const cloudName = getCloudName();
  const preset = getUploadPreset();
  const cfg = parseCloudinaryUrl();
  const mime = mimeType || mimeFromFilename(filename);
  const base64 = `data:${mime};base64,${buffer.toString("base64")}`;

  const body = new FormData();
  body.append("file", base64);

  if (preset) {
    body.append("upload_preset", preset);
    if (folder) body.append("folder", folder);
  } else if (cfg?.apiKey && cfg?.apiSecret) {
    const timestamp = Math.floor(Date.now() / 1000);
    const { signature } = buildSignedParams({
      folder,
      timestamp,
      apiSecret: cfg.apiSecret,
    });
    body.append("api_key", cfg.apiKey);
    body.append("timestamp", String(timestamp));
    body.append("signature", signature);
    body.append("folder", folder);
  } else {
    throw new Error("Cloudinary upload preset or API credentials required");
  }

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body },
  );
  const data = await res.json();

  if (!res.ok) {
    const hint =
      data.error?.message?.includes("upload preset")
        ? ` Check that upload preset "${preset}" exists and is set to Unsigned in Cloudinary.`
        : "";
    throw new Error((data.error?.message || "Upload failed") + hint);
  }

  return {
    url: data.secure_url,
    publicId: data.public_id,
    width: data.width,
    height: data.height,
    bytes: data.bytes,
  };
}

/** Remove asset from Cloudinary (requires signed CLOUDINARY_URL). */
export async function deleteCloudinaryImage(publicId) {
  const cfg = parseCloudinaryUrl();
  if (!cfg?.apiKey || !cfg?.apiSecret || !publicId) return { ok: false };

  const timestamp = Math.floor(Date.now() / 1000);
  const toSign = `public_id=${publicId}&timestamp=${timestamp}${cfg.apiSecret}`;
  const signature = crypto.createHash("sha1").update(toSign).digest("hex");

  const body = new FormData();
  body.append("public_id", publicId);
  body.append("api_key", cfg.apiKey);
  body.append("timestamp", String(timestamp));
  body.append("signature", signature);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cfg.cloudName}/image/destroy`,
    { method: "POST", body },
  );
  const data = await res.json();
  return { ok: res.ok, data };
}
