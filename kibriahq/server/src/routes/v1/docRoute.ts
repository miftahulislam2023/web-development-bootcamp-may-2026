import { Router } from "express";
import { myDocs, sharedDocs, create, updateName, getDoc, deleteDoc } from "../../controllers/doc.js";
import docPermissionsRouter from "./docPermissions.js";

const router: Router = Router();

router.get('/my', myDocs);
router.get('/shared', sharedDocs);
router.get('/:id', getDoc);
router.post('/', create);
router.post('/update/name/:id', updateName);
router.delete('/:id', deleteDoc);

router.use('/permissions', docPermissionsRouter)

export default router;