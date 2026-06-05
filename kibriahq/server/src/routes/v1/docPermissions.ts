import { Router } from "express";
import { userSearch, addPermission, removePermission, getPermissionsByDocId } from "../../controllers/docPermissions.js";
import { userSearchValidator, userSearchValidatorHandler } from "../../middlewares/validators/doc/userSearchForPermission.js";
import { addPermissionValidator, addPermissionValidatorHandler, getPermissionsByDocIdValidator, getPermissionsByDocIdValidatorHandler, removePermissionValidator, removePermissionValidatorHandler } from "../../middlewares/validators/doc/docPermission.js";

const router: Router = Router();

router.post('/user-search', userSearchValidator, userSearchValidatorHandler, userSearch);
router.post('/add', addPermissionValidator, addPermissionValidatorHandler, addPermission);
router.delete('/remove', removePermissionValidator, removePermissionValidatorHandler, removePermission);
router.get('/get-all/:docId', getPermissionsByDocIdValidator, getPermissionsByDocIdValidatorHandler, getPermissionsByDocId);

export default router;