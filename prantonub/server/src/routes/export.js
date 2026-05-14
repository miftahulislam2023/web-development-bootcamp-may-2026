const router = require("express").Router();
const { protect } = require("../middleware/auth");
const { exportCSV, exportSummary } = require("../controllers/exportController");
router.use(protect);
router.get("/csv", exportCSV);
router.get("/summary", exportSummary);
module.exports = router;
