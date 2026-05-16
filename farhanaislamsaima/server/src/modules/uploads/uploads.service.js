import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

function ensureCloudinaryConfig() {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME
    || !process.env.CLOUDINARY_API_KEY
    || !process.env.CLOUDINARY_API_SECRET
  ) {
    const error = new Error('Cloudinary is not configured');
    error.statusCode = 500;
    throw error;
  }
}

function uploadBuffer(buffer, options) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
}

async function uploadChatImage(file) {
  ensureCloudinaryConfig();

  const result = await uploadBuffer(file.buffer, {
    folder: process.env.CLOUDINARY_UPLOAD_FOLDER || 'echoline/chat-images',
    resource_type: 'image',
    transformation: [
      { width: 1200, height: 1200, crop: 'limit' },
      { quality: 'auto', fetch_format: 'auto' }
    ]
  });

  return {
    imageUrl: result.secure_url,
    publicId: result.public_id
  };
}

export {
  uploadChatImage
};
