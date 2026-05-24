const express = require("express");
const router = express.Router();
const Mood = require("../models/Mood");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/add", authMiddleware, async (req, res) => {
  try {
    const mood = await Mood.create({
      userId: req.user.id,
      mood: req.body.mood,
      amount: req.body.amount,
      notes: req.body.notes,
    });

    res.json(mood);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const data = await Mood.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;