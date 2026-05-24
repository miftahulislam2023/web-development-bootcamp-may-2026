const express = require("express");
const Transaction = require("../models/Transaction");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();



router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { type, amount, category, note, date } = req.body;

    if (!type || !amount || !category) {
      return res.status(400).json({
        message: "Type, amount and category required",
      });
    }

    const transaction = await Transaction.create({
      userId: req.user,
      type,
      amount,
      category,
      note: note || "",
      date: date || new Date(),
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.get("/all", authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.user,
    }).sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.userId.toString() !== req.user) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    await Transaction.findByIdAndDelete(req.params.id);

    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.put("/update/:id", authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.userId.toString() !== req.user) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    const updated = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;