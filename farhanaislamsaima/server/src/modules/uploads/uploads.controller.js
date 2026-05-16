import { uploadChatImage } from './uploads.service.js';

async function uploadImage(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: 'Image file is required' });
  }

  try {
    const uploadedImage = await uploadChatImage(req.file);
    res.status(201).json(uploadedImage);
  } catch (error) {
    console.log(error);
    res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : 'Could not upload image'
    });
  }
}

export {
  uploadImage
};
