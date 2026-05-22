const router = require("express").Router();
const { protect } = require("../middleware/auth");
const { getAll, upsert, remove } = require("../controllers/budgetController");
router.use(protect);
router.get("/", getAll);
router.post("/", upsert);
router.delete("/:id", remove);
module.exports = router;
