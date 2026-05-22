"use client";

import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

const normalizeApiBase = (baseUrl) => {
  if (!baseUrl) return "http://localhost:5001/api";
  const trimmed = baseUrl.replace(/\/$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
};

const API_BASE = normalizeApiBase(process.env.NEXT_PUBLIC_API_URL);
const UPLOADTHING_URL = `${API_BASE}/uploadthing`;

export const UploadButton = generateUploadButton({ url: UPLOADTHING_URL });
export const UploadDropzone = generateUploadDropzone({ url: UPLOADTHING_URL });
