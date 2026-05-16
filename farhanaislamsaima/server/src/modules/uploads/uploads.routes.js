import express from 'express';
import multer from 'multer';
import { uploadImage } from './uploads.controller.js';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024
  },
  fileFilter(req, file, callback) {
    if (!file.mimetype.startsWith('image/')) {
      return callback(new Error('Only image files are allowed'));
    }

    return callback(null, true);
  }
});

router.post('/image', upload.single('image'), uploadImage);

export default router;
