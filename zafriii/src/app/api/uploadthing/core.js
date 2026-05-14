import { createUploadthing } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  // Profile avatar upload
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => ({ ok: true }))
    .onUploadComplete(({ file }) => {
      return { url: file.ufsUrl || file.url };
    }),

  // Chat message file upload
  messageFile: f({
    image: { maxFileSize: "16MB", maxFileCount: 1 },
    video: { maxFileSize: "64MB", maxFileCount: 1 },
    pdf: { maxFileSize: "16MB", maxFileCount: 1 },
    blob: { maxFileSize: "16MB", maxFileCount: 1 },
  })
    .middleware(() => ({ ok: true }))
    .onUploadComplete(({ file }) => {
      return { url: file.ufsUrl || file.url };
    }),
};
