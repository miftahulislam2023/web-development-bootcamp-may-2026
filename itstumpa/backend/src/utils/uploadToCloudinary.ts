import { UploadApiResponse } from 'cloudinary';
import cloudinary from '../app/config/cloudinary';

type ResourceType = 'image' | 'video' | 'raw';

export const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder: string,
  resourceType: ResourceType = 'image'
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId);
};