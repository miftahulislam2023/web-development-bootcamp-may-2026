import { Router } from "express";
import { registerValidator, registerValidatorHandler } from "../../middlewares/validators/auth/register.js";
import { loginValidator, loginValidatorHandler } from "../../middlewares/validators/auth/login.js";
import { register, login } from "../../controllers/auth.js";

const router: Router = Router();

router.post('/register', registerValidator, registerValidatorHandler, register);
router.post('/login', loginValidator, loginValidatorHandler, login);


export default router;