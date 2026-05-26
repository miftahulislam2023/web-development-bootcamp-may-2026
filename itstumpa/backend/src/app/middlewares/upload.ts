import multer from "multer";
import ApiError from "../../utils/apiErrors";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
const ALLOWED_DOC_TYPES = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_DOC_SIZE = 10 * 1024 * 1024; // 10MB

const storage = multer.memoryStorage();

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const isImage = ALLOWED_IMAGE_TYPES.includes(file.mimetype);
  const isDoc = ALLOWED_DOC_TYPES.includes(file.mimetype);

  if (!isImage && !isDoc) {
    return cb(
      new ApiError(
        400,
        "Invalid file type. Allowed: jpg, png, gif, webp, pdf, docx, txt"
      )
    );
  }

  const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_DOC_SIZE;
  if (file.size > maxSize) {
    return cb(
      new ApiError(400, `File too large. Max: ${isImage ? "5MB" : "10MB"}`)
    );
  }

  cb(null, true);
};

export const uploadFile = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_DOC_SIZE },
});