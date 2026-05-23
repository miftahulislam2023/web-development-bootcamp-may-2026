import express from 'express';
import { getAllUsers, getAUser, loginUser, myProfile, verifyUser, updateProfile, deleteAccount } from '../controllers/user.js';
import { isAuth } from '../middleware/isAuth.js';
import { upload } from '../middleware/multer.js';
import '../config/cloudinary.js';

const router = express.Router();

router.post("/login", loginUser);
router.post("/verify", verifyUser);
router.get("/me", isAuth, myProfile);
router.get("/user/all", isAuth, getAllUsers);
router.get("/user/:id", getAUser);
router.put("/user/update", isAuth, upload.single("avatar"), updateProfile);
router.delete("/user/delete", isAuth, deleteAccount);

export default router;