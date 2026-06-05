import { Router } from "express";
import { getProfile, updateProfile, deleteProfile } from "../../controllers/profile.js";
import { updateProfileValidator, updateProfileValidatorHandler } from "../../middlewares/validators/profile/updateProfile.js";

const router: Router = Router();

router.get('/me', getProfile);
router.put('/me', updateProfileValidator, updateProfileValidatorHandler, updateProfile);
router.delete('/me', deleteProfile);

export default router;