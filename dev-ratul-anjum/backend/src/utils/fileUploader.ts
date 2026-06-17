import { v2 as cloudinary } from "cloudinary";
import multer, { memoryStorage } from "multer";
import path from "path";
import { env } from "./env.js";
import { ApiError } from "$/middlewares/errorHandler.js";

export const uploader = (
  allowed_file_types: string[],
  max_file_size: number,
  error_msg: string,
  max_number_of_files: number = 1,
) => {
  const storage = memoryStorage();
  const upload = multer({
    storage,
    limits: { fileSize: max_file_size, files: max_number_of_files },
    fileFilter: (req, file, cb) => {
      if (allowed_file_types.includes(file.mimetype)) cb(null, true);
      else cb(new ApiError(400, error_msg));
    },
  });

  return upload;
};

export const uploadToCloudinary = (file: Express.Multer.File) => {
  return new Promise<any>((resolve, reject) => {
    // Cloudinary config
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
    });

    // Unique pretty filename
    const file_ext = path.extname(file.originalname);
    const file_name =
      file.originalname
        .replace(file_ext, "")
        .toLowerCase()
        .split(" ")
        .join("-") +
      "-" +
      Date.now();

    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto", // auto detect image/pdf
        public_id: file_name,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result); // full Cloudinary response
      },
    );

    stream.end(file.buffer); // memoryStorage buffer
  });
};

export const uploadMultipleToCloudinary = async (
  files: Express.Multer.File[],
) => {
  return await Promise.all(files.map(uploadToCloudinary));
};
