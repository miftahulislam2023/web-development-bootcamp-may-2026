import { Router } from "express";
import { authRoute } from "../modules/auth/auth.routes";
import UserRoutes from "../modules/users/users.routes";
import { ChatRoutes } from "../modules/chat/chat.routes";
import { AdminRoutes } from "../modules/admin/admin.routes";
//import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

router.use("/auth", authRoute);
// router.use(authenticate);

router.use("/users", UserRoutes);
router.use("/chat", ChatRoutes);
router.use("/admin", AdminRoutes);

export default router;
