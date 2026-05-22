import { createUploadthing } from "uploadthing/express";
import { UTApi, UploadThingError } from "uploadthing/server";
import jwt from "jsonwebtoken";

const f = createUploadthing();

import { prisma } from "../database/db.js";
import { JWT_SECRET } from "../middleware/jwt.js";

const uploadthingApiKey = process.env.UPLOADTHING_SECRET;
if (!uploadthingApiKey) {
  console.warn("UPLOADTHING_SECRET is not set. UTApi operations will fail.");
}
const utapi = uploadthingApiKey
  ? new UTApi({ apiKey: uploadthingApiKey })
  : new UTApi();

const getHeaderValue = (req, key) => {
  const value = req.headers?.[key];
  if (!value) return null;
  if (Array.isArray(value)) return value[0];
  return value;
};

const getTokenFromRequest = (req) => {
  const authHeader =
    getHeaderValue(req, "authorization") ||
    getHeaderValue(req, "Authorization");
  if (!authHeader) return null;
  const [, token] = authHeader.split(" ");
  return token || null;
};

export default {
  fileUploader: f({
    // we could also specify minFileCount but I guess that's not necessary rn
    image: { maxFileSize: "2MB", maxFileCount: 1 },
    video: { maxFileSize: "32MB", maxFileCount: 1 },
    text: { maxFileSize: "100KB", maxFileCount: 1 },
    pdf: { maxFileSize: "6MB", maxFileCount: 1 },
    audio: { maxFileSize: "8MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      const token = getTokenFromRequest(req);
      if (!token) {
        throw new UploadThingError("Unauthorized");
      }

      let decoded;

      try {
        decoded = jwt.verify(token, JWT_SECRET);
      } catch (error) {
        throw new UploadThingError("Unauthorized");
      }
      const folderHeader = getHeaderValue(req, "x-folder-id");
      const folderId = folderHeader ? folderHeader.toString() : null;

      return {
        userId: decoded.id,
        folderId: folderId || null,
      };
    })
    .onUploadComplete(
      // this acts as a webhook that prompts the ORM to store the metadata
      // in the database as per our schema design

      async ({ metadata, file }) => {
        console.log("Upload completed", file);
        console.log("Upload metadata", {
          userId: metadata?.userId,
          folderId: metadata?.folderId ?? null,
        });

        try {
          await prisma.file.create({
            data: {
              name: file.name,
              fileKey: file.key,
              url: file.url,
              size: file.size,
              type: file.type,
              ownerId: metadata.userId,
              folderId: metadata.folderId || null,
            },
          });
        } catch (error) {
          console.log("File upload failed", {
            message: error?.message,
            code: error?.code,
            meta: error?.meta,
          });
          throw new Error("Failed to save file to database");
        }
      },
    ),
};

export const deleteFileFromUploadThing = async (fileKeys) => {
  try {
    const keys = Array.isArray(fileKeys) ? fileKeys : [fileKeys];
    await utapi.deleteFiles(keys);
    console.log("Files deleted from UploadThing:", keys);
  } catch (error) {
    console.log("Failed to delete files from UploadThing:", error);
    throw new Error("Failed to delete files from UploadThing");
  }
};

export const renameFileInUploadThing = async ({ key, newName }) => {
  try {
    const renameFile = await utapi.renameFiles([
      { fileKey: key, newName: newName }
    ]);
    console.log("File renamed in UploadThing:", renameFile);
  } catch (error) {
    console.log("Failed to rename file in UploadThing:", error);
    throw new Error("Failed to rename file in UploadThing");
  }
};
