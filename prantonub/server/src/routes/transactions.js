const router = require("express").Router();
const { protect } = require("../middleware/auth");
const {
  getTransactions, createTransaction, updateTransaction,
  deleteTransaction, getSummary, exportTransactions,
} = require("../controllers/transactionController");

router.use(protect);
router.get("/summary", getSummary);
router.get("/export", exportTransactions);
router.get("/", getTransactions);
router.post("/", createTransaction);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;
