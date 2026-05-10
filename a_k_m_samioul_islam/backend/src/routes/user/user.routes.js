import express from "express";
import { createUser, getUserDetails, updateUserDetails } from "../../controllers/user/user.controller.js";

const router=express.Router();

// User creation

router.post("/users",createUser);

// User details fetch

router.get("/users/:email",getUserDetails);

// User details update

router.patch("/users/:email",updateUserDetails);

export default router;