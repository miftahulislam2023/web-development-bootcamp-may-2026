import { generateReactHelpers, generateUploadButton, generateUploadDropzone } from "@uploadthing/react";

export const { useUploadThing, uploadFiles } = generateReactHelpers({
  url: "/api/uploadthing",
});

export const UploadButton = generateUploadButton({ url: "/api/uploadthing" });
export const UploadDropzone = generateUploadDropzone({ url: "/api/uploadthing" });
