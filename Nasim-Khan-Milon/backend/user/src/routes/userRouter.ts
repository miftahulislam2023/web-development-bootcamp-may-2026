import express from 'express';
import { getAllUsers, getAUser, loginUser, myProfile, updateName, verifyUser } from '../controllers/userController.js';
import { isAuth } from '../middlewares/isAuth.js';

const router = express.Router();

router.post("/login", loginUser);
router.post("/verify", verifyUser);
router.get("/me", isAuth, myProfile);
router.get("/all", isAuth, getAllUsers);
router.put("/update", isAuth, updateName);
router.get("/:id", getAUser);

export default router;