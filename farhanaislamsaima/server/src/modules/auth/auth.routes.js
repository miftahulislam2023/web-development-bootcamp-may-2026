import express from 'express';
import {
  googleLogin,
  loginUser,
  registerUser
} from './auth.controller.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);

export default router;
