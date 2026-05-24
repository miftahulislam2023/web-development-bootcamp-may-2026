import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,

    params: {
        folder: "chat-app",
        allowed_formats: ["jpg", "jpeg", "png", "gif", "bmp", "webp"],
        transformation: [{ width: 800, height: 600, crop: "limit" }, { quality: "auto" }],
        resource_type: "auto",
    } as any,
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/bmp", "image/webp"];   
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type! Only Images are allowed.") as any, false);
        }
    }
});

export default upload;