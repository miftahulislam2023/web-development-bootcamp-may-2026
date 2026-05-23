import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "chat-avatars",
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
        transformation: [{ width: 300, height: 300, crop: "fill" }, { quality: "auto" }],
    } as any,
});

export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) cb(null, true);
        else cb(new Error("Only image files are allowed"));
    },
});
