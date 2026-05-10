import express from "express";
import { createUser, getUserDetails, updateUserDetails } from "../../controllers/user/user.controller.js";
import { verifyFirebaseToken } from "../../middlewares/auth/auth.middleware.js";
import { loadDbUser } from "../../middlewares/dbuser/dbuser.middleware.js";

const router=express.Router();

// User creation

router.post("/users",createUser);

// User details fetch

router.get("/users/me", verifyFirebaseToken, loadDbUser,getUserDetails);

// User details update

router.patch("/users/me", verifyFirebaseToken, loadDbUser,updateUserDetails);

export default router;