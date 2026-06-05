import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { error, notFound, root } from "./common.js";
import routerV1 from "./v1/index.js";

const router: ExpressRouter = Router();


router.use('/api/v1/', routerV1);

router.get('/', root);

router.use(notFound);
router.use(error);

export default router;