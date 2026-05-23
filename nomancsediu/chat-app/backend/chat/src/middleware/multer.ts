import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req: any, file: any) => {
        const isImage = file.mimetype.startsWith('image/');
        if (isImage) {
            return {
                folder: "chat-images",
                resource_type: "image",
            };
        } else {
            return {
                folder: "chat-files",
                resource_type: "raw",
            };
        }
    },
});

export const upload = multer({ 
    storage,
    limits: {
        fileSize: 10*1024*1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
            'application/zip',
            'application/x-rar-compressed'
        ];
        
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("File type not supported"));
        }
    }
});