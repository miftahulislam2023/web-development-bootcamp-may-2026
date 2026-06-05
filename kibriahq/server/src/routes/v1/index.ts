import { Router } from "express";
import authRoutes from "./auth.js";
import docRouter from "./docRoute.js";
import profileRoutes from "./profileRoute.js";
import { auth } from "../../middlewares/auth.js";

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/profile', auth, profileRoutes);
router.use('/docs', auth, docRouter);

export default router;