"use client";

import { CldUploadWidget, CloudinaryUploadWidgetResults } from "next-cloudinary";
import { Camera } from "lucide-react";

interface ImageUploadWidgetProps {
  onSuccess: (imageUrl: string) => void;
  children: React.ReactNode;
}

export default function ImageUploadWidget({ onSuccess, children }: ImageUploadWidgetProps) {
  return (
    <CldUploadWidget
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      onSuccess={(result: CloudinaryUploadWidgetResults) => {
        if (typeof result.info === 'object' && result.info !== null && 'secure_url' in result.info) {
          onSuccess(result.info.secure_url as string);
        }
      }}
      options={{
        maxFiles: 1,
        resourceType: "image",
        clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
        cropping: true,
        croppingAspectRatio: 1,
        showSkipCropButton: false,
        folder: "spendsentry_avatars",
      }}
    >
      {({ open }) => {
        return (
          <div onClick={() => open?.()} className="cursor-pointer group relative rounded-full">
            {children}
            <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
        );
      }}
    </CldUploadWidget>
  );
}
